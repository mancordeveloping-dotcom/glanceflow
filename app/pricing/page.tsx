'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

const freeFeatures = [
  { text: '3 screenshots per day', included: true },
  { text: 'AI task extraction', included: true },
  { text: 'Dashboard, calendar, projects', included: true },
  { text: 'Task priority & recurrence', included: true },
  { text: 'Browser notifications', included: true },
  { text: 'Last 30 days history only', included: false },
  { text: 'Task from link / text', included: false },
  { text: 'AI Smart Summary email', included: false },
  { text: 'Expense tracker', included: false },
]

const premiumFeatures = [
  { text: 'Unlimited screenshots', included: true },
  { text: 'AI task extraction (priority)', included: true },
  { text: 'Dashboard, calendar, projects', included: true },
  { text: 'Task priority & recurrence', included: true },
  { text: 'Browser & email notifications', included: true },
  { text: 'Full task history (unlimited)', included: true },
  { text: 'Task from link / text (AI)', included: true },
  { text: 'AI Smart Summary email', included: true },
  { text: 'Expense tracker + AI receipts', included: true },
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
      <div className="grid sm:grid-cols-3 gap-6 items-start">

        {/* Free */}
        <div className="glass inner-highlight rounded-3xl p-8 space-y-6 border border-white/5 animate-fade-up">
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500">Free</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">€0</span>
              <span className="text-sm pb-1.5 text-slate-500">/forever</span>
            </div>
            <p className="text-sm text-slate-500">Perfect to get started</p>
          </div>
          <ul className="space-y-2.5">
            {freeFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${f.included ? 'bg-white/5 text-slate-400 border border-white/10' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {f.included ? '✓' : '✗'}
                </span>
                <span className={f.included ? 'text-slate-400' : 'text-slate-600 line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => handlePlan(null)}
            className="w-full rounded-xl py-3.5 text-sm font-extrabold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors">
            Get started free
          </button>
        </div>

        {/* Premium Monthly — highlighted */}
        <div className="relative rounded-3xl p-8 space-y-6 border border-violet-500/40 bg-gradient-to-b from-violet-900/80 to-indigo-900/60 scale-105 z-10 shadow-2xl shadow-violet-500/20 animate-fade-up" style={{ animationDelay: '0.12s' }}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 pointer-events-none" />
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-1 text-xs font-extrabold text-white shadow-lg shadow-violet-500/30">
            Most Popular
          </div>
          <div className="relative space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-violet-300">Premium</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">€6.99</span>
              <span className="text-sm pb-1.5 text-slate-300">/month</span>
            </div>
            <p className="text-sm text-slate-300">For power users</p>
          </div>
          <ul className="relative space-y-2.5">
            {premiumFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className="shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">✓</span>
                <span className="text-slate-200">{f.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => handlePlan('monthly')} disabled={loading !== null}
            className="relative w-full shimmer-btn btn-3d rounded-xl py-3.5 text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 text-white disabled:opacity-40">
            {loading === 'monthly' ? 'Redirecting…' : 'Start Monthly'}
          </button>
        </div>

        {/* Annual */}
        <div className="glass inner-highlight rounded-3xl p-8 space-y-6 border border-white/5 animate-fade-up" style={{ animationDelay: '0.24s', opacity: 0 }}>
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 border border-white/10 px-4 py-1 text-xs font-extrabold text-slate-300">
            Save 40%
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500">Annual</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">€49.99</span>
              <span className="text-sm pb-1.5 text-slate-500">/year</span>
            </div>
            <p className="text-sm text-emerald-400 font-semibold">Save €33.89 vs monthly</p>
          </div>
          <ul className="space-y-2.5">
            {premiumFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className="shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold bg-white/5 text-slate-400 border border-white/10">✓</span>
                <span className="text-slate-400">{f.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => handlePlan('yearly')} disabled={loading !== null}
            className="w-full rounded-xl py-3.5 text-sm font-extrabold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-40">
            {loading === 'yearly' ? 'Redirecting…' : 'Start Annual'}
          </button>
        </div>
      </div>

      {/* Feature comparison highlight */}
      <div className="glass inner-highlight rounded-3xl p-8 border border-white/5 space-y-6">
        <h2 className="text-2xl font-extrabold text-white text-center">What you unlock with Premium</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🔗', title: 'Task from link/text', desc: 'Paste any URL or text — AI extracts tasks instantly.' },
            { icon: '📬', title: 'AI Smart Summary', desc: 'Weekly email with AI-generated task summary and priorities.' },
            { icon: '📜', title: 'Unlimited history', desc: 'Access all your tasks from day one, no 30-day limit.' },
            { icon: '♾️', title: 'Unlimited screenshots', desc: 'Process as many screenshots as you need, every day.' },
          ].map(f => (
            <div key={f.title} className="glass rounded-2xl p-5 space-y-2 border border-white/5 text-center card-lift">
              <div className="text-3xl">{f.icon}</div>
              <p className="font-bold text-white text-sm">{f.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
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
            { q: 'What is the AI Smart Summary?', a: 'A weekly email generated by AI that summarizes your pending tasks, highlights priorities, and gives you a motivating overview.' },
            { q: 'Is my data safe?', a: 'Yes. Tasks are stored in your private Supabase database. Screenshots are not stored.' },
          ].map((item) => (
            <div key={item.q} className="glass inner-highlight rounded-2xl p-6 space-y-2 border border-white/5 hover:border-violet-500/20 transition-colors">
              <p className="font-bold text-white">{item.q}</p>
              <p className="text-sm text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
