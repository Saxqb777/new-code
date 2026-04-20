import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

const schema = z.object({
  status: z.enum(['PENDING','IN_PROGRESS','COMPLETED','BLOCKED']).optional(),
  title: z.string().min(1).optional(),
  dueDate: z.string().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
})

export async function PATCH(req: Request, { params }: { params: { projectId: string; milestoneId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const updated = await prisma.milestone.update({
    where: { id: params.milestoneId },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate !== undefined ? (parsed.data.dueDate ? new Date(parsed.data.dueDate) : null) : undefined,
      completedAt: parsed.data.status === 'COMPLETED' ? new Date() : undefined,
    },
    include: { assignee: { select: { id: true, name: true } } },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { projectId: string; milestoneId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.milestone.delete({ where: { id: params.milestoneId } })
  return NextResponse.json({ ok: true })
}
