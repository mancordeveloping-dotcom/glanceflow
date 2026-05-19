'use client'

import { useState } from 'react'
import type { ParsedTask } from '@/types'

const TEMPLATES = [
  {
    id: 'work',
    icon: '💼',
    label: 'Work',
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    tasks: ['Follow up on emails', 'Prepare meeting notes', 'Review project status', 'Update team on progress', 'Check deadlines'],
  },
  {
    id: 'study',
    icon: '📚',
    label: 'Study',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    tasks: ['Review lecture notes', 'Complete assignment', 'Schedule study session', 'Read chapter', 'Practice exercises'],
  },
  {
    id: 'fitness',
    icon: '🏃',
    label: 'Fitness',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    tasks: ['Morning workout', 'Meal prep', 'Track weekly progress', 'Schedule gym session', 'Drink 2L water'],
  },
  {
    id: 'personal',
    icon: '🏠',
    label: 'Personal',
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    tasks: ['Grocery shopping', 'Pay bills', 'Call family', 'Book appointment', 'Clean desk'],
  },
]

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (tasks: ParsedTask[]) => Promise<void>
}

export default function TemplateModal({ open, onClose, onAdd }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  if (!open) return null

  async function handleAdd(templateId: string, tasks: string[]) {
    setLoading(templateId)
    const parsed: ParsedTask[] = tasks.map(title => ({
      title,
      date: null,
      time: null,
      location: null,
      type: 'task' as const,
    }))
    await onAdd(parsed)
    setLoading(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass inner-highlight rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl shadow-black/80 space-y-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white">Task Templates</h2>
            <p className="text-xs text-slate-500 mt-0.5">Add a set of ready-made tasks instantly</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {TEMPLATES.map(tpl => (
            <div key={tpl.id} className={`rounded-2xl border overflow-hidden ${expanded === tpl.id ? 'border-white/15' : 'border-white/8'}`}>
              <button
                onClick={() => setExpanded(expanded === tpl.id ? null : tpl.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm rounded-xl px-2.5 py-1 border font-bold ${tpl.color}`}>{tpl.icon} {tpl.label}</span>
                  <span className="text-xs text-slate-500">{tpl.tasks.length} tasks</span>
                </div>
                <svg className={`h-4 w-4 text-slate-500 transition-transform ${expanded === tpl.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {expanded === tpl.id && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="space-y-1.5">
                    {tpl.tasks.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAdd(tpl.id, tpl.tasks)}
                    disabled={loading === tpl.id}
                    className="w-full shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {loading === tpl.id ? 'Adding…' : `Add ${tpl.tasks.length} tasks →`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
