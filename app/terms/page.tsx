import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'FreeBucks Terms of Service — rules for earning, redeeming, and using the platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
          <p className="text-slate-500 mt-2 text-sm">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8 text-sm text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using FreeBucks, you agree to these Terms of Service. If
              you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Eligibility</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>You must be at least 13 years old to use FreeBucks.</li>
              <li>You must be a resident of an eligible country (currently US, CA, UK, AU).</li>
              <li>You may only hold one FreeBucks account per person.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Earning Points</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Points are earned by completing legitimate offers on the FreeBucks offer wall.</li>
              <li>The daily earning cap is <strong>500 points per account</strong>.</li>
              <li>Points have no cash value until redeemed through the official Redeem page.</li>
              <li>FreeBucks reserves the right to adjust point values and offer availability at any time.</li>
              <li>Points expire after 12 months of account inactivity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Prohibited Activities</h2>
            <p className="mb-3">
              The following activities are strictly prohibited and will result in immediate account
              termination and forfeiture of all points:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Creating multiple accounts (including family members on the same device/IP).</li>
              <li>Using bots, scripts, VPNs, proxies, or any automated methods to earn points.</li>
              <li>Fraudulently completing offers (e.g., uninstalling apps immediately after earning).</li>
              <li>Attempting to circumvent the daily earning cap.</li>
              <li>Sharing, selling, or transferring your account or points.</li>
              <li>Any activity that defrauds FreeBucks or its advertising partners.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Redemptions</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Minimum redemption is 5,000 points ($5.00).</li>
              <li>Redemption requests are processed within 24 hours on business days.</li>
              <li>PayPal payouts require a verified PayPal account in your name.</li>
              <li>Gift card codes are final — they cannot be exchanged, refunded, or reissued once delivered.</li>
              <li>FreeBucks is not responsible for lost gift card codes after delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Account Termination</h2>
            <p>
              FreeBucks reserves the right to suspend or permanently terminate any account at its
              sole discretion, with or without notice, for violations of these Terms. Terminated
              accounts forfeit all accumulated points without compensation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Limitation of Liability</h2>
            <p>
              FreeBucks is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
              liable for technical issues, data loss, or inability to access your account. Our
              maximum liability to any user is the cash value of their current verified points
              balance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of FreeBucks after changes
              means you accept the new Terms. Major changes will be announced via email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Contact</h2>
            <p>
              For legal inquiries, email{' '}
              <a href="mailto:legal@freebucks.com" className="text-blue-600 underline">
                legal@freebucks.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
