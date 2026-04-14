'use client'

import { useState } from 'react'
import { offers, type OfferCategory } from '@/lib/offers'
import OfferCard from '@/components/OfferCard'

const categories: { key: OfferCategory; label: string }[] = [
  { key: 'all', label: 'All Offers' },
  { key: 'video', label: '▶ Watch Videos' },
  { key: 'click', label: '🖱 Click Ads' },
  { key: 'install', label: '📲 App Installs' },
  { key: 'survey', label: '📋 Surveys' },
  { key: 'daily', label: '🎁 Daily Bonus' },
]

export default function OfferWall() {
  const [activeCategory, setActiveCategory] = useState<OfferCategory>('all')

  const filteredOffers =
    activeCategory === 'all' ? offers : offers.filter((o) => o.category === activeCategory)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Offer count */}
      <p className="text-slate-500 text-sm mb-4">
        Showing <strong className="text-slate-700">{filteredOffers.length}</strong> offers
      </p>

      {/* Offer grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">No offers in this category right now.</p>
          <p className="text-sm mt-1">Check back later or try a different category.</p>
        </div>
      )}
    </div>
  )
}
