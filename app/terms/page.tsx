import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3">
        <Link href="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">← Back to home</Link>
        <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-slate-400 text-sm">Last updated: May 16, 2026</p>
      </div>

      <div className="space-y-8 text-slate-300 text-sm leading-relaxed">

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using GlanceFlow ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">2. Description of Service</h2>
          <p>GlanceFlow is a web application that uses artificial intelligence to extract actionable tasks from screenshots uploaded by users. The Service is provided on a freemium basis — a free tier with limited daily usage and a premium tier with unlimited access.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">3. User Accounts</h2>
          <p>You must create an account to use the Service. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">4. Subscriptions and Payments</h2>
          <p>Premium plans are billed on a monthly or annual basis. Payments are processed securely by Stripe. You may cancel your subscription at any time through your billing portal — cancellation takes effect at the end of the current billing period. We do not offer refunds for partial periods.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">5. Acceptable Use</h2>
          <p>You agree not to use the Service to upload content that is illegal, harmful, or violates third-party rights. You may not attempt to reverse-engineer, scrape, or abuse the Service's API limits.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">6. Privacy and Data</h2>
          <p>Your tasks are stored securely in a private database accessible only to you. Uploaded screenshots are processed by the AI and are <strong className="text-white">not stored</strong> on our servers. We do not sell your personal data to third parties. For full details, see our Privacy Policy.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">7. Intellectual Property</h2>
          <p>All content, design, and code of GlanceFlow is the property of its creators. You retain ownership of the data you upload and the tasks extracted from your screenshots.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">8. Limitation of Liability</h2>
          <p>GlanceFlow is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you in the last 3 months.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">9. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We will notify users of significant changes via email.</p>
        </section>

        <section className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
          <h2 className="text-lg font-bold text-white">10. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:mancordeveloping@gmail.com" className="text-violet-400 hover:text-violet-300">mancordeveloping@gmail.com</a>.</p>
        </section>

      </div>
    </div>
  )
}
