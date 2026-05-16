import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BackgroundFX from '@/components/BackgroundFX'
import PWARegister from '@/components/PWARegister'
import { ToastProvider } from '@/components/Toast'

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
      <body className="min-h-full flex flex-col text-gray-900">
        <PWARegister />
        <BackgroundFX />
        <ToastProvider>
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>
          </main>
          <footer className="border-t border-white/5 py-6">
            <div className="mx-auto max-w-5xl px-4 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-600">© 2026 GlanceFlow. All rights reserved.</span>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <a href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                <span>·</span>
                <a href="mailto:mancordeveloping@gmail.com" className="hover:text-slate-400 transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  )
}
