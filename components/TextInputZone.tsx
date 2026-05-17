'use client'

import { useState } from 'react'
import { useTaskStore } from '@/store/taskStore'
import type { ParsedTask } from '@/types'

interface Props {
  onDone?: () => void
}

export default function TextInputZone({ onDone }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tasks, setTasks] = useState<ParsedTask[]>([])
  const [saved, setSaved] = useState(false)
  const { addTask } = useTaskStore()

  const isUrl = /^https?:\/\//i.test(input.trim())

  async function handleProcess() {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setTasks([])
    setSaved(false)

    const res = await fetch('/api/process-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input.trim() }),
    })
    const json = await res.json() as { tasks?: ParsedTask[]; error?: string }

    if (!res.ok || json.error) {
      if (json.error === 'PREMIUM_REQUIRED') {
        setError('This feature is available for Premium users only. Upgrade to use task extraction from links and text.')
      } else {
        setError(json.error ?? 'Something went wrong.')
      }
      setLoading(false)
      return
    }

    setTasks(json.tasks ?? [])
    setLoading(false)
  }

  async function handleSave() {
    if (tasks.length === 0) return
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    })
    const data = await res.json()
    if (Array.isArray(data)) {
      data.forEach(t => addTask(t))
      setSaved(true)
      setInput('')
      setTasks([])
      onDone?.()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(null); setTasks([]) }}
          placeholder="Paste a URL or any text with tasks (email, notes, message…)"
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
        />
        {isUrl && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 text-[10px] font-bold text-cyan-400">
            🔗 URL detected
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
          {error.includes('Premium') && (
            <a href="/pricing" className="ml-2 font-bold text-violet-400 hover:text-violet-300">Upgrade →</a>
          )}
        </div>
      )}

      {tasks.length > 0 && !saved && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">{tasks.length} task{tasks.length > 1 ? 's' : ''} found</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {tasks.map((t, i) => (
              <div key={i} className="glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/5 flex items-center gap-2">
                <span className="text-xs text-slate-500 shrink-0">{t.type}</span>
                <span className="flex-1">{t.title}</span>
                {t.date && <span className="text-xs text-slate-500 shrink-0">📅 {t.date}</span>}
              </div>
            ))}
          </div>
          <button onClick={handleSave}
            className="w-full shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-bold text-white">
            Save {tasks.length} task{tasks.length > 1 ? 's' : ''} to Dashboard →
          </button>
        </div>
      )}

      {saved && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 font-semibold text-center">
          ✓ Tasks saved to your Dashboard!
        </div>
      )}

      {!saved && tasks.length === 0 && (
        <button
          onClick={handleProcess}
          disabled={loading || !input.trim()}
          className="w-full shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-bold text-white disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isUrl ? 'Fetching page…' : 'Extracting tasks…'}
            </span>
          ) : (
            `Extract tasks with AI ${isUrl ? '🔗' : '✨'}`
          )}
        </button>
      )}
    </div>
  )
}
