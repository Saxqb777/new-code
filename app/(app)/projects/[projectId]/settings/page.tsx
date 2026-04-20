import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import ProjectSettings from '@/components/projects/ProjectSettings'

interface Props { params: { projectId: string } }

export default async function SettingsPage({ params }: Props) {
  const session = await requireAuth()
  const { projectId } = params

  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  const userRoles = await prisma.projectMember.findMany({
    where: { projectId, userId: session.user.id, removedAt: null },
    select: { role: true },
  })
  const roles = userRoles.map(r => r.role as string)
  if (!isAdmin && !roles.includes('PROJECT_MANAGER')) notFound()

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
  })
  if (!project) notFound()

  const members = await prisma.projectMember.findMany({
    where: { projectId, removedAt: null },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { joinedAt: 'asc' },
  })

  return (
    <ProjectSettings
      projectId={projectId}
      project={{
        title: project.title,
        description: project.description ?? '',
        clientName: project.clientName ?? '',
        dueDate: project.dueDate?.toISOString().split('T')[0] ?? '',
        status: project.status,
      }}
      members={members.map(m => ({
        id: m.id,
        userId: m.userId,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
      }))}
    />
  )
}
