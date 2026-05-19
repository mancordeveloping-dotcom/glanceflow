'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import Tilt3D from '@/components/Tilt3D'
import type { Task } from '@/types'

interface Expense {
  id: string
  amount: number
  category: string
  created_at: string
}

const categoryEmoji: Record<string, string> = {
  food: '🍕', transport: '🚗', shopping: '🛍️',
  entertainment: '🎬', health: '💊', utilities: '⚡', other: '📦',
}

const categoryColors: Record<string, string> = {
  food: '#f97316', transport: '#3b82f6', shopping: '#ec4899',
  entertainment: '#8b5cf6', health: '#10b981', utilities: '#eab308', other: '#64748b',
}

const typeColors: Record<string, string> = {
  task: '#7c3aed', event: '#06b6d4', reminder: '#ec4899',
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function getLast112Days() {
  return Array.from({ length: 112 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (111 - i))
    return d.toISOString().split('T')[0]
  })
}

function ActivityHeatmap({ tasks }: { tasks: Task[] }) {
  const days = getLast112Days()
  // Count completions per day
  const counts: Record<string, number> = {}
  tasks.forEach(t => {
    if (t.status === 'done' && t.updated_at) {
      const day = t.updated_at.split('T')[0]
      counts[day] = (counts[day] ?? 0) + 1
    }
  })
  const maxCount = Math.max(...Object.values(counts), 1)

  function getColor(count: number) {
    if (count === 0) return 'rgba(255,255,255,0.04)'
    const intensity = count / maxCount
    if (intensity < 0.25) return 'rgba(124,58,237,0.3)'
    if (intensity < 0.5)  return 'rgba(124,58,237,0.55)'
    if (intensity < 0.75) return 'rgba(124,58,237,0.8)'
    return 'rgba(139,92,246,1)'
  }

  // Group into weeks (columns of 7)
  const weeks: string[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const monthLabels: { label: string; col: number }[] = []
  weeks.forEach((week, wi) => {
    const firstDay = new Date(week[0] + 'T00:00:00')
    if (firstDay.getDate() <= 7) {
      monthLabels.push({ label: firstDay.toLocaleDateString('en', { month: 'short' }), col: wi })
    }
  })

  const totalDone = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-white">Activity — last 16 weeks</p>
        <span className="text-xs text-slate-500">{totalDone} tasks completed</span>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="relative inline-block">
          {/* Month labels */}
          <div className="flex gap-1 mb-1 pl-0" style={{ paddingLeft: 0 }}>
            {weeks.map((_, wi) => {
              const ml = monthLabels.find(m => m.col === wi)
              return (
                <div key={wi} className="w-3 text-[9px] text-slate-600 shrink-0">
                  {ml ? ml.label : ''}
                </div>
              )
            })}
          </div>
          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map(day => {
                  const count = counts[day] ?? 0
                  return (
                    <div
                      key={day}
                      title={`${day}: ${count} task${count !== 1 ? 's' : ''}`}
                      className="h-3 w-3 rounded-sm cursor-default transition-opacity hover:opacity-80"
                      style={{ backgroundColor: getColor(count) }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-2 justify-end">
            <span className="text-[10px] text-slate-600">Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map(v => (
              <div key={v} className="h-3 w-3 rounded-sm" style={{ backgroundColor: getColor(v * maxCount) }} />
            ))}
            <span className="text-[10px] text-slate-600">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  if (total === 0) return <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No data</div>

  let offset = 0
  const r = 60
  const circ = 2 * Math.PI * r

  return (
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
        {segments.map((seg, i) => {
          const pct = seg.value / total
          const dash = pct * circ
          const gap = circ - dash
          const rotate = offset * 360 - 90
          offset += pct
          return (
            <circle
              key={i}
              cx="70" cy="70" r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={0}
              transform={`rotate(${rotate} 70 70)`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )
        })}
        <text x="70" y="70" textAnchor="middle" dy="0.35em" fill="white" fontSize="18" fontWeight="bold">{total}</text>
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-400">{seg.label}</span>
            <span className="font-bold text-white ml-auto pl-4">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ bars }: { bars: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...bars.map(b => b.value), 1)
  return (
    <div className="flex items-end gap-2 h-32">
      {bars.map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-white">{bar.value > 0 ? bar.value : ''}</span>
          <div className="w-full rounded-t-lg transition-all" style={{
            height: `${(bar.value / max) * 96}px`,
            minHeight: bar.value > 0 ? '4px' : '2px',
            background: bar.color ?? 'linear-gradient(to top, #7c3aed, #06b6d4)',
            opacity: bar.value > 0 ? 1 : 0.2,
          }} />
          <span className="text-[10px] text-slate-500">{bar.label}</span>
        </div>
      ))}
    </div>
  )
}

interface GamifData { streak_days: number; total_done: number; badges: string[] }

export default function StatsPage() {
  const [tasks, setTasks]       = useState<Task[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [gamif, setGamif]       = useState<GamifData | null>(null)
  const [loading, setLoading]   = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      Promise.all([
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/expenses').then(r => r.json()),
        fetch('/api/gamification').then(r => r.json()),
      ]).then(([t, e, g]) => {
        const tasksArr = t?.tasks ?? (Array.isArray(t) ? t : [])
        setTasks(tasksArr)
        if (Array.isArray(e)) setExpenses(e)
        if (g && !g.error) setGamif(g as GamifData)
      }).finally(() => setLoading(false))
    })
  }, [router])

  const days = getLast7Days()
  const dayNames = days.map(d => new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' }))

  const completedPerDay = days.map(day =>
    tasks.filter(t => t.status === 'done' && t.updated_at?.startsWith(day)).length
  )

  const createdPerDay = days.map(day =>
    tasks.filter(t => t.created_at?.startsWith(day)).length
  )

  const typeSegments = ['task', 'event', 'reminder'].map(type => ({
    value: tasks.filter(t => t.type === type).length,
    color: typeColors[type],
    label: type.charAt(0).toUpperCase() + type.slice(1),
  })).filter(s => s.value > 0)

  const statusSegments = [
    { value: tasks.filter(t => t.status === 'pending').length, color: '#eab308', label: 'Pending' },
    { value: tasks.filter(t => t.status === 'done').length, color: '#10b981', label: 'Done' },
  ].filter(s => s.value > 0)

  const expenseByCategory = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount)
      return acc
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0
  const todayStr = new Date().toISOString().split('T')[0]
  const overdueCount = tasks.filter(t => t.status === 'pending' && t.date && t.date < todayStr).length

  const prioritySegments = [
    { value: tasks.filter(t => t.priority === 'urgent').length, color: '#ef4444', label: 'Urgent' },
    { value: tasks.filter(t => t.priority === 'high').length,   color: '#f97316', label: 'High' },
    { value: tasks.filter(t => t.priority === 'medium').length, color: '#eab308', label: 'Medium' },
    { value: tasks.filter(t => t.priority === 'low').length,    color: '#64748b', label: 'Low' },
  ].filter(s => s.value > 0)

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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white">Statistics</h1>
        <p className="mt-1 text-sm text-slate-400">Your productivity at a glance</p>
      </div>

      {/* Gamification strip */}
      {gamif && (
        <div className="glass rounded-2xl border border-violet-500/15 px-6 py-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-2xl font-black text-white">{gamif.streak_days}</p>
              <p className="text-xs text-slate-500">Day streak</p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/8 hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-2xl font-black text-emerald-400">{gamif.total_done}</p>
              <p className="text-xs text-slate-500">All-time done</p>
            </div>
          </div>
          {gamif.badges.length > 0 && (
            <>
              <div className="h-10 w-px bg-white/8 hidden sm:block" />
              <div className="flex items-center gap-2 flex-wrap">
                {gamif.badges.map(b => (
                  <span key={b} className="rounded-full bg-violet-500/15 border border-violet-500/25 px-3 py-1 text-xs font-bold text-violet-300">
                    {b === 'first_task' ? '⭐ First Task' : b === 'tasks_10' ? '🏆 10 Tasks' : b === 'tasks_50' ? '💎 50 Tasks' : b === 'streak_3' ? '🔥 3-Day Streak' : b === 'streak_7' ? '⚡ 7-Day Streak' : b}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total tasks',      value: tasks.length,                                     color: 'text-white',        icon: '🗂' },
          { label: 'Completed',        value: tasks.filter(t => t.status === 'done').length,    color: 'text-emerald-400',  icon: '✅' },
          { label: 'Completion rate',  value: `${completionRate}%`,                             color: 'text-violet-400',   icon: '📈' },
          { label: 'Overdue',          value: overdueCount,                                     color: overdueCount > 0 ? 'text-red-400' : 'text-slate-400', icon: '⚠️' },
        ].map((k, i) => (
          <Tilt3D key={i} intensity={8} className="glass holographic inner-highlight rounded-2xl p-5 text-center space-y-1 border border-white/5">
            <div className="text-xl mb-1 depth-sm">{k.icon}</div>
            <p className={`text-3xl font-extrabold ${k.color} depth-md`}>{k.value}</p>
            <p className="text-xs text-slate-500">{k.label}</p>
          </Tilt3D>
        ))}
      </div>

      {/* Weekly charts */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white">Tasks completed — last 7 days</p>
          <BarChart bars={dayNames.map((label, i) => ({ label, value: completedPerDay[i] }))} />
        </div>
        <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white">Tasks created — last 7 days</p>
          <BarChart bars={dayNames.map((label, i) => ({ label, value: createdPerDay[i], color: 'linear-gradient(to top, #06b6d4, #a78bfa)' }))} />
        </div>
      </div>

      {/* Donut charts */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Tilt3D intensity={6} className="glass holographic inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white text-sm depth-xs">By type</p>
          <div className="depth-sm"><DonutChart segments={typeSegments} /></div>
        </Tilt3D>
        <Tilt3D intensity={6} className="glass holographic inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white text-sm depth-xs">By status</p>
          <div className="depth-sm"><DonutChart segments={statusSegments} /></div>
        </Tilt3D>
        <Tilt3D intensity={6} className="glass holographic inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white text-sm depth-xs">By priority</p>
          <div className="depth-sm"><DonutChart segments={prioritySegments} /></div>
        </Tilt3D>
      </div>

      {/* Activity heatmap */}
      <div className="glass inner-highlight rounded-2xl p-6 border border-white/5">
        <ActivityHeatmap tasks={tasks} />
      </div>

      {/* Expenses breakdown */}
      {expenses.length > 0 && (
        <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white">Expenses by category</p>
          <div className="space-y-3">
            {expenseByCategory.map(([cat, amount]) => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{categoryEmoji[cat] ?? '📦'} {cat}</span>
                  <span className="font-bold text-white">€{amount.toFixed(2)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(amount / totalSpent) * 100}%`,
                      backgroundColor: categoryColors[cat] ?? '#64748b',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
