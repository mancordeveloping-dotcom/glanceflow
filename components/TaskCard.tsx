'use client'

import { useState } from 'react'
import type { Task, Project } from '@/types'

const typeColors: Record<Task['type'], string> = {
  task: 'text-violet-400 bg-violet-500/10',
  event: 'text-cyan-400 bg-cyan-500/10',
  reminder: 'text-pink-400 bg-pink-500/10',
}

const typeLabel: Record<Task['type'], string> = {
  task: '◆ Task',
  event: '◆ Event',
  reminder: '◆ Reminder',
}

interface TaskCardProps {
  task: Task
  projects?: Project[]
  onToggle?: (task: Task) => void
  onDelete?: (task: Task) => void
  onEdit?: (task: Task, updates: Partial<Task>) => Promise<void>
}

export default function TaskCard({ task, projects = [], onToggle, onDelete, onEdit }: TaskCardProps) {
  const isDone = task.status === 'done'
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState(task.title)
  const [date, setDate] = useState(task.date ?? '')
  const [time, setTime] = useState(task.time ?? '')
  const [location, setLocation] = useState(task.location ?? '')
  const [type, setType] = useState(task.type)
  const [projectId, setProjectId] = useState(task.project_id ?? '')

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
    setProjectId(task.project_id ?? '')
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
      project_id: projectId || null,
    })
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="glass rounded-2xl p-5 space-y-4 border border-violet-500/20">
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Edit task</p>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            placeholder="Task title"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
          </div>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            placeholder="Location (optional)"
          />
          <select value={type} onChange={(e) => setType(e.target.value as Task['type'])}
            className="w-full rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
            <option value="task">Task</option>
            <option value="event">Event</option>
            <option value="reminder">Reminder</option>
          </select>

          {projects.length > 0 && (
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              <option value="">No project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving || !title.trim()}
            className="flex-1 shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-bold text-white disabled:opacity-40">
            {saving ? 'Saving…' : '✓ Save'}
          </button>
          <button onClick={() => setEditing(false)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/10 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass rounded-2xl border border-white/5 overflow-hidden transition-all ${isDone ? 'opacity-60' : ''}`}>
      {/* Top bar with type */}
      <div className={`px-4 py-2 flex items-center justify-between ${typeColors[task.type]}`}>
        <span className="text-xs font-bold tracking-wide">{typeLabel[task.type]}</span>
        <div className="flex items-center gap-1">
          <button onClick={handleEditOpen}
            className="rounded p-1 opacity-60 hover:opacity-100 transition-opacity"
            title="Edit">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="rounded p-1 opacity-60 hover:opacity-100 hover:text-red-400 transition-all disabled:opacity-20"
            title="Delete">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        <p className={`font-semibold text-sm leading-snug ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
          {task.title}
        </p>

        {(task.date || task.time || task.location) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {task.date && <span className="text-xs text-slate-500">📅 {task.date}</span>}
            {task.time && <span className="text-xs text-slate-500">🕐 {task.time}</span>}
            {task.location && <span className="text-xs text-slate-500">📍 {task.location}</span>}
          </div>
        )}

        {task.project_id && projects.length > 0 && (() => {
          const proj = projects.find(p => p.id === task.project_id)
          if (!proj) return null
          return (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
              <span className="text-xs text-slate-500">{proj.name}</span>
            </div>
          )
        })()}

        {onToggle && (
          <button
            onClick={() => onToggle(task)}
            className={`w-full rounded-xl py-2 text-xs font-bold transition-all
              ${isDone
                ? 'bg-white/5 text-slate-400 hover:bg-white/8 border border-white/8'
                : 'bg-white/5 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
              }`}
          >
            {isDone ? '↩ Reopen' : '✓ Mark as Done'}
          </button>
        )}
      </div>
    </div>
  )
}
