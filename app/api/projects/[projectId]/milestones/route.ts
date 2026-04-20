import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const milestones = await prisma.milestone.findMany({
    where: { projectId: params.projectId },
    include: { assignee: { select: { id: true, name: true } } },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(milestones)
}

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const count = await prisma.milestone.count({ where: { projectId: params.projectId } })
  const milestone = await prisma.milestone.create({
    data: {
      projectId: params.projectId,
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      assigneeId: parsed.data.assigneeId || null,
      sortOrder: count,
    },
    include: { assignee: { select: { id: true, name: true } } },
  })
  return NextResponse.json({ ...milestone, dueDate: milestone.dueDate?.toISOString() ?? null, completedAt: null, createdAt: milestone.createdAt.toISOString(), updatedAt: milestone.updatedAt.toISOString() }, { status: 201 })
}
