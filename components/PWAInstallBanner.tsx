'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('pwa-dismissed')) return
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
  }

  function handleDismiss() {
    localStorage.setItem('pwa-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40 animate-fade-scale">
      <div className="glass inner-highlight rounded-2xl border border-violet-500/20 p-4 shadow-2xl shadow-black/70 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0 text-white font-black text-sm shadow-lg shadow-violet-500/30">
          G
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Install GlanceFlow</p>
          <p className="text-xs text-slate-400 truncate">Add to home screen for faster access</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
