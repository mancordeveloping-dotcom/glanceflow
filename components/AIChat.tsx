'use client'

import { useState, useRef, useEffect } from 'react'
import type { Task } from '@/types'

interface Message {
  role: 'user' | 'ai'
  text: string
}

const SUGGESTIONS = [
  "What's urgent today?",
  "Summarize my pending tasks",
  "What should I focus on first?",
  "How many tasks do I have?",
]

interface AIChatProps {
  tasks: Task[]
}

export default function AIChat({ tasks }: AIChatProps) {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm your GlanceFlow AI assistant. Ask me anything about your tasks — what's urgent, what to focus on, or for a quick summary. ✨" }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        inputRef.current?.focus()
      }, 100)
    }
  }, [open, messages])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, tasks }),
      })
      const data = await res.json() as { reply?: string; error?: string }
      setMessages(prev => [...prev, { role: 'ai', text: data.reply ?? data.error ?? 'Something went wrong.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Could not connect to AI. Try again.' }])
    }
    setLoading(false)
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-44 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${open ? 'bg-white/10 border border-white/20 scale-90' : 'bg-gradient-to-br from-violet-600 to-cyan-500 shadow-violet-500/40 hover:scale-110'}`}
        title="AI Assistant"
        style={{ boxShadow: open ? undefined : '0 8px 32px rgba(139,92,246,0.5)' }}
      >
        {open ? (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        )}
        {/* Badge */}
        {!open && pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-[#06060f] flex items-center justify-center text-[9px] font-black text-white">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] glass rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/40 flex flex-col overflow-hidden"
          style={{ height: '440px' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))' }}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">GlanceFlow AI</p>
              <p className="text-[10px] text-slate-500">{tasks.length} tasks · {pendingCount} pending</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-br-sm'
                    : 'bg-white/6 border border-white/8 text-slate-300 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/6 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-400"
                      style={{ animation: `bounce-soft 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions (only when fresh) */}
            {messages.length === 1 && !loading && (
              <div className="space-y-1.5 pt-1">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="w-full text-left rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-3 pb-3 pt-2 border-t border-white/8">
            <form onSubmit={e => { e.preventDefault(); send() }} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about your tasks…"
                disabled={loading}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50"
              />
              <button type="submit" disabled={loading || !input.trim()}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 w-9 h-9 flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity hover:opacity-90">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
