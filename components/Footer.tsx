import Link from 'next/link'
import { DollarSign } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Free<span className="text-blue-400">Bucks</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              FreeBucks lets you earn real rewards by watching ads and completing simple offers.
              Join 250,000+ members earning cash and gift cards every day.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-900/50 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-800">
                ✓ SSL Secured
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-900/50 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-800">
                ✓ PayPal Verified
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-700">
                ✓ 100% Free
              </span>
            </div>
          </div>

          {/* Earn */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Earn</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/earn" className="hover:text-white transition-colors">
                  Watch Videos
                </Link>
              </li>
              <li>
                <Link href="/earn" className="hover:text-white transition-colors">
                  Click Ads
                </Link>
              </li>
              <li>
                <Link href="/earn" className="hover:text-white transition-colors">
                  App Installs
                </Link>
              </li>
              <li>
                <Link href="/earn" className="hover:text-white transition-colors">
                  Surveys
                </Link>
              </li>
              <li>
                <Link href="/referral" className="hover:text-white transition-colors">
                  Refer a Friend
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/redeem" className="hover:text-white transition-colors">
                  How to Redeem
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-sm">© {year} FreeBucks. All rights reserved.</p>
          <p className="text-slate-600 text-xs text-center md:text-right">
            FreeBucks shares a portion of ad revenue with users. Min payout: 5,000 pts ($5). Daily
            cap: 500 pts.
          </p>
        </div>
      </div>
    </footer>
  )
}
