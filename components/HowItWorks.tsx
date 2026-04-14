import { UserPlus, Play, Gift } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create a Free Account',
    description:
      'Sign up in under 60 seconds. No credit card required — just your email and a password.',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Play,
    number: '02',
    title: 'Watch Ads & Complete Offers',
    description:
      'Browse hundreds of daily offers. Watch video ads, click sponsored links, install apps, or take quick surveys.',
    color: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    icon: Gift,
    number: '03',
    title: 'Redeem for Real Rewards',
    description:
      'Cash out as low as $5 via PayPal or choose from Amazon, Google Play, Steam, and Netflix gift cards.',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How FreeBucks Works</h2>
          <p className="text-slate-500 mt-2 text-lg">Start earning in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-slate-200 z-0" />

          {steps.map((step) => (
            <div key={step.number} className="text-center relative z-10">
              <div
                className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5 shadow-sm`}
              >
                <step.icon className={`w-8 h-8 ${step.iconColor}`} />
              </div>
              <div className="text-xs font-bold text-slate-400 tracking-widest mb-1 uppercase">
                Step {step.number}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Points explanation box */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-amber-800 font-medium text-sm leading-relaxed">
            🪙{' '}
            <strong>1,000 FreeBucks points = $1.00 USD</strong> — Minimum payout is just 5,000
            points ($5). Daily earning cap is 500 points to keep the platform fair and sustainable.
          </p>
        </div>
      </div>
    </section>
  )
}
