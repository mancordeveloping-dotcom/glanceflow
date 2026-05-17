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
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('gf-theme');if(t&&t!=='violet')document.documentElement.setAttribute('data-theme',t)}catch(e){}` }} />
        <Analytics />
        <PWARegister />
        <BackgroundFX />
        <LanguageProvider>
        <ToastProvider>
          <OnboardingModal />
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>
          </main>
          <footer className="border-t border-white/5 mt-20">
            {/* Gradient separator */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.3), transparent)' }} />
            <div className="mx-auto max-w-5xl px-4 py-10">
              <div className="grid sm:grid-cols-3 gap-8 mb-8">
                {/* Brand */}
                <div className="space-y-3">
                  <span className="text-lg font-extrabold gradient-text">GlanceFlow</span>
                  <p className="text-xs text-slate-500 leading-relaxed">Turn any screenshot into an organized task list with AI. Free to start.</p>
                  <div className="flex items-center gap-3">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-white transition-colors">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="mailto:mancordeveloping@gmail.com" className="text-slate-600 hover:text-white transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                    </a>
                  </div>
                </div>
                {/* Product */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product</p>
                  <div className="space-y-2">
                    {[['/', 'Home'], ['/dashboard', 'Dashboard'], ['/pricing', 'Pricing'], ['/stats', 'Statistics']].map(([href, label]) => (
                      <a key={href} href={href} className="block text-sm text-slate-500 hover:text-white transition-colors">{label}</a>
                    ))}
                  </div>
                </div>
                {/* Legal */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal</p>
                  <div className="space-y-2">
                    <a href="/terms" className="block text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</a>
                    <a href="mailto:mancordeveloping@gmail.com" className="block text-sm text-slate-500 hover:text-white transition-colors">Contact</a>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/5 pt-6 flex items-center justify-between flex-wrap gap-3">
                <span className="text-xs text-slate-600">© 2026 GlanceFlow. All rights reserved.</span>
                <span className="text-xs text-slate-600">Made with ♥ for productivity</span>
              </div>
            </div>
          </footer>
        </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
