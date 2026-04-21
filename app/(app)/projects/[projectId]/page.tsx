import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { notFound } from 'next/navigation'
import { formatDate, formatDateTime, projectStatusLabel, projectRoleLabel, isOverdue } from '@/lib/utils'

interface Props {
  params: { projectId: string }
}

export default async function ProjectOverviewPage({ params }: Props) {
  const session = await requireAuth()
  const { projectId } = params

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    include: {
      members: {
        where: { removedAt: null },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { joinedAt: 'asc' },
      },
      milestones: { orderBy: { sortOrder: 'asc' } },
      assets: { orderBy: { createdAt: 'desc' }, take: 5 },
      reviews: { orderBy: { requestedAt: 'desc' }, take: 3 },
    },
  })
  if (!project) notFound()

  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'
  const userRoles = project.members.filter(m => m.userId === session.user.id).map(m => m.role)
  const isClient = userRoles.includes('CLIENT') && !isAdmin

  const completedMilestones = project.milestones.filter(m => m.status === 'COMPLETED').length
  const totalMilestones = project.milestones.length
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Project summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <InfoCard label="Status" value={projectStatusLabel(project.status)} />
        <InfoCard label="Due date" value={formatDate(project.dueDate)} overdue={!!project.dueDate && isOverdue(project.dueDate)} />
        <InfoCard label="Milestones" value={`${completedMilestones}/${totalMilestones}`} />
        <InfoCard label="Team members" value={String(project.members.length)} />
      </div>

      {project.description && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
          <p className="text-sm text-slate-600 whitespace-pre-line">{project.description}</p>
        </div>
      )}

      {/* Progress */}
      {totalMilestones > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Overall progress</h3>
            <span className="text-sm font-semibold text-slate-900">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Team */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Team</h3>
          <ul className="space-y-2">
            {project.members.map(m => (
              <li key={m.id} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {m.user.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{m.user.name}</div>
                  <div className="text-xs text-slate-400">{projectRoleLabel(m.role)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent milestones */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Milestones</h3>
          {project.milestones.length === 0 ? (
            <p className="text-sm text-slate-400">No milestones yet.</p>
          ) : (
            <ul className="space-y-2">
              {project.milestones.slice(0, 5).map(m => (
                <li key={m.id} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    m.status === 'COMPLETED' ? 'bg-emerald-400' :
                    m.status === 'IN_PROGRESS' ? 'bg-amber-400' :
                    m.status === 'BLOCKED' ? 'bg-red-400' : 'bg-slate-300'
                  }`} />
                  <span className={`text-sm flex-1 ${m.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {m.title}
                  </span>
                  {m.dueDate && <span className="text-xs text-slate-400">{formatDate(m.dueDate)}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoCard({ label, value, overdue }: { label: string; value: string; overdue?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`font-semibold text-sm ${overdue ? 'text-red-600' : 'text-slate-900'}`}>{value}</div>
    </div>
  )
}
