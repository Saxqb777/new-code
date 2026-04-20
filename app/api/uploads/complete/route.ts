import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/client'
import { completeMultipart } from '@/lib/s3/multipart'
import { createNotification } from '@/lib/notifications/create'

const schema = z.object({
  uploadId: z.string().min(1),
  key: z.string().min(1),
  assetId: z.string().min(1),
  versionId: z.string().min(1),
  parts: z.array(z.object({ PartNumber: z.number(), ETag: z.string() })),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { uploadId, key, assetId, versionId, parts } = parsed.data

  await completeMultipart(uploadId, key, parts)

  const asset = await prisma.$transaction(async tx => {
    const a = await tx.asset.update({
      where: { id: assetId },
      data: { status: 'READY', currentVersionId: versionId },
    })
    await tx.assetVersion.update({ where: { id: versionId }, data: {} })

    // Workflow state transitions
    const project = await tx.project.findUnique({
      where: { id: a.projectId },
      include: { members: { where: { removedAt: null }, include: { user: true } } },
    })

    if (a.type === 'RAW_FOOTAGE' && project?.status === 'DRAFT' || project?.status === 'IN_PRODUCTION') {
      await tx.project.update({ where: { id: a.projectId }, data: { status: 'IN_POST' } })

      // Notify all editors
      const editors = project!.members.filter(m => m.role === 'EDITOR')
      for (const e of editors) {
        await createNotification(e.userId, 'FOOTAGE_UPLOADED', {
          title: 'Raw footage uploaded',
          body: `Footage is ready to edit on "${project!.title}"`,
          linkUrl: `/projects/${a.projectId}/assets`,
        })
      }
    }

    if (a.type === 'FINAL_EDIT') {
      await tx.project.update({ where: { id: a.projectId }, data: { status: 'IN_REVIEW' } })
      await tx.review.create({ data: { projectId: a.projectId, assetId: a.id } })

      const clients = project!.members.filter(m => m.role === 'CLIENT')
      const pms = project!.members.filter(m => m.role === 'PROJECT_MANAGER')
      for (const c of [...clients, ...pms]) {
        await createNotification(c.userId, 'EDIT_READY', {
          title: 'Final edit ready for review',
          body: `"${project!.title}" is ready for your review`,
          linkUrl: `/projects/${a.projectId}/review`,
        })
      }
    }

    await tx.auditLog.create({
      data: { actorId: session.user.id, action: 'asset.uploaded', entityType: 'Asset', entityId: a.id, projectId: a.projectId },
    })

    return a
  })

  const assetWithVersion = await prisma.asset.findUnique({
    where: { id: asset.id },
    include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1, include: { uploadedBy: { select: { name: true } } } } },
  })

  return NextResponse.json({
    asset: {
      id: assetWithVersion!.id,
      type: assetWithVersion!.type,
      title: assetWithVersion!.title,
      status: assetWithVersion!.status,
      createdAt: assetWithVersion!.createdAt.toISOString(),
      latestVersion: assetWithVersion!.versions[0] ? {
        versionNumber: assetWithVersion!.versions[0].versionNumber,
        fileSizeBytes: Number(assetWithVersion!.versions[0].fileSizeBytes),
        mimeType: assetWithVersion!.versions[0].mimeType,
        durationMs: assetWithVersion!.versions[0].durationMs,
        uploadedBy: assetWithVersion!.versions[0].uploadedBy.name,
        createdAt: assetWithVersion!.versions[0].createdAt.toISOString(),
      } : null,
    },
  })
}
