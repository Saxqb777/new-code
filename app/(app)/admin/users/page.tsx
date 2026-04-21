import { requireAdmin } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { formatDate } from '@/lib/utils'
import InviteUserDialog from '@/components/layout/InviteUserDialog'

export default async function AdminUsersPage() {
  await requireAdmin()

  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { projectMembers: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} member{users.length !== 1 ? 's' : ''}</p>
        </div>
        <InviteUserDialog />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center shrink-0">
              {u.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 text-sm">{u.name}</div>
              <div className="text-xs text-slate-500">{u.email}</div>
            </div>
            <div className="text-xs text-slate-400">{u._count.projectMembers} project{u._count.projectMembers !== 1 ? 's' : ''}</div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              u.globalRole === 'AGENCY_ADMIN' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {u.globalRole === 'AGENCY_ADMIN' ? 'Admin' : 'Member'}
            </span>
            <div className="text-xs text-slate-400">Joined {formatDate(u.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
