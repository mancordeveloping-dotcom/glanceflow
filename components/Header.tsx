'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Logo from '@/components/Logo'

interface UsageData {
  used: number
  limit: number
  isPremium: boolean
  remaining: number | null
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [open, setOpen] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        fetch('/api/usage').then(r => r.json()).then((d: UsageData) => setUsage(d)).catch(() => null)
      }
    })
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await supabaseBrowser.auth.signOut()
    router.push('/')
    router.refresh()
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

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 glass">
      <div className="mx-auto max-w-5xl px-4 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-110 duration-200">
            <Logo size={34} />
          </div>
          <span className="text-lg font-extrabold gradient-text tracking-tight">GlanceFlow</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform"
              >
                {initials}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-72 glass-bright inner-highlight rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-up border border-white/10">
                  {/* User info */}
                  <div className="px-5 py-4 border-b border-white/8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-violet-500/30">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user.email}</p>
                        <p className="text-xs text-slate-400">
                          Membro dal {new Date(user.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-5 py-4 border-b border-white/8 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Piano</span>
                      {usage?.isPremium ? (
                        <span className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-0.5 text-xs font-bold text-white">✦ Premium</span>
                      ) : (
                        <span className="rounded-full border border-white/10 px-3 py-0.5 text-xs font-semibold text-slate-300">Free</span>
                      )}
                    </div>

                    {!usage?.isPremium && usage && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Screenshot oggi</span>
                          <span className="font-bold text-white">{usage.used}/{usage.limit}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                            style={{ width: `${(usage.used / usage.limit) * 100}%` }}
                          />
                        </div>
                        <Link
                          href="/pricing"
                          onClick={() => setOpen(false)}
                          className="block text-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity mt-2"
                        >
                          Upgrade a Premium →
                        </Link>
                      </div>
                    )}

                    {usage?.isPremium && (
                      <button
                        onClick={handlePortal}
                        disabled={portalLoading}
                        className="w-full text-left text-sm text-violet-400 font-semibold hover:text-violet-300 transition-colors disabled:opacity-50"
                      >
                        {portalLoading ? 'Caricamento…' : 'Gestisci abbonamento →'}
                      </button>
                    )}
                  </div>

                  <div className="px-5 py-3">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-sm text-red-400 font-semibold hover:text-red-300 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="shimmer-btn rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
