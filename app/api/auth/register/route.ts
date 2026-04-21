import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db/client'

const schema = z.object({
  token: z.string().min(1),
  name: z.string().min(2),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { token, name, password } = parsed.data

  const invite = await prisma.invite.findUnique({ where: { token } })
  if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invite is invalid or expired.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: invite.email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: invite.email,
        name,
        passwordHash,
        globalRole: invite.globalRole,
      },
    })

    if (invite.projectId && invite.projectRole) {
      await tx.projectMember.create({
        data: {
          projectId: invite.projectId,
          userId: user.id,
          role: invite.projectRole,
        },
      })
    }

    await tx.invite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    })
  })

  return NextResponse.json({ ok: true })
}
