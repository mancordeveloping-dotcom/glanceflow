'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

const plans = [
  {
    name: 'Free',
    price: '€0',
    period: 'forever',
    description: 'Perfect to try GlanceFlow',
    features: ['3 screenshots per day', 'AI task extraction', 'Dashboard & task tracking', 'Mark tasks as done'],
    cta: 'Get started free',
    plan: null as null,
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '€6.99',
    period: 'per month',
    description: 'For power users',
    features: ['Unlimited screenshots', 'Priority AI processing', 'Dashboard & task tracking', 'Mark tasks as done', 'Cancel anytime'],
    cta: 'Start Monthly',
    plan: 'monthly' as const,
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Annual',
    price: '€49.99',
    period: 'per year',
    description: 'Best value — save 40%',
    features: ['Unlimited screenshots', 'Priority AI processing', 'Dashboard & task tracking', 'Mark tasks as done', 'Save €33.89 vs monthly'],
    cta: 'Start Annual',
    plan: 'yearly' as const,
    highlighted: false,
    badge: 'Save 40%',
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handlePlan(plan: 'monthly' | 'yearly' | null) {
    if (!plan) { router.push('/login'); return }
    const { data: { user } } = await supabaseBrowser.auth.getUser()
    if (!user) { router.push('/login'); return }
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const { url } = await res.json() as { url: string }
      window.location.href = url
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300 tracking-widest uppercase">
          Simple pricing
        </span>
        <h1 className="text-6xl font-extrabold tracking-tight">
          <span className="text-white">Choose your </span>
          <span className="gradient-text">plan</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-lg mx-auto">
          Start free, upgrade when you need more. No hidden fees.
        </p>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-3 gap-6 items-center">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`relative rounded-3xl p-8 space-y-6 border animate-fade-up transition-all
              ${p.highlighted
                ? 'bg-gradient-to-b from-violet-900/80 to-indigo-900/60 border-violet-500/40 scale-105 z-10 shadow-2xl shadow-violet-500/20'
                : 'glass inner-highlight border-white/5'
              }`}
            style={{ animationDelay: `${i * 0.12}s`, opacity: p.highlighted ? 1 : 0 }}
          >
            {p.highlighted && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 pointer-events-none" />
            )}

            {p.badge && (
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-extrabold
                ${p.highlighted
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white/10 text-slate-300 border border-white/10'
                }`}>
                {p.badge}
              </div>
            )}

            <div className="relative space-y-1">
              <p className={`text-xs font-bold tracking-widest uppercase ${p.highlighted ? 'text-violet-300' : 'text-slate-500'}`}>
                {p.name}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold text-white">{p.price}</span>
                <span className={`text-sm pb-1.5 ${p.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>/{p.period}</span>
              </div>
              <p className={`text-sm ${p.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>{p.description}</p>
            </div>

            <ul className="relative space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <span className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold
                    ${p.highlighted ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>✓</span>
                  <span className={p.highlighted ? 'text-slate-200' : 'text-slate-400'}>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlan(p.plan)}
              disabled={loading !== null}
              className={`relative w-full rounded-xl py-3.5 text-sm font-extrabold transition-all disabled:opacity-40
                ${p.highlighted
                  ? 'shimmer-btn btn-3d bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
            >
              {loading === p.plan ? 'Redirecting…' : p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {['🔒 Secure via Stripe', '↩ Cancel anytime', '⚡ Instant activation', '🇪🇺 VAT included'].map((b) => (
          <span key={b} className="glass rounded-full px-4 py-2 text-xs font-medium text-slate-400 border border-white/5">{b}</span>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-white">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, cancel with one click from your Stripe billing portal. No questions asked.' },
            { q: 'What counts as a screenshot?', a: 'Every image you upload and process with AI counts as one screenshot.' },
            { q: 'Do unused free screenshots roll over?', a: 'No, the free limit resets every day at midnight.' },
            { q: 'Is my data safe?', a: 'Yes. Tasks are stored in your private Supabase database. Screenshots are not stored.' },
          ].map((item, i) => (
            <div key={item.q} className="card-3d glass inner-highlight rounded-2xl p-6 space-y-2 border border-white/5 animate-fade-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <p className="font-bold text-white">{item.q}</p>
              <p className="text-sm text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
