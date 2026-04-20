import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/client'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { SSEProvider } from '@/components/notifications/SSEProvider'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth()
  const userId = session.user.id

  const [memberships, unreadCount] = await Promise.all([
    prisma.projectMember.findMany({
      where: { userId, removedAt: null },
      select: { role: true },
    }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ])

  const projectRoles = [...new Set(memberships.map(m => m.role as string))]

  return (
    <SSEProvider initialUnread={unreadCount}>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar globalRole={session.user.globalRole} projectRoles={projectRoles} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SSEProvider>
  )
}
