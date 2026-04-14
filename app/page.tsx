import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import StatsBar from '@/components/StatsBar'
import HowItWorks from '@/components/HowItWorks'
import OfferCard from '@/components/OfferCard'
import TestimonialsSection from '@/components/TestimonialsSection'
import TrustBadges from '@/components/TrustBadges'
import AdBanner from '@/components/AdBanner'
import { offers } from '@/lib/offers'

export const metadata: Metadata = {
  title: 'FreeBucks — Get Paid to Watch Ads',
  description:
    'Earn real cash rewards by watching video ads and completing offers. Redeem for PayPal cash, Amazon, Google Play, and more. 100% free to join.',
  openGraph: {
    title: 'FreeBucks — Get Paid to Watch Ads',
    description:
      'Join 250,000+ members earning PayPal cash and gift cards by watching ads. Free to join, minimum $5 payout.',
    url: '/',
  },
}

export default function HomePage() {
  const featuredOffers = offers.filter((o) => o.featured)

  return (
    <>
      <HeroSection />
      <StatsBar />
      <HowItWorks />

      {/* Featured Offers Preview */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Start Earning Today</h2>
            <p className="text-slate-500 mt-2">
              Popular offers available right now — new ones added daily
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/earn"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-600/20"
            >
              View All {offers.length} Offers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AdBanner />

      <TestimonialsSection />
      <TrustBadges />

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-blue-100 mb-8 text-lg leading-relaxed">
            Join 250,000+ members who earn real cash just by watching ads. It&apos;s completely
            free — no credit card, no catch.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg"
          >
            Create Free Account →
          </Link>
          <p className="mt-4 text-blue-200 text-sm">
            No credit card required &nbsp;•&nbsp; Earn from Day 1 &nbsp;•&nbsp; Minimum $5 payout
          </p>
        </div>
      </section>
    </>
  )
}
