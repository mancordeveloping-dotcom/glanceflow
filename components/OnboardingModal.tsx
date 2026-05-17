'use client'

import { useEffect, useState } from 'react'

const steps = [
  {
    icon: '👋',
    title: 'Welcome to GlanceFlow',
    desc: 'The AI productivity app that turns any screenshot into an organized task list in seconds.',
  },
  {
    icon: '📸',
    title: 'Upload a screenshot',
    desc: 'Drag & drop any image — WhatsApp chats, emails, notes. Gemini AI extracts every task automatically.',
  },
  {
    icon: '📋',
    title: 'Manage your tasks',
    desc: 'Filter, complete, organize by project and priority. Track your progress in the Statistics page.',
  },
  {
    icon: '🚀',
    title: "You're all set!",
    desc: 'Start by uploading your first screenshot on the home page. Premium users get unlimited AI processing.',
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
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-violet-500' : 'w-1.5 bg-white/15'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-8">
          <div className="text-6xl animate-bounce-soft">{current.icon}</div>
          <h2 className="text-2xl font-extrabold text-white">{current.title}</h2>
          <p className="text-slate-400 leading-relaxed text-sm">{current.desc}</p>
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
      </div>
    </div>
  )
}
