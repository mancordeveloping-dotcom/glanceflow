'use client'

import { useEffect, useState } from 'react'

interface GamData {
  streak_days: number
  total_done: number
  badges: string[]
}

const ALL_BADGES = [
  { id: 'first_task', label: 'First Task', icon: '⭐' },
  { id: 'tasks_10',   label: '10 Tasks',   icon: '🏆' },
  { id: 'tasks_50',   label: '50 Tasks',   icon: '💎' },
  { id: 'streak_3',   label: '3-Day Streak', icon: '🔥' },
  { id: 'streak_7',   label: '7-Day Streak', icon: '⚡' },
]

export default function GamificationWidget() {
  const [data, setData] = useState<GamData | null>(null)

  useEffect(() => {
    fetch('/api/gamification')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setData(d))
      .catch(() => null)
  }, [])

  if (!data) return (
    <div className="h-16 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
  )

  return (
    <div className="glass rounded-2xl border border-white/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
      {/* Streak */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{data.streak_days > 0 ? '🔥' : '💤'}</span>
        <div>
          <p className="text-sm font-extrabold text-white">
            {data.streak_days > 0 ? `${data.streak_days} day streak` : 'Start your streak!'}
          </p>
          <p className="text-xs text-slate-500">Complete a task today to keep it going</p>
        </div>
      </div>

      {/* Total done */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <span className="text-base">✅</span>
        </div>
        <div>
          <p className="text-sm font-extrabold text-white">{data.total_done}</p>
          <p className="text-xs text-slate-500">tasks done</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        {ALL_BADGES.map(b => {
          const earned = data.badges.includes(b.id)
          return (
            <div
              key={b.id}
              title={b.label}
              className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm transition-all
                ${earned
                  ? 'bg-violet-500/20 border border-violet-500/40 shadow-sm shadow-violet-500/20'
                  : 'bg-white/3 border border-white/8 opacity-30 grayscale'
                }`}
            >
              {b.icon}
            </div>
          )
        })}
      </div>
    </div>
  )
}
