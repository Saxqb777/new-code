import type { Metadata } from 'next'
import ReferralBanner from '@/components/ReferralBanner'

export const metadata: Metadata = {
  title: 'Refer & Earn',
  description:
    'Earn 200 bonus FreeBucks points for every friend you refer who earns their first 1,000 points. No limit on referrals.',
}

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900">Refer &amp; Earn</h1>
          <p className="text-slate-500 mt-2">
            Invite friends and earn bonus points for every successful referral
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Main reward card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center mb-8 shadow-sm">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Earn 200 Points Per Referral
          </h2>
          <p className="text-slate-500 leading-relaxed max-w-md mx-auto">
            Share your unique link. When a friend signs up and earns their first 1,000 points,
            you both automatically receive{' '}
            <strong className="text-amber-600">200 bonus points</strong>.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-sm text-amber-700 font-medium">
            🪙 200 points = $0.20 per referral &nbsp;•&nbsp; No limit on referrals
          </div>
        </div>

        {/* Referral link */}
        <ReferralBanner />

        {/* How it works */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-5 text-lg">How It Works</h3>
          <ol className="space-y-4">
            {[
              'Copy your unique referral link above and share it with friends, family, or on social media.',
              'Your friend clicks your link, signs up for free, and starts watching ads and completing offers.',
              'Once your friend reaches 1,000 earned points, both of you automatically receive 200 bonus points.',
              'No limit — refer as many friends as you want and keep earning bonuses indefinitely!',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '$0.20', label: 'Per Referral' },
            { value: '∞', label: 'No Limit' },
            { value: '24h', label: 'Bonus Credited' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 py-4 px-3">
              <p className="text-2xl font-extrabold text-blue-600">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
