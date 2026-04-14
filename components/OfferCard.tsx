import { Clock } from 'lucide-react'
import type { Offer } from '@/lib/offers'

const categoryStyles: Record<
  Exclude<import('@/lib/offers').OfferCategory, 'all'>,
  { bg: string; text: string; label: string }
> = {
  video: { bg: 'bg-violet-100', text: 'text-violet-700', label: '▶ Watch Video' },
  click: { bg: 'bg-blue-100', text: 'text-blue-700', label: '🖱 Click Ad' },
  install: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '📲 App Install' },
  survey: { bg: 'bg-orange-100', text: 'text-orange-700', label: '📋 Survey' },
  daily: { bg: 'bg-amber-100', text: 'text-amber-700', label: '🎁 Daily Bonus' },
}

const difficultyLabel: Record<Offer['difficulty'], string> = {
  easy: '⭐ Easy',
  medium: '⭐⭐ Medium',
  hard: '⭐⭐⭐ Hard',
}

export default function OfferCard({ offer }: { offer: Offer }) {
  const style = categoryStyles[offer.category]

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}
        >
          {style.label}
        </span>
        {offer.featured && (
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
            ⚡ Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug">{offer.title}</h3>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
          {offer.description}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {offer.estimatedTime}
        </span>
        <span>{difficultyLabel[offer.difficulty]}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-lg leading-none">🪙</span>
          <span className="font-extrabold text-amber-600 text-base">{offer.points}</span>
          <span className="text-slate-400 text-xs">pts</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Earn Now →
        </button>
      </div>
    </article>
  )
}
