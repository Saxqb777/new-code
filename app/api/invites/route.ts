import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

const schema = z.object({
  email: z.string().email(),
  globalRole: z.enum(['USER', 'AGENCY_ADMIN']).optional(),
  projectId: z.string().optional(),
  projectRole: z.enum(['PROJECT_MANAGER', 'SHOOTER', 'EDITOR', 'CLIENT']).optional(),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { email, globalRole = 'USER', projectId, projectRole } = parsed.data

  // Only admins can set globalRole to AGENCY_ADMIN
  if (globalRole === 'AGENCY_ADMIN' && session.user.globalRole !== 'AGENCY_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const invite = await prisma.invite.create({
    data: {
      email,
      globalRole,
      projectId: projectId ?? null,
      projectRole: projectRole ?? null,
      invitedById: session.user.id,
      expiresAt,
    },
  })

  // In production: send email via Resend with invite link
  // For MVP: return the invite URL so admin can share manually
  const inviteUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/register?token=${invite.token}`

  return NextResponse.json({ ok: true, inviteUrl, token: invite.token }, { status: 201 })
}
