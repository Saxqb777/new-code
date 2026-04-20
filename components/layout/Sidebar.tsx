'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Eye,
  Bell,
  Users,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/components/notifications/SSEProvider'

interface SidebarProps {
  globalRole: string
  projectRoles: string[]
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  roles?: string[]
  globalRoles?: string[]
  showAlways?: boolean
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    showAlways: true,
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: <FolderOpen size={18} />,
    showAlways: true,
  },
  {
    href: '/visibility',
    label: 'Visibility',
    icon: <Eye size={18} />,
    globalRoles: ['AGENCY_ADMIN'],
    roles: ['PROJECT_MANAGER', 'CLIENT'],
  },
  {
    href: '/notifications',
    label: 'Notifications',
    icon: <Bell size={18} />,
    showAlways: true,
  },
  {
    href: '/admin/users',
    label: 'Team',
    icon: <Users size={18} />,
    globalRoles: ['AGENCY_ADMIN'],
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: <Settings size={18} />,
    globalRoles: ['AGENCY_ADMIN'],
  },
]

export default function Sidebar({ globalRole, projectRoles }: SidebarProps) {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()

  const visible = navItems.filter(item => {
    if (item.showAlways) return true
    if (item.globalRoles?.includes(globalRole)) return true
    if (item.roles?.some(r => projectRoles.includes(r))) return true
    return false
  })

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-slate-200">
        <span className="text-lg font-bold text-brand-600">CrewFlow</span>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {visible.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="bg-brand-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
