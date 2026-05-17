'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Logo from '@/components/Logo'
import { usePathname } from 'next/navigation'

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
  const [toolsOpen, setToolsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false)
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await supabaseBrowser.auth.signOut()
    setMobileOpen(false)
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
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="transition-transform group-hover:scale-110 duration-200">
            <Logo size={34} />
          </div>
          <span className="text-lg font-extrabold gradient-text tracking-tight">GlanceFlow</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-400">
            <Link href="/" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-white' : ''}`}>Home</Link>
            <Link href="/dashboard" className={`hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-white' : ''}`}>Dashboard</Link>

            {/* Tools dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(v => !v)}
                className={`flex items-center gap-1 hover:text-white transition-colors ${['/expenses','/calendar','/projects'].includes(pathname) ? 'text-white' : ''}`}
              >
                Tools
                <svg className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-2xl border border-white/10 shadow-xl shadow-black/50 overflow-hidden z-50 animate-fade-up" style={{ background: '#111118' }}>
                  {[
                    { href: '/expenses', icon: '🧾', label: 'Expenses' },
                    { href: '/calendar', icon: '📅', label: 'Calendar' },
                    { href: '/projects', icon: '📁', label: 'Projects' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setToolsOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/8
                        ${pathname === item.href ? 'text-white bg-white/5' : 'text-slate-400'}`}>
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/pricing" className={`hover:text-white transition-colors ${pathname === '/pricing' ? 'text-white' : ''}`}>Pricing</Link>
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
                <div className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-50 animate-fade-up border border-white/10" style={{ background: '#111118' }}>
                  <div className="px-5 py-4 border-b border-white/8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
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
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all" style={{ width: `${(usage.used / usage.limit) * 100}%` }} />
                        </div>
                        <Link href="/pricing" onClick={() => setOpen(false)} className="block text-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity mt-2">
                          Upgrade a Premium →
                        </Link>
                      </div>
                    )}

                    {usage?.isPremium && (
                      <button onClick={handlePortal} disabled={portalLoading} className="w-full text-left text-sm text-violet-400 font-semibold hover:text-violet-300 transition-colors disabled:opacity-50">
                        {portalLoading ? 'Caricamento…' : 'Gestisci abbonamento →'}
                      </button>
                    )}
                  </div>

                  <div className="px-5 py-3 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/8 transition-colors"
                    >
                      <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="shimmer-btn rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          {!user && (
            <Link href="/login" className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white">
              Sign in
            </Link>
          )}
          {user && (
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          )}
          {/* Hamburger */}
          <button onClick={() => setMobileOpen((v) => !v)} className="rounded-lg border border-white/10 bg-white/5 p-2">
            {mobileOpen ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 glass-bright px-4 py-4 space-y-1 animate-fade-up">
          {user && (
            <div className="px-3 py-3 mb-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-sm font-bold text-white truncate">{user.email}</p>
              {usage?.isPremium ? (
                <span className="text-xs text-violet-400 font-semibold">✦ Premium</span>
              ) : (
                <span className="text-xs text-slate-400">{usage?.remaining}/{usage?.limit} screenshot rimasti oggi</span>
              )}
            </div>
          )}

          {[
            { href: '/', label: 'Home' },
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/expenses', label: 'Expenses' },
            { href: '/calendar', label: 'Calendar' },
            { href: '/projects', label: 'Projects' },
            { href: '/pricing', label: 'Pricing' },
            { href: '/profile', label: 'Profile' },
          ].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}

          {user ? (
            <button onClick={handleLogout} className="w-full text-left rounded-xl px-3 py-3 text-sm font-semibold text-red-400 hover:bg-white/5 transition-colors">
              Sign out
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="block rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-3 text-sm font-bold text-white text-center mt-2">
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
