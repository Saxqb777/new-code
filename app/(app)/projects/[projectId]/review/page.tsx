import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import ReviewPanel from '@/components/review/ReviewPanel'

interface Props { params: { projectId: string } }

export default async function ReviewPage({ params }: Props) {
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
  const isClient = roles.includes('CLIENT')

  // Get the latest pending or most recent review
  const review = await prisma.review.findFirst({
    where: { projectId },
    include: {
      asset: {
        include: {
          versions: { orderBy: { versionNumber: 'desc' }, take: 1 },
        },
      },
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { startTimeMs: 'asc' },
      },
    },
    orderBy: { requestedAt: 'desc' },
  })

  // Get presigned read URL for the video if a review+asset exists
  let videoUrl: string | null = null
  if (review?.asset.versions[0]) {
    const version = review.asset.versions[0]
    const { getReadPresignedUrl } = await import('@/lib/s3/presign')
    videoUrl = await getReadPresignedUrl(version.s3Key).catch(() => null)
  }

  return (
    <ReviewPanel
      projectId={projectId}
      userId={session.user.id}
      isClient={isClient}
      isAdmin={isAdmin}
      projectStatus={project.status}
      review={review
        ? {
            id: review.id,
            status: review.status,
            requestedAt: review.requestedAt.toISOString(),
            decidedAt: review.decidedAt?.toISOString() ?? null,
            notes: review.notes,
            assetTitle: review.asset.title,
            assetType: review.asset.type,
            videoUrl,
            comments: review.comments.map(c => ({
              id: c.id,
              body: c.body,
              startTimeMs: c.startTimeMs,
              resolved: c.resolved,
              authorId: c.authorId,
              authorName: c.author.name,
              createdAt: c.createdAt.toISOString(),
            })),
          }
        : null}
    />
  )
}
