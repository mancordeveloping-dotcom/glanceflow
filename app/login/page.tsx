'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type Mode = 'login' | 'signup'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [signupDone, setSignupDone] = useState(false)
  const router = useRouter()

  async function handleGoogle() {
    setGoogleLoading(true)
    setError(null)
    const { error: err } = await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (err) { setError(err.message); setGoogleLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (mode === 'login') {
      const { error: err } = await supabaseBrowser.auth.signInWithPassword({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      router.push('/')
      router.refresh()
    } else {
      const { error: err } = await supabaseBrowser.auth.signUp({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      fetch('/api/welcome', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).catch(() => null)
      setSignupDone(true)
    }
    setLoading(false)
  }

  if (signupDone) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="text-5xl">📧</div>
          <h2 className="text-xl font-bold text-white">Check your email</h2>
          <p className="text-sm text-slate-400">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
          </p>
          <button onClick={() => setMode('login')} className="text-sm text-violet-400 hover:text-violet-300">
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        {/* Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 w-64 h-32 bg-violet-600/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-slate-400">
            {mode === 'login' ? 'Sign in to GlanceFlow' : 'Free — 3 tasks/day'}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              placeholder="Min 6 characters"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="shimmer-btn btn-3d w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-bold text-white disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Loading…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
            className="text-violet-400 hover:text-violet-300 font-semibold"
          >
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
