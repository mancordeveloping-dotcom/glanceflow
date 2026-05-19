'use client'

import { useState, useEffect, useRef } from 'react'
import type { Task, Project, TaskPriority, TaskRecurrence } from '@/types'

const typeColors: Record<Task['type'], string> = {
  task:     'text-violet-400 bg-violet-500/10',
  event:    'text-cyan-400 bg-cyan-500/10',
  reminder: 'text-pink-400 bg-pink-500/10',
}

const typeLabel: Record<Task['type'], string> = {
  task:     '◆ Task',
  event:    '◆ Event',
  reminder: '◆ Reminder',
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; dot: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-400 bg-red-500/10',    dot: 'bg-red-400' },
  high:   { label: 'High',   color: 'text-orange-400 bg-orange-500/10', dot: 'bg-orange-400' },
  medium: { label: 'Medium', color: 'text-yellow-400 bg-yellow-500/10', dot: 'bg-yellow-400' },
  low:    { label: 'Low',    color: 'text-slate-400 bg-slate-500/10', dot: 'bg-slate-400' },
}

const recurrenceLabel: Record<TaskRecurrence, string> = {
  daily:   '🔁 Daily',
  weekly:  '🔁 Weekly',
  monthly: '🔁 Monthly',
}

interface TaskCardProps {
  task: Task
  projects?: Project[]
  onToggle?: (task: Task) => void
  onDelete?: (task: Task) => void
  onEdit?: (task: Task, updates: Partial<Task>) => Promise<void>
  selected?: boolean
  onSelect?: (id: string) => void
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export default function TaskCard({ task, projects = [], onToggle, onDelete, onEdit, selected, onSelect }: TaskCardProps) {
  const isDone = task.status === 'done'
  const [deleting, setDeleting]   = useState(false)
  const [editing, setEditing]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [sharing, setSharing]     = useState(false)
  const [shared, setShared]       = useState(false)

  // Task timer
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  async function handleShare() {
    setSharing(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}/share`, { method: 'POST' })
      const { url } = await res.json() as { url: string }
      await navigator.clipboard.writeText(url)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    } catch { /* ignore */ }
    setSharing(false)
  }

  const [title,       setTitle]       = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [date,        setDate]        = useState(task.date ?? '')
  const [time,        setTime]        = useState(task.time ?? '')
  const [location,    setLocation]    = useState(task.location ?? '')
  const [type,        setType]        = useState(task.type)
  const [projectId,   setProjectId]   = useState(task.project_id ?? '')
  const [priority,    setPriority]    = useState<TaskPriority | ''>(task.priority ?? '')
  const [recurrence,  setRecurrence]  = useState<TaskRecurrence | ''>(task.recurrence ?? '')

  // Subtasks (local edit state)
  const [editSubtasks, setEditSubtasks] = useState<Array<{ id: string; title: string; done: boolean }>>(task.subtasks ?? [])
  const [newSubtask, setNewSubtask]     = useState('')

  function handleDelete() {
    if (!onDelete) return
    setDeleting(true)
    onDelete(task)
  }

  function handleEditOpen() {
    setTitle(task.title)
    setDescription(task.description ?? '')
    setDate(task.date ?? '')
    setTime(task.time ?? '')
    setLocation(task.location ?? '')
    setType(task.type)
    setProjectId(task.project_id ?? '')
    setPriority(task.priority ?? '')
    setRecurrence(task.recurrence ?? '')
    setEditSubtasks(task.subtasks ?? [])
    setNewSubtask('')
    setEditing(true)
  }

  async function handleSave() {
    if (!onEdit || !title.trim()) return
    setSaving(true)
    await onEdit(task, {
      title:       title.trim(),
      description: description.trim() || null,
      date:        date || null,
      time:        time || null,
      location:    location || null,
      type,
      project_id:  projectId || null,
      priority:    (priority as TaskPriority) || null,
      recurrence:  (recurrence as TaskRecurrence) || null,
      subtasks:    editSubtasks,
    })
    setSaving(false)
    setEditing(false)
  }

  function addSubtask() {
    const t = newSubtask.trim()
    if (!t) return
    setEditSubtasks(s => [...s, { id: crypto.randomUUID(), title: t, done: false }])
    setNewSubtask('')
  }

  function toggleSubtaskInCard(subtaskId: string) {
    if (!onEdit) return
    const updated = (task.subtasks ?? []).map(s => s.id === subtaskId ? { ...s, done: !s.done } : s)
    onEdit(task, { subtasks: updated })
  }

  /* ── Edit form ── */
  if (editing) {
    return (
      <div className="glass rounded-2xl p-5 space-y-4 border border-violet-500/20">
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Edit task</p>
        <div className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            placeholder="Task title" />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
            placeholder="Note (opzionale)" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
            </div>
          </div>

          <input value={location} onChange={e => setLocation(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            placeholder="Location (optional)" />

          <div className="grid grid-cols-2 gap-3">
            <select value={type} onChange={e => setType(e.target.value as Task['type'])}
              className="rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              <option value="task">Task</option>
              <option value="event">Event</option>
              <option value="reminder">Reminder</option>
            </select>

            <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority | '')}
              className="rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              <option value="">No priority</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>
          </div>

          <select value={recurrence} onChange={e => setRecurrence(e.target.value as TaskRecurrence | '')}
            className="w-full rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
            <option value="">No recurrence</option>
            <option value="daily">🔁 Daily</option>
            <option value="weekly">🔁 Weekly</option>
            <option value="monthly">🔁 Monthly</option>
          </select>

          {projects.length > 0 && (
            <select value={projectId} onChange={e => setProjectId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}

          {/* Subtasks editor */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subtasks</p>
            {editSubtasks.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditSubtasks(prev => prev.map(x => x.id === s.id ? { ...x, done: !x.done } : x))}
                  className={`shrink-0 h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${s.done ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/30'}`}
                >
                  {s.done && <svg className="h-2.5 w-2.5 text-emerald-400" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}><path d="M1.5 5l2.5 2.5 4.5-5"/></svg>}
                </button>
                <span className={`flex-1 text-xs ${s.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>{s.title}</span>
                <button type="button" onClick={() => setEditSubtasks(prev => prev.filter(x => x.id !== s.id))} className="text-slate-600 hover:text-red-400 transition-colors text-xs">✕</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }}
                placeholder="Add subtask…"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
              <button type="button" onClick={addSubtask} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">+ Add</button>
            </div>
          </div>
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

  /* ── Card view ── */
  const pCfg = task.priority ? priorityConfig[task.priority] : null
  const todayStr = new Date().toISOString().split('T')[0]
  const isOverdue = !isDone && task.date && task.date < todayStr

  return (
    <div className={`glass rounded-2xl border overflow-hidden card-lift transition-all ${isDone ? 'opacity-55' : ''} ${selected ? 'border-violet-500/60 ring-2 ring-violet-500/20' : isOverdue ? 'border-red-500/40' : 'border-white/5'}`}
      style={isOverdue ? { boxShadow: '0 0 0 1px rgba(239,68,68,0.15), 0 4px 24px rgba(0,0,0,0.3)' } : undefined}>
      {/* Type bar */}
      <div className={`px-4 py-2 flex items-center justify-between ${typeColors[task.type]}`}>
        <div className="flex items-center gap-2">
          {onSelect && (
            <button
              onClick={() => onSelect(task.id)}
              className={`shrink-0 h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${selected ? 'border-violet-400 bg-violet-500' : 'border-white/30 bg-transparent hover:border-violet-400'}`}
            >
              {selected && (
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          )}
          <span className="text-xs font-bold tracking-wide">{typeLabel[task.type]}</span>
          {isOverdue && (
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-red-400 bg-red-500/15">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              Overdue
            </span>
          )}
          {pCfg && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${pCfg.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pCfg.dot}`} />
              {pCfg.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleShare} disabled={sharing}
            className="rounded p-1 opacity-60 hover:opacity-100 transition-opacity" title={shared ? 'Link copied!' : 'Share'}>
            {shared ? (
              <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            )}
          </button>
          <button onClick={handleEditOpen} className="rounded p-1 opacity-60 hover:opacity-100 transition-opacity" title="Edit">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="rounded p-1 opacity-60 hover:opacity-100 hover:text-red-400 transition-all disabled:opacity-20" title="Delete">
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

        {task.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Subtasks */}
        {(task.subtasks ?? []).length > 0 && (() => {
          const subs = task.subtasks!
          const done = subs.filter(s => s.done).length
          const pct = Math.round((done / subs.length) * 100)
          return (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Subtasks</span>
                <span className="font-bold text-slate-400">{done}/{subs.length}</span>
              </div>
              <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="space-y-1">
                {subs.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSubtaskInCard(s.id)}
                    className="flex items-center gap-2 w-full text-left group"
                  >
                    <span className={`shrink-0 h-3.5 w-3.5 rounded border flex items-center justify-center transition-colors ${s.done ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/20 group-hover:border-white/40'}`}>
                      {s.done && <svg className="h-2 w-2 text-emerald-400" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}><path d="M1.5 5l2.5 2.5 4.5-5"/></svg>}
                    </span>
                    <span className={`text-[11px] ${s.done ? 'line-through text-slate-600' : 'text-slate-400 group-hover:text-slate-300'} transition-colors`}>{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })()}

        {(task.date || task.time || task.location) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {task.date     && <span className="text-xs text-slate-500">📅 {task.date}</span>}
            {task.time     && <span className="text-xs text-slate-500">🕐 {task.time}</span>}
            {task.location && <span className="text-xs text-slate-500">📍 {task.location}</span>}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {task.recurrence && (
            <span className="text-[10px] text-slate-500 bg-white/5 rounded-full px-2 py-0.5">
              {recurrenceLabel[task.recurrence]}
            </span>
          )}
          {task.project_id && projects.length > 0 && (() => {
            const proj = projects.find(p => p.id === task.project_id)
            if (!proj) return null
            return (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-white/5 rounded-full px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                {proj.name}
              </span>
            )
          })()}
        </div>

        {/* Timer */}
        {!isDone && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerRunning(r => !r)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border ${
                timerRunning
                  ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title={timerRunning ? 'Pause timer' : 'Start timer'}
            >
              {timerRunning ? (
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
              <span className={`tabular-nums ${timerRunning ? 'text-red-400' : timerSeconds > 0 ? 'text-white' : ''}`}>
                {formatTime(timerSeconds)}
              </span>
            </button>
            {timerSeconds > 0 && !timerRunning && (
              <button
                onClick={() => setTimerSeconds(0)}
                className="rounded-xl px-2 py-1.5 text-[10px] text-slate-500 hover:text-white border border-white/8 bg-white/3 hover:bg-white/8 transition-colors"
                title="Reset timer"
              >
                ↺
              </button>
            )}
          </div>
        )}

        {onToggle && (
          <div className="flex gap-2">
            <button onClick={() => onToggle(task)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all
                ${isDone
                  ? 'bg-white/5 text-slate-400 hover:bg-white/8 border border-white/8'
                  : 'bg-white/5 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
                }`}
            >
              {isDone ? '↩ Reopen' : task.recurrence ? '⏭ Skip' : '✓ Mark as Done'}
            </button>
            {task.recurrence && !isDone && onEdit && (
              <button
                onClick={() => onEdit(task, { recurrence_paused: !task.recurrence_paused })}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
                  task.recurrence_paused
                    ? 'text-violet-400 border-violet-500/20 bg-violet-500/10 hover:bg-violet-500/20'
                    : 'text-slate-400 border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                title={task.recurrence_paused ? 'Resume recurrence' : 'Pause recurrence'}
              >
                {task.recurrence_paused ? '▶' : '⏸'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
