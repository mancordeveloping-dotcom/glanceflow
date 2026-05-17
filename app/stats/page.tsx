'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
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

export default function StatsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      Promise.all([
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/expenses').then(r => r.json()),
      ]).then(([t, e]: [Task[], Expense[]]) => {
        if (Array.isArray(t)) setTasks(t)
        if (Array.isArray(e)) setExpenses(e)
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total tasks', value: tasks.length, color: 'text-white' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, color: 'text-emerald-400' },
          { label: 'Completion rate', value: `${completionRate}%`, color: 'text-violet-400' },
          { label: 'Total spent', value: `€${totalSpent.toFixed(0)}`, color: 'text-cyan-400' },
        ].map((k, i) => (
          <div key={i} className="glass inner-highlight rounded-2xl p-5 text-center space-y-1 border border-white/5">
            <p className={`text-3xl font-extrabold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500">{k.label}</p>
          </div>
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
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white">Tasks by type</p>
          <DonutChart segments={typeSegments} />
        </div>
        <div className="glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4">
          <p className="font-bold text-white">Tasks by status</p>
          <DonutChart segments={statusSegments} />
        </div>
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
