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
  title: 'GlanceFlow',
  description: 'Transform screenshots into tasks with AI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GlanceFlow',
  },
  icons: {
    icon: '/icon-192.svg',
    apple: '/icon-512.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
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
