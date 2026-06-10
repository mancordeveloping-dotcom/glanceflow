'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useTaskStore } from '@/store/taskStore'
import PaywallModal from '@/components/PaywallModal'
import type { Task } from '@/types'

type UploadState = 'idle' | 'loading' | 'done' | 'error'

export default function UploadZone() {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Task[]>([])
  const [showPaywall, setShowPaywall] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addTask = useTaskStore((s) => s.addTask)
  const router = useRouter()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setState('idle')
    setError(null)
    setResults([])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (!dropped) return
    setFile(dropped)
    setPreview(URL.createObjectURL(dropped))
    setState('idle')
    setError(null)
    setResults([])
  }

  function handleReset() {
    setFile(null)
    setPreview(null)
    setState('idle')
    setError(null)
    setResults([])
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleProcess() {
    if (!file) return
    const { data: { user } } = await supabaseBrowser.auth.getUser()
    if (!user) { router.push('/login'); return }
    setState('loading')
    setError(null)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const processRes = await fetch('/api/process', { method: 'POST', body: formData })
      const processData = await processRes.json() as { tasks?: unknown[]; error?: string }
      if (processRes.status === 401) { router.push('/login'); return }
      if (processRes.status === 403 && processData.error === 'LIMIT_REACHED') {
        setShowPaywall(true); setState('idle'); return
      }
      if (!processRes.ok) throw new Error(processData.error ?? 'Failed to analyze image')
      if (!processData.tasks?.length) throw new Error('No tasks found in this screenshot.')
      const saveRes = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: processData.tasks }),
      })
      const saveData = await saveRes.json() as Task[] | { error: string }
      if (!saveRes.ok) throw new Error((saveData as { error: string }).error ?? 'Failed to save tasks')
      const saved = saveData as Task[]
      saved.forEach(addTask)
      setResults(saved)
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }

  const isLoading = state === 'loading'

  return (
    <>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      <div className="space-y-4">
        {/* Drop zone */}
        <div
          onClick={() => !isLoading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative w-full rounded-2xl p-8 flex flex-col items-center gap-4 transition-all duration-200 overflow-hidden
            ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${dragging ? 'scale-[1.02]' : ''}
          `}
          style={{
            background: dragging
              ? 'linear-gradient(#0e0a1f, #0e0a1f) padding-box, linear-gradient(135deg, rgba(124,58,237,0.9), rgba(6,182,212,0.9)) border-box'
              : 'linear-gradient(#0a0a16, #0a0a16) padding-box, linear-gradient(135deg, rgba(124,58,237,0.45), rgba(6,182,212,0.35)) border-box',
            border: '2px solid transparent',
          }}
        >
          {/* Glow pulse behind zone */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(124,58,237,0.12) 0%, transparent 70%)',
              opacity: dragging ? 1 : 0.6,
            }} />

          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />

          {preview ? (
            <img src={preview} alt="Preview" className="max-h-56 rounded-xl object-contain w-full relative z-10" />
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-4">
              {/* Icon */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.5))' }} />
                <div className="relative rounded-2xl p-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15))', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <svg className="h-8 w-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <div className="text-center space-y-1">
                <p className="font-bold text-white text-base">
                  {dragging ? 'Release to upload' : 'Drop any screenshot here'}
                </p>
                <p className="text-sm text-slate-400">
                  WhatsApp, email, notes — any image with text
                </p>
                <p className="text-xs text-slate-600 mt-1">PNG · JPG · WEBP · max 10MB</p>
              </div>

              {/* Or click pill */}
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-10 bg-white/10" />
                <span className="text-xs text-slate-500 font-medium">or click to browse</span>
                <div className="h-px w-10 bg-white/10" />
              </div>
            </div>
          )}
        </div>

        {file && state !== 'done' && (
          <div className="flex gap-3">
            <button
              onClick={handleProcess}
              disabled={isLoading}
              className="flex-1 shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing with AI…
                </>
              ) : '⚡ Extract Tasks with AI'}
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/10 disabled:opacity-40 transition-colors"
            >
              Reset
            </button>
          </div>
        )}

        {state === 'error' && error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {state === 'done' && results.length > 0 && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 space-y-3">
            <p className="text-sm font-bold text-emerald-400">
              ✓ {results.length} task{results.length === 1 ? '' : 's'} extracted and saved!
            </p>
            <ul className="space-y-1.5">
              {results.map((t) => (
                <li key={t.id} className="text-sm text-emerald-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />{t.title}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 pt-1">
              <button onClick={handleReset} className="text-sm text-emerald-400 font-medium underline hover:no-underline">
                Upload another →
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'GlanceFlow', text: `I just extracted ${results.length} task${results.length === 1 ? '' : 's'} from a screenshot in seconds!`, url: window.location.origin })
                  } else {
                    navigator.clipboard.writeText(`Check out GlanceFlow — screenshot to tasks with AI! ${window.location.origin}`)
                  }
                }}
                className="ml-auto text-xs text-slate-400 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors hover:border-white/20"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share GlanceFlow
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
