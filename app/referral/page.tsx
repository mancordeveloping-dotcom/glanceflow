'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useToast } from '@/components/Toast'

interface ReferralData {
  code: string
  bonus_credits: number
  referral_count: number
}

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [inputCode, setInputCode] = useState('')
  const [applying, setApplying] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: auth }) => {
      if (!auth.user) { router.push('/login'); return }
      fetch('/api/referral').then(r => r.json()).then((d: ReferralData) => {
        setData(d)
      }).finally(() => setLoading(false))
    })
  }, [router])

  function getLink() {
    return `${window.location.origin}/login?ref=${data?.code}`
  }

  function handleCopy() {
    navigator.clipboard.writeText(getLink())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast('Link copiato!', 'success')
  }

  async function handleApply() {
    if (!inputCode.trim()) return
    setApplying(true)
    const res = await fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inputCode.trim() }),
    })
    const result = await res.json() as { success?: boolean; error?: string }
    if (res.ok) {
      toast('+3 screenshot bonus sbloccati!', 'success')
      fetch('/api/referral').then(r => r.json()).then(setData)
      setInputCode('')
    } else {
      toast(result.error ?? 'Codice non valido', 'error')
    }
    setApplying(false)
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

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold text-white">Referral</h1>
        <p className="mt-1 text-sm text-slate-400">Invita amici e guadagna screenshot extra</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass inner-highlight rounded-2xl p-5 text-center border border-white/5 space-y-1">
          <p className="text-3xl font-extrabold text-violet-400">{data?.referral_count ?? 0}</p>
          <p className="text-xs text-slate-500">Amici invitati</p>
        </div>
        <div className="glass inner-highlight rounded-2xl p-5 text-center border border-white/5 space-y-1">
          <p className="text-3xl font-extrabold text-cyan-400">+{data?.bonus_credits ?? 0}</p>
          <p className="text-xs text-slate-500">Screenshot bonus</p>
        </div>
      </div>

      {/* How it works */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-violet-500/20 space-y-4">
        <p className="text-sm font-bold text-violet-300 uppercase tracking-widest">Come funziona</p>
        <div className="space-y-3">
          {[
            { icon: '🔗', text: 'Condividi il tuo link con un amico' },
            { icon: '✅', text: "L'amico si registra con il tuo link" },
            { icon: '🎁', text: 'Entrambi ricevete +3 screenshot al giorno' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-xl">{s.icon}</span>
              {s.text}
            </div>
          ))}
        </div>
      </div>

      {/* Your link */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
        <p className="text-sm font-semibold text-slate-400">Il tuo link referral</p>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-300 truncate font-mono">
            {typeof window !== 'undefined' ? getLink() : `...?ref=${data?.code}`}
          </div>
          <button
            onClick={handleCopy}
            className="shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shrink-0"
          >
            {copied ? '✓ Copiato' : 'Copia'}
          </button>
        </div>
        <p className="text-xs text-slate-500">Il tuo codice: <span className="font-bold text-white font-mono">{data?.code}</span></p>
      </div>

      {/* Apply a code */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-3">
        <p className="text-sm font-semibold text-slate-400">Hai un codice referral?</p>
        <div className="flex gap-2">
          <input
            value={inputCode}
            onChange={e => setInputCode(e.target.value.toUpperCase())}
            placeholder="Inserisci codice (es. AB12CD34)"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 font-mono uppercase"
            maxLength={8}
          />
          <button
            onClick={handleApply}
            disabled={applying || !inputCode.trim()}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            {applying ? '...' : 'Applica'}
          </button>
        </div>
      </div>
    </div>
  )
}
