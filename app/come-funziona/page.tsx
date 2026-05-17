import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Come Funziona — GlanceFlow',
  description: 'Scopri come GlanceFlow trasforma i tuoi screenshot in task organizzati con l\'intelligenza artificiale. Semplice, veloce, gratuito.',
  keywords: ['come funziona', 'screenshot to task', 'ai task extraction', 'produttività', 'gestione task', 'intelligenza artificiale'],
  openGraph: {
    title: 'Come Funziona GlanceFlow — Screenshot to Task con AI',
    description: 'Carica uno screenshot, l\'AI estrae tutti i task in 3 secondi. Gratis.',
    type: 'website',
  },
}

const steps = [
  {
    n: '01',
    icon: '📸',
    title: 'Carica uno screenshot',
    desc: 'Fai uno screenshot di qualsiasi cosa: una chat di WhatsApp, un\'email, una nota, un messaggio. Caricalo su GlanceFlow con un click.',
    color: 'from-violet-600 to-violet-400',
  },
  {
    n: '02',
    icon: '🤖',
    title: 'L\'AI estrae i task',
    desc: 'Gemini AI analizza l\'immagine in pochi secondi e identifica automaticamente tutti i task, eventi e reminder presenti nel testo.',
    color: 'from-cyan-600 to-cyan-400',
  },
  {
    n: '03',
    icon: '✅',
    title: 'Gestisci e completa',
    desc: 'I task appaiono nel tuo dashboard. Assegna priorità, date, progetti. Spunta quelli completati. Tieni traccia di tutto in un posto solo.',
    color: 'from-emerald-600 to-emerald-400',
  },
]

const features = [
  { icon: '🔗', title: 'Link e testo', desc: 'Incolla un URL o del testo e l\'AI estrae i task anche senza screenshot.', badge: 'Premium' },
  { icon: '📬', title: 'AI Summary', desc: 'Ogni settimana ricevi un\'email riassuntiva con le priorità generate dall\'AI.', badge: 'Premium' },
  { icon: '📅', title: 'Calendario', desc: 'Visualizza tutti i task con data su un calendario mensile interattivo.', badge: 'Annual' },
  { icon: '🧾', title: 'Expense tracker', desc: 'Fotografa lo scontrino e l\'AI registra automaticamente la spesa.', badge: 'Premium' },
  { icon: '⏱️', title: 'Timer Pomodoro', desc: 'Timer integrato nel dashboard per lavorare in sessioni focalizzate.', badge: null },
  { icon: '📊', title: 'Statistiche', desc: 'Grafici su completamento task, tipi e trend nel tempo.', badge: null },
]

const faqs = [
  { q: 'È gratuito?', a: 'Sì. Il piano gratuito include 3 screenshot al giorno, dashboard completo, progetti e statistiche. Nessuna carta di credito richiesta.' },
  { q: 'Quali immagini posso caricare?', a: 'PNG, JPG, WEBP e GIF. L\'AI funziona meglio con screenshot di testo chiaro: chat, email, note, liste.' },
  { q: 'I miei dati sono al sicuro?', a: 'Sì. I task sono salvati nel tuo account privato. Gli screenshot non vengono salvati sul server: vengono inviati all\'AI e subito eliminati.' },
  { q: 'Cosa include il piano Premium?', a: 'Screenshot illimitati, task da link e testo, AI Smart Summary via email, cronologia completa, expense tracker con AI.' },
  { q: 'Posso disdire in qualsiasi momento?', a: 'Sì. Cancelli dal portale Stripe con un click, senza penali e senza domande.' },
  { q: 'Funziona anche su mobile?', a: 'Sì, GlanceFlow è una Progressive Web App. Puoi aggiungerla alla home del telefono e usarla come un\'app nativa.' },
]

export default function ComeFunzionaPage() {
  return (
    <div className="space-y-24">

      {/* Hero */}
      <div className="text-center space-y-6 animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300 tracking-widest uppercase">
          Come funziona
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          <span className="text-white">Da screenshot a task </span>
          <span className="gradient-text">in 3 secondi</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Smetti di riscrivere i task a mano. GlanceFlow usa l&apos;AI per estrarre automaticamente tutto quello che devi fare dai tuoi screenshot.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login" className="shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white">
            Inizia gratis →
          </Link>
          <Link href="/pricing" className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
            Vedi i piani
          </Link>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        <h2 className="text-3xl font-extrabold text-white text-center">3 passi, zero attrito</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="glass inner-highlight rounded-3xl p-8 space-y-4 border border-white/5 card-lift animate-fade-up" style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.n}</span>
                <span className="text-3xl">{s.icon}</span>
              </div>
              <h3 className="text-lg font-extrabold text-white">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Tutto quello che ti serve</h2>
          <p className="text-slate-400">Strumenti pensati per chi vuole fare di più in meno tempo.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="glass rounded-2xl p-5 space-y-2 border border-white/5 hover:border-violet-500/20 transition-colors relative card-lift">
              {f.badge && (
                <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full border
                  ${f.badge === 'Annual'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    : 'border-violet-500/30 bg-violet-500/10 text-violet-400'}`}>
                  {f.badge}
                </span>
              )}
              <div className="text-2xl">{f.icon}</div>
              <p className="font-bold text-white text-sm">{f.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold text-white text-center">Domande frequenti</h2>
        <div className="space-y-3">
          {faqs.map(item => (
            <div key={item.q} className="glass inner-highlight rounded-2xl p-6 space-y-2 border border-white/5 hover:border-violet-500/20 transition-colors">
              <p className="font-bold text-white text-sm">{item.q}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass inner-highlight rounded-3xl border border-violet-500/20 p-12 text-center space-y-6 animate-fade-up">
        <h2 className="text-4xl font-extrabold text-white">Pronto a provarlo?</h2>
        <p className="text-slate-400 max-w-md mx-auto">Gratis, senza carta di credito. Inizia in 30 secondi.</p>
        <Link href="/login" className="inline-block shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-base font-bold text-white">
          Inizia gratis →
        </Link>
      </div>

    </div>
  )
}
