'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'en' | 'it' | 'es' | 'fr' | 'de'

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
  es: {
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.pricing': 'Precios',
    'nav.profile': 'Perfil',
    'nav.signout': 'Cerrar sesión',
    'nav.signin': 'Iniciar sesión',
    'profile.title': 'Perfil',
    'profile.email': 'Correo',
    'profile.plan': 'Plan',
    'profile.plan.free': 'Gratis',
    'profile.plan.premium': '✦ Premium',
    'profile.usage': 'Uso hoy',
    'profile.language': 'Idioma',
    'profile.changePassword': 'Cambiar contraseña',
    'profile.changePassword.desc': 'Te enviaremos un enlace de restablecimiento.',
    'profile.changePassword.btn': 'Enviar enlace',
    'profile.changePassword.sent': '¡Correo enviado! Revisa tu bandeja.',
    'profile.member': 'Miembro desde',
    'profile.upgrade': 'Actualizar a Premium →',
    'profile.manageSubscription': 'Gestionar suscripción →',
    'dashboard.title': 'Panel',
    'dashboard.noTasks': 'Sin tareas aún — sube una captura para empezar.',
    'dashboard.upload': 'Subir captura →',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.pricing': 'Tarifs',
    'nav.profile': 'Profil',
    'nav.signout': 'Se déconnecter',
    'nav.signin': 'Se connecter',
    'profile.title': 'Profil',
    'profile.email': 'Email',
    'profile.plan': 'Forfait',
    'profile.plan.free': 'Gratuit',
    'profile.plan.premium': '✦ Premium',
    'profile.usage': "Utilisation aujourd'hui",
    'profile.language': 'Langue',
    'profile.changePassword': 'Changer le mot de passe',
    'profile.changePassword.desc': 'Nous enverrons un lien de réinitialisation à votre email.',
    'profile.changePassword.btn': 'Envoyer le lien',
    'profile.changePassword.sent': 'Email envoyé ! Vérifiez votre boîte.',
    'profile.member': 'Membre depuis',
    'profile.upgrade': 'Passer à Premium →',
    'profile.manageSubscription': "Gérer l'abonnement →",
    'dashboard.title': 'Tableau de bord',
    'dashboard.noTasks': "Pas encore de tâches — importez une capture d'écran.",
    'dashboard.upload': "Importer une capture →",
  },
  de: {
    'nav.home': 'Start',
    'nav.dashboard': 'Dashboard',
    'nav.pricing': 'Preise',
    'nav.profile': 'Profil',
    'nav.signout': 'Abmelden',
    'nav.signin': 'Anmelden',
    'profile.title': 'Profil',
    'profile.email': 'E-Mail',
    'profile.plan': 'Plan',
    'profile.plan.free': 'Kostenlos',
    'profile.plan.premium': '✦ Premium',
    'profile.usage': 'Nutzung heute',
    'profile.language': 'Sprache',
    'profile.changePassword': 'Passwort ändern',
    'profile.changePassword.desc': 'Wir senden einen Reset-Link an Ihre E-Mail.',
    'profile.changePassword.btn': 'Link senden',
    'profile.changePassword.sent': 'E-Mail gesendet! Prüfen Sie Ihr Postfach.',
    'profile.member': 'Mitglied seit',
    'profile.upgrade': 'Auf Premium upgraden →',
    'profile.manageSubscription': 'Abonnement verwalten →',
    'dashboard.title': 'Dashboard',
    'dashboard.noTasks': 'Noch keine Aufgaben — lade einen Screenshot hoch.',
    'dashboard.upload': 'Screenshot hochladen →',
  },
}

const VALID_LANGS: Lang[] = ['en', 'it', 'es', 'fr', 'de']

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => null,
  t: (k) => k,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved && VALID_LANGS.includes(saved)) setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  function t(key: string): string {
    return translations[lang][key] ?? translations['en'][key] ?? key
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
