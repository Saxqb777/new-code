import Link from 'next/link'
import { projectStatusLabel, projectRoleLabel } from '@/lib/utils'
import type { VisibilityTeamMember } from '@/types'

interface Props { members: VisibilityTeamMember[] }

const statusChip: Record<string, string> = {
  DRAFT:         'bg-slate-100 text-slate-500',
  IN_PRODUCTION: 'bg-amber-100 text-amber-700',
  IN_POST:       'bg-violet-100 text-violet-700',
  IN_REVIEW:     'bg-blue-100 text-blue-700',
  APPROVED:      'bg-emerald-100 text-emerald-700',
  PUBLISHED:     'bg-green-100 text-green-700',
}

export default function TeamWorkloadTable({ members }: Props) {
  if (members.length === 0) return null

  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-4">Team workload</h2>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {members.map(m => (
          <div key={m.userId} className="px-5 py-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                {m.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">{m.name}</div>
                <div className="text-xs text-slate-400">{m.assignments.length} active project{m.assignments.length !== 1 ? 's' : ''}</div>
              </div>
              {m.assignments.some(a => a.isOverdue) && (
                <span className="ml-auto text-xs text-red-500 font-medium">⚠ Overdue</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 ml-10">
              {m.assignments.map((a, i) => (
                <Link
                  key={`${a.projectId}-${a.role}-${i}`}
                  href={`/projects/${a.projectId}`}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-opacity hover:opacity-80 ${
                    a.isOverdue ? 'border-red-300 bg-red-50 text-red-700' : `border-transparent ${statusChip[a.status] ?? 'bg-slate-100 text-slate-600'}`
                  }`}
                  title={`${a.projectTitle} — ${projectRoleLabel(a.role)}`}
                >
                  <span className="font-medium truncate max-w-[100px]">{a.projectTitle}</span>
                  <span className="opacity-60">· {projectRoleLabel(a.role)}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
