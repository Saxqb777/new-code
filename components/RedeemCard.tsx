'use client'

import type { RewardOption } from '@/lib/rewards'

interface RedeemCardProps {
  reward: RewardOption
  userPoints: number
}

export default function RedeemCard({ reward, userPoints }: RedeemCardProps) {
  const canRedeem = userPoints >= reward.pointsRequired
  const pointsNeeded = reward.pointsRequired - userPoints

  const handleRedeem = () => {
    alert(
      `Demo mode: In the real app, you would redeem ${reward.pointsRequired.toLocaleString()} pts for a $${reward.cashValue} ${reward.name} reward.`
    )
  }

  return (
    <div
      className={`bg-white rounded-xl border ${canRedeem ? 'border-slate-200' : 'border-slate-100'} p-5 flex flex-col gap-3 ${!canRedeem ? 'opacity-70' : ''}`}
    >
      <div className="text-4xl">{reward.icon}</div>

      <div>
        <h3 className="font-bold text-slate-900">{reward.name}</h3>
        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{reward.description}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-slate-900">${reward.cashValue}</span>
        <span className="text-slate-400 text-sm">value</span>
      </div>

      <div className="text-sm text-amber-600 font-semibold">
        🪙 {reward.pointsRequired.toLocaleString()} pts required
      </div>

      <button
        onClick={canRedeem ? handleRedeem : undefined}
        disabled={!canRedeem}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors mt-auto ${
          canRedeem
            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        {canRedeem
          ? 'Redeem Now'
          : `Need ${pointsNeeded.toLocaleString()} more pts`}
      </button>
    </div>
  )
}
