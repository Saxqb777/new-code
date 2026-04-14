import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FreeBucks Privacy Policy — how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="text-slate-500 mt-2 text-sm">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8 text-sm text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you use FreeBucks, we may collect the following information:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Account information:</strong> Email address, username, and password (hashed).</li>
              <li><strong>Payout information:</strong> PayPal email address when you request a cash payout.</li>
              <li><strong>Usage data:</strong> Offers completed, points earned, IP address, and device type (for fraud prevention).</li>
              <li><strong>Cookies:</strong> Session cookies to keep you logged in and analytics cookies to improve the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>To create and manage your FreeBucks account.</li>
              <li>To credit your points balance when you complete offers.</li>
              <li>To process your reward redemptions (PayPal, gift cards).</li>
              <li>To detect and prevent fraudulent activity.</li>
              <li>To send transactional emails (account confirmation, payout receipts).</li>
              <li>To improve the FreeBucks platform and offer quality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Information Sharing</h2>
            <p className="mb-3">
              We do <strong>not sell</strong> your personal data to third parties.
            </p>
            <p>We may share limited information with:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 mt-2">
              <li><strong>Payment processors</strong> (PayPal) only to fulfill your payout request.</li>
              <li><strong>Advertisers</strong>: We share aggregated, non-identifiable usage statistics only (e.g., how many users watched an ad).</li>
              <li><strong>Law enforcement</strong> if required by law or to prevent fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Cookies</h2>
            <p>
              FreeBucks uses essential cookies to keep you logged in and functional cookies to
              remember your preferences. We also use Google Analytics to understand how visitors
              use our site. You can disable cookies in your browser settings, but some site features
              may not work correctly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Data Security</h2>
            <p>
              We use 256-bit SSL encryption for all data transmitted between your browser and our
              servers. Passwords are hashed and never stored in plain text. We perform regular
              security audits and do not store payment card information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 mt-2">
              <li>Request a copy of the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Opt out of non-transactional marketing emails.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email us at{' '}
              <a href="mailto:privacy@freebucks.com" className="text-blue-600 underline">
                privacy@freebucks.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Children&apos;s Privacy</h2>
            <p>
              FreeBucks is not intended for users under 13 years of age. We do not knowingly
              collect personal information from children. If you believe a child has created an
              account, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users
              of significant changes via email. Continued use of FreeBucks after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Contact Us</h2>
            <p>
              For privacy-related questions, email{' '}
              <a href="mailto:privacy@freebucks.com" className="text-blue-600 underline">
                privacy@freebucks.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
