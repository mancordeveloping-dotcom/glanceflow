'use client'

import { useState } from 'react'
import type { Task } from '@/types'

const typeColors: Record<Task['type'], string> = {
  task: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  event: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  reminder: 'border-pink-500/30 bg-pink-500/10 text-pink-300',
}

const typeLabel: Record<Task['type'], string> = {
  task: 'Task',
  event: 'Event',
  reminder: 'Reminder',
}

interface TaskCardProps {
  task: Task
  onToggle?: (task: Task) => void
  onDelete?: (task: Task) => void
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const isDone = task.status === 'done'
  const [deleting, setDeleting] = useState(false)

  function handleDelete() {
    if (!onDelete) return
    setDeleting(true)
    onDelete(task)
  }

  return (
    <div className={`card-3d glass inner-highlight rounded-2xl p-5 space-y-4 border border-white/5 ${isDone ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-semibold leading-snug text-sm flex-1 ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColors[task.type]}`}>
            {typeLabel[task.type]}
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {(task.date || task.time || task.location) && (
        <div className="space-y-0.5 text-xs text-slate-500">
          {task.date && <p>📅 {task.date}</p>}
          {task.time && <p>🕐 {task.time}</p>}
          {task.location && <p>📍 {task.location}</p>}
        </div>
      )}

      {onToggle && (
        <button
          onClick={() => onToggle(task)}
          className={`w-full rounded-xl py-2 text-xs font-bold transition-all
            ${isDone
              ? 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
              : 'shimmer-btn btn-3d bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
            }`}
        >
          {isDone ? '↩ Mark as Pending' : '✓ Mark as Done'}
        </button>
      )}
    </div>
  )
}
