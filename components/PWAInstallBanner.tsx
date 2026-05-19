'use client'

import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa-dismissed')) return

    // iOS Safari
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as { standalone?: boolean }).standalone
    if (ios) {
      setIsIOS(true)
      setTimeout(() => setVisible(true), 4000)
      return
    }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setVisible(true), 4000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-dismissed', '1')
      setVisible(false)
    }
  }

  function handleDismiss() {
    localStorage.setItem('pwa-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  // iOS instructions
  if (isIOS) return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-up">
      <div className="glass inner-highlight rounded-2xl border border-cyan-500/30 p-4 shadow-2xl shadow-black/70">
        <div className="flex items-start gap-3">
          <div className="shrink-0"><Logo size={36} /></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Aggiungi alla schermata Home</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Tocca <span className="text-white font-semibold">Condividi</span>{' '}
              <svg className="inline h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v11.25" /></svg>
              {' '}poi <span className="text-white font-semibold">"Aggiungi a Home"</span>
            </p>
          </div>
          <button onClick={handleDismiss} className="text-slate-500 hover:text-white transition-colors shrink-0 p-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  // Android / Chrome install
  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-fade-up">
      <div className="glass inner-highlight rounded-2xl border border-violet-500/30 p-4 shadow-2xl shadow-black/70 flex items-center gap-3">
        <div className="shrink-0"><Logo size={40} /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Installa GlanceFlow</p>
          <p className="text-xs text-slate-400">Accesso rapido, funziona offline</p>
          <div className="flex gap-2 mt-2.5">
            <button onClick={handleInstall}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity">
              Installa
            </button>
            <button onClick={handleDismiss}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              No grazie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
