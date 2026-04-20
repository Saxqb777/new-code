import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'
import { createNotification } from '@/lib/notifications/create'

const schema = z.object({
  status: z.enum(['APPROVED', 'CHANGES_REQUESTED']),
  notes: z.string().optional(),
})

export async function PATCH(req: Request, { params }: { params: { projectId: string; reviewId: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const review = await prisma.review.findUnique({ where: { id: params.reviewId } })
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (review.status !== 'PENDING') return NextResponse.json({ error: 'Already decided' }, { status: 400 })

  const updated = await prisma.$transaction(async tx => {
    const r = await tx.review.update({
      where: { id: params.reviewId },
      data: { status: parsed.data.status, notes: parsed.data.notes, reviewerId: session.user.id, decidedAt: new Date() },
    })

    const project = await tx.project.findUnique({
      where: { id: params.projectId },
      include: { members: { where: { removedAt: null } } },
    })

    if (parsed.data.status === 'APPROVED') {
      await tx.project.update({ where: { id: params.projectId }, data: { status: 'APPROVED' } })
      const notifyRoles = ['PROJECT_MANAGER', 'EDITOR']
      for (const m of project!.members.filter(m => notifyRoles.includes(m.role))) {
        await createNotification(m.userId, 'REVIEW_APPROVED', {
          title: 'Video approved!',
          body: `Client approved "${project!.title}"`,
          linkUrl: `/projects/${params.projectId}/review`,
        })
      }
    } else {
      await tx.project.update({ where: { id: params.projectId }, data: { status: 'IN_POST' } })
      for (const m of project!.members.filter(m => m.role === 'EDITOR')) {
        await createNotification(m.userId, 'REVIEW_CHANGES', {
          title: 'Changes requested',
          body: `Client requested changes on "${project!.title}"`,
          linkUrl: `/projects/${params.projectId}/review`,
        })
      }
    }

    await tx.auditLog.create({
      data: { actorId: session.user.id, action: `review.${parsed.data.status.toLowerCase()}`, entityType: 'Review', entityId: r.id, projectId: params.projectId },
    })
    return r
  })

  return NextResponse.json({
    ...updated,
    requestedAt: updated.requestedAt.toISOString(),
    decidedAt: updated.decidedAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  })
}
