import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProjectTabNav from '@/components/projects/ProjectTabNav'

interface Props {
  children: React.ReactNode
  params: { projectId: string }
}

export default async function ProjectLayout({ children, params }: Props) {
  const session = await requireAuth()
  const { projectId } = params

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    select: { id: true, title: true, clientName: true, status: true },
  })
  if (!project) notFound()

  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  if (!isAdmin) {
    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId: session.user.id, removedAt: null },
    })
    if (!member) notFound()
  }

  const userRoles = await prisma.projectMember.findMany({
    where: { projectId, userId: session.user.id, removedAt: null },
    select: { role: true },
  })
  const roles = userRoles.map(r => r.role)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/projects" className="hover:text-slate-900">Projects</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{project.title}</span>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
        {project.clientName && (
          <p className="text-sm text-slate-500 mt-0.5">Client: {project.clientName}</p>
        )}
      </div>

      <ProjectTabNav
        projectId={projectId}
        globalRole={session.user.globalRole}
        roles={roles as string[]}
        status={project.status}
      />

      <div className="mt-6">{children}</div>
    </div>
  )
}
