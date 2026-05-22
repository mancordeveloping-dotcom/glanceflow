'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useLang } from '@/context/LanguageContext'

export default function MobileNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<boolean>(false)
  const { t } = useLang()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => setUser(!!data.user))
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_, session) => {
      setUser(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Hide on login page — no nav needed there
  if (pathname === '/login') return null

  const isActive = (href: string) => pathname === href

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8"
      style={{ background: 'rgba(6,6,15,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-3">

        {/* Home */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-0 px-3 py-1">
          <div className={`h-6 w-6 flex items-center justify-center transition-all ${isActive('/') ? 'scale-110' : ''}`}>
            <svg className={`h-5 w-5 ${isActive('/') ? 'text-violet-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/') ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <span className={`text-[10px] font-semibold ${isActive('/') ? 'text-violet-400' : 'text-slate-600'}`}>{t('nav.home')}</span>
        </Link>

        {/* Dashboard */}
        <Link href="/dashboard" className="flex flex-col items-center gap-1 min-w-0 px-3 py-1">
          <div className={`h-6 w-6 flex items-center justify-center transition-all ${isActive('/dashboard') ? 'scale-110' : ''}`}>
            <svg className={`h-5 w-5 ${isActive('/dashboard') ? 'text-violet-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/dashboard') ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <span className={`text-[10px] font-semibold ${isActive('/dashboard') ? 'text-violet-400' : 'text-slate-600'}`}>{t('nav.dashboard')}</span>
        </Link>

        {/* Upload — center CTA */}
        <Link href="/dashboard"
          className="flex flex-col items-center gap-1 -mt-5"
          aria-label="Upload screenshot">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/40 border-4 border-[#06060f] transition-transform active:scale-95">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">Upload</span>
        </Link>

        {/* Projects */}
        <Link href="/projects" className="flex flex-col items-center gap-1 min-w-0 px-3 py-1">
          <div className={`h-6 w-6 flex items-center justify-center transition-all ${isActive('/projects') ? 'scale-110' : ''}`}>
            <svg className={`h-5 w-5 ${isActive('/projects') ? 'text-violet-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/projects') ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          </div>
          <span className={`text-[10px] font-semibold ${isActive('/projects') ? 'text-violet-400' : 'text-slate-600'}`}>Projects</span>
        </Link>

        {/* Profile / Login */}
        <Link href={user ? '/profile' : '/login'} className="flex flex-col items-center gap-1 min-w-0 px-3 py-1">
          <div className={`h-6 w-6 flex items-center justify-center transition-all ${isActive('/profile') ? 'scale-110' : ''}`}>
            <svg className={`h-5 w-5 ${isActive('/profile') ? 'text-violet-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/profile') ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <span className={`text-[10px] font-semibold ${isActive('/profile') ? 'text-violet-400' : 'text-slate-600'}`}>
            {user ? t('nav.profile') : t('nav.signin')}
          </span>
        </Link>

      </div>
    </nav>
  )
}
