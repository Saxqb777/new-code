'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, DollarSign } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Free<span className="text-blue-600">Bucks</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/earn"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              Earn
            </Link>
            <Link
              href="/redeem"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              Redeem
            </Link>
            <Link
              href="/referral"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              Refer &amp; Earn
            </Link>
            <Link
              href="/faq"
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
            >
              FAQ
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-slate-700 hover:text-blue-600 font-medium text-sm px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              Start Earning Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-1">
            <Link
              href="/earn"
              className="block px-3 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Earn
            </Link>
            <Link
              href="/redeem"
              className="block px-3 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Redeem
            </Link>
            <Link
              href="/referral"
              className="block px-3 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Refer &amp; Earn
            </Link>
            <Link
              href="/faq"
              className="block px-3 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </Link>
            <div className="pt-3 border-t border-slate-100 flex gap-3 px-1">
              <Link
                href="/dashboard"
                className="flex-1 text-center border border-blue-600 text-blue-600 font-semibold py-2.5 rounded-lg text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
