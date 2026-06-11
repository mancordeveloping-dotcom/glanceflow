import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About GlanceFlow',
  description: 'The story behind GlanceFlow — why it was built and who is behind it.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-16 py-8">

      {/* Header */}
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300 tracking-widest uppercase">
          Our story
        </span>
        <h1 className="text-5xl font-black text-white leading-tight">
          Built because I was<br />
          <span className="gradient-text">losing tasks in chats.</span>
        </h1>
      </div>

      {/* Founder card */}
      <div className="glass inner-highlight rounded-3xl p-8 border border-white/8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-violet-500/30 shrink-0">
            M
          </div>
          <div>
            <p className="font-black text-white text-lg">Marco</p>
            <p className="text-sm text-slate-400">Founder & Developer — Italy 🇮🇹</p>
            <a href="mailto:mancordeveloping@gmail.com" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              mancordeveloping@gmail.com
            </a>
          </div>
        </div>

        <div className="space-y-4 text-slate-300 leading-relaxed">
          <p>
            I built GlanceFlow out of pure frustration. Every day I had dozens of WhatsApp messages,
            emails, and Slack threads full of action items — and I kept forgetting them because copying
            them into a to-do app manually took too much effort.
          </p>
          <p>
            The idea was simple: <strong className="text-white">what if I could just take a screenshot
            and let AI do the rest?</strong> Screenshot → tasks in 3 seconds, no copy-paste, no manual
            work.
          </p>
          <p>
            I started building it for myself. Then friends started using it. Then strangers found it.
            Now I work on it every day trying to make it the best AI productivity tool for people who
            live in their messages.
          </p>
          <p className="text-slate-400 text-sm">
            It&apos;s a solo project. No VC funding, no team. Just me, Gemini AI, and a lot of coffee.
            Every piece of feedback goes directly to my inbox and I read everything.
          </p>
        </div>
      </div>

      {/* Why it works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white">Why GlanceFlow works</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: '📸',
              title: 'Zero friction',
              desc: 'The hardest part of any to-do app is adding tasks. A screenshot takes 1 second. That\'s it.',
            },
            {
              icon: '🧠',
              title: 'AI that actually reads',
              desc: 'Powered by Google Gemini — it understands context, picks up deadlines, priorities, and even vague mentions.',
            },
            {
              icon: '🔒',
              title: 'Your data stays yours',
              desc: 'Screenshots are processed by Gemini and immediately discarded. Only the extracted tasks are saved — nothing else.',
            },
            {
              icon: '📱',
              title: 'Works on your phone',
              desc: 'Install GlanceFlow as a PWA on iOS or Android. Share a screenshot directly from WhatsApp → tasks in seconds.',
            },
          ].map(f => (
            <div key={f.title} className="glass inner-highlight rounded-2xl p-6 space-y-3 border border-white/5">
              <div className="text-2xl">{f.icon}</div>
              <p className="font-bold text-white">{f.title}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Numbers */}
      <div className="glass inner-highlight rounded-3xl p-8 border border-white/8">
        <h2 className="text-xl font-black text-white mb-6">By the numbers</h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { n: '1', label: 'Developer', sub: 'solo project' },
            { n: '3s', label: 'AI extraction', sub: 'average time' },
            { n: '∞', label: 'Screenshot types', sub: 'any image with text' },
          ].map(s => (
            <div key={s.label} className="space-y-1">
              <p className="text-4xl font-black gradient-text">{s.n}</p>
              <p className="text-sm font-bold text-white">{s.label}</p>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Got feedback?</h2>
        <p className="text-slate-400">I read every email personally. If something is broken, missing, or just annoying — tell me.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:mancordeveloping@gmail.com"
            className="shimmer-btn btn-3d inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white"
          >
            ✉️ Send me a message
          </a>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/8 transition-all"
          >
            Try GlanceFlow →
          </Link>
        </div>
      </div>

    </div>
  )
}
