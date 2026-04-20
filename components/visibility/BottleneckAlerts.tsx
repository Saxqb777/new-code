import Link from 'next/link'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import type { VisibilityAlert } from '@/types'

interface Props { alerts: VisibilityAlert[] }

export default function BottleneckAlerts({ alerts }: Props) {
  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        Alerts
        {alerts.length > 0 && (
          <span className="bg-red-100 text-red-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
            {alerts.length}
          </span>
        )}
      </h2>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <div className="text-2xl mb-1">✅</div>
          <p className="text-sm text-slate-500">No bottlenecks detected.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((a, i) => {
            const isCritical = a.severity === 'critical'
            const Icon = isCritical ? AlertCircle : AlertTriangle
            return (
              <Link
                key={i}
                href={`/projects/${a.projectId}`}
                className={`flex items-start gap-3 p-3 rounded-xl border text-sm transition-colors hover:opacity-90 ${
                  isCritical
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <Icon size={15} className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium leading-snug">{a.projectTitle}</div>
                  <div className="text-xs opacity-80 mt-0.5">{a.message}</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
