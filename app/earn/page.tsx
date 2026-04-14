import type { Metadata } from 'next'
import OfferWall from '@/components/OfferWall'
import PointsWidget from '@/components/PointsWidget'
import AdBanner from '@/components/AdBanner'

export const metadata: Metadata = {
  title: 'Earn Points',
  description:
    'Browse hundreds of daily offers to earn FreeBucks points. Watch video ads, click sponsored links, install apps, and complete surveys.',
}

export default function EarnPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Earn Points</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Complete offers to earn FreeBucks — new offers added daily
            </p>
          </div>
          <PointsWidget points={1247} />
        </div>
      </div>

      <AdBanner />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Daily bonus reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🎁</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-900 text-sm">Daily Bonus Available!</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Claim your free 10-point daily check-in bonus — resets every 24 hours.
            </p>
          </div>
          <button className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            Claim Now
          </button>
        </div>

        {/* Earning cap info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 flex items-center gap-2">
          <span className="text-blue-500 text-sm">ℹ️</span>
          <p className="text-blue-700 text-xs">
            <strong>Daily earning cap:</strong> 500 points ($0.50) per account to keep FreeBucks
            sustainable and fair for everyone.
          </p>
        </div>

        <OfferWall />
      </div>

      <AdBanner />
    </div>
  )
}
