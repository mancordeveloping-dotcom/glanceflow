import UploadZone from '@/components/UploadZone'
import MockupDemo from '@/components/MockupDemo'
import Link from 'next/link'

const features = [
  { icon: '📸', title: 'Upload any screenshot', desc: 'WhatsApp, email, notes — any image works instantly.' },
  { icon: '⚡', title: 'AI extracts tasks', desc: 'Gemini reads and understands the content in seconds.' },
  { icon: '✅', title: 'Track & complete', desc: 'Manage everything in one powerful dashboard.' },
]

const stats = [
  { value: '10k+', label: 'Tasks extracted' },
  { value: '< 3s', label: 'AI processing' },
  { value: '100%', label: 'Free to start' },
]

export default function HomePage() {
  return (
    <div className="space-y-32">

      {/* Hero */}
      <section className="relative text-center space-y-10 pt-10">
        {/* Glow behind title */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative space-y-6 animate-fade-up">
          <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight leading-[1.0]">
            <span className="text-white">Screenshot</span>
            <br />
            <span className="gradient-text">to Task.</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            Upload any screenshot and GlanceFlow extracts actionable tasks automatically — no copy-paste, no manual work.
          </p>
        </div>

        {/* Upload zone */}
        <div className="relative w-full max-w-lg mx-auto animate-tilt-in">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 to-cyan-500 opacity-20 blur-lg" />
          <UploadZone />
        </div>

        {/* Social proof */}
        <div className="relative flex items-center justify-center gap-8 text-sm text-slate-500">
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Free — 3/day</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />No credit card</span>
          <Link href="/pricing" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
            See plans →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="card-3d glass inner-highlight neon-border rounded-2xl py-8 px-4 text-center space-y-1 animate-fade-up"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
          >
            <p className="text-4xl font-extrabold gradient-text">{s.value}</p>
            <p className="text-sm font-medium text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold text-white">How it works</h2>
          <p className="text-slate-400 text-lg">Three steps, zero friction.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-3d glass inner-highlight rounded-3xl p-8 space-y-4 border border-white/5 animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
            >
              <div className="text-5xl">{f.icon}</div>
              <h3 className="font-bold text-white text-lg">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mockup demo */}
      <MockupDemo />

      {/* CTA */}
      <section className="relative rounded-3xl overflow-hidden text-center p-16 space-y-6 animate-pulse-glow border border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-indigo-900/40 to-cyan-900/30" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-500/30 blur-[80px] rounded-full" />

        <div className="relative space-y-4">
          <h2 className="text-4xl font-extrabold text-white">Ready to go Premium?</h2>
          <p className="text-slate-300 text-lg">Unlimited screenshots. Priority AI. Starting at €6.99/month.</p>
          <Link
            href="/pricing"
            className="shimmer-btn btn-3d inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-10 py-3.5 text-sm font-extrabold text-white hover:opacity-90 transition-opacity"
          >
            View Plans →
          </Link>
        </div>
      </section>

    </div>
  )
}
