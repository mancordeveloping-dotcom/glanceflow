'use client'

import { useState, useEffect } from 'react'

interface ShortcutDef {
  keys: string[]
  label: string
  category: string
}

const SHORTCUTS: ShortcutDef[] = [
  { keys: ['N'],      label: 'Quick add task',       category: 'Tasks' },
  { keys: ['/'],      label: 'Focus search',          category: 'Tasks' },
  { keys: ['C'],      label: 'Toggle calendar view', category: 'Views' },
  { keys: ['D'],      label: 'Show Dashboard',        category: 'Views' },
  { keys: ['?'],      label: 'Show this help',        category: 'App' },
  { keys: ['Esc'],    label: 'Close modal / deselect', category: 'App' },
]

interface KeyboardShortcutsProps {
  onQuickAdd: () => void
  onToggleCalendar: () => void
  onFocusSearch: () => void
}

export default function KeyboardShortcuts({ onQuickAdd, onToggleCalendar, onFocusSearch }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target as HTMLElement).isContentEditable

      if (e.key === '?' && !isInput) { e.preventDefault(); setShowHelp(h => !h); return }
      if (e.key === 'Escape') { setShowHelp(false); return }

      if (isInput) return

      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); onQuickAdd(); return }
      if (e.key === '/')                  { e.preventDefault(); onFocusSearch(); return }
      if (e.key === 'c' || e.key === 'C') { e.preventDefault(); onToggleCalendar(); return }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onQuickAdd, onToggleCalendar, onFocusSearch])

  const categories = [...new Set(SHORTCUTS.map(s => s.category))]

  return (
    <>
      {/* Help hint (bottom center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-black/60 backdrop-blur px-3 py-1.5 text-[10px] text-slate-600 pointer-events-auto cursor-default"
          onClick={() => setShowHelp(true)}
          style={{ cursor: 'pointer' }}>
          <kbd className="rounded bg-white/8 border border-white/10 px-1.5 font-mono">?</kbd>
          <span>keyboard shortcuts</span>
        </div>
      </div>

      {/* Help modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative glass rounded-3xl border border-white/10 shadow-2xl shadow-black/60 w-full max-w-sm p-6 space-y-5 animate-fade-scale"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-black text-white">Keyboard Shortcuts</h2>
              <button onClick={() => setShowHelp(false)} className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {categories.map(cat => (
                <div key={cat} className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{cat}</p>
                  <div className="space-y-1.5">
                    {SHORTCUTS.filter(s => s.category === cat).map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">{s.label}</span>
                        <div className="flex items-center gap-1">
                          {s.keys.map(k => (
                            <kbd key={k} className="rounded-lg bg-white/8 border border-white/12 px-2.5 py-1 text-xs font-mono text-white font-bold min-w-[28px] text-center">
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-600">Press <kbd className="rounded bg-white/8 border border-white/10 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> to close</p>
          </div>
        </div>
      )}
    </>
  )
}
