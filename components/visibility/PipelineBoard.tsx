'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { VisibilityProjectSummary } from '@/types'

const STAGES = [
  { status: 'DRAFT',         label: 'Draft',       color: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400' },
  { status: 'IN_PRODUCTION', label: 'Shooting',    color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-400' },
  { status: 'IN_POST',       label: 'Editing',     color: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-400' },
  { status: 'IN_REVIEW',     label: 'In Review',   color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-400' },
  { status: 'APPROVED',      label: 'Approved',    color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  { status: 'PUBLISHED',     label: 'Published',   color: 'bg-green-100 text-green-700',    dot: 'bg-green-400' },
]

interface Props { projects: VisibilityProjectSummary[] }

export default function PipelineBoard({ projects }: Props) {
  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-4">Pipeline</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {STAGES.map(stage => {
            const items = projects.filter(p => p.status === stage.status)
            return (
              <div key={stage.status} className="w-56 shrink-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <span className="text-xs font-semibold text-slate-600">{stage.label}</span>
                  <span className="text-xs text-slate-400">({items.length})</span>
                </div>
                <div className="space-y-2">
                  {items.map(p => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="block bg-white rounded-lg border border-slate-200 p-3 hover:border-brand-300 hover:shadow-sm transition-all"
                    >
                      <div className="font-medium text-slate-900 text-xs leading-snug line-clamp-2">{p.title}</div>
                      {p.clientName && (
                        <div className="text-xs text-slate-400 mt-0.5 truncate">{p.clientName}</div>
                      )}

                      {/* Member avatars */}
                      <div className="flex -space-x-1 mt-2">
                        {p.members.slice(0, 4).map(m => (
                          <div
                            key={`${m.userId}-${m.role}`}
                            title={`${m.name} (${m.role})`}
                            className="w-5 h-5 rounded-full bg-brand-100 border border-white text-brand-700 text-[9px] font-bold flex items-center justify-center"
                          >
                            {m.name.slice(0, 1).toUpperCase()}
                          </div>
                        ))}
                        {p.members.length > 4 && (
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-white text-slate-500 text-[9px] flex items-center justify-center">
                            +{p.members.length - 4}
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      {p.milestoneCount > 0 && (
                        <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-400 rounded-full"
                            style={{ width: `${Math.round((p.completedMilestoneCount / p.milestoneCount) * 100)}%` }}
                          />
                        </div>
                      )}

                      {p.dueDate && (
                        <div className={`text-[10px] mt-1.5 ${p.isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                          {p.isOverdue ? '⚠ ' : ''}Due {formatDate(p.dueDate)}
                        </div>
                      )}
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <div className="bg-slate-50 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400 text-center">
                      None
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
