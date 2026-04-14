import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about FreeBucks — how to earn points, minimum payout, redemption process, and account rules.',
}

const faqs = [
  {
    q: 'Is FreeBucks really free to join?',
    a: 'Yes, 100% free. You never pay anything. FreeBucks earns from advertisers and shares a portion of that revenue with you as points.',
  },
  {
    q: 'How does FreeBucks actually make money?',
    a: "We partner with advertisers who pay us to show their ads to our members. We keep a portion of that revenue to run and grow the platform, and we share the rest with you as points. It's a genuine win-win.",
  },
  {
    q: 'How much can I earn per day?',
    a: 'There is a daily cap of 500 points ($0.50) per account. This keeps earning sustainable and prevents abuse. Watch videos, click ads, and complete offers to reach your daily cap.',
  },
  {
    q: 'What is the minimum payout amount?',
    a: 'The minimum payout is 5,000 points, which equals $5.00. This helps us keep payment processing costs manageable and ensures payouts are worth the transaction fees.',
  },
  {
    q: 'How many FreeBucks points equal $1?',
    a: '1,000 FreeBucks points = $1.00 USD. So 10 points = $0.01, and 5,000 points (minimum payout) = $5.00.',
  },
  {
    q: 'How do I redeem my points?',
    a: 'Go to the Redeem page and choose your reward: PayPal cash ($5, $10, or $25), or gift cards for Amazon, Google Play, Steam, or Netflix. Payouts are processed within 24 hours.',
  },
  {
    q: 'How long does a PayPal payout take?',
    a: 'PayPal payouts are processed within 24 hours of your redemption request. The funds appear directly in your PayPal account. Gift card codes are emailed within 24 hours.',
  },
  {
    q: 'Can I have more than one account?',
    a: 'No. One account per person, email address, and household is strictly enforced. Multiple accounts will result in a permanent ban and forfeiture of all points.',
  },
  {
    q: 'What if I complete an offer but don\'t receive my points?',
    a: "If you complete an offer and don't see your points credited within 30 minutes, contact our support team with a screenshot as proof of completion. We review every case.",
  },
  {
    q: 'Is my personal information safe?',
    a: 'Yes. We use 256-bit SSL encryption and we never sell your personal data to third parties. We only share data required to process your payout (e.g., your PayPal email with PayPal). Read our Privacy Policy for full details.',
  },
  {
    q: 'What countries is FreeBucks available in?',
    a: 'FreeBucks is currently available to users in the United States, Canada, United Kingdom, and Australia. We are working on expanding to more countries.',
  },
  {
    q: 'Are the advertisers on FreeBucks legitimate?',
    a: 'Yes. Every advertiser and offer on FreeBucks is reviewed by our team before going live. We only work with legitimate businesses. If you ever encounter a suspicious offer, please report it.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h1>
          <p className="text-slate-500 mt-2">Everything you need to know about FreeBucks</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">{faq.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-slate-900 mb-2">Still have a question?</h3>
          <p className="text-slate-500 text-sm mb-4">
            Our support team typically responds within 24 hours.
          </p>
          <a
            href="mailto:support@freebucks.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
