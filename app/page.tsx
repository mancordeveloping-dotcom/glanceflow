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
    <div className="space-y-32">

      {/* Hero */}
      <section className="relative text-center space-y-10 pt-10">
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

      {/* Testimonials */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold text-white">Loved by users</h2>
          <p className="text-slate-400 text-lg">Join thousands turning screenshots into done tasks.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="card-3d glass inner-highlight rounded-3xl p-6 space-y-4 border border-white/5 animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
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
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold text-white">FAQ</h2>
          <p className="text-slate-400">Everything you need to know.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className="card-3d glass inner-highlight rounded-2xl p-6 space-y-2 border border-white/5 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
            >
              <p className="font-bold text-white">{item.q}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

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
