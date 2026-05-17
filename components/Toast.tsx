'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => null })

export function useToast() {
  return useContext(ToastContext)
}

const colors: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200',
  error:   'border-red-500/30 bg-red-950/80 text-red-200',
  info:    'border-violet-500/30 bg-violet-950/80 text-violet-200',
}

const progressColors: Record<ToastType, string> = {
  success: 'bg-emerald-400',
  error:   'bg-red-400',
  info:    'bg-violet-400',
}

function SuccessIcon() {
  return (
    <svg className="h-4 w-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}
function ErrorIcon() {
  return (
    <svg className="h-4 w-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}
function InfoIcon() {
  return (
    <svg className="h-4 w-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  )
}

const icons = { success: SuccessIcon, error: ErrorIcon, info: InfoIcon }

function ToastItem({ t, onDismiss }: { t: ToastItem; onDismiss: (id: number) => void }) {
  const Icon = icons[t.type]
  return (
    <div className={`animate-toast flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-xl pointer-events-auto relative overflow-hidden min-w-[280px] max-w-[360px] ${colors[t.type]}`}>
      <Icon />
      <p className="text-sm font-semibold flex-1 leading-snug mt-0.5">{t.message}</p>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <div className={`absolute bottom-0 left-0 h-0.5 toast-progress ${progressColors[t.type]}`} />
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current
    setToasts(prev => [...prev.slice(-4), { id, message, type }])
    setTimeout(() => dismiss(id), 3200)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none items-end">
        {toasts.map(t => (
          <ToastItem key={t.id} t={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
