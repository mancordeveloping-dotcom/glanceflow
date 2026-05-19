'use client'

import { useEffect, useRef, useState } from 'react'

type Phase = 'work' | 'break'

const DURATIONS = [
  { label: '15m', work: 15 * 60, break: 5 * 60 },
  { label: '25m', work: 25 * 60, break: 5 * 60 },
  { label: '45m', work: 45 * 60, break: 10 * 60 },
  { label: '60m', work: 60 * 60, break: 15 * 60 },
]

export default function PomodoroTimer() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>('work')
  const [durationIdx, setDurationIdx] = useState(1) // default 25m
  const [seconds, setSeconds] = useState(DURATIONS[1].work)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [focusTask, setFocusTask] = useState('')
  const [editingTask, setEditingTask] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const WORK_SECS = DURATIONS[durationIdx].work
  const BREAK_SECS = DURATIONS[durationIdx].break

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s > 1) return s - 1
        // Phase complete
        const nextPhase: Phase = phase === 'work' ? 'break' : 'work'
        if (phase === 'work') setSessions(n => n + 1)
        setPhase(nextPhase)
        setRunning(false)
        if (Notification.permission === 'granted') {
          new Notification(phase === 'work' ? '🍅 Break time!' : '💪 Back to work!', {
            body: phase === 'work' ? 'Great work — take 5 minutes.' : 'Focus session starting!',
            icon: '/icon-192.png',
          })
        }
        return nextPhase === 'work' ? WORK_SECS : BREAK_SECS
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, phase])

  function reset() {
    setRunning(false)
    setSeconds(phase === 'work' ? WORK_SECS : BREAK_SECS)
  }

  const total = phase === 'work' ? WORK_SECS : BREAK_SECS
  const pct = ((total - seconds) / total) * 100
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  const r = 42
  const circ = 2 * Math.PI * r
  const strokeDash = circ - (pct / 100) * circ

  const accentColor = phase === 'work' ? '#7c3aed' : '#10b981'

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed pill */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="shimmer-btn flex items-center gap-2 glass inner-highlight rounded-full px-4 py-2.5 border border-white/10 shadow-xl shadow-black/50 hover:border-violet-500/30 transition-all"
        >
          <span className="text-lg">🍅</span>
          <span className="text-sm font-bold text-white tabular-nums">{mins}:{secs}</span>
          {running && <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />}
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div className="glass inner-highlight rounded-2xl p-5 border border-white/10 shadow-2xl shadow-black/70 w-56 space-y-4 animate-fade-scale">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🍅</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${phase === 'work' ? 'text-violet-400' : 'text-emerald-400'}`}>
                {phase === 'work' ? 'Focus' : 'Break'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{sessions} 🍅</span>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Ring */}
          <div className="flex justify-center">
            <div className="relative">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r={r}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={strokeDash}
                  transform="rotate(-90 50 50)"
                  style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none', filter: `drop-shadow(0 0 6px ${accentColor}88)` }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-extrabold text-white tabular-nums">{mins}:{secs}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setRunning(v => !v)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                running ? 'bg-white/10 text-white border border-white/10' : 'shimmer-btn bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
              }`}
            >
              {running ? '⏸ Pause' : '▶ Start'}
            </button>
            <button onClick={reset} className="rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-400 hover:bg-white/10 transition-colors">
              ↺
            </button>
          </div>

          {/* Focus task */}
          <div className="space-y-1">
            {editingTask ? (
              <input
                autoFocus
                value={focusTask}
                onChange={e => setFocusTask(e.target.value)}
                onBlur={() => setEditingTask(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingTask(false)}
                placeholder="What are you focusing on?"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            ) : (
              <button
                onClick={() => setEditingTask(true)}
                className="w-full text-left rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs transition-colors hover:bg-white/8"
              >
                {focusTask
                  ? <span className="text-white truncate block">{focusTask}</span>
                  : <span className="text-slate-500">+ Add focus task…</span>
                }
              </button>
            )}
          </div>

          {/* Duration selector */}
          <div className="flex rounded-xl border border-white/8 bg-white/3 p-1 gap-1">
            {DURATIONS.map((d, i) => (
              <button key={d.label}
                onClick={() => { setDurationIdx(i); setRunning(false); setPhase('work'); setSeconds(d.work) }}
                className={`flex-1 rounded-lg py-1 text-xs font-semibold transition-all ${durationIdx === i ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
