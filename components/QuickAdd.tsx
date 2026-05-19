'use client'

import { useState, useEffect, useRef } from 'react'
import type { Task, TaskPriority } from '@/types'

interface QuickAddProps {
  onAdded: (task: Task) => void
  open?: boolean
  onClose?: () => void
}

export default function QuickAdd({ onAdded, open: externalOpen, onClose }: QuickAddProps) {
  const [open, setOpen]       = useState(false)
  const [title, setTitle]     = useState('')
  const [date, setDate]       = useState('')
  const [type, setType]       = useState<'task' | 'event' | 'reminder'>('task')
  const [priority, setPriority] = useState<TaskPriority | ''>('')
  const [saving, setSaving]   = useState(false)
  const inputRef              = useRef<HTMLInputElement>(null)

  const isOpen = externalOpen ?? open

  useEffect(() => {
    if (isOpen) {
      setTitle(''); setDate(''); setType('task'); setPriority('')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  function close() {
    setOpen(false)
    onClose?.()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: [{ title: title.trim(), date: date || null, time: null, location: null, type, priority: priority || null }]
        }),
      })
      if (res.ok) {
        const created = await res.json() as Task[]
        if (created[0]) onAdded(created[0])
        close()
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  return (
    <>
      {/* Floating + button — only when no external control */}
      {externalOpen === undefined && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40 hover:scale-110 transition-transform"
          title="Quick add task (N)"
          style={{ boxShadow: '0 8px 28px rgba(124,58,237,0.5)' }}
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={close}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative glass rounded-3xl border border-white/10 shadow-2xl shadow-black/60 w-full max-w-md p-6 space-y-5 animate-fade-scale"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-white text-lg">Quick Add</h2>
                <p className="text-xs text-slate-500 mt-0.5">New task in seconds</p>
              </div>
              <button onClick={close} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="relative">
                <input
                  ref={inputRef}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30"
                />
              </div>

              {/* Type + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-medium">Type</label>
                  <div className="flex rounded-xl border border-white/10 bg-white/3 p-1 gap-1">
                    {(['task', 'event', 'reminder'] as const).map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => setType(t)}
                        className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all capitalize ${type === t ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'text-slate-500 hover:text-white'}`}
                      >{t}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-medium">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskPriority | '')}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  >
                    <option value="">None</option>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🔵 Low</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-medium">Due date (optional)</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!title.trim() || saving}
                className="w-full shimmer-btn btn-3d rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-black text-white disabled:opacity-40 transition-opacity"
              >
                {saving ? 'Adding…' : '+ Add Task'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-600">Press <kbd className="rounded bg-white/8 border border-white/10 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> to close</p>
          </div>
        </div>
      )}
    </>
  )
}
