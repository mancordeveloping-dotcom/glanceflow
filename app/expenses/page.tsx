'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useToast } from '@/components/Toast'

interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  category: string
  merchant: string | null
  date: string | null
  created_at: string
}

const categoryEmoji: Record<string, string> = {
  food: '🍕',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎬',
  health: '💊',
  utilities: '⚡',
  other: '📦',
}

const categoryColors: Record<string, string> = {
  food: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  transport: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  shopping: 'border-pink-500/30 bg-pink-500/10 text-pink-300',
  entertainment: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  health: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  utilities: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  other: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
}

type UploadState = 'idle' | 'loading' | 'done' | 'error'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [newExpenses, setNewExpenses] = useState<Expense[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      fetch('/api/expenses').then(r => r.json()).then((data: Expense[]) => {
        if (Array.isArray(data)) setExpenses(data)
      }).catch(() => null).finally(() => setLoading(false))
    })
  }, [router])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setUploadState('idle')
    setUploadError(null)
    setNewExpenses([])
  }

  function handleReset() {
    setFile(null)
    setPreview(null)
    setUploadState('idle')
    setUploadError(null)
    setNewExpenses([])
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleProcess() {
    if (!file) return
    setUploadState('loading')
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/expenses/process', { method: 'POST', body: formData })
      const data = await res.json() as { expenses?: Expense[]; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to process image')
      const saved = data.expenses ?? []
      setExpenses(prev => [...saved, ...prev])
      setNewExpenses(saved)
      setUploadState('done')
      toast(`${saved.length} spesa${saved.length !== 1 ? 'e' : ''} estratta!`, 'success')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Something went wrong')
      setUploadState('error')
    }
  }

  async function handleDelete(expense: Expense) {
    setExpenses(prev => prev.filter(e => e.id !== expense.id))
    const res = await fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' })
    if (!res.ok) {
      setExpenses(prev => [expense, ...prev])
      toast('Errore eliminazione', 'error')
    } else {
      toast('Spesa eliminata', 'info')
    }
  }

  const filtered = filterCategory === 'all' ? expenses : expenses.filter(e => e.category === filterCategory)
  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0)
  const categories = [...new Set(expenses.map(e => e.category))]

  // Monthly total
  const thisMonth = new Date()
  const monthlyTotal = expenses.filter(e => {
    const d = new Date(e.created_at)
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear()
  }).reduce((sum, e) => sum + Number(e.amount), 0)

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
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Expenses</h1>
          <p className="mt-1 text-sm text-slate-400">Scan receipts and track spending automatically</p>
        </div>
      </div>

      {/* Stats */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="glass inner-highlight rounded-2xl p-4 text-center space-y-1 border border-white/5">
            <p className="text-2xl font-extrabold text-white">€{monthlyTotal.toFixed(2)}</p>
            <p className="text-xs text-slate-500">This month</p>
          </div>
          <div className="glass inner-highlight rounded-2xl p-4 text-center space-y-1 border border-white/5">
            <p className="text-2xl font-extrabold gradient-text">€{total.toFixed(2)}</p>
            <p className="text-xs text-slate-500">{filterCategory === 'all' ? 'Total' : filterCategory}</p>
          </div>
          <div className="glass inner-highlight rounded-2xl p-4 text-center space-y-1 border border-white/5">
            <p className="text-2xl font-extrabold text-cyan-400">{expenses.length}</p>
            <p className="text-xs text-slate-500">Transactions</p>
          </div>
        </div>
      )}

      {/* Upload zone */}
      <div className="glass inner-highlight rounded-2xl border border-white/5 p-6 space-y-4">
        <p className="text-sm font-bold text-slate-300">📸 Scan a receipt</p>

        <div
          onClick={() => uploadState !== 'loading' && inputRef.current?.click()}
          className={`w-full rounded-2xl border-2 border-dashed p-6 flex flex-col items-center gap-3 transition-all
            ${uploadState === 'loading'
              ? 'cursor-not-allowed opacity-50 border-white/10'
              : 'cursor-pointer border-emerald-500/30 hover:border-emerald-400/60 hover:bg-white/3'
            }`}
        >
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
          {preview ? (
            <img src={preview} alt="Receipt preview" className="max-h-48 rounded-xl object-contain w-full" />
          ) : (
            <>
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-3xl">🧾</div>
              <div className="text-center">
                <p className="font-semibold text-white text-sm">Drop receipt here or click to upload</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP — scontrini, fatture, ricevute</p>
              </div>
            </>
          )}
        </div>

        {file && uploadState !== 'done' && (
          <div className="flex gap-3">
            <button
              onClick={handleProcess}
              disabled={uploadState === 'loading'}
              className="flex-1 shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {uploadState === 'loading' ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing receipt…
                </>
              ) : '⚡ Extract Expenses with AI'}
            </button>
            <button onClick={handleReset} disabled={uploadState === 'loading'} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 hover:bg-white/10 disabled:opacity-40 transition-colors">
              Reset
            </button>
          </div>
        )}

        {uploadState === 'error' && uploadError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{uploadError}</div>
        )}

        {uploadState === 'done' && newExpenses.length > 0 && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 space-y-2">
            <p className="text-sm font-bold text-emerald-400">✓ {newExpenses.length} expense{newExpenses.length !== 1 ? 's' : ''} extracted!</p>
            {newExpenses.map(e => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <span className="text-emerald-300">{categoryEmoji[e.category]} {e.description}</span>
                <span className="font-bold text-white">{e.currency} {Number(e.amount).toFixed(2)}</span>
              </div>
            ))}
            <button onClick={handleReset} className="text-sm text-emerald-400 underline hover:no-underline">Scan another →</button>
          </div>
        )}
      </div>

      {/* Filters */}
      {expenses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all border
              ${filterCategory === 'all' ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent' : 'glass text-slate-400 border-white/8 hover:text-white'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all border
                ${filterCategory === cat ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent' : 'glass text-slate-400 border-white/8 hover:text-white'}`}
            >
              {categoryEmoji[cat]} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Expenses list */}
      {expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-500/20 bg-emerald-500/5 py-24 text-center space-y-4">
          <div className="text-5xl">🧾</div>
          <div>
            <p className="font-bold text-white">No expenses yet</p>
            <p className="mt-1 text-sm text-slate-500">Scan a receipt to track your first expense.</p>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(expense => (
            <div key={expense.id} className="card-3d glass inner-highlight rounded-2xl px-5 py-4 border border-white/5 flex items-center gap-4 group">
              <div className="text-2xl">{categoryEmoji[expense.category]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{expense.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {expense.merchant && <span className="text-xs text-slate-500">{expense.merchant}</span>}
                  {expense.date && <span className="text-xs text-slate-600">📅 {expense.date}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[expense.category]}`}>
                  {expense.category}
                </span>
                <span className="text-lg font-extrabold text-white">{expense.currency} {Number(expense.amount).toFixed(2)}</span>
                <button
                  onClick={() => handleDelete(expense)}
                  className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
