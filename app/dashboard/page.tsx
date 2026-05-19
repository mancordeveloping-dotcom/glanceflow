'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useTaskStore } from '@/store/taskStore'
import { useToast } from '@/components/Toast'
import TaskCard from '@/components/TaskCard'
import TaskCardSkeleton from '@/components/TaskCardSkeleton'
import PomodoroTimer from '@/components/PomodoroTimer'
import NotificationManager from '@/components/NotificationManager'
import GamificationWidget from '@/components/GamificationWidget'
import TemplateModal from '@/components/TemplateModal'
import PWAInstallBanner from '@/components/PWAInstallBanner'
import CalendarView from '@/components/CalendarView'
import AIChat from '@/components/AIChat'
import type { Task, Project, ParsedTask } from '@/types'

type SortBy = 'priority' | 'date_asc' | 'date_desc' | 'created' | 'title'
type ViewMode = 'list' | 'calendar'

const PRIORITY_RANK: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

function triggerConfetti() {
  const colors = ['#7c3aed', '#06b6d4', '#f472b6', '#fbbf24', '#34d399']
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden'
  document.body.appendChild(container)
  for (let i = 0; i < 55; i++) {
    const el = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    const x = 20 + Math.random() * 60
    const size = Math.random() * 9 + 4
    const delay = Math.random() * 0.6
    const dur = Math.random() * 2 + 1.8
    el.style.cssText = `position:absolute;left:${x}%;top:-12px;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random()>0.5?'50%':'3px'};animation:confetti-fall ${dur}s ${delay}s ease-in forwards;`
    container.appendChild(el)
  }
  setTimeout(() => container.remove(), 4000)
}

function exportCSV(tasks: Task[]) {
  const header = 'Title,Status,Type,Priority,Date,Time,Location,Recurrence,Created'
  const rows = tasks.map(t =>
    [t.title, t.status, t.type, t.priority ?? '', t.date ?? '', t.time ?? '', t.location ?? '', t.recurrence ?? '', t.created_at.split('T')[0]]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  const csv = [header, ...rows].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `glanceflow-tasks-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}

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
  const [search, setSearch] = useState('')
  const [historyLimited, setHistoryLimited] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summarySent, setSummarySent] = useState(false)
  const [dragOrder, setDragOrder] = useState<Task[] | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('priority')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
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
        fetch('/api/tasks').then((r) => r.json()) as Promise<{ tasks: Task[]; historyLimited: boolean } | Task[]>,
        fetch('/api/usage').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
      ]).then(([tasksData, usageData, projectsData]) => {
        if (tasksData && 'tasks' in tasksData && Array.isArray(tasksData.tasks)) {
          setTasks(tasksData.tasks)
          setHistoryLimited(tasksData.historyLimited ?? false)
        } else if (Array.isArray(tasksData)) {
          setTasks(tasksData as Task[])
        } else if (tasksData && 'error' in tasksData) {
          setError((tasksData as { error: string }).error)
        }
        if ('used' in usageData) setUsage(usageData as UsageData)
        if (Array.isArray(projectsData)) setProjects(projectsData)
      }).catch(() => setError('Could not load data'))
        .finally(() => setLoading(false))
    })
  }, [router, setTasks])

  useEffect(() => { setDragOrder(null) }, [statusFilter, typeFilter, projectFilter, search])

  async function handleToggle(task: Task) {
    const nextStatus = task.status === 'done' ? 'pending' : 'done'
    if (nextStatus === 'done') triggerConfetti()
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

  async function handleAddTemplates(templateTasks: ParsedTask[]) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: templateTasks }),
    })
    if (res.ok) {
      const newTasks = await res.json() as Task[]
      setTasks([...newTasks, ...tasks])
      toast(`${templateTasks.length} task aggiunti!`, 'success')
    } else {
      toast('Errore aggiunta template', 'error')
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function selectAll() {
    setSelectedIds(displayTasks.map(t => t.id))
  }

  async function bulkMarkDone() {
    const ids = [...selectedIds]
    setSelectedIds([])
    await Promise.all(ids.map(id => {
      updateTask(id, { status: 'done' })
      return fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'done' }) })
    }))
    triggerConfetti()
    toast(`${ids.length} task completati!`, 'success')
  }

  async function bulkDelete() {
    const ids = [...selectedIds]
    setSelectedIds([])
    await Promise.all(ids.map(id => {
      removeTask(id)
      return fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    }))
    toast(`${ids.length} task eliminati`, 'info')
  }

  async function handleSummary() {
    setSummaryLoading(true)
    const res = await fetch('/api/summary', { method: 'POST' })
    setSummaryLoading(false)
    if (res.ok) setSummarySent(true)
    else toast('Errore invio summary', 'error')
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

  const filtered = tasks
    .filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (projectFilter !== 'all' && t.project_id !== projectFilter) return false
      if (search.trim() && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const pa = a.priority ? PRIORITY_RANK[a.priority] : 99
        const pb = b.priority ? PRIORITY_RANK[b.priority] : 99
        return pa - pb
      }
      if (sortBy === 'date_asc') return (a.date ?? '9999') > (b.date ?? '9999') ? 1 : -1
      if (sortBy === 'date_desc') return (a.date ?? '') < (b.date ?? '') ? 1 : -1
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      // created (default newest first)
      return a.created_at < b.created_at ? 1 : -1
    })

  const displayTasks = dragOrder ?? filtered

  const todayStr = new Date().toISOString().split('T')[0]
  const dueTodayTasks = tasks.filter(t => t.date === todayStr && t.status === 'pending')

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
      <PWAInstallBanner />
      <TemplateModal open={templateOpen} onClose={() => setTemplateOpen(false)} onAdd={handleAddTemplates} />
      <NotificationManager tasks={tasks} />
      <PomodoroTimer />
      {/* History limited banner */}
      {historyLimited && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-300">
            📜 Showing tasks from the <span className="font-bold">last 30 days</span>. Upgrade to Premium for full history.
          </p>
          <a href="/pricing" className="shrink-0 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors">Upgrade →</a>
        </div>
      )}

      {/* AI Summary */}
      {usage?.isPremium && !summarySent && (
        <div className="flex justify-end">
          <button onClick={handleSummary} disabled={summaryLoading}
            className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-300 hover:bg-violet-500/20 transition-colors disabled:opacity-50">
            {summaryLoading ? '⏳ Generating…' : '📬 Send AI Summary to email'}
          </button>
        </div>
      )}
      {summarySent && (
        <div className="flex justify-end">
          <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400">
            ✓ Summary sent to your email!
          </span>
        </div>
      )}

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

        {/* Search + Export */}
        {!loading && tasks.length > 0 && (
          <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplateOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 transition-colors"
          >
            📋 Templates
          </button>
          {/* View mode toggle */}
          <div className="flex rounded-xl border border-white/10 bg-white/3 p-1 gap-1">
            <button onClick={() => setViewMode('list')}
              className={`rounded-lg px-2.5 py-1.5 text-xs transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
              title="List view">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <button onClick={() => setViewMode('calendar')}
              className={`rounded-lg px-2.5 py-1.5 text-xs transition-all ${viewMode === 'calendar' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
              title="Calendar view">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </button>
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          >
            <option value="priority">↕ Priority</option>
            <option value="date_asc">📅 Date ↑</option>
            <option value="date_desc">📅 Date ↓</option>
            <option value="created">🕐 Newest</option>
            <option value="title">🔤 Title A-Z</option>
          </select>
          <button
            onClick={() => exportCSV(tasks)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
            title="Export as CSV"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-56 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:w-72 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          </div>
        )}

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
            <div key={s.label} className="glass inner-highlight neon-inner rounded-2xl p-4 text-center space-y-1 border border-white/5 card-lift cursor-default">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && tasks.length > 0 && <GamificationWidget />}

      {!loading && dueTodayTasks.length > 0 && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse shrink-0" />
            <p className="text-sm font-bold text-violet-300">
              {dueTodayTasks.length} task{dueTodayTasks.length > 1 ? 's' : ''} due today
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {dueTodayTasks.slice(0, 5).map(t => (
              <span key={t.id} className="flex items-center gap-1.5 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                {t.title}
              </span>
            ))}
            {dueTodayTasks.length > 5 && (
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-500">
                +{dueTodayTasks.length - 5} more
              </span>
            )}
          </div>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <TaskCardSkeleton key={i} />)}
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

      {!loading && displayTasks.length === 0 && tasks.length > 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-slate-400 font-semibold">Nessun task corrisponde ai filtri.</p>
          <button onClick={() => { setStatusFilter('all'); setTypeFilter('all') }} className="text-sm text-violet-400 hover:text-violet-300">
            Rimuovi filtri →
          </button>
        </div>
      )}

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-30 flex items-center justify-between gap-4 glass rounded-2xl border border-violet-500/30 px-5 py-3 shadow-2xl shadow-violet-900/40">
          <div className="flex items-center gap-3">
            <span className="h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-black shrink-0">{selectedIds.length}</span>
            <span className="text-sm font-bold text-white">{selectedIds.length} selected</span>
            <button onClick={selectAll} className="text-xs text-slate-500 hover:text-violet-300 transition-colors">Select all</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={bulkMarkDone}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors">
              ✓ Mark done
            </button>
            <button onClick={bulkDelete}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors">
              🗑 Delete
            </button>
            <button onClick={() => setSelectedIds([])}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Calendar view */}
      {!loading && viewMode === 'calendar' && (
        <div className="glass rounded-3xl border border-white/8 p-6">
          <CalendarView tasks={tasks} projects={projects} onToggle={handleToggle} onEdit={handleEdit} />
        </div>
      )}

      {/* List view */}
      {!loading && viewMode === 'list' && displayTasks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => { setDragId(task.id); setDragOrder(displayTasks) }}
              onDragEnd={() => { setDragId(null); setDragOverId(null) }}
              onDragOver={(e) => { e.preventDefault(); setDragOverId(task.id) }}
              onDrop={() => {
                if (!dragId || dragId === task.id) return
                const items = [...(dragOrder ?? filtered)]
                const from = items.findIndex(t => t.id === dragId)
                const to = items.findIndex(t => t.id === task.id)
                if (from === -1 || to === -1) return
                const [moved] = items.splice(from, 1)
                items.splice(to, 0, moved)
                setDragOrder(items)
                setDragOverId(null)
              }}
              className={`transition-all duration-200 rounded-2xl ${dragId === task.id ? 'opacity-40 scale-95' : ''} ${dragOverId === task.id && dragId !== task.id ? 'ring-2 ring-violet-500/60' : ''}`}
              style={{ cursor: dragId ? 'grabbing' : 'grab' }}
            >
              <TaskCard
                task={task}
                projects={projects}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
                selected={selectedIds.includes(task.id)}
                onSelect={toggleSelect}
              />
            </div>
          ))}
        </div>
      )}

      {/* AI Chat — floating */}
      <AIChat tasks={tasks} />
    </div>
  )
}
