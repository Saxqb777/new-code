import type { Metadata } from 'next'
import { rewards } from '@/lib/rewards'
import RedeemCard from '@/components/RedeemCard'
import PointsWidget from '@/components/PointsWidget'

export const metadata: Metadata = {
  title: 'Redeem Rewards',
  description:
    'Redeem your FreeBucks points for PayPal cash, Amazon gift cards, Google Play, Steam, Netflix, and more. Minimum payout just $5.',
}

export default function RedeemPage() {
  const cashRewards = rewards.filter((r) => r.type === 'cash')
  const giftCardRewards = rewards.filter((r) => r.type === 'giftcard')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Redeem Rewards</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Exchange your points for cash or gift cards
            </p>
          </div>
          <PointsWidget points={1247} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-700 leading-relaxed">
          <strong>ℹ️ How redemptions work:</strong> Once you submit a request, it&apos;s processed
          within 24 hours. Gift card codes are delivered to your registered email.{' '}
          <strong>Minimum: 5,000 points = $5.00.</strong>
        </div>

        {/* Cash payouts */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-1">💸 Cash Payouts</h2>
          <p className="text-slate-500 text-sm mb-5">Direct transfer to your PayPal account</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cashRewards.map((reward) => (
              <RedeemCard key={reward.id} reward={reward} userPoints={1247} />
            ))}
          </div>
        </div>

        {/* Gift cards */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">🎁 Gift Cards</h2>
          <p className="text-slate-500 text-sm mb-5">Codes delivered to your email instantly</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {giftCardRewards.map((reward) => (
              <RedeemCard key={reward.id} reward={reward} userPoints={1247} />
            ))}
          </div>
        </div>

        {/* Fine print */}
        <div className="mt-10 bg-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
          <strong>Redemption Policy:</strong> Points must be earned legitimately through our offer
          wall. Accounts suspected of fraud or abuse will be reviewed before payouts are processed.
          FreeBucks reserves the right to void points earned through invalid activity. See our{' '}
          <a href="/terms" className="text-blue-600 underline">
            Terms of Service
          </a>{' '}
          for full details.
        </div>
      </div>
    </div>
  )
}
