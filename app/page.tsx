'use client'

import UploadZone from '@/components/UploadZone'
import MockupDemo from '@/components/MockupDemo'
import CountUp from '@/components/CountUp'
import ScrollReveal from '@/components/ScrollReveal'
import TextInputZone from '@/components/TextInputZone'
import Link from 'next/link'
import { useState } from 'react'

const features = [
  { icon: '📸', title: 'Upload any screenshot', desc: 'WhatsApp, email, notes — any image works instantly.' },
  { icon: '⚡', title: 'AI extracts tasks', desc: 'Gemini reads and understands the content in seconds.' },
  { icon: '✅', title: 'Track & complete', desc: 'Manage everything in one powerful dashboard.' },
]

const stats = [
  { value: '10k+', label: 'Tasks extracted' },
  { value: '3s', label: 'AI processing' },
  { value: '100%', label: 'Free to start' },
]

const testimonials = [
  { name: 'Marco R.', role: 'Freelance Designer', avatar: 'M', text: "Finally I stop losing tasks in WhatsApp chats. GlanceFlow extracts everything in seconds — it's magic." },
  { name: 'Sara T.', role: 'Project Manager', avatar: 'S', text: 'I upload my meeting notes screenshots and get a full task list instantly. Saves me 30 minutes every day.' },
  { name: 'Luca B.', role: 'Startup Founder', avatar: 'L', text: "The AI is scary accurate. It picks up every action item from email screenshots I didn't even notice." },
]

const faqs = [
  { q: 'What types of screenshots work?', a: "Any image — WhatsApp messages, emails, notes, Slack, documents. If there's text, GlanceFlow extracts tasks from it." },
  { q: 'How many screenshots can I process for free?', a: '3 screenshots per day, forever. Upgrade to Premium for unlimited processing.' },
  { q: 'Is my data private?', a: 'Yes. Screenshots are processed by Gemini AI and immediately discarded. Only the extracted tasks are saved in your private database.' },
  { q: 'Does it work on mobile?', a: 'Yes! GlanceFlow is a PWA — install it on your iPhone or Android from the browser and use it like a native app.' },
  { q: 'What languages does it support?', a: 'Any language. Gemini AI understands Italian, English, Spanish, French, and many more.' },
]

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl mt-8" style={{ perspective: '1200px' }}>
      <div className="float-card-c rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/40">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          <div className="flex-1 mx-4 rounded-md bg-white/5 border border-white/8 px-3 py-1 text-xs text-slate-500 text-center">
            glanceflow.app/dashboard
          </div>
        </div>
        {/* Fake dashboard UI */}
        <div className="bg-[#06060f] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-5 w-28 rounded skeleton" />
              <div className="h-3 w-44 rounded skeleton" />
            </div>
            <div className="h-8 w-20 rounded-xl skeleton" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['12', 'Total'], ['5', 'Pending'], ['7', 'Done']].map(([v, l]) => (
              <div key={l} className="glass rounded-xl p-3 text-center border border-white/5">
                <p className="text-xl font-extrabold gradient-text">{v}</p>
                <p className="text-[10px] text-slate-500">{l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { type: 'task', label: '◆ Task', color: 'text-violet-400 bg-violet-500/10', title: 'Review Q1 report slides', tag: '🔴 Urgent' },
              { type: 'event', label: '◆ Event', color: 'text-cyan-400 bg-cyan-500/10', title: 'Team standup at 10:00', tag: '📅 Today' },
              { type: 'reminder', label: '◆ Reminder', color: 'text-pink-400 bg-pink-500/10', title: 'Send invoice to client', tag: '🔁 Weekly' },
            ].map((t) => (
              <div key={t.title} className="glass rounded-xl overflow-hidden border border-white/5">
                <div className={`px-3 py-1.5 flex items-center justify-between text-[10px] font-bold ${t.color}`}>
                  <span>{t.label}</span>
                  <span className="opacity-60">{t.tag}</span>
                </div>
                <div className="px-3 py-2 text-xs text-slate-300 font-medium">{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Glow under mockup */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.4) 0%, transparent 70%)', filter: 'blur(20px)' }} />
    </div>
  )
}

export default function HomePage() {
  const [inputTab, setInputTab] = useState<'screenshot' | 'text'>('screenshot')
  return (
    <div className="space-y-36">

      {/* ── Hero ── */}
      <section className="relative pt-8">
        {/* Big glow orb */}
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.28) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Two-column layout */}
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text + upload */}
          <div className="space-y-8 animate-fade-up text-center lg:text-left">
            <div className="space-y-5">
              <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-[1.0]">
                <span className="text-white">Screenshot</span>
                <br />
                <span className="text-shimmer">to Task.</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                Upload any screenshot and GlanceFlow extracts actionable tasks automatically — no copy-paste, no manual work.
              </p>
            </div>

            {/* Upload zone with tabs */}
            <div className="relative max-w-md mx-auto lg:mx-0 space-y-3">
              <div className="flex rounded-xl border border-white/8 bg-white/3 p-1 gap-1 w-fit">
                <button onClick={() => setInputTab('screenshot')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${inputTab === 'screenshot' ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                  📸 Screenshot
                </button>
                <button onClick={() => setInputTab('text')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${inputTab === 'text' ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                  🔗 Link / Text
                  <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-1.5 py-0.5 text-[9px] text-violet-300 font-extrabold">PRO</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.25))', filter: 'blur(20px)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
                {inputTab === 'screenshot' ? <UploadZone /> : <TextInputZone />}
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-6 flex-wrap justify-center lg:justify-start text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                Free — 3/day
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                No credit card
              </span>
              <span className="h-3 w-px bg-white/10" />
              <Link href="/pricing" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
                See Premium →
              </Link>
            </div>
          </div>

          {/* Right: 3D Mockup */}
          <div className="hidden lg:block">
            <HeroMockup />
          </div>
        </div>

        {/* Mobile mockup */}
        <div className="lg:hidden mt-8">
          <HeroMockup />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-3 gap-4 sm:gap-6">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 100} direction="scale">
            <div className={`glass inner-highlight neon-border rounded-2xl py-10 px-4 text-center space-y-2 cursor-default h-full ${i === 0 ? 'float-card-l' : i === 1 ? 'float-card-c' : 'float-card-r'}`}
              style={{ animationDelay: `${i * 0.5}s` }}>
              <p className="text-4xl sm:text-5xl font-extrabold gradient-text tabular-nums">
                <CountUp end={s.value} />
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400">{s.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="space-y-14">
        <ScrollReveal direction="up" className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold text-white">How it works</h2>
          <p className="text-slate-400 text-lg">Three steps, zero friction.</p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 120} direction="up">
              <div className={`glass inner-highlight rounded-3xl p-8 space-y-5 border border-white/5 cursor-default h-full ${i === 0 ? 'float-card-l' : i === 1 ? 'float-card-c' : 'float-card-r'}`}
                style={{ animationDelay: `${i * 0.6}s` }}>
                <div className="text-5xl animate-bounce-soft" style={{ animationDelay: `${i * 0.4}s` }}>{f.icon}</div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
                <div className="h-px w-full rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${i === 0 ? 'rgba(167,139,250,0.6)' : i === 1 ? 'rgba(6,182,212,0.6)' : 'rgba(52,211,153,0.6)'}, transparent)` }} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Mockup demo ── */}
      <ScrollReveal direction="scale">
        <MockupDemo />
      </ScrollReveal>

      {/* ── Testimonials ── */}
      <section className="space-y-14">
        <ScrollReveal direction="up" className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold text-white">Loved by users</h2>
          <p className="text-slate-400 text-lg">Join thousands turning screenshots into done tasks.</p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 130} direction="up">
              <div className={`glass inner-highlight rounded-3xl p-6 space-y-4 border border-white/5 cursor-default h-full gradient-border ${i === 0 ? 'tilt-left' : i === 1 ? 'tilt-center' : 'tilt-right'}`}>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg shadow-violet-500/30">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto space-y-12">
        <ScrollReveal direction="up" className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold text-white">FAQ</h2>
          <p className="text-slate-400">Everything you need to know.</p>
        </ScrollReveal>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <ScrollReveal key={item.q} delay={i * 80} direction="left">
              <div className="glass inner-highlight rounded-2xl p-6 space-y-2 border border-white/5 hover:border-violet-500/30 transition-colors duration-300 group">
                <p className="font-bold text-white group-hover:text-violet-300 transition-colors">{item.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <ScrollReveal direction="scale">
        <section className="relative rounded-3xl overflow-hidden text-center p-16 space-y-6 border border-violet-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-indigo-900/40 to-cyan-900/30" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
          <div className="beam beam-top" />

          <div className="relative space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Premium Plan</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white">Ready to go unlimited?</h2>

            {/* Live counter */}
            <p className="text-slate-300 text-lg">
              Join{' '}
              <span className="font-extrabold text-white">
                <CountUp end="1200+" duration={2500} />
              </span>{' '}
              users who already upgraded. Starting at <span className="font-bold text-white">€6.99/month</span>.
            </p>

            <Link
              href="/pricing"
              className="shimmer-btn btn-3d inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-12 py-4 text-sm font-extrabold text-white hover:opacity-90 transition-opacity mt-2"
            >
              View Plans →
            </Link>
          </div>
        </section>
      </ScrollReveal>

    </div>
  )
}
