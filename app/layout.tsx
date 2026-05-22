import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BackgroundFX from '@/components/BackgroundFX'
import PWARegister from '@/components/PWARegister'
import { ToastProvider } from '@/components/Toast'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/LanguageContext'
import OnboardingModal from '@/components/OnboardingModal'
import PageTransition from '@/components/PageTransition'
import MobileNav from '@/components/MobileNav'
import PWAInstallBanner from '@/components/PWAInstallBanner'
import Footer from '@/components/Footer'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: '#06060f',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'GlanceFlow — Screenshot to Task with AI',
    template: '%s | GlanceFlow',
  },
  description: 'Trasforma qualsiasi screenshot in task con l\'AI. Carica, estrai, completa. Gratis — 3 screenshot al giorno.',
  keywords: ['task management', 'ai productivity', 'screenshot to task', 'gemini ai', 'todo app', 'productivity app'],
  authors: [{ name: 'GlanceFlow' }],
  creator: 'GlanceFlow',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'https://glanceflow.vercel.app'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GlanceFlow',
  },
  icons: {
    icon: '/icon-192.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: process.env.NEXT_PUBLIC_URL ?? 'https://glanceflow.vercel.app',
    title: 'GlanceFlow — Screenshot to Task with AI',
    description: 'Trasforma qualsiasi screenshot in task con l\'AI in 3 secondi. Gratis.',
    siteName: 'GlanceFlow',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'GlanceFlow — Screenshot to Task with AI',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlanceFlow — Screenshot to Task with AI',
    description: 'Trasforma qualsiasi screenshot in task con l\'AI in 3 secondi.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MD8RCMHSLC" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-MD8RCMHSLC');` }} />
      </head>
      <body className="min-h-full flex flex-col text-gray-900">
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('gf-theme');if(t&&t!=='violet')document.documentElement.setAttribute('data-theme',t);var m=localStorage.getItem('gf-mode')||'dark';document.documentElement.setAttribute('data-mode',m)}catch(e){}` }} />
        <Analytics />
        <PWARegister />
        <BackgroundFX />
        <LanguageProvider>
        <ToastProvider>
          <MobileNav />
          <PWAInstallBanner />
          <OnboardingModal />
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-10 pb-28 md:pb-10"><PageTransition>{children}</PageTransition></div>
          </main>
          <Footer />
        </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
