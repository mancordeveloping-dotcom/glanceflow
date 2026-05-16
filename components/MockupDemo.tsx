'use client'

import { useEffect, useState } from 'react'

const fakeTasks = [
  { type: 'event', title: 'Meeting con il team', time: '14:00' },
  { type: 'task', title: 'Inviare report settimanale' },
  { type: 'reminder', title: 'Chiamare il cliente' },
]

const typeColors: Record<string, string> = {
  event: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  task: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  reminder: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
}

export default function MockupDemo() {
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'scanning' | 'done'>('idle')
  const [visibleTasks, setVisibleTasks] = useState(0)

  useEffect(() => {
    const loop = () => {
      setPhase('idle')
      setVisibleTasks(0)

      setTimeout(() => setPhase('uploading'), 1200)
      setTimeout(() => setPhase('scanning'), 2600)
      setTimeout(() => {
        setPhase('done')
        setTimeout(() => setVisibleTasks(1), 300)
        setTimeout(() => setVisibleTasks(2), 700)
        setTimeout(() => setVisibleTasks(3), 1100)
      }, 4400)

      setTimeout(loop, 8000)
    }

    const t = setTimeout(loop, 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold text-white">See it in action</h2>
        <p className="text-slate-400 text-lg">Works on any device, instantly.</p>
      </div>

      <div className="flex items-end justify-center gap-8 flex-wrap">

        {/* iPhone mockup */}
        <div className="relative flex flex-col items-center gap-3">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">iPhone</span>
          <div className="relative w-[200px] h-[400px] rounded-[36px] bg-[#0d0d1a] border-2 border-white/10 shadow-2xl shadow-violet-500/10 overflow-hidden"
            style={{ boxShadow: '0 0 0 8px #1a1a2e, 0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.1)' }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0d0d1a] rounded-b-2xl z-20" />
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-8 pb-2">
              <span className="text-[9px] text-white font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 rounded-sm border border-white/40 relative"><div className="absolute inset-0.5 bg-white/60 rounded-sm" /></div>
              </div>
            </div>

            {/* App content */}
            <div className="px-3 pb-3 space-y-2 flex-1">
              {/* Mini header */}
              <div className="flex items-center gap-1.5 py-1">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-violet-500 to-cyan-500" />
                <span className="text-[10px] font-extrabold text-white">GlanceFlow</span>
              </div>

              {/* Upload zone */}
              <div className={`rounded-xl border-2 border-dashed p-3 flex flex-col items-center gap-2 transition-all duration-500
                ${phase === 'idle' ? 'border-violet-500/30 bg-violet-500/5' : ''}
                ${phase === 'uploading' ? 'border-violet-400/60 bg-violet-500/10' : ''}
                ${phase === 'scanning' || phase === 'done' ? 'border-cyan-500/40 bg-cyan-500/5' : ''}
              `}>
                {phase === 'idle' && (
                  <>
                    <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12m4.5-4.5V21" />
                      </svg>
                    </div>
                    <span className="text-[8px] text-slate-400 text-center">Tap to upload screenshot</span>
                  </>
                )}
                {phase === 'uploading' && (
                  <>
                    {/* Fake screenshot thumbnail */}
                    <div className="w-full h-14 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden relative">
                      <div className="absolute inset-0 flex flex-col p-1.5 gap-1">
                        <div className="h-1.5 w-3/4 rounded bg-white/20" />
                        <div className="h-1.5 w-1/2 rounded bg-white/15" />
                        <div className="h-1.5 w-2/3 rounded bg-white/20" />
                        <div className="h-1.5 w-1/3 rounded bg-white/10" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-fast" />
                    </div>
                    <span className="text-[8px] text-violet-300 font-semibold">Screenshot ready</span>
                  </>
                )}
                {(phase === 'scanning') && (
                  <div className="w-full space-y-1.5">
                    <div className="w-full h-14 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden relative">
                      <div className="absolute inset-0 flex flex-col p-1.5 gap-1">
                        <div className="h-1.5 w-3/4 rounded bg-white/20" />
                        <div className="h-1.5 w-1/2 rounded bg-white/15" />
                        <div className="h-1.5 w-2/3 rounded bg-white/20" />
                      </div>
                      {/* Scan line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <svg className="w-2.5 h-2.5 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      <span className="text-[8px] text-cyan-300 font-semibold">AI analyzing…</span>
                    </div>
                  </div>
                )}
                {phase === 'done' && (
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-emerald-400 font-bold">✓ 3 tasks found!</span>
                  </div>
                )}
              </div>

              {/* Extract button */}
              <button className={`w-full rounded-xl py-2 text-[9px] font-bold transition-all duration-300
                ${phase === 'scanning' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'}
              `}>
                {phase === 'scanning' ? 'Analyzing…' : '⚡ Extract Tasks'}
              </button>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Arrow between phones */}
        <div className="flex flex-col items-center gap-1 pb-8">
          <div className="text-2xl animate-pulse">→</div>
          <span className="text-[10px] text-slate-600 font-medium">instant</span>
        </div>

        {/* Android mockup */}
        <div className="relative flex flex-col items-center gap-3">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Android</span>
          <div className="relative w-[200px] h-[400px] rounded-[28px] bg-[#0d0d1a] border-2 border-white/10 overflow-hidden"
            style={{ boxShadow: '0 0 0 6px #1a1a2e, 0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.1)' }}
          >
            {/* Punch-hole camera */}
            <div className="absolute top-3 right-5 w-3 h-3 rounded-full bg-[#0d0d1a] border border-white/10 z-20" />
            {/* Status bar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <span className="text-[9px] text-white font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-2.5 h-2.5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="px-3 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-white">Dashboard</span>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[7px] font-bold text-white">M</div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: 'Total', value: '3', color: 'text-white' },
                  { label: 'Pending', value: '3', color: 'text-yellow-400' },
                  { label: 'Done', value: '0', color: 'text-emerald-400' },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-white/5 border border-white/5 py-1.5 text-center">
                    <p className={`text-[11px] font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-[7px] text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Task cards */}
              <div className="space-y-1.5">
                {fakeTasks.map((task, i) => (
                  <div
                    key={i}
                    className={`rounded-xl bg-white/5 border border-white/5 p-2 space-y-1.5 transition-all duration-500
                      ${visibleTasks > i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
                    `}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-semibold text-white leading-tight">{task.title}</span>
                      <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[7px] font-bold ${typeColors[task.type]}`}>
                        {task.type}
                      </span>
                    </div>
                    {task.time && <p className="text-[7px] text-slate-500">🕐 {task.time}</p>}
                    <div className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 py-0.5 text-center">
                      <span className="text-[7px] font-bold text-white">✓ Mark as Done</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Android nav bar */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0d0d1a]/80 flex items-center justify-center gap-5">
              <div className="w-3 h-3 rounded-sm border border-white/20" />
              <div className="w-3 h-3 rounded-full border border-white/20" />
              <div className="w-3 h-3 border-l-2 border-t-2 border-white/20 rotate-[-135deg]" />
            </div>
          </div>
        </div>

      </div>

      {/* Install CTA */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-slate-400">Install directly on your phone — no App Store needed.</p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div>
              <p className="text-[9px] text-slate-400">Add to</p>
              <p className="text-xs font-bold text-white">iPhone</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M3.18 23.76c.3.17.64.2.96.1L15.66 12 12 8.34 3.18 23.76z" fill="#EA4335"/>
              <path d="M20.93 10.47l-2.81-1.6-3.46 3.13 3.46 3.47 2.78-1.58a1.54 1.54 0 000-3.42z" fill="#FBBC04"/>
              <path d="M2.22.84A1.5 1.5 0 002 1.58V22.42c0 .26.07.5.22.74L12 12 2.22.84z" fill="#4285F4"/>
              <path d="M15.66 12L3.18.24A1.02 1.02 0 002.22.84L12 12l3.66-3.66L15.66 12z" fill="#34A853"/>
            </svg>
            <div>
              <p className="text-[9px] text-slate-400">Add to</p>
              <p className="text-xs font-bold text-white">Android</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-600">Safari → Condividi → "Aggiungi alla schermata Home" · Chrome → Menu → "Aggiungi alla schermata"</p>
      </div>
    </section>
  )
}
