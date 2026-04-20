import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { formatDate, isOverdue, projectStatusLabel } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ProjectsPage() {
  const session = await requireAuth()
  const userId = session.user.id
  const isAdmin = session.user.globalRole === 'AGENCY_ADMIN'

  const where = isAdmin
    ? { deletedAt: null }
    : { deletedAt: null, members: { some: { userId, removedAt: null } } }

  const projects = await prisma.project.findMany({
    where,
    include: {
      members: {
        where: { removedAt: null },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
      milestones: { select: { status: true } },
      _count: { select: { assets: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const canCreate = isAdmin || projects.some(p =>
    p.members.some(m => m.userId === userId && m.role === 'PROJECT_MANAGER')
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {(isAdmin || canCreate) && (
          <Link
            href="/projects/new"
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            New project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="text-4xl mb-3">📽️</div>
          <h3 className="font-semibold text-slate-900">No projects yet</h3>
          <p className="text-slate-500 text-sm mt-1">Create your first project to get started.</p>
          {(isAdmin || canCreate) && (
            <Link
              href="/projects/new"
              className="mt-4 inline-flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              <Plus size={16} /> New project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(p => {
            const done = p.milestones.filter(m => m.status === 'COMPLETED').length
            const total = p.milestones.length
            const progress = total > 0 ? Math.round((done / total) * 100) : 0
            const overdue = p.dueDate && isOverdue(p.dueDate)
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-brand-300 hover:shadow-sm transition-all block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{p.title}</h3>
                      <StatusBadge status={p.status} />
                    </div>
                    {p.clientName && (
                      <p className="text-sm text-slate-500 mt-0.5">Client: {p.clientName}</p>
                    )}
                    {p.description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{p.description}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-slate-400 shrink-0">
                    {p.dueDate && (
                      <div className={overdue ? 'text-red-500 font-medium' : ''}>
                        Due {formatDate(p.dueDate)}
                      </div>
                    )}
                    <div className="mt-1">{p._count.assets} assets</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex -space-x-2">
                    {p.members.slice(0, 5).map(m => (
                      <div
                        key={m.id}
                        className="w-7 h-7 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-brand-700"
                        title={`${m.user.name} (${m.role})`}
                      >
                        {m.user.name.slice(0, 1).toUpperCase()}
                      </div>
                    ))}
                    {p.members.length > 5 && (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                        +{p.members.length - 5}
                      </div>
                    )}
                  </div>
                  {total > 0 && (
                    <div className="flex items-center gap-2 flex-1 max-w-xs justify-end">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{done}/{total} milestones</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
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
