import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center text-center space-y-8">
      {/* Glow */}
      <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Icon */}
      <div className="relative animate-bounce-in">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        {/* Rings */}
        <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400/20 scale-110 animate-ping" />
      </div>

      {/* Text */}
      <div className="relative space-y-3 animate-fade-up">
        <h1 className="text-4xl font-extrabold text-white">Welcome to Premium! 🎉</h1>
        <p className="text-slate-400 max-w-md mx-auto text-lg">
          Il tuo abbonamento è attivo. Ora hai screenshot illimitati e accesso prioritario all'AI.
        </p>
      </div>

      {/* Features unlocked */}
      <div className="relative glass inner-highlight rounded-2xl border border-emerald-500/20 p-6 max-w-sm w-full space-y-3 animate-fade-up">
        <p className="text-sm font-bold text-emerald-400 mb-4">✦ Funzionalità sbloccate</p>
        {[
          'Screenshot illimitati al giorno',
          'Elaborazione AI prioritaria',
          'Dashboard avanzata',
          'Cancella quando vuoi',
        ].map((f) => (
          <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
            <span className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">✓</span>
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative flex items-center gap-4 animate-fade-up">
        <Link
          href="/dashboard"
          className="shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 text-sm font-bold text-white"
        >
          Vai al Dashboard →
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
