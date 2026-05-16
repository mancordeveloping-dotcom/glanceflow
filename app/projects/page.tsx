'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useToast } from '@/components/Toast'
import type { Project, Task } from '@/types'

const COLORS = [
  '#7c3aed', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6',
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
      ]).then(([proj, tasks]: [Project[], Task[]]) => {
        setProjects(proj)
        const counts: Record<string, number> = {}
        if (Array.isArray(tasks)) {
          tasks.forEach(t => {
            if (t.project_id) counts[t.project_id] = (counts[t.project_id] ?? 0) + 1
          })
        }
        setTaskCounts(counts)
      }).catch(() => null).finally(() => setLoading(false))
    })
  }, [router])

  async function handleCreate() {
    if (!newName.trim()) return
    setCreating(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), color: newColor }),
    })
    const data = await res.json() as Project
    if (res.ok) {
      setProjects(p => [...p, data])
      setNewName('')
      setNewColor(COLORS[0])
      setShowForm(false)
      toast('Progetto creato!', 'success')
    } else {
      toast('Errore creazione progetto', 'error')
    }
    setCreating(false)
  }

  async function handleDelete(project: Project) {
    setProjects(p => p.filter(x => x.id !== project.id))
    const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
    if (!res.ok) {
      setProjects(p => [...p, project])
      toast('Errore eliminazione', 'error')
    } else {
      toast('Progetto eliminato', 'info')
    }
  }

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-400">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white"
        >
          + New Project
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="glass inner-highlight rounded-2xl p-6 border border-violet-500/30 space-y-4 animate-fade-up">
          <p className="text-sm font-bold text-violet-300 uppercase tracking-widest">New Project</p>
          <div className="space-y-3">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Project name (e.g. Work, Home, Gym)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400">Color</p>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`h-8 w-8 rounded-full transition-all ${newColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="flex-1 shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              {creating ? 'Creating…' : 'Create Project'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects grid */}
      {projects.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-violet-500/20 bg-violet-500/5 py-24 text-center space-y-4">
          <div className="rounded-full bg-violet-500/10 border border-violet-500/20 p-5 text-4xl">📁</div>
          <div>
            <p className="font-bold text-white">No projects yet</p>
            <p className="mt-1 text-sm text-slate-500">Create a project to organize your tasks.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="card-3d glass inner-highlight rounded-2xl p-6 border border-white/5 space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: project.color + '22', border: `1px solid ${project.color}44` }}>
                    📁
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{project.name}</h3>
                    <p className="text-xs text-slate-500">{taskCounts[project.id] ?? 0} task{(taskCounts[project.id] ?? 0) !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(project)}
                  className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="h-1 rounded-full" style={{ backgroundColor: project.color + '33' }}>
                <div className="h-full rounded-full transition-all" style={{ backgroundColor: project.color, width: taskCounts[project.id] ? '60%' : '0%' }} />
              </div>

              <p className="text-xs text-slate-500">
                Created {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
