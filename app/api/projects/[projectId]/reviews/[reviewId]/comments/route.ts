import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'
import { createNotification } from '@/lib/notifications/create'

const schema = z.object({
  body: z.string().min(1),
  startTimeMs: z.number().int().nonnegative().nullable().optional(),
})

export async function GET(req: Request, { params }: { params: { projectId: string; reviewId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const comments = await prisma.reviewComment.findMany({
    where: { reviewId: params.reviewId },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { startTimeMs: 'asc' },
  })
  return NextResponse.json(comments.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(), authorName: c.author.name })))
}

export async function POST(req: Request, { params }: { params: { projectId: string; reviewId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const comment = await prisma.reviewComment.create({
    data: { reviewId: params.reviewId, authorId: session.user.id, body: parsed.data.body, startTimeMs: parsed.data.startTimeMs ?? null },
    include: { author: { select: { id: true, name: true } } },
  })

  // Notify project members about the comment
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: { members: { where: { removedAt: null } } },
  })
  for (const m of project?.members ?? []) {
    if (m.userId !== session.user.id) {
      await createNotification(m.userId, 'COMMENT_ADDED', {
        title: 'New comment on review',
        body: `${session.user.name} commented on "${project!.title}"`,
        linkUrl: `/projects/${params.projectId}/review`,
      })
    }
  }

  return NextResponse.json({ ...comment, authorName: comment.author.name, createdAt: comment.createdAt.toISOString(), updatedAt: comment.updatedAt.toISOString() }, { status: 201 })
}
