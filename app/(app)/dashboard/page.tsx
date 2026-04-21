import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { formatDate, isOverdue, projectStatusLabel, projectRoleLabel } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await requireAuth()
  const userId = session.user.id
  const globalRole = session.user.globalRole

  // Fetch projects relevant to this user
  const memberships = await prisma.projectMember.findMany({
    where: { userId, removedAt: null },
    include: {
      project: {
        include: {
          members: { where: { removedAt: null }, include: { user: { select: { name: true } } } },
          milestones: true,
          _count: { select: { assets: true } },
        },
      },
    },
    orderBy: { project: { updatedAt: 'desc' } },
  })

  const projects = memberships.map(m => ({ ...m.project, myRole: m.role }))

  const pendingReviews = await prisma.review.count({
    where: {
      status: 'PENDING',
      project: { members: { some: { userId, removedAt: null } } },
    },
  })

  const overdueMilestones = await prisma.milestone.count({
    where: {
      dueDate: { lt: new Date() },
      status: { in: ['PENDING', 'IN_PROGRESS'] },
      project: { members: { some: { userId, removedAt: null } } },
    },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Hello, {session.user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {globalRole === 'AGENCY_ADMIN' ? 'Agency Admin' : 'Here\'s your workspace overview'}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
          <div className="text-sm text-slate-500 mt-0.5">Active projects</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-amber-600">{pendingReviews}</div>
          <div className="text-sm text-slate-500 mt-0.5">Pending reviews</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className={`text-2xl font-bold ${overdueMilestones > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {overdueMilestones}
          </div>
          <div className="text-sm text-slate-500 mt-0.5">Overdue milestones</div>
        </div>
      </div>

      {/* Projects list */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Your projects</h2>
          <Link href="/projects" className="text-sm text-brand-600 hover:underline">View all</Link>
        </div>
        {projects.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 text-sm">
            No projects yet. Ask your project manager to add you to one.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {projects.slice(0, 8).map(p => {
              const completed = p.milestones.filter(m => m.status === 'COMPLETED').length
              const total = p.milestones.length
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0
              const overdue = p.dueDate && isOverdue(p.dueDate)
              return (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 text-sm">{p.title}</span>
                        <span className="text-xs text-slate-400">{projectRoleLabel(p.myRole)}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {p.clientName && <span className="mr-2">Client: {p.clientName}</span>}
                        {p.dueDate && (
                          <span className={overdue ? 'text-red-500' : ''}>
                            Due {formatDate(p.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {total > 0 && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{progress}%</span>
                        </div>
                      )}
                      <StatusBadge status={p.status} />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT:         'bg-slate-100 text-slate-600',
    IN_PRODUCTION: 'bg-amber-100 text-amber-700',
    IN_POST:       'bg-violet-100 text-violet-700',
    IN_REVIEW:     'bg-blue-100 text-blue-700',
    APPROVED:      'bg-emerald-100 text-emerald-700',
    PUBLISHED:     'bg-green-100 text-green-700',
    ARCHIVED:      'bg-slate-100 text-slate-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {projectStatusLabel(status)}
    </span>
  )
}
