'use client'

import { useEffect, useState } from 'react'

const steps = [
  {
    icon: '👋',
    title: 'Welcome to GlanceFlow',
    desc: 'The AI productivity app that turns any screenshot into an organized task list in seconds. Let\'s take a quick tour!',
    hint: null,
  },
  {
    icon: '📸',
    title: 'AI Screenshot Processing',
    desc: 'Drag & drop any image — WhatsApp chats, emails, notes, calendars. Gemini AI extracts every task automatically with dates, times and priorities.',
    hint: '✦ AI also assigns priority based on context — urgent deadlines get flagged automatically.',
  },
  {
    icon: '📋',
    title: 'Dashboard & Filtering',
    desc: 'Filter by status, type, priority or project. Use the search bar to find tasks instantly. Toggle between list and calendar view.',
    hint: '⌨ Press N to quick-add, / to search, C for calendar, ? for all shortcuts.',
  },
  {
    icon: '✅',
    title: 'Subtasks & Timer',
    desc: 'Break any task into subtasks — check them off one by one with a visual progress bar. Use the built-in timer to track how long you spend on each task.',
    hint: '🔁 Recurring tasks auto-create the next occurrence when you complete them.',
  },
  {
    icon: '📊',
    title: 'Stats & Heatmap',
    desc: 'Track your streaks, earn badges and view a GitHub-style activity heatmap showing 16 weeks of productivity. Donuts show completion by type and priority.',
    hint: '🏆 Complete your first task to earn the First Task badge!',
  },
  {
    icon: '🔗',
    title: 'Integrations & Export',
    desc: 'Connect GlanceFlow to Zapier, Notion, Slack, Google Sheets and more via webhooks. Export tasks to CSV or print a clean PDF summary.',
    hint: '⚡ Find integrations under Tools → Integrations in the navigation.',
  },
  {
    icon: '🚀',
    title: "You're all set!",
    desc: 'Start by uploading your first screenshot on the home page. Premium users get unlimited AI processing and full task history.',
    hint: null,
  },
]

export default function OnboardingModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem('gf_onboarded')) setOpen(true)
  }, [])

  function close() {
    localStorage.setItem('gf_onboarded', '1')
    setOpen(false)
  }

  if (!open) return null

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
      <div className="relative glass inner-highlight rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl shadow-black/80 animate-fade-scale">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-violet-500' : i < step ? 'w-1.5 bg-violet-500/40' : 'w-1.5 bg-white/15'}`}
            />
          ))}
        </div>

        {/* Step counter */}
        <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">
          Step {step + 1} of {steps.length}
        </p>

        {/* Content */}
        <div className="text-center space-y-4 mb-6">
          <div className="text-6xl animate-bounce-soft">{current.icon}</div>
          <h2 className="text-xl font-extrabold text-white">{current.title}</h2>
          <p className="text-slate-400 leading-relaxed text-sm">{current.desc}</p>
          {current.hint && (
            <p className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-2 text-xs text-violet-300 text-left">
              {current.hint}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isLast ? (
            <>
              <button
                onClick={close}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-slate-400 hover:bg-white/10 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex-1 shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-bold text-white"
              >
                Next →
              </button>
            </>
          ) : (
            <button
              onClick={close}
              className="w-full shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-bold text-white"
            >
              Get started 🚀
            </button>
          )}
        </div>

        {/* Back button */}
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="mt-3 w-full text-center text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
