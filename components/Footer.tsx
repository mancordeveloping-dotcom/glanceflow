'use client'

import { useLang } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t border-white/5 mt-20 pb-20 md:pb-0">
      {/* Gradient separator */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.3), transparent)' }} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-lg tracking-tight"><span className="font-black text-white">Glance</span><span className="font-light gradient-text">Flow</span></span>
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('footer.product')}</p>
            <div className="space-y-2">
              {[
                ['/', t('nav.home')],
                ['/dashboard', t('nav.dashboard')],
                ['/pricing', t('nav.pricing')],
                ['/about', 'About'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="block text-sm text-slate-500 hover:text-white transition-colors">{label}</a>
              ))}
            </div>
          </div>
          {/* Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('footer.legal')}</p>
            <div className="space-y-2">
              <a href="/terms" className="block text-sm text-slate-500 hover:text-white transition-colors">{t('footer.terms')}</a>
              <a href="mailto:mancordeveloping@gmail.com" className="block text-sm text-slate-500 hover:text-white transition-colors">{t('footer.contact')}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-slate-600">{t('footer.rights')}</span>
          <span className="text-xs text-slate-600">{t('footer.made')}</span>
        </div>
      </div>
    </footer>
  )
}
