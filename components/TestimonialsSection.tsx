import { testimonials } from '@/lib/testimonials'

export default function TestimonialsSection() {
  const displayed = testimonials.slice(0, 3)

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">What Our Members Say</h2>
          <p className="text-slate-500 mt-2 text-lg">Real people earning real rewards every day</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayed.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{t.name}</p>
                  <p className="text-slate-400 text-xs truncate">{t.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-emerald-600 text-sm">{t.earned}</p>
                  <p className="text-slate-400 text-xs">earned</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < t.rating ? 'text-amber-400' : 'text-slate-200'}>
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>

              <p className="text-slate-400 text-xs">
                Member for{' '}
                {t.joinedMonthsAgo === 1 ? '1 month' : `${t.joinedMonthsAgo} months`}
              </p>
            </div>
          ))}
        </div>

        {/* Payment proof strip */}
        <div className="mt-10 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
          <p className="text-emerald-800 font-medium text-sm">
            💳 <strong>$1,200,000+</strong> paid out to members — verified PayPal and gift card
            transactions processed since launch.
          </p>
        </div>
      </div>
    </section>
  )
}
