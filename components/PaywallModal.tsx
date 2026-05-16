'use client'

import { useState } from 'react'

interface PaywallModalProps {
  onClose: () => void
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade(plan: 'monthly' | 'yearly') {
    setLoading(plan)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Failed to create checkout')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden border border-violet-500/20 shadow-2xl shadow-violet-500/10">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-violet-900/90 to-indigo-900/80 px-8 py-8 text-center space-y-2 border-b border-violet-500/20">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-500/30 blur-[60px] rounded-full" />
          <div className="relative text-5xl">🚀</div>
          <h2 className="relative text-2xl font-extrabold text-white">Daily limit reached</h2>
          <p className="relative text-sm text-slate-300">You've used all 3 free screenshots today.</p>
        </div>

        <div className="bg-[#0d0d1a]/95 p-8 space-y-4">
          <button
            onClick={() => handleUpgrade('yearly')}
            disabled={loading !== null}
            className="relative w-full shimmer-btn btn-3d rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 py-4 text-sm font-bold text-white disabled:opacity-40"
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-pink-500 px-3 py-0.5 text-[10px] font-bold text-white">
              SAVE 40%
            </span>
            {loading === 'yearly' ? 'Redirecting…' : '€49.99 / year — Best value'}
          </button>

          <button
            onClick={() => handleUpgrade('monthly')}
            disabled={loading !== null}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-slate-200 hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            {loading === 'monthly' ? 'Redirecting…' : '€6.99 / month — Go Premium'}
          </button>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-center gap-5 text-xs text-slate-500">
            <span>✓ Unlimited screenshots</span>
            <span>✓ Cancel anytime</span>
          </div>

          <button onClick={onClose} className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
