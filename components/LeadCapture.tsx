'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const DISMISSED_KEY = 'gf-lead-dismissed'
const SUBMITTED_KEY = 'gf-lead-submitted'
const HIDE_ON = ['/login', '/dashboard', '/profile', '/pricing']

export default function LeadCapture() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const triggered = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    if (HIDE_ON.includes(pathname)) return
    if (localStorage.getItem(DISMISSED_KEY)) return
    if (localStorage.getItem(SUBMITTED_KEY)) return

    function onScroll() {
      if (triggered.current) return
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrolled >= 0.6) {
        triggered.current = true
        setVisible(true)
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('done')
        localStorage.setItem(SUBMITTED_KEY, '1')
        setTimeout(() => setVisible(false), 3000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="relative w-full max-w-md glass inner-highlight rounded-3xl border border-violet-500/25 shadow-2xl shadow-black/80 overflow-hidden animate-fade-up">

        {/* Glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.45) 0%, transparent 70%)', filter: 'blur(30px)' }} />

        {/* Close */}
        <button onClick={dismiss} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 p-1">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative p-8 space-y-5">
          {status === 'done' ? (
            <div className="text-center space-y-3 py-4">
              <div className="text-5xl">📬</div>
              <h3 className="text-xl font-black text-white">Controllа la tua inbox!</h3>
              <p className="text-sm text-slate-400">Ti ho mandato la guida "5 mosse per smettere di perdere task". Arriva in pochi secondi.</p>
            </div>
          ) : (
            <>
              {/* Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300">
                  ⚡ Guida gratis
                </span>
              </div>

              {/* Headline */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-white leading-tight">
                  Smetti di perdere task<br />
                  <span className="gradient-text">nei messaggi</span>
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Lascia la mail — ti mando gratis la guida <strong className="text-slate-300">"5 mosse per non perdere più un task"</strong> + accesso con <strong className="text-violet-300">10 task gratuiti al giorno</strong>.
                </p>
              </div>

              {/* Bullets */}
              <ul className="space-y-2">
                {[
                  '📱 Come installare GlanceFlow sul telefono',
                  '⚡ Il workflow WhatsApp → task in 3 secondi',
                  '🏷️ Come organizzare per progetto',
                  '🔁 Attivare i reminder automatici',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tua@email.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="shimmer-btn btn-3d w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white disabled:opacity-50"
                >
                  {status === 'loading' ? 'Invio...' : 'Mandami la guida gratis →'}
                </button>
                {status === 'error' && (
                  <p className="text-xs text-red-400 text-center">Qualcosa è andato storto, riprova.</p>
                )}
              </form>

              <p className="text-[11px] text-slate-600 text-center">
                Niente spam. Solo la guida + aggiornamenti su GlanceFlow. Cancellati quando vuoi.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
