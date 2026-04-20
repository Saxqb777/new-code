import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import MilestoneBoard from '@/components/milestones/MilestoneBoard'

interface Props { params: { projectId: string } }

export default async function MilestonesPage({ params }: Props) {
  const session = await requireAuth()
  const { projectId } = params

  const [project, milestones, members] = await Promise.all([
    prisma.project.findFirst({ where: { id: projectId, deletedAt: null }, select: { id: true, status: true } }),
    prisma.milestone.findMany({
      where: { projectId },
      include: { assignee: { select: { id: true, name: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.projectMember.findMany({
      where: { projectId, removedAt: null },
      include: { user: { select: { id: true, name: true } } },
    }),
  ])
  if (!project) notFound()

  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  const userRoles = await prisma.projectMember.findMany({
    where: { projectId, userId: session.user.id, removedAt: null },
    select: { role: true },
  })
  const roles = userRoles.map(r => r.role)
  const canEdit = isAdmin || roles.includes('PROJECT_MANAGER')

  return (
    <MilestoneBoard
      projectId={projectId}
      milestones={milestones.map(m => ({
        ...m,
        dueDate: m.dueDate?.toISOString() ?? null,
        completedAt: m.completedAt?.toISOString() ?? null,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
        assignee: m.assignee,
      }))}
      members={members.map(m => ({ id: m.user.id, name: m.user.name }))}
      canEdit={canEdit}
    />
  )
}
