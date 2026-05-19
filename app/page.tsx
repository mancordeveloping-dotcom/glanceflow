'use client'

import UploadZone from '@/components/UploadZone'
import MockupDemo from '@/components/MockupDemo'
import CountUp from '@/components/CountUp'
import ScrollReveal from '@/components/ScrollReveal'
import TextInputZone from '@/components/TextInputZone'
import Link from 'next/link'
import React, { useState, useRef } from 'react'

/* ─── Data ─────────────────────────────────────────────── */

const features = [
  {
    icon: '📸',
    title: 'Drop any screenshot',
    desc: 'WhatsApp, email, Slack, notes — any image with text. No formatting needed.',
    color: 'from-violet-500/20 to-violet-600/5',
    glow: 'rgba(139,92,246,0.5)',
    accent: 'rgba(139,92,246,0.3)',
  },
  {
    icon: '⚡',
    title: 'AI extracts in seconds',
    desc: 'Gemini reads your image and turns every action item into a structured task.',
    color: 'from-cyan-500/20 to-cyan-600/5',
    glow: 'rgba(6,182,212,0.5)',
    accent: 'rgba(6,182,212,0.3)',
  },
  {
    icon: '✅',
    title: 'Track & complete',
    desc: 'Organize by priority, due date, project. Mark done, set recurrence, share.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    glow: 'rgba(52,211,153,0.5)',
    accent: 'rgba(52,211,153,0.3)',
  },
]

const stats = [
  { value: '10k+', label: 'Tasks extracted', icon: '🗂' },
  { value: '3s',   label: 'AI processing',   icon: '⚡' },
  { value: '100%', label: 'Free to start',   icon: '🎁' },
]

const testimonials = [
  { name: 'Marco R.',  role: 'Freelance Designer',  avatar: 'M', color: 'from-violet-500 to-pink-500',    text: "Finally I stop losing tasks in WhatsApp chats. GlanceFlow extracts everything in seconds — it's magic." },
  { name: 'Sara T.',   role: 'Project Manager',     avatar: 'S', color: 'from-cyan-500 to-blue-500',      text: 'I upload my meeting notes screenshots and get a full task list instantly. Saves me 30 minutes every day.' },
  { name: 'Luca B.',   role: 'Startup Founder',     avatar: 'L', color: 'from-emerald-500 to-cyan-500',   text: "The AI is scary accurate. It picks up every action item from email screenshots I didn't even notice." },
]

const faqs = [
  { q: 'What types of screenshots work?',           a: "Any image — WhatsApp messages, emails, notes, Slack, documents. If there's text, GlanceFlow extracts tasks from it." },
  { q: 'How many screenshots can I process free?',  a: '3 screenshots per day, forever. Upgrade to Premium for unlimited processing.' },
  { q: 'Is my data private?',                       a: 'Yes. Screenshots are processed by Gemini AI and immediately discarded. Only the extracted tasks are saved in your private database.' },
  { q: 'Does it work on mobile?',                   a: 'Yes! GlanceFlow is a PWA — install it on your iPhone or Android from the browser and use it like a native app.' },
  { q: 'What languages does it support?',           a: 'Any language. Gemini AI understands Italian, English, Spanish, French, and many more.' },
]

const trust = [
  '📸 Screenshot to task in 3s',
  '⚡ Powered by Gemini AI',
  '🔒 100% private',
  '📱 Works on mobile',
  '🔁 Recurring tasks',
  '🏆 Gamification streaks',
  '📤 Share tasks',
  '🌐 Any language',
  '✨ Free to start',
]

/* ─── Spotlight card ────────────────────────────────────── */

function SpotlightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={handleMove} className={`spotlight ${className}`}>
      {children}
    </div>
  )
}

/* ─── Hero Mockup ───────────────────────────────────────── */

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg" style={{ perspective: '1400px' }}>
      {/* Halo glow */}
      <div className="absolute -inset-12 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.35) 0%, rgba(6,182,212,0.15) 40%, transparent 70%)', filter: 'blur(50px)', animation: 'halo-pulse 6s ease-in-out infinite' }} />

      <div className="float-card-c relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
          <span className="h-3 w-3 rounded-full bg-rose-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          <div className="flex-1 mx-4 rounded-full bg-white/5 border border-white/8 px-3 py-1 text-[10px] text-slate-500 text-center">
            glanceflow.app/dashboard
          </div>
        </div>

        {/* Fake dashboard */}
        <div className="bg-[#06060f] p-5 space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-4 w-28 rounded-lg skeleton" />
              <div className="h-2.5 w-40 rounded skeleton" />
            </div>
            <div className="h-7 w-20 rounded-xl skeleton" />
          </div>
          {/* Stats mini */}
          <div className="grid grid-cols-3 gap-2.5">
            {[['12', 'Total', 'text-violet-400'], ['5', 'Pending', 'text-amber-400'], ['7', 'Done', 'text-emerald-400']].map(([v, l, c]) => (
              <div key={l} className="glass rounded-xl p-3 text-center border border-white/5">
                <p className={`text-lg font-extrabold ${c}`}>{v}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          {/* Task cards */}
          <div className="space-y-2">
            {[
              { label: '◆ Task',     color: 'text-violet-400 bg-violet-500/10', title: 'Review Q1 report slides',  tag: '🔴 Urgent',  bar: 'bg-violet-500' },
              { label: '◆ Event',    color: 'text-cyan-400 bg-cyan-500/10',     title: 'Team standup at 10:00',    tag: '📅 Today',   bar: 'bg-cyan-500' },
              { label: '◆ Reminder', color: 'text-pink-400 bg-pink-500/10',     title: 'Send invoice to client',   tag: '🔁 Weekly',  bar: 'bg-pink-500' },
            ].map((t) => (
              <div key={t.title} className="rounded-xl overflow-hidden border border-white/5"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                {/* left accent bar */}
                <div className="flex">
                  <div className={`w-1 shrink-0 ${t.bar}`} />
                  <div className="flex-1">
                    <div className={`px-3 py-1.5 flex items-center justify-between text-[10px] font-bold ${t.color}`}>
                      <span>{t.label}</span>
                      <span className="opacity-60">{t.tag}</span>
                    </div>
                    <div className="px-3 py-2 text-[11px] text-slate-300 font-medium">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <div className="absolute -top-5 -right-6 premium-badge rounded-full px-3 py-1.5 text-[10px] font-bold text-violet-300 chip-float" style={{ '--r': '4deg' } as React.CSSProperties}>
        ⚡ AI powered
      </div>
      <div className="absolute -bottom-4 -left-5 premium-badge rounded-full px-3 py-1.5 text-[10px] font-bold text-cyan-300 chip-float" style={{ '--r': '-5deg', animationDelay: '1.3s' } as React.CSSProperties}>
        ✓ 3s extraction
      </div>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────── */

export default function HomePage() {
  const [inputTab, setInputTab] = useState<'screenshot' | 'text'>('screenshot')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="relative">
      {/* Global noise overlay */}
      <div className="noise-overlay" />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative pt-4 pb-28 text-center overflow-hidden">

        {/* Aurora layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.32) 0%, rgba(6,182,212,0.12) 45%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora 18s ease-in-out infinite' }} />
          <div className="absolute top-[60px] left-[-10%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'aurora 24s ease-in-out infinite reverse', animationDelay: '-6s' }} />
          <div className="absolute top-[20px] right-[-8%] w-[450px] h-[450px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)', filter: 'blur(70px)', animation: 'aurora 20s ease-in-out infinite', animationDelay: '-10s' }} />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(244,63,94,0.10) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'aurora 28s ease-in-out infinite reverse', animationDelay: '-3s' }} />
        </div>

        {/* Eyebrow badge */}
        <div className="relative z-10 flex justify-center mb-8 animate-fade-up">
          <span className="premium-badge inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)]" style={{ animation: 'halo-pulse 2s ease-in-out infinite' }} />
            Screenshot → Task in 3 seconds
          </span>
        </div>

        {/* Big headline */}
        <div className="relative z-10 space-y-5 max-w-5xl mx-auto px-4">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.0]">
            <span className="block text-white word-reveal" style={{ animationDelay: '0.05s' }}>
              Turn your
            </span>
            <span className="block word-reveal" style={{ animationDelay: '0.18s' }}>
              <span className="text-shimmer">screenshots</span>
            </span>
            <span className="block text-white word-reveal" style={{ animationDelay: '0.31s' }}>
              into tasks.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed word-reveal" style={{ animationDelay: '0.45s' }}>
            Drop any image — WhatsApp, email, notes — and GlanceFlow extracts every action item with AI. No copy-paste, no manual work.
          </p>
        </div>

        {/* Upload zone */}
        <div className="relative z-10 mt-12 max-w-lg mx-auto px-4 animate-fade-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          {/* Tab switcher */}
          <div className="flex justify-center mb-4">
            <div className="flex rounded-xl border border-white/8 bg-white/3 p-1 gap-1 backdrop-blur">
              <button onClick={() => setInputTab('screenshot')}
                className={`rounded-lg px-5 py-2 text-xs font-bold transition-all duration-200 ${inputTab === 'screenshot' ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30' : 'text-slate-400 hover:text-white'}`}>
                📸 Screenshot
              </button>
              <button onClick={() => setInputTab('text')}
                className={`rounded-lg px-5 py-2 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${inputTab === 'text' ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30' : 'text-slate-400 hover:text-white'}`}>
                🔗 Text / URL
                <span className="rounded-full bg-violet-500/25 border border-violet-500/40 px-1.5 py-0.5 text-[9px] text-violet-300 font-extrabold">PRO</span>
              </button>
            </div>
          </div>

          {/* Upload box glow wrapper */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))', filter: 'blur(24px)', animation: 'pulse-glow 4s ease-in-out infinite' }} />
            {inputTab === 'screenshot' ? <UploadZone /> : <TextInputZone />}
          </div>

          {/* Trust pills */}
          <div className="flex items-center justify-center gap-5 mt-6 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              Free — 3/day
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              No credit card
            </span>
            <span className="h-3 w-px bg-white/10" />
            <Link href="/pricing" className="font-bold text-violet-400 hover:text-violet-300 transition-colors hover:underline underline-offset-2">
              See Premium →
            </Link>
          </div>
        </div>

        {/* 3D Mockup below */}
        <div className="relative z-10 mt-20 animate-fade-up px-4" style={{ animationDelay: '0.65s', animationFillMode: 'both' }}>
          <HeroMockup />
        </div>
      </section>

      {/* ── Divider glow line ── */}
      <div className="relative my-4 mx-auto max-w-3xl px-8">
        <div className="glow-line" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sep-orb" />
      </div>

      {/* ── Marquee / trust strip ── */}
      <div className="py-10 overflow-hidden select-none">
        <div className="marquee-track">
          {[...trust, ...trust].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs text-slate-500 font-medium px-8 shrink-0">
              {t}
              <span className="sep-orb scale-75" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="relative my-4 mx-auto max-w-3xl px-8">
        <div className="glow-line" style={{ opacity: 0.5 }} />
      </div>

      {/* ── Stats ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 sm:gap-8">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 120} direction="scale">
              <SpotlightCard className={`glass shine-card inner-highlight rounded-2xl py-10 px-4 text-center space-y-3 h-full border border-white/6 ${i === 0 ? 'float-card-l' : i === 1 ? 'float-card-c' : 'float-card-r'}`}
                style={{ animationDelay: `${i * 0.5}s` } as React.CSSProperties}>
                <div className="text-3xl">{s.icon}</div>
                <p className="text-4xl sm:text-5xl font-black gradient-text tabular-nums stat-number">
                  <CountUp end={s.value} />
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-400">{s.label}</p>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          <ScrollReveal direction="up" className="text-center space-y-4">
            <span className="premium-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold text-violet-300">How it works</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Three steps,<br />
              <span className="gradient-text">zero friction.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto">From screenshot to structured task list in the time it takes to blink.</p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-12 left-[16.66%] right-[16.66%] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.6), rgba(6,182,212,0.6))', filter: 'blur(0.5px)' }} />
            <div className="hidden sm:block absolute top-[46px] left-[16.66%] right-[16.66%] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', filter: 'blur(4px)' }} />

            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 150} direction="up">
                <SpotlightCard className={`relative glass shine-card inner-highlight rounded-3xl p-8 space-y-5 border border-white/5 h-full`}>
                  {/* Step number */}
                  <div className="absolute top-5 right-5 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-500">
                    {i + 1}
                  </div>

                  {/* Icon with glow */}
                  <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: `linear-gradient(135deg, ${f.accent}, transparent)`, boxShadow: `0 0 24px ${f.glow}40` }}>
                    <span className="icon-glow" style={{ animationDelay: `${i * 0.8}s`, '--glow': f.glow } as React.CSSProperties}>{f.icon}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-black text-white text-lg">{f.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-px w-full rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }} />
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Demo ── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up" className="text-center space-y-4 mb-14">
            <span className="premium-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold text-cyan-300">Live preview</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">See it in action.</h2>
          </ScrollReveal>
          <ScrollReveal direction="scale">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <MockupDemo />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          <ScrollReveal direction="up" className="text-center space-y-4">
            <span className="premium-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold text-pink-300">Reviews</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Loved by users.</h2>
            <p className="text-slate-400 text-lg">Join thousands turning screenshots into done tasks.</p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 140} direction="up">
                <SpotlightCard className={`glass shine-card inner-highlight rounded-3xl p-7 space-y-5 border border-white/5 h-full ${i === 0 ? 'tilt-left' : i === 1 ? 'tilt-center' : 'tilt-right'}`}>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">&ldquo;{t.text}&rdquo;</p>

                  <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto space-y-12">
          <ScrollReveal direction="up" className="text-center space-y-4">
            <span className="premium-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold text-violet-300">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Questions?</h2>
            <p className="text-slate-400 text-lg">Everything you need to know.</p>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 70} direction="left">
                <button
                  className="w-full text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className={`glass inner-highlight rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? 'border-violet-500/40' : 'border-white/5 hover:border-violet-500/20'}`}>
                    <div className="flex items-center justify-between px-6 py-5 gap-4">
                      <p className={`font-bold text-sm transition-colors duration-200 ${openFaq === i ? 'text-violet-300' : 'text-white'}`}>{item.q}</p>
                      <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-all duration-300 ${openFaq === i ? 'border-violet-500/50 text-violet-400 rotate-45 bg-violet-500/10' : 'border-white/10 text-slate-500'}`}>+</span>
                    </div>
                    {openFaq === i && (
                      <div className="px-6 pb-5">
                        <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 px-4 pb-24">
        <ScrollReveal direction="scale">
          <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden text-center p-14 sm:p-20 border border-violet-500/20">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-indigo-950/60 to-cyan-950/50" />
            <div className="absolute inset-0 bg-grid opacity-20" />
            {/* Aurora inside CTA */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.45) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'pulse-glow 4s ease-in-out infinite' }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[250px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }} />
            {/* Beams */}
            <div className="beam beam-top" />
            <div className="beam beam-bottom" />

            {/* Content */}
            <div className="relative z-10 space-y-7">
              <span className="premium-badge inline-block rounded-full px-5 py-2 text-xs font-bold text-violet-300">Premium Plan</span>

              <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
                Ready to go<br />
                <span className="text-shimmer">unlimited?</span>
              </h2>

              <p className="text-slate-300 text-lg max-w-md mx-auto">
                Join{' '}
                <span className="font-black text-white">
                  <CountUp end="1200+" duration={2500} />
                </span>{' '}
                users who already upgraded.{' '}
                <span className="font-bold text-white">From €6.99/month.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <Link
                  href="/pricing"
                  className="shimmer-btn btn-3d inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-10 py-4 text-sm font-extrabold text-white hover:opacity-90 transition-opacity shadow-xl shadow-violet-500/30"
                >
                  View Plans →
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-10 py-4 text-sm font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all"
                >
                  Start free
                </Link>
              </div>

              {/* Social proof mini */}
              <p className="text-xs text-slate-600 pt-2">No credit card required · Cancel anytime</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  )
}
