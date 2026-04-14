import { Shield, Lock, CreditCard, Zap, BadgeCheck } from 'lucide-react'

const badges = [
  {
    icon: Lock,
    title: '100% Free',
    description: 'No credit card, no hidden fees, ever.',
  },
  {
    icon: Shield,
    title: 'SSL Secured',
    description: 'All data protected with 256-bit SSL.',
  },
  {
    icon: CreditCard,
    title: 'PayPal Verified',
    description: 'Secure payouts via trusted PayPal.',
  },
  {
    icon: Zap,
    title: 'Fast Payouts',
    description: 'Rewards processed within 24 hours.',
  },
  {
    icon: BadgeCheck,
    title: 'Vetted Advertisers',
    description: 'All sponsors reviewed by our team.',
  },
]

export default function TrustBadges() {
  return (
    <section className="py-12 px-4 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-xl font-semibold text-slate-700 mb-8">
          Why Members Trust FreeBucks
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {badges.map((badge) => (
            <div key={badge.title} className="text-center">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <badge.icon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{badge.title}</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
