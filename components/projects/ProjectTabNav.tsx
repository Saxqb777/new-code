'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
  projectId: string
  globalRole: string
  roles: string[]
  status: string
}

export default function ProjectTabNav({ projectId, globalRole, roles, status }: Props) {
  const pathname = usePathname()
  const base = `/projects/${projectId}`
  const isAdmin = globalRole === 'AGENCY_ADMIN'
  const isPM = roles.includes('PROJECT_MANAGER')
  const isClient = roles.includes('CLIENT')

  const tabs = [
    { href: base, label: 'Overview', show: true },
    { href: `${base}/milestones`, label: 'Milestones', show: true },
    { href: `${base}/assets`, label: 'Assets', show: !isClient || true },
    { href: `${base}/review`, label: 'Review', show: true },
    { href: `${base}/analytics`, label: 'Analytics', show: isAdmin || isPM || isClient },
    { href: `${base}/settings`, label: 'Settings', show: isAdmin || isPM },
  ].filter(t => t.show)

  return (
    <div className="flex gap-1 border-b border-slate-200">
      {tabs.map(tab => {
        const active = tab.href === base ? pathname === base : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              active
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
