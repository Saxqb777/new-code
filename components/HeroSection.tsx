import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-slate-200">5,847 members earned today</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Get Paid Just for
          <br />
          <span className="text-amber-400">Watching Ads</span>
        </h1>

        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          FreeBucks pays you real rewards to watch video ads and complete simple offers. Redeem your
          points for PayPal cash or top gift cards — no catch, 100% free.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-amber-400/20"
          >
            Start Earning Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            <Play className="w-5 h-5" /> See How It Works
          </Link>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-blue-200">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> 100% Free to Join
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> No Credit Card Needed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> Minimum $5 Payout
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> PayPal &amp; Gift Cards
          </span>
        </div>
      </div>
    </section>
  )
}
