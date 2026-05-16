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
  onEdit?: (task: Task, updates: Partial<Task>) => Promise<void>
}

export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const isDone = task.status === 'done'
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState(task.title)
  const [date, setDate] = useState(task.date ?? '')
  const [time, setTime] = useState(task.time ?? '')
  const [location, setLocation] = useState(task.location ?? '')
  const [type, setType] = useState(task.type)

  function handleDelete() {
    if (!onDelete) return
    setDeleting(true)
    onDelete(task)
  }

  function handleEditOpen() {
    setTitle(task.title)
    setDate(task.date ?? '')
    setTime(task.time ?? '')
    setLocation(task.location ?? '')
    setType(task.type)
    setEditing(true)
  }

  async function handleSave() {
    if (!onEdit || !title.trim()) return
    setSaving(true)
    await onEdit(task, {
      title: title.trim(),
      date: date || null,
      time: time || null,
      location: location || null,
      type,
    })
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="glass inner-highlight rounded-2xl p-5 space-y-4 border border-violet-500/30">
        <p className="text-xs font-bold text-violet-300 uppercase tracking-widest">Edit task</p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              placeholder="Task title"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              placeholder="Optional location"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Task['type'])}
              className="w-full rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <option value="task">Task</option>
              <option value="event">Event</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex-1 shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            {saving ? 'Saving…' : '✓ Save'}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`card-3d glass inner-highlight rounded-2xl p-5 space-y-4 border border-white/5 ${isDone ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-semibold leading-snug text-sm flex-1 ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColors[task.type]}`}>
            {typeLabel[task.type]}
          </span>
          <button
            onClick={handleEditOpen}
            className="rounded-lg p-1 text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
            title="Edit task"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
            title="Delete task"
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
