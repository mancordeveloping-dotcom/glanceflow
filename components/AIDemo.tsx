'use client'

import { useEffect, useState, useCallback } from 'react'

const STEPS = [
  { id: 'upload', label: 'Screenshot uploaded', duration: 1200 },
  { id: 'analyze', label: 'AI analyzing image…', duration: 2000 },
  { id: 'extract', label: '4 tasks extracted!', duration: 800 },
]

const FAKE_SCREENSHOT = [
  { sender: 'Luca', time: '09:41', text: 'Ciao! Puoi mandarmi il report Q1 entro venerdì?' },
  { sender: 'Luca', time: '09:42', text: 'Ah e ricordati di chiamare il cliente alle 15:00 oggi' },
  { sender: 'Tu', time: '09:43', text: 'Sì ci penso 👍' },
  { sender: 'Luca', time: '09:44', text: 'Grazie! Anche quella fattura di marzo va inviata ASAP' },
]

const EXTRACTED = [
  { title: 'Mandare report Q1 a Luca', tag: '📅 Venerdì', color: 'violet', priority: '🟡 High' },
  { title: 'Chiamare il cliente', tag: '⏰ Oggi 15:00', color: 'cyan', priority: '🔴 Urgent' },
  { title: 'Inviare fattura marzo', tag: '⚡ ASAP', color: 'pink', priority: '🔴 Urgent' },
  { title: 'Risposta confermata a Luca', tag: '✅ Done', color: 'emerald', priority: '🟢 Low' },
]

const COLORS: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  violet:  { bg: 'rgba(124,58,237,0.1)',   border: 'rgba(124,58,237,0.25)',  text: '#a78bfa', bar: '#7c3aed' },
  cyan:    { bg: 'rgba(6,182,212,0.1)',     border: 'rgba(6,182,212,0.25)',   text: '#67e8f9', bar: '#06b6d4' },
  pink:    { bg: 'rgba(236,72,153,0.1)',    border: 'rgba(236,72,153,0.25)',  text: '#f9a8d4', bar: '#ec4899' },
  emerald: { bg: 'rgba(52,211,153,0.1)',    border: 'rgba(52,211,153,0.25)', text: '#6ee7b7', bar: '#34d399' },
}

export default function AIDemo() {
  const [step, setStep] = useState(0) // 0=screenshot, 1=analyzing, 2=done
  const [visible, setVisible] = useState(0) // how many tasks shown
  const [running, setRunning] = useState(false)

  const run = useCallback(() => {
    if (running) return
    setRunning(true)
    setStep(1)
    setVisible(0)

    setTimeout(() => {
      setStep(2)
      let count = 0
      const interval = setInterval(() => {
        count++
        setVisible(count)
        if (count >= EXTRACTED.length) {
          clearInterval(interval)
          setRunning(false)
        }
      }, 300)
    }, STEPS[1].duration)
  }, [running])

  function reset() {
    setStep(0)
    setVisible(0)
    setRunning(false)
  }

  // Auto-run on first mount after a delay
  useEffect(() => {
    const t = setTimeout(run, 1200)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4 items-start">

        {/* LEFT — fake WhatsApp screenshot */}
        <div className="glass inner-highlight rounded-2xl overflow-hidden border border-white/8">
          {/* Phone chrome */}
          <div className="px-4 py-2.5 flex items-center gap-2.5 border-b border-white/8" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">L</div>
            <div>
              <p className="text-xs font-bold text-white">Luca</p>
              <p className="text-[10px] text-slate-500">WhatsApp</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-slate-500">online</span>
            </div>
          </div>

          {/* Chat bubbles */}
          <div className="p-3 space-y-2 min-h-[180px]" style={{ background: 'rgba(0,0,0,0.25)' }}>
            {FAKE_SCREENSHOT.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'Tu' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed`}
                  style={{
                    background: msg.sender === 'Tu'
                      ? 'rgba(124,58,237,0.35)'
                      : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${msg.sender === 'Tu' ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: '#e2e8f0',
                  }}
                >
                  {msg.sender !== 'Tu' && (
                    <p className="text-[9px] font-bold text-emerald-400 mb-0.5">{msg.sender}</p>
                  )}
                  {msg.text}
                  <p className="text-[9px] text-slate-600 mt-0.5 text-right">{msg.time} ✓✓</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <div className="p-3 border-t border-white/8">
            <button
              onClick={step === 0 ? run : reset}
              disabled={running}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2
                ${step === 2
                  ? 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90'
                }
                ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {step === 0 && !running && (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  Carica su GlanceFlow
                </>
              )}
              {step === 1 && (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI in analisi…
                </>
              )}
              {step === 2 && '↺ Rifai la demo'}
            </button>
          </div>
        </div>

        {/* RIGHT — extracted tasks */}
        <div className="space-y-3">
          {/* Status bar */}
          <div className="flex items-center gap-2 px-1">
            <div className={`h-2 w-2 rounded-full transition-all duration-300 ${step === 0 ? 'bg-slate-600' : step === 1 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-xs font-semibold text-slate-400">
              {step === 0 ? 'In attesa di screenshot…' : step === 1 ? 'Gemini AI sta leggendo…' : `${EXTRACTED.length} task estratti in 2.1s ⚡`}
            </span>
          </div>

          {/* AI thinking animation */}
          {step === 1 && (
            <div className="glass rounded-2xl border border-amber-500/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[10px] font-black text-white">AI</div>
                <span className="text-xs text-slate-400 font-medium">Gemini sta analizzando…</span>
              </div>
              {['Riconosco il testo nell\'immagine…', 'Identifico task e scadenze…', 'Assegno priorità…'].map((line, i) => (
                <div key={line} className="flex items-center gap-2" style={{ opacity: 0, animation: `fadeIn 0.3s ${i * 0.4}s forwards` }}>
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span className="text-[11px] text-slate-400">{line}</span>
                </div>
              ))}
            </div>
          )}

          {/* Extracted task cards */}
          {step === 2 && EXTRACTED.slice(0, visible).map((task, i) => {
            const c = COLORS[task.color]
            return (
              <div
                key={task.title}
                className="rounded-xl overflow-hidden"
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  animation: `slideInRight 0.35s ${i * 0.05}s both`,
                }}
              >
                <div className="flex">
                  <div className="w-1 shrink-0" style={{ background: c.bar }} />
                  <div className="flex-1 px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] font-semibold text-slate-100 leading-snug">{task.title}</p>
                      <span className="text-[10px] font-bold shrink-0 mt-0.5" style={{ color: c.text }}>{task.priority}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{task.tag}</p>
                  </div>
                  <div className="flex items-center pr-3">
                    <div className="h-4 w-4 rounded border border-white/15 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-sm" style={{ background: c.bar }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Empty state */}
          {step === 0 && (
            <div className="glass rounded-2xl border border-dashed border-white/10 p-8 text-center space-y-2">
              <p className="text-2xl">📋</p>
              <p className="text-sm text-slate-500">I task estratti appariranno qui</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
