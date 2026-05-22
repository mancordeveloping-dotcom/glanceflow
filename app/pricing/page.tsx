'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useLang } from '@/context/LanguageContext'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useLang()

  const freeFeatures = [
    { text: '3 tasks per day',               ok: true  },
    { text: 'AI task extraction',           ok: true  },
    { text: 'Dashboard & projects',         ok: true  },
    { text: 'Task priority & recurrence',   ok: true  },
    { text: 'Browser notifications',        ok: true  },
    { text: 'Full task history',            ok: false },
    { text: 'Task from link / text',        ok: false },
    { text: 'AI Smart Summary email',       ok: false },
    { text: 'Calendar view',               ok: false },
    { text: 'Webhooks & integrations',      ok: false },
    { text: 'Priority AI processing',       ok: false },
  ]

  const premiumFeatures = [
    { text: 'Unlimited screenshots',        ok: true  },
    { text: 'AI task extraction (fast)',    ok: true  },
    { text: 'Dashboard & projects',         ok: true  },
    { text: 'Task priority & recurrence',   ok: true  },
    { text: 'Browser & email notifications',ok: true  },
    { text: 'Full task history (unlimited)',ok: true  },
    { text: 'Task from link / text (AI)',   ok: true  },
    { text: 'AI Smart Summary email',       ok: true  },
    { text: 'Calendar view',               ok: false },
    { text: 'Webhooks & integrations',      ok: false },
    { text: 'Priority AI processing',       ok: false },
  ]

  const proFeatures = [
    { text: 'Everything in Premium',        ok: true, star: false },
    { text: 'Unlimited screenshots',        ok: true, star: false },
    { text: 'Priority AI processing',       ok: true, star: true  },
    { text: 'Calendar view',               ok: true, star: true  },
    { text: 'Webhooks & integrations',      ok: true, star: true  },
    { text: 'Zapier / Make connect',        ok: true, star: true  },
    { text: 'On-demand AI Smart Summary',   ok: true, star: true  },
    { text: 'Advanced task analytics',      ok: true, star: true  },
    { text: 'API access (coming soon)',     ok: true, star: false },
    { text: 'Priority support',            ok: true, star: false },
    { text: 'Early access to new features', ok: true, star: false },
  ]

  async function handlePlan(plan: 'monthly' | 'pro' | null) {
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

      {/* ── Header ── */}
      <div className="text-center space-y-4 animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300 tracking-widest uppercase">
          {t('pricing.badge')}
        </span>
        <h1 className="text-6xl font-extrabold tracking-tight">
          <span className="text-white">{t('pricing.title')} </span>
          <span className="gradient-text">{t('pricing.title.highlight')}</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-lg mx-auto">
          {t('pricing.subtitle')}
        </p>
      </div>

      {/* ── Plans ── */}
      <div className="grid sm:grid-cols-3 gap-6 items-start">

        {/* Free */}
        <div className="glass inner-highlight rounded-3xl p-8 space-y-6 border border-white/5 animate-fade-up">
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500">{t('pricing.free.label')}</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">{t('pricing.free.price')}</span>
              <span className="text-sm pb-1.5 text-slate-500">{t('pricing.free.period')}</span>
            </div>
            <p className="text-sm text-slate-500">{t('pricing.free.tagline')}</p>
          </div>
          <ul className="space-y-2.5">
            {freeFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${f.ok ? 'bg-white/5 text-slate-400 border border-white/10' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {f.ok ? '✓' : '✗'}
                </span>
                <span className={f.ok ? 'text-slate-400' : 'text-slate-600 line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => handlePlan(null)}
            className="w-full rounded-xl py-3.5 text-sm font-extrabold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors">
            {t('pricing.free.cta')}
          </button>
        </div>

        {/* Premium Monthly */}
        <div className="glass inner-highlight rounded-3xl p-8 space-y-6 border border-white/8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-violet-400">{t('pricing.premium.label')}</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">{t('pricing.premium.price')}</span>
              <span className="text-sm pb-1.5 text-slate-400">{t('pricing.premium.period')}</span>
            </div>
            <p className="text-sm text-slate-400">{t('pricing.premium.tagline')}</p>
          </div>
          <ul className="space-y-2.5">
            {premiumFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${f.ok ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-slate-600 border border-white/5'}`}>
                  {f.ok ? '✓' : '✗'}
                </span>
                <span className={f.ok ? 'text-slate-300' : 'text-slate-600'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => handlePlan('monthly')} disabled={loading !== null}
            className="w-full rounded-xl py-3.5 text-sm font-extrabold border border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-colors disabled:opacity-40">
            {loading === 'monthly' ? t('pricing.premium.cta.loading') : t('pricing.premium.cta')}
          </button>
        </div>

        {/* Pro — highlighted */}
        <div className="relative rounded-3xl p-8 space-y-6 border border-cyan-500/40 bg-gradient-to-b from-cyan-900/50 to-violet-900/40 scale-105 z-10 shadow-2xl shadow-cyan-500/15 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-600/8 to-violet-600/8 pointer-events-none" />
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-1 text-xs font-extrabold text-white shadow-lg shadow-cyan-500/30 whitespace-nowrap">
            {t('pricing.pro.badge')}
          </div>
          <div className="relative space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-cyan-300">{t('pricing.pro.label')}</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">{t('pricing.pro.price')}</span>
              <span className="text-sm pb-1.5 text-slate-300">{t('pricing.pro.period')}</span>
            </div>
            <p className="text-sm text-cyan-400 font-semibold">{t('pricing.pro.tagline')}</p>
          </div>
          <ul className="relative space-y-2.5">
            {proFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${f.star ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/8 text-slate-300 border border-white/15'}`}>
                  {f.star ? '✦' : '✓'}
                </span>
                <span className={f.star ? 'text-cyan-200 font-semibold' : 'text-slate-300'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => handlePlan('pro')} disabled={loading !== null}
            className="relative w-full shimmer-btn btn-3d rounded-xl py-3.5 text-sm font-extrabold bg-gradient-to-r from-cyan-500 to-violet-600 text-white disabled:opacity-40 shadow-lg shadow-cyan-500/20">
            {loading === 'pro' ? t('pricing.pro.cta.loading') : t('pricing.pro.cta')}
          </button>
        </div>

      </div>

      {/* ── What you unlock with Pro ── */}
      <div className="glass inner-highlight rounded-3xl p-8 border border-white/5 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">{t('pricing.unlock.title')}</h2>
          <p className="text-sm text-slate-500">{t('pricing.unlock.subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🔗', title: 'Webhooks & Zapier',    desc: 'Fire events to Zapier, Make or any webhook URL on task create / complete / delete.' },
            { icon: '📅', title: 'Calendar view',        desc: 'Full monthly calendar showing all your tasks, events and reminders at a glance.' },
            { icon: '⚡', title: 'Priority AI',          desc: 'Your screenshots jump to the front of the processing queue — results in seconds.' },
            { icon: '📊', title: 'Advanced analytics',   desc: 'Heatmaps, streaks, priority breakdowns and completion trends across all time.' },
            { icon: '📬', title: 'On-demand Summary',    desc: 'Request an AI-written email summary of your tasks anytime, not just weekly.' },
            { icon: '🛠', title: 'API access',           desc: 'Programmatic access to your tasks — build your own integrations (coming soon).' },
          ].map(f => (
            <div key={f.title} className="glass rounded-2xl p-5 space-y-2 border border-cyan-500/10 hover:border-cyan-500/25 transition-colors">
              <div className="text-2xl">{f.icon}</div>
              <p className="font-bold text-sm text-white">{f.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {[t('pricing.trust.stripe'), t('pricing.trust.cancel'), t('pricing.trust.instant'), t('pricing.trust.vat')].map((b) => (
          <span key={b} className="glass rounded-full px-4 py-2 text-xs font-medium text-slate-400 border border-white/5">{b}</span>
        ))}
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-white">{t('pricing.faq.title')}</h2>
        <div className="space-y-4">
          {[
            { q: t('pricing.faq.q1'), a: t('pricing.faq.a1') },
            { q: t('pricing.faq.q2'), a: t('pricing.faq.a2') },
            { q: t('pricing.faq.q3'), a: t('pricing.faq.a3') },
            { q: t('pricing.faq.q4'), a: t('pricing.faq.a4') },
            { q: t('pricing.faq.q5'), a: t('pricing.faq.a5') },
            { q: t('pricing.faq.q6'), a: t('pricing.faq.a6') },
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
