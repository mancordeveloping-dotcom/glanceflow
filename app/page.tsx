import UploadZone from '@/components/UploadZone'
import MockupDemo from '@/components/MockupDemo'
import Tilt3D from '@/components/Tilt3D'
import CountUp from '@/components/CountUp'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'
import type React from 'react'

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

export default function HomePage() {
  return (
    <div className="space-y-36">

      {/* ── Hero ── */}
      <section className="relative text-center space-y-10 pt-8">
        {/* Big glow orb */}
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.28) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Orbital ring decoration */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none" aria-hidden>
          <div className="absolute inset-0 rounded-full border border-violet-500/10 animate-spin-slow" />
          <div className="absolute inset-[60px] rounded-full border border-cyan-500/8"
            style={{ animation: 'spin-slow 18s linear infinite reverse' }} />
          <div className="absolute top-[20px] left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-violet-400 animate-orbit shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400"
            style={{ animation: 'orbit 12s linear infinite reverse', boxShadow: '0 0 8px rgba(6,182,212,0.8)' }} />
        </div>

        {/* Headline */}
        <div className="relative space-y-5 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Powered by Gemini AI
          </div>
          <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight leading-[1.0]">
            <span className="text-white">Screenshot</span>
            <br />
            <span className="text-shimmer">to Task.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            Upload any screenshot and GlanceFlow extracts actionable tasks automatically — no copy-paste, no manual work.
          </p>
        </div>

        {/* Upload zone with glow */}
        <div className="relative w-full max-w-lg mx-auto" style={{ animation: 'tilt-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}>
          <div className="absolute -inset-2 rounded-3xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.25))', filter: 'blur(20px)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
          <UploadZone />
        </div>

        {/* Social proof badges */}
        <div className="relative flex items-center justify-center gap-6 text-sm text-slate-500 flex-wrap">
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
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-3 gap-4 sm:gap-6">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 100} direction="scale">
            <Tilt3D className="glass inner-highlight neon-border rounded-2xl py-10 px-4 text-center space-y-2 cursor-default h-full">
              <p className="text-4xl sm:text-5xl font-extrabold gradient-text tabular-nums">
                <CountUp end={s.value} />
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400">{s.label}</p>
            </Tilt3D>
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
              <Tilt3D className="glass inner-highlight rounded-3xl p-8 space-y-5 border border-white/5 cursor-default h-full">
                <div className="text-5xl animate-bounce-soft" style={{ animationDelay: `${i * 0.4}s` }}>{f.icon}</div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
                {/* Bottom glow line */}
                <div className="h-px w-full rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${i === 0 ? 'rgba(167,139,250,0.6)' : i === 1 ? 'rgba(6,182,212,0.6)' : 'rgba(52,211,153,0.6)'}, transparent)` }} />
              </Tilt3D>
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
              <Tilt3D className="glass inner-highlight rounded-3xl p-6 space-y-4 border border-white/5 cursor-default h-full gradient-border">
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
              </Tilt3D>
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
            <p className="text-slate-300 text-lg">Unlimited screenshots. Priority AI. Starting at <span className="font-bold text-white">€6.99/month</span>.</p>
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
