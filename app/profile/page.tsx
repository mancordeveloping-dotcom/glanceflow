'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useLang, type Lang } from '@/context/LanguageContext'
import type { User } from '@supabase/supabase-js'

const THEMES = [
  { id: 'violet', label: 'Violet', from: '#7c3aed', to: '#06b6d4' },
  { id: 'blue',   label: 'Blue',   from: '#2563eb', to: '#38bdf8' },
  { id: 'green',  label: 'Green',  from: '#059669', to: '#34d399' },
  { id: 'pink',   label: 'Pink',   from: '#db2777', to: '#f472b6' },
  { id: 'orange', label: 'Orange', from: '#ea580c', to: '#f59e0b' },
  { id: 'red',    label: 'Red',    from: '#dc2626', to: '#ef4444' },
] as const

type ThemeId = (typeof THEMES)[number]['id']

interface UsageData {
  used: number
  limit: number
  isPremium: boolean
  remaining: number | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [theme, setTheme] = useState<ThemeId>('violet')
  const { lang, setLang, t } = useLang()
  const router = useRouter()

  useEffect(() => {
    const saved = (localStorage.getItem('gf-theme') ?? 'violet') as ThemeId
    setTheme(saved)
  }, [])

  function applyTheme(id: ThemeId) {
    setTheme(id)
    localStorage.setItem('gf-theme', id)
    if (id === 'violet') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', id)
    }
  }

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      fetch('/api/usage').then(r => r.json()).then((d: UsageData) => setUsage(d)).catch(() => null).finally(() => setLoading(false))
    })
  }, [router])

  async function handleResetPassword() {
    if (!user?.email) return
    setResetLoading(true)
    await supabaseBrowser.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setResetSent(true)
    setResetLoading(false)
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url } = await res.json() as { url: string }
      window.location.href = url
    } catch {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="h-8 w-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-white">{t('profile.title')}</h1>
        <p className="text-sm text-slate-400">
          {t('profile.member')} {user ? new Date(user.created_at).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { month: 'long', year: 'numeric' }) : ''}
        </p>
      </div>

      {/* Avatar + email */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-violet-500/30">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t('profile.email')}</p>
          </div>
        </div>
      </div>

      {/* Plan + usage */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-400">{t('profile.plan')}</p>
          {usage?.isPremium ? (
            <span className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
              {t('profile.plan.premium')}
            </span>
          ) : (
            <span className="rounded-full border border-white/10 px-4 py-1 text-xs font-semibold text-slate-300">
              {t('profile.plan.free')}
            </span>
          )}
        </div>

        {!usage?.isPremium && usage && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t('profile.usage')}</span>
              <span className="font-bold text-white">{usage.used}/{usage.limit}</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                style={{ width: `${Math.min((usage.used / usage.limit) * 100, 100)}%` }}
              />
            </div>
            <Link
              href="/pricing"
              className="block text-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity mt-2"
            >
              {t('profile.upgrade')}
            </Link>
          </div>
        )}

        {usage?.isPremium && (
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="w-full text-left text-sm text-violet-400 font-semibold hover:text-violet-300 transition-colors disabled:opacity-50"
          >
            {portalLoading ? '...' : t('profile.manageSubscription')}
          </button>
        )}
      </div>

      {/* Language */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
        <p className="text-sm font-semibold text-slate-400">{t('profile.language')}</p>
        <div className="grid grid-cols-2 gap-2">
          {([
            { code: 'en', label: '🇬🇧 English' },
            { code: 'it', label: '🇮🇹 Italiano' },
            { code: 'es', label: '🇪🇸 Español' },
            { code: 'fr', label: '🇫🇷 Français' },
            { code: 'de', label: '🇩🇪 Deutsch' },
          ] as { code: Lang; label: string }[]).map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-xl py-2.5 text-sm font-bold transition-all border
                ${lang === l.code
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
        <p className="text-sm font-semibold text-slate-400">Accent color</p>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(th => (
            <button key={th.id} onClick={() => applyTheme(th.id)}
              className={`relative rounded-xl py-2.5 text-xs font-bold transition-all border overflow-hidden ${theme === th.id ? 'border-white/30 scale-105' : 'border-white/5 hover:border-white/15'}`}>
              <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${th.from}, ${th.to})` }} />
              <span className="relative flex items-center justify-center gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ background: `linear-gradient(135deg, ${th.from}, ${th.to})` }} />
                <span className="text-white">{th.label}</span>
              </span>
              {theme === th.id && <span className="absolute top-1 right-1.5 text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
        <p className="text-sm font-semibold text-slate-400">{t('profile.changePassword')}</p>
        <p className="text-xs text-slate-500">{t('profile.changePassword.desc')}</p>
        {resetSent ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {t('profile.changePassword.sent')}
          </div>
        ) : (
          <button
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            {resetLoading ? '...' : t('profile.changePassword.btn')}
          </button>
        )}
      </div>
    </div>
  )
}
