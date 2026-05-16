'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Lang = 'en' | 'it'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.pricing': 'Pricing',
    'nav.profile': 'Profile',
    'nav.signout': 'Sign out',
    'nav.signin': 'Sign in',
    'profile.title': 'Profile',
    'profile.email': 'Email',
    'profile.plan': 'Plan',
    'profile.plan.free': 'Free',
    'profile.plan.premium': '✦ Premium',
    'profile.usage': 'Usage today',
    'profile.language': 'Language',
    'profile.changePassword': 'Change password',
    'profile.changePassword.desc': 'We will send a reset link to your email.',
    'profile.changePassword.btn': 'Send reset link',
    'profile.changePassword.sent': 'Email sent! Check your inbox.',
    'profile.member': 'Member since',
    'profile.upgrade': 'Upgrade to Premium →',
    'profile.manageSubscription': 'Manage subscription →',
    'dashboard.title': 'Dashboard',
    'dashboard.noTasks': 'No tasks yet — upload a screenshot to get started.',
    'dashboard.upload': 'Upload a screenshot →',
  },
  it: {
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.pricing': 'Prezzi',
    'nav.profile': 'Profilo',
    'nav.signout': 'Esci',
    'nav.signin': 'Accedi',
    'profile.title': 'Profilo',
    'profile.email': 'Email',
    'profile.plan': 'Piano',
    'profile.plan.free': 'Gratuito',
    'profile.plan.premium': '✦ Premium',
    'profile.usage': 'Utilizzo oggi',
    'profile.language': 'Lingua',
    'profile.changePassword': 'Cambia password',
    'profile.changePassword.desc': 'Ti invieremo un link di reset alla tua email.',
    'profile.changePassword.btn': 'Invia link di reset',
    'profile.changePassword.sent': 'Email inviata! Controlla la tua casella.',
    'profile.member': 'Membro da',
    'profile.upgrade': 'Passa a Premium →',
    'profile.manageSubscription': 'Gestisci abbonamento →',
    'dashboard.title': 'Dashboard',
    'dashboard.noTasks': 'Nessun task ancora — carica uno screenshot per iniziare.',
    'dashboard.upload': 'Carica uno screenshot →',
  },
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => null,
  t: (k) => k,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved === 'en' || saved === 'it') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  function t(key: string): string {
    return translations[lang][key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
