import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import AnalyticsPanel from '@/components/analytics/AnalyticsPanel'

interface Props { params: { projectId: string } }

export default async function AnalyticsPage({ params }: Props) {
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
  const canView = isAdmin || roles.includes('PROJECT_MANAGER') || roles.includes('CLIENT')
  if (!canView) notFound()

  const analytics = await prisma.projectAnalytics.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  })

  const canManage = isAdmin || roles.includes('PROJECT_MANAGER')

  return (
    <AnalyticsPanel
      projectId={projectId}
      canManage={canManage}
      analytics={analytics.map(a => ({
        id: a.id,
        platform: a.platform,
        externalUrl: a.externalUrl,
        publishedAt: a.publishedAt?.toISOString() ?? null,
        viewCount: Number(a.viewCount),
        likeCount: Number(a.likeCount),
        commentCount: Number(a.commentCount),
        shareCount: Number(a.shareCount),
        lastFetchedAt: a.lastFetchedAt?.toISOString() ?? null,
      }))}
    />
  )
}
