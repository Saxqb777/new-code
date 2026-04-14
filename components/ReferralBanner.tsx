'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function ReferralBanner() {
  const [copied, setCopied] = useState(false)
  const referralLink = 'https://freebucks.com/join?ref=DEMO123'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
      <p className="font-semibold text-sm mb-1 text-blue-100 uppercase tracking-wide">
        Your Referral Link
      </p>
      <p className="text-white font-medium mb-4">Share this link and earn 200 pts per referral</p>
      <div className="flex gap-2">
        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-mono truncate border border-white/10">
          {referralLink}
        </div>
        <button
          onClick={handleCopy}
          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm flex-shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-blue-200 text-xs mt-3">
        📌 Sign up first to get your real personalized referral link.
      </p>
    </div>
  )
}
