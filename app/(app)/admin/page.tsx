import { requireAdmin } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { projectStatusLabel } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()

  const [projects, users, pendingReviews] = await Promise.all([
    prisma.project.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { members: true, assets: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.review.count({ where: { status: 'PENDING' } }),
  ])

  const byStatus = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Agency overview</h1>
        <p className="text-slate-500 text-sm mt-0.5">Agency-wide stats and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Stat label="Total projects" value={projects.length} />
        <Stat label="Team members"   value={users} />
        <Stat label="Pending reviews" value={pendingReviews} highlight={pendingReviews > 0} />
        <Stat label="Active"         value={(byStatus['IN_PRODUCTION'] ?? 0) + (byStatus['IN_POST'] ?? 0) + (byStatus['IN_REVIEW'] ?? 0)} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">All projects</h2>
          <Link href="/projects/new" className="text-sm text-brand-600 hover:underline">+ New</Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {projects.map(p => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm">{p.title}</div>
                  {p.clientName && <div className="text-xs text-slate-500">Client: {p.clientName}</div>}
                </div>
                <div className="text-xs text-slate-400">{p._count.members} members · {p._count.assets} assets</div>
                <StatusBadge status={p.status} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`text-2xl font-bold ${highlight ? 'text-amber-600' : 'text-slate-900'}`}>{value}</div>
      <div className="text-sm text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600', IN_PRODUCTION: 'bg-amber-100 text-amber-700',
    IN_POST: 'bg-violet-100 text-violet-700', IN_REVIEW: 'bg-blue-100 text-blue-700',
    APPROVED: 'bg-emerald-100 text-emerald-700', PUBLISHED: 'bg-green-100 text-green-700',
    ARCHIVED: 'bg-slate-100 text-slate-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {projectStatusLabel(status)}
    </span>
  )
}
