import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import type { Metadata } from 'next'

const typeColors: Record<string, string> = {
  task:     'text-violet-400 bg-violet-500/10',
  event:    'text-cyan-400 bg-cyan-500/10',
  reminder: 'text-pink-400 bg-pink-500/10',
}

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-400 bg-red-500/10',       dot: 'bg-red-400' },
  high:   { label: 'High',   color: 'text-orange-400 bg-orange-500/10', dot: 'bg-orange-400' },
  medium: { label: 'Medium', color: 'text-yellow-400 bg-yellow-500/10', dot: 'bg-yellow-400' },
  low:    { label: 'Low',    color: 'text-slate-400 bg-slate-500/10',   dot: 'bg-slate-400' },
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const { data } = await supabaseAdmin.from('tasks').select('title').eq('share_token', token).single()
  return { title: data?.title ?? 'Shared Task' }
}

export default async function SharedTaskPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { data: task } = await supabaseAdmin
    .from('tasks')
    .select('title, description, date, time, location, type, priority, status')
    .eq('share_token', token)
    .single()

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
        <p className="text-4xl">🔗</p>
        <h1 className="text-xl font-bold text-white">Task not found</h1>
        <p className="text-sm text-slate-400">This link may have been removed or expired.</p>
        <Link href="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
          Go to GlanceFlow →
        </Link>
      </div>
    )
  }

  const pCfg = task.priority ? priorityConfig[task.priority] : null
  const typeColor = typeColors[task.type] ?? typeColors.task

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-widest">Shared task</p>
        <h1 className="text-2xl font-extrabold gradient-text">GlanceFlow</h1>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className={`px-4 py-2 flex items-center gap-2 ${typeColor}`}>
          <span className="text-xs font-bold tracking-wide capitalize">◆ {task.type}</span>
          {pCfg && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${pCfg.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pCfg.dot}`} />
              {pCfg.label}
            </span>
          )}
          {task.status === 'done' && (
            <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5">
              ✓ Done
            </span>
          )}
        </div>

        <div className="px-4 py-4 space-y-3">
          <p className={`font-semibold text-sm leading-snug ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-slate-500 leading-relaxed">{task.description}</p>
          )}

          {(task.date || task.time || task.location) && (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {task.date     && <span className="text-xs text-slate-500">📅 {task.date}</span>}
              {task.time     && <span className="text-xs text-slate-500">🕐 {task.time}</span>}
              {task.location && <span className="text-xs text-slate-500">📍 {task.location}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/5 p-6 text-center space-y-3">
        <p className="text-sm text-slate-400">Turn your screenshots into tasks with AI</p>
        <Link
          href="/login"
          className="block rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          Try GlanceFlow free →
        </Link>
      </div>
    </div>
  )
}
