'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { Task } from '@/types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const typeColors: Record<Task['type'], string> = {
  task: 'bg-violet-500',
  event: 'bg-cyan-500',
  reminder: 'bg-pink-500',
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [today] = useState(new Date())
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      fetch('/api/tasks').then(r => r.json()).then((data: Task[]) => {
        if (Array.isArray(data)) setTasks(data.filter(t => t.date))
      }).catch(() => null).finally(() => setLoading(false))
    })
  }, [router])

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Monday-based week offset
  const startOffset = (firstDay.getDay() + 6) % 7
  const totalCells = startOffset + lastDay.getDate()
  const cells = Math.ceil(totalCells / 7) * 7

  function tasksByDate(dateStr: string) {
    return tasks.filter(t => t.date === dateStr)
  }

  function toDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  const selectedTasks = selected ? tasksByDate(selected) : []

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="h-8 w-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Calendar</h1>
          <p className="mt-1 text-sm text-slate-400">{tasks.length} task{tasks.length !== 1 ? 's' : ''} with dates</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="glass rounded-xl p-2 border border-white/8 hover:bg-white/10 transition-colors">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-lg font-bold text-white min-w-[160px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="glass rounded-xl p-2 border border-white/8 hover:bg-white/10 transition-colors">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="glass inner-highlight rounded-2xl border border-white/5 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {DAYS.map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: cells }).map((_, i) => {
            const dayNum = i - startOffset + 1
            const isCurrentMonth = dayNum >= 1 && dayNum <= lastDay.getDate()
            const dateStr = isCurrentMonth ? toDateStr(year, month, dayNum) : ''
            const dayTasks = dateStr ? tasksByDate(dateStr) : []
            const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
            const isSelected = dateStr === selected

            return (
              <div
                key={i}
                onClick={() => isCurrentMonth && setSelected(isSelected ? null : dateStr)}
                className={`min-h-[80px] p-2 border-b border-r border-white/5 transition-colors
                  ${isCurrentMonth ? 'cursor-pointer hover:bg-white/5' : 'opacity-20 pointer-events-none'}
                  ${isSelected ? 'bg-violet-500/10' : ''}
                `}
              >
                {isCurrentMonth && (
                  <>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1
                      ${isToday ? 'bg-gradient-to-br from-violet-600 to-cyan-500 text-white' : 'text-slate-400'}
                    `}>
                      {dayNum}
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 2).map(t => (
                        <div key={t.id} className={`flex items-center gap-1 rounded px-1 py-0.5 ${typeColors[t.type]} bg-opacity-20`}>
                          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${typeColors[t.type]}`} />
                          <span className="text-[10px] text-white truncate leading-tight">{t.title}</span>
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <p className="text-[10px] text-slate-500 pl-1">+{dayTasks.length - 2} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day panel */}
      {selected && selectedTasks.length > 0 && (
        <div className="glass inner-highlight rounded-2xl border border-violet-500/20 p-6 space-y-4 animate-fade-up">
          <div className="flex items-center justify-between">
            <p className="font-bold text-white">
              {new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {selectedTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/3 px-4 py-3">
                <div className={`h-2 w-2 rounded-full shrink-0 ${typeColors[t.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${t.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                    {t.title}
                  </p>
                  {t.time && <p className="text-xs text-slate-500">🕐 {t.time}</p>}
                  {t.location && <p className="text-xs text-slate-500">📍 {t.location}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold
                  ${t.status === 'done' ? 'border-emerald-500/30 text-emerald-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && selectedTasks.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm animate-fade-up">
          No tasks on this day.
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" />Task</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-500" />Event</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pink-500" />Reminder</span>
      </div>
    </div>
  )
}
