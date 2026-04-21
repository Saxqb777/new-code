import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import { canViewAsset, canUploadRawFootage, canUploadFinalEdit } from '@/lib/auth/permissions'
import AssetsPanel from '@/components/assets/AssetsPanel'

interface Props { params: { projectId: string } }

export default async function AssetsPage({ params }: Props) {
  const session = await requireAuth()
  const { projectId } = params

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    select: { id: true, status: true },
  })
  if (!project) notFound()

  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  const userRoles = await prisma.projectMember.findMany({
    where: { projectId, userId: session.user.id, removedAt: null },
    select: { role: true },
  })
  const roles = userRoles.map(r => r.role as string)

  // Filter assets by role
  const allowedTypes = isAdmin
    ? undefined
    : roles.includes('CLIENT')
      ? { in: ['EDIT_DRAFT', 'FINAL_EDIT', 'THUMBNAIL', 'SUPPORTING'] as const }
      : undefined

  const assets = await prisma.asset.findMany({
    where: { projectId, ...(allowedTypes ? { type: allowedTypes } : {}) },
    include: {
      versions: {
        orderBy: { versionNumber: 'desc' },
        take: 1,
        include: { uploadedBy: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const showUploadRaw = isAdmin || canUploadRawFootage(roles as any)
  const showUploadFinal = isAdmin || canUploadFinalEdit(roles as any)
  const canUpload = (showUploadRaw || showUploadFinal) &&
    (project.status === 'IN_PRODUCTION' || project.status === 'IN_POST' || isAdmin)

  return (
    <AssetsPanel
      projectId={projectId}
      projectStatus={project.status}
      assets={assets.map(a => ({
        id: a.id,
        type: a.type,
        title: a.title,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
        latestVersion: a.versions[0]
          ? {
              versionNumber: a.versions[0].versionNumber,
              fileSizeBytes: Number(a.versions[0].fileSizeBytes),
              mimeType: a.versions[0].mimeType,
              durationMs: a.versions[0].durationMs,
              uploadedBy: a.versions[0].uploadedBy.name,
              createdAt: a.versions[0].createdAt.toISOString(),
            }
          : null,
      }))}
      canUploadRaw={showUploadRaw}
      canUploadFinal={showUploadFinal}
      canUpload={canUpload}
    />
  )
}
