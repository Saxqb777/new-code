import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import MarkAllRead from '@/components/notifications/MarkAllRead'

export default async function NotificationsPage() {
  const session = await requireAuth()
  const userId = session.user.id

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const unread = notifications.filter(n => !n.readAt).length

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          {unread > 0 && <p className="text-sm text-slate-500 mt-0.5">{unread} unread</p>}
        </div>
        {unread > 0 && <MarkAllRead />}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No notifications yet.</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`px-5 py-4 ${!n.readAt ? 'bg-blue-50/40' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.readAt ? 'bg-brand-500' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">{n.title}</div>
                  <div className="text-sm text-slate-600 mt-0.5">{n.body}</div>
                  <div className="text-xs text-slate-400 mt-1">{formatDateTime(n.createdAt)}</div>
                </div>
                {n.linkUrl && (
                  <Link href={n.linkUrl} className="text-xs text-brand-600 hover:underline shrink-0">
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
