'use client'

import Link from 'next/link'
import PointsWidget from '@/components/PointsWidget'
import AdBanner from '@/components/AdBanner'

const TOTAL_POINTS = 1247
const DAILY_EARNED = 30
const DAILY_CAP = 500
const NEXT_REDEMPTION = 5000

const recentActivity = [
  { id: 1, action: 'Watched 30-sec video ad', points: 15, time: '2 min ago', icon: '📺' },
  { id: 2, action: 'Daily Check-In Bonus', points: 10, time: '1 hour ago', icon: '🎁' },
  { id: 3, action: "Visited sponsor's page", points: 5, time: '3 hours ago', icon: '🖱' },
  { id: 4, action: 'Completed quick survey', points: 50, time: 'Yesterday', icon: '📋' },
  { id: 5, action: 'Watched product review', points: 40, time: '2 days ago', icon: '📺' },
]

export default function DashboardPage() {
  const redemptionProgress = Math.min((TOTAL_POINTS / NEXT_REDEMPTION) * 100, 100)
  const dailyProgress = Math.min((DAILY_EARNED / DAILY_CAP) * 100, 100)
  const pointsToGo = NEXT_REDEMPTION - TOTAL_POINTS

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">
              Demo Account
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Welcome back, Alex! 👋</h1>
          </div>
          <PointsWidget points={TOTAL_POINTS} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Demo notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700 leading-relaxed">
          <strong>👀 Demo Preview</strong> — This is a preview of your dashboard after signing up.{' '}
          <Link href="/" className="text-blue-600 underline underline-offset-2">
            Create a free account
          </Link>{' '}
          to start earning real points and tracking your progress.
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Balance */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
              Total Balance
            </p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">
              {TOTAL_POINTS.toLocaleString()}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              points = ${(TOTAL_POINTS / 1000).toFixed(2)} USD
            </p>
          </div>

          {/* Today */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
              Today&apos;s Earnings
            </p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{DAILY_EARNED}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>
                  {DAILY_EARNED} / {DAILY_CAP} pts
                </span>
                <span>Daily limit</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Redemption progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
              Next Redemption
            </p>
            <p className="text-slate-900 font-bold text-lg mt-1">
              {pointsToGo.toLocaleString()} pts to go
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>
                  {TOTAL_POINTS} / {NEXT_REDEMPTION} pts
                </span>
                <span>$5 payout</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${redemptionProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{item.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 flex-shrink-0">
                    +{item.points} pts
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/earn"
              className="block text-center mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Earn more points →
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2.5">
              <Link
                href="/earn"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <span className="text-xl">📺</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Watch an Ad</p>
                  <p className="text-xs text-blue-600">Earn up to 40 pts</p>
                </div>
              </Link>

              <Link
                href="/earn"
                className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
              >
                <span className="text-xl">🎁</span>
                <div>
                  <p className="text-sm font-medium text-amber-900">Daily Check-In</p>
                  <p className="text-xs text-amber-600">+10 pts free</p>
                </div>
              </Link>

              <Link
                href="/referral"
                className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              >
                <span className="text-xl">👥</span>
                <div>
                  <p className="text-sm font-medium text-emerald-900">Refer a Friend</p>
                  <p className="text-xs text-emerald-600">+200 pts per referral</p>
                </div>
              </Link>

              <Link
                href="/redeem"
                className="flex items-center gap-3 p-3 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
              >
                <span className="text-xl">💳</span>
                <div>
                  <p className="text-sm font-medium text-violet-900">Redeem Rewards</p>
                  <p className="text-xs text-violet-600">Starting at $5</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />
    </div>
  )
}
