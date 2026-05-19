'use client'

import { useEffect, useRef, useState } from 'react'
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
import QuickAdd from '@/components/QuickAdd'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
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
  isPro: boolean
  remaining: number | null
}

type StatusFilter = 'all' | 'pending' | 'done'
type TypeFilter = 'all' | 'task' | 'event' | 'reminder'

/* ── MoreMenu: ⋯ dropdown for secondary actions ── */
interface MoreMenuProps {
  onTemplates: () => void
  onCSV: () => void
  onPDF: () => void
  onSummary?: () => void
  summaryLoading?: boolean
  summarySent?: boolean
}

function MoreMenu({ onTemplates, onCSV, onPDF, onSummary, summaryLoading, summarySent }: MoreMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function action(fn: () => void) {
    fn()
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center justify-center rounded-xl border px-3 py-2 text-slate-400 transition-all ${
          open ? 'border-violet-500/40 bg-violet-500/10 text-violet-300' : 'border-white/10 bg-white/5 hover:text-white hover:border-white/20'
        }`}
        title="More actions"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 glass rounded-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
          <div className="py-1">
            <button
              onClick={() => action(onTemplates)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="text-base">📋</span>
              <span className="font-medium">Templates</span>
            </button>

            <div className="mx-3 my-1 h-px bg-white/5" />

            <button
              onClick={() => action(onCSV)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="text-base">📄</span>
              <span className="font-medium">Export CSV</span>
            </button>

            <button
              onClick={() => action(onPDF)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="text-base">🖨</span>
              <span className="font-medium">Export PDF</span>
            </button>

            {(onSummary || summarySent) && (
              <>
                <div className="mx-3 my-1 h-px bg-white/5" />
                {summarySent ? (
                  <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-400">
                    <span className="text-base">✓</span>
                    <span className="font-medium">Summary sent!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onSummary && action(onSummary)}
                    disabled={summaryLoading}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-violet-300 transition-colors disabled:opacity-50"
                  >
                    <span className="text-base">{summaryLoading ? '⏳' : '✨'}</span>
                    <span className="font-medium">{summaryLoading ? 'Sending…' : 'AI Summary'}</span>
                    <span className="ml-auto rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-bold text-violet-300">PRO</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

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
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
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

  const todayStr = new Date().toISOString().split('T')[0]
  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const doneCount = tasks.filter((t) => t.status === 'done').length
  const overdueCount = tasks.filter(t => t.status === 'pending' && t.date && t.date < todayStr).length

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
    <div className="space-y-5">
      <PWAInstallBanner />
      <TemplateModal open={templateOpen} onClose={() => setTemplateOpen(false)} onAdd={handleAddTemplates} />
      <NotificationManager tasks={tasks} />
      <PomodoroTimer />

      {/* ── Upgraded banner (one-time) ── */}
      {upgraded && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 flex items-center gap-3">
          <span className="text-xl">🎉</span>
          <p className="text-sm font-bold text-emerald-300">Welcome to Premium! Unlimited screenshots unlocked.</p>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          {!loading && tasks.length > 0 && (
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span><span className="font-bold text-white">{tasks.length}</span> tasks</span>
              <span className="h-3 w-px bg-white/10" />
              <span><span className="font-bold text-amber-400">{pendingCount}</span> pending</span>
              <span className="h-3 w-px bg-white/10" />
              <span><span className="font-bold text-emerald-400">{doneCount}</span> done</span>
              {overdueCount > 0 && (
                <>
                  <span className="h-3 w-px bg-white/10" />
                  <button
                    onClick={() => { setStatusFilter('pending'); setSortBy('date_asc') }}
                    className="flex items-center gap-1 text-red-400 font-bold hover:text-red-300 transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                    {overdueCount} overdue
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Plan badge */}
        {usage?.isPro ? (
          <button onClick={handlePortal} disabled={portalLoading}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity disabled:opacity-60">
            ✦ Pro
          </button>
        ) : usage?.isPremium ? (
          <button onClick={handlePortal} disabled={portalLoading}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity disabled:opacity-60">
            ✦ Premium
          </button>
        ) : usage ? (
          <Link href="/pricing"
            className="shrink-0 glass rounded-full px-3 py-1.5 text-xs font-medium text-slate-400 border border-white/8 hover:border-violet-500/30 transition-colors">
            <span className="font-bold text-violet-400">{usage.remaining}</span>/{usage.limit} · <span className="text-violet-400">Upgrade →</span>
          </Link>
        ) : null}
      </div>

      {/* ── Toolbar ── */}
      {!loading && tasks.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search — takes available space */}
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks… (/)"
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-8 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl border border-white/10 bg-white/3 p-1 gap-1 shrink-0">
            <button onClick={() => setViewMode('list')}
              className={`rounded-lg px-2.5 py-1.5 transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
              title="List view">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <button onClick={() => setViewMode('calendar')}
              className={`rounded-lg px-2.5 py-1.5 transition-all ${viewMode === 'calendar' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
              title="Calendar view">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="shrink-0 rounded-xl border border-white/10 bg-[#0d0d1a] px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          >
            <option value="priority">↕ Priority</option>
            <option value="date_asc">📅 Date ↑</option>
            <option value="date_desc">📅 Date ↓</option>
            <option value="created">🕐 Newest</option>
            <option value="title">🔤 A-Z</option>
          </select>

          {/* ⋯ More actions dropdown */}
          <MoreMenu
            onTemplates={() => setTemplateOpen(true)}
            onCSV={() => exportCSV(tasks)}
            onPDF={() => window.open('/dashboard/print', '_blank')}
            onSummary={usage?.isPremium && !summarySent ? handleSummary : undefined}
            summaryLoading={summaryLoading}
            summarySent={summarySent}
          />
        </div>
      )}

      {/* ── Gamification strip (compact) ── */}
      {!loading && tasks.length > 0 && <GamificationWidget />}

      {/* ── Filter chips ── */}
      {!loading && tasks.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status */}
          {statusFilters.map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all border ${
                statusFilter === f.key
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'border-white/8 bg-white/3 text-slate-500 hover:text-white hover:border-white/15'
              }`}>
              {f.label}
            </button>
          ))}

          <span className="h-4 w-px bg-white/10 shrink-0" />

          {/* Type */}
          {typeFilters.filter(f => f.key !== 'all').map(f => (
            <button key={f.key} onClick={() => setTypeFilter(typeFilter === f.key ? 'all' : f.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all border ${
                typeFilter === f.key
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'border-white/8 bg-white/3 text-slate-500 hover:text-white hover:border-white/15'
              }`}>
              {f.label}
            </button>
          ))}

          {/* Projects */}
          {projects.map(p => (
            <button key={p.id} onClick={() => setProjectFilter(projectFilter === p.id ? 'all' : p.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all border ${
                projectFilter === p.id
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/8 bg-white/3 text-slate-500 hover:text-white hover:border-white/15'
              }`}>
              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              {p.name}
            </button>
          ))}

          {/* Clear filters */}
          {(statusFilter !== 'all' || typeFilter !== 'all' || projectFilter !== 'all' || search) && (
            <button
              onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setProjectFilter('all'); setSearch('') }}
              className="rounded-full px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-300 border border-white/5 hover:border-white/15 transition-all"
            >
              ✕ Clear
            </button>
          )}

          {/* Result count */}
          {filtered.length !== tasks.length && (
            <span className="text-xs text-slate-600 ml-1">{filtered.length}/{tasks.length}</span>
          )}
        </div>
      )}

      {/* ── Today's tasks (compact inline) ── */}
      {!loading && dueTodayTasks.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap py-1">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest shrink-0">Today</span>
          {dueTodayTasks.slice(0, 4).map(t => (
            <span key={t.id} className="flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/8 px-2.5 py-1 text-[11px] font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
              {t.title}
            </span>
          ))}
          {dueTodayTasks.length > 4 && (
            <span className="text-[11px] text-slate-600">+{dueTodayTasks.length - 4} more</span>
          )}
        </div>
      )}

      {/* ── History limited notice (subtle) ── */}
      {historyLimited && (
        <p className="text-xs text-slate-600 flex items-center gap-1.5">
          <span>📜 Showing last 30 days.</span>
          <Link href="/pricing" className="text-violet-500 hover:text-violet-400 font-semibold transition-colors">Upgrade for full history →</Link>
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* ── Bulk action bar (sticky, only when selection active) ── */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-30 flex items-center justify-between gap-4 glass rounded-2xl border border-violet-500/30 px-4 py-2.5 shadow-2xl shadow-violet-900/40">
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">{selectedIds.length}</span>
            <span className="text-sm font-bold text-white">{selectedIds.length} selected</span>
            <button onClick={selectAll} className="text-xs text-slate-500 hover:text-violet-300 transition-colors">All</button>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={bulkMarkDone}
              className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors">
              ✓ Done
            </button>
            <button onClick={bulkDelete}
              className="flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors">
              🗑 Delete
            </button>
            <button onClick={() => setSelectedIds([])}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <TaskCardSkeleton key={i} />)}
        </div>
      )}

      {/* ── Empty state ── */}
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
          <p className="text-slate-400 font-semibold">No tasks match the filters.</p>
          <button onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setProjectFilter('all'); setSearch('') }}
            className="text-sm text-violet-400 hover:text-violet-300">
            Clear filters →
          </button>
        </div>
      )}

      {/* ── Calendar view ── */}
      {!loading && viewMode === 'calendar' && (
        <div className="glass rounded-3xl border border-white/8 p-6">
          <CalendarView tasks={tasks} projects={projects} onToggle={handleToggle} onEdit={handleEdit} />
        </div>
      )}

      {/* ── List view ── */}
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
                const to   = items.findIndex(t => t.id === task.id)
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

      {/* Floating: AI Chat + Quick Add + Keyboard shortcuts */}
      <AIChat tasks={tasks} />
      <QuickAdd
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onAdded={(task) => { setTasks([task, ...tasks]); toast('Task aggiunto!', 'success') }}
      />
      <KeyboardShortcuts
        onQuickAdd={() => setQuickAddOpen(true)}
        onToggleCalendar={() => setViewMode(v => v === 'calendar' ? 'list' : 'calendar')}
        onFocusSearch={() => searchRef.current?.focus()}
      />
    </div>
  )
}
