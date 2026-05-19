'use client'

import { useState } from 'react'
import type { Task, Project } from '@/types'

interface CalendarViewProps {
  tasks: Task[]
  projects: Project[]
  onToggle: (task: Task) => void
  onEdit: (task: Task, updates: Partial<Task>) => Promise<void>
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const TYPE_COLOR: Record<string, string> = {
  task:     'bg-violet-500/80',
  event:    'bg-cyan-500/80',
  reminder: 'bg-pink-500/80',
}

const PRIORITY_DOT: Record<string, string> = {
  urgent: 'bg-red-400',
  high:   'bg-orange-400',
  medium: 'bg-yellow-400',
  low:    'bg-slate-400',
}

export default function CalendarView({ tasks, projects, onToggle }: CalendarViewProps) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)

  // Build calendar grid
  const firstDay = new Date(year, month, 1)
  // Monday-based: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(totalCells - startOffset - daysInMonth).fill(null),
  ]

  const todayStr = today.toISOString().split('T')[0]

  function cellDate(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function tasksForDay(day: number) {
    const d = cellDate(day)
    return tasks.filter(t => t.date === d)
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const selectedTasks = selected ? tasks.filter(t => t.date === selected) : []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">{MONTHS[month]} {year}</h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth}
            className="rounded-xl border border-white/10 bg-white/5 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            ‹
          </button>
          <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); setSelected(todayStr) }}
            className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 h-8 text-xs font-bold text-violet-300 hover:bg-violet-500/20 transition-colors">
            Today
          </button>
          <button onClick={nextMonth}
            className="rounded-xl border border-white/10 bg-white/5 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            ›
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="min-h-[70px]" />
          const dateStr = cellDate(day)
          const dayTasks = tasksForDay(day)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selected
          const hasPending = dayTasks.some(t => t.status === 'pending')

          return (
            <button
              key={i}
              onClick={() => setSelected(isSelected ? null : dateStr)}
              className={`min-h-[70px] rounded-xl p-1.5 text-left transition-all duration-200 border
                ${isSelected ? 'border-violet-500/60 bg-violet-500/10' : isToday ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10'}`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={`text-xs font-bold leading-none ${isToday ? 'text-cyan-400' : isSelected ? 'text-violet-300' : 'text-slate-400'}`}>
                  {day}
                </span>
                {hasPending && (
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0 mt-0.5" style={{ boxShadow: '0 0 4px rgba(139,92,246,0.8)' }} />
                )}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-1 overflow-hidden">
                    {t.priority && (
                      <span className={`shrink-0 h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[t.priority]}`} />
                    )}
                    <div className={`rounded px-1 py-0.5 text-[9px] font-medium leading-tight truncate ${TYPE_COLOR[t.type]} text-white ${t.status === 'done' ? 'opacity-40 line-through' : ''}`}>
                      {t.title}
                    </div>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-slate-500 pl-1">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected day panel */}
      {selected && (
        <div className="glass rounded-2xl border border-white/8 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-white text-sm">
              {new Date(selected + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <span className="text-xs text-slate-500">{selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}</span>
          </div>

          {selectedTasks.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No tasks this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(t => {
                const proj = projects.find(p => p.id === t.project_id)
                return (
                  <div key={t.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${t.status === 'done' ? 'border-white/5 opacity-50' : 'border-white/8'}`}>
                    <button
                      onClick={() => onToggle(t)}
                      className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${t.status === 'done' ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/20 hover:border-violet-500'}`}
                    >
                      {t.status === 'done' && (
                        <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${t.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {t.time && <span className="text-[10px] text-slate-500">🕐 {t.time}</span>}
                        {t.priority && (
                          <span className={`flex items-center gap-1 text-[10px] font-bold ${
                            t.priority === 'urgent' ? 'text-red-400' :
                            t.priority === 'high' ? 'text-orange-400' :
                            t.priority === 'medium' ? 'text-yellow-400' : 'text-slate-400'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[t.priority]}`} />
                            {t.priority}
                          </span>
                        )}
                        {proj && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: proj.color }} />
                            {proj.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      t.type === 'task' ? 'bg-violet-500/20 text-violet-300' :
                      t.type === 'event' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-pink-500/20 text-pink-300'
                    }`}>{t.type}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
