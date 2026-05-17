'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useTaskStore } from '@/store/taskStore'
import { useToast } from '@/components/Toast'
import TaskCard from '@/components/TaskCard'
import NotificationManager from '@/components/NotificationManager'
import type { Task, Project } from '@/types'

interface UsageData {
  used: number
  limit: number
  isPremium: boolean
  remaining: number | null
}

type StatusFilter = 'all' | 'pending' | 'done'
type TypeFilter = 'all' | 'task' | 'event' | 'reminder'

export default function DashboardPage() {
  const { tasks, setTasks, updateTask, removeTask } = useTaskStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [upgraded, setUpgraded] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === 'true') {
      setUpgraded(true)
      fetch('/api/stripe/sync', { method: 'POST' }).catch(() => null)
      window.history.replaceState({}, '', '/dashboard')
    }
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      Promise.all([
        fetch('/api/tasks').then((r) => r.json()),
        fetch('/api/usage').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
      ]).then(([tasksData, usageData, projectsData]: [Task[] | { error: string }, UsageData | { error: string }, Project[]]) => {
        if (Array.isArray(tasksData)) setTasks(tasksData)
        else setError((tasksData as { error: string }).error)
        if ('used' in usageData) setUsage(usageData as UsageData)
        if (Array.isArray(projectsData)) setProjects(projectsData)
      }).catch(() => setError('Could not load data'))
        .finally(() => setLoading(false))
    })
  }, [router, setTasks])

  async function handleToggle(task: Task) {
    const nextStatus = task.status === 'done' ? 'pending' : 'done'
    updateTask(task.id, { status: nextStatus })
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    if (!res.ok) {
      updateTask(task.id, { status: task.status })
      toast('Errore aggiornamento task', 'error')
    } else {
      toast(nextStatus === 'done' ? 'Task completato!' : 'Task riaperto', nextStatus === 'done' ? 'success' : 'info')
    }
  }

  async function handleDelete(task: Task) {
    removeTask(task.id)
    const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
    if (!res.ok) {
      setTasks([...tasks, task])
      toast('Errore eliminazione task', 'error')
    } else {
      toast('Task eliminato', 'info')
    }
  }

  async function handleEdit(task: Task, updates: Partial<Task>) {
    updateTask(task.id, updates)
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      updateTask(task.id, { title: task.title, date: task.date, time: task.time, location: task.location, type: task.type })
      toast('Errore modifica task', 'error')
    } else {
      toast('Task aggiornato!', 'success')
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url } = await res.json() as { url: string }
      window.location.href = url
    } catch {
      setPortalLoading(false)
      toast('Errore apertura portale', 'error')
    }
  }

  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (projectFilter !== 'all' && t.project_id !== projectFilter) return false
    return true
  })

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'done', label: 'Done' },
  ]

  const typeFilters: { key: TypeFilter; label: string }[] = [
    { key: 'all', label: 'All types' },
    { key: 'task', label: 'Task' },
    { key: 'event', label: 'Event' },
    { key: 'reminder', label: 'Reminder' },
  ]

  return (
    <div className="space-y-8">
      <NotificationManager tasks={tasks} />
      {upgraded && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-emerald-300">Welcome to Premium!</p>
            <p className="text-sm text-emerald-400">Unlimited screenshots are now unlocked.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            {loading ? 'Loading…' : tasks.length === 0
              ? 'No tasks yet — upload a screenshot to get started.'
              : `${tasks.length} task${tasks.length === 1 ? '' : 's'} total`}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {usage?.isPremium ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                ✦ Premium
              </span>
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                {portalLoading ? 'Loading…' : 'Manage subscription'}
              </button>
            </div>
          ) : usage && (
            <div className="glass rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 border border-white/5">
              <span className="font-bold text-violet-400">{usage.remaining}</span>/{usage.limit} left today
              <Link href="/pricing" className="ml-2 text-violet-400 font-semibold hover:text-violet-300">Upgrade →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: tasks.length, color: 'text-white' },
            { label: 'Pending', value: pendingCount, color: 'text-yellow-400' },
            { label: 'Done', value: doneCount, color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="glass inner-highlight rounded-2xl p-4 text-center space-y-1 border border-white/5">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {!loading && tasks.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status filters */}
          <div className="flex rounded-xl border border-white/8 bg-white/3 p-1 gap-1">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
                  ${statusFilter === f.key
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/10" />

          {/* Type filters */}
          <div className="flex rounded-xl border border-white/8 bg-white/3 p-1 gap-1">
            {typeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
                  ${typeFilter === f.key
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-slate-500 hover:text-white'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Project filter */}
          {projects.length > 0 && (
            <>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex rounded-xl border border-white/8 bg-white/3 p-1 gap-1">
                <button onClick={() => setProjectFilter('all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${projectFilter === 'all' ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-white'}`}>
                  All projects
                </button>
                {projects.map(p => (
                  <button key={p.id} onClick={() => setProjectFilter(p.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${projectFilter === p.id ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-white'}`}>
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Active filter count */}
          {filtered.length !== tasks.length && (
            <span className="text-xs text-slate-500">
              {filtered.length} di {tasks.length} task
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-24">
          <svg className="h-8 w-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {!loading && tasks.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-violet-500/20 bg-violet-500/5 py-24 text-center space-y-4">
          <div className="rounded-full bg-violet-500/10 border border-violet-500/20 p-5">
            <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white">No tasks yet</p>
            <p className="mt-1 text-sm text-slate-500">Upload a screenshot to generate your first tasks.</p>
          </div>
          <Link href="/" className="shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white">
            Upload a screenshot →
          </Link>
        </div>
      )}

      {!loading && filtered.length === 0 && tasks.length > 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-slate-400 font-semibold">Nessun task corrisponde ai filtri.</p>
          <button onClick={() => { setStatusFilter('all'); setTypeFilter('all') }} className="text-sm text-violet-400 hover:text-violet-300">
            Rimuovi filtri →
          </button>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} projects={projects} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
