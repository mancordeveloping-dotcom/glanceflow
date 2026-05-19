'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useToast } from '@/components/Toast'
import Tilt3D from '@/components/Tilt3D'

const EVENTS = [
  { event: 'task.created',   desc: 'Triggered when a new task is created',          icon: '➕' },
  { event: 'task.completed', desc: 'Triggered when a task is marked as done',        icon: '✅' },
  { event: 'task.deleted',   desc: 'Triggered when a task is deleted',               icon: '🗑' },
]

const ZAPIER_APPS = [
  { name: 'Notion',         icon: '📝', color: '#000', desc: 'Save tasks to a Notion database' },
  { name: 'Google Sheets',  icon: '📊', color: '#0f9d58', desc: 'Log completed tasks to a spreadsheet' },
  { name: 'Slack',          icon: '💬', color: '#4a154b', desc: 'Send task notifications to Slack' },
  { name: 'Trello',         icon: '🗂',  color: '#0052cc', desc: 'Create Trello cards from tasks' },
  { name: 'Google Calendar',icon: '📅', color: '#4285f4', desc: 'Sync events to Google Calendar' },
  { name: 'Airtable',       icon: '🔷', color: '#2d7ff9', desc: 'Store tasks in an Airtable base' },
]

export default function IntegrationsPage() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [saved, setSaved]   = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      fetch('/api/integrations/webhook')
        .then(r => r.json())
        .then((d: { webhook_url: string }) => {
          setWebhookUrl(d.webhook_url ?? '')
          setSaved(d.webhook_url ?? '')
        })
        .finally(() => setLoading(false))
    })
  }, [router])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/integrations/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook_url: webhookUrl }),
    })
    setSaving(false)
    if (res.ok) { setSaved(webhookUrl); toast('Webhook saved!', 'success') }
    else toast('Error saving webhook', 'error')
  }

  async function handleTest() {
    if (!saved) return
    setTesting(true); setTestResult(null)
    try {
      const res = await fetch(saved, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-GlanceFlow-Event': 'test' },
        body: JSON.stringify({ event: 'test', timestamp: new Date().toISOString(), message: 'GlanceFlow webhook test ✓' }),
      })
      setTestResult(res.ok ? 'ok' : 'fail')
    } catch { setTestResult('fail') }
    setTesting(false)
  }

  async function handleDelete() {
    await fetch('/api/integrations/webhook', { method: 'DELETE' })
    setWebhookUrl(''); setSaved('')
    toast('Webhook removed', 'info')
  }

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-4xl font-black text-white">Integrations</h1>
        <p className="mt-1 text-sm text-slate-400">Connect GlanceFlow to your favourite tools via webhooks.</p>
      </div>

      {/* Webhook section */}
      <div className="glass rounded-3xl border border-white/8 p-7 space-y-6">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-xl shrink-0">🔗</div>
          <div>
            <h2 className="font-black text-white text-lg">Outgoing Webhook</h2>
            <p className="text-sm text-slate-400 mt-0.5">GlanceFlow will POST a JSON payload to your URL whenever a task event fires.</p>
          </div>
        </div>

        {/* URL input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Webhook URL</label>
          <div className="flex gap-2">
            <input
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/…"
              disabled={loading}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-40"
            />
            <button
              onClick={handleSave}
              disabled={saving || webhookUrl === saved || loading}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Test + delete */}
        {saved && (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
            >
              {testing ? '⏳ Sending…' : '⚡ Test webhook'}
            </button>
            {testResult === 'ok' && <span className="text-xs font-bold text-emerald-400">✓ Test successful!</span>}
            {testResult === 'fail' && <span className="text-xs font-bold text-red-400">✗ Request failed — check your URL</span>}
            <button onClick={handleDelete} className="ml-auto text-xs text-slate-500 hover:text-red-400 transition-colors">Remove webhook</button>
          </div>
        )}

        {/* Events list */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Events fired</p>
          <div className="space-y-2">
            {EVENTS.map(ev => (
              <div key={ev.event} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/3 px-4 py-3">
                <span className="text-base">{ev.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white font-mono">{ev.event}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{ev.desc}</p>
                </div>
                <span className="shrink-0 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Example payload */}
        <details className="group">
          <summary className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-300 transition-colors list-none flex items-center gap-1.5">
            <svg className="h-3 w-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
            Example payload
          </summary>
          <pre className="mt-3 rounded-xl bg-black/40 border border-white/8 p-4 text-[11px] text-slate-300 overflow-x-auto">{`{
  "event": "task.completed",
  "timestamp": "2026-05-19T10:30:00.000Z",
  "task": {
    "id": "uuid",
    "title": "Review Q1 report",
    "type": "task",
    "priority": "urgent",
    "date": "2026-05-19"
  }
}`}</pre>
        </details>
      </div>

      {/* Connect with Zapier / Make */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-white text-lg">Connect with Zapier or Make</h2>
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-black text-violet-300">via Webhook</span>
        </div>
        <p className="text-sm text-slate-400">Paste your Zapier Catch Hook or Make Webhook URL above to connect GlanceFlow to 6000+ apps.</p>

        <div className="grid sm:grid-cols-3 gap-3">
          {ZAPIER_APPS.map(app => (
            <Tilt3D key={app.name} intensity={10} className="glass holographic rounded-2xl border border-white/5 p-4 flex items-center gap-3 hover:border-white/10 transition-colors">
              <span className="text-2xl shrink-0 depth-md">{app.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{app.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{app.desc}</p>
              </div>
            </Tilt3D>
          ))}
        </div>

        <div className="glass rounded-2xl border border-cyan-500/15 p-5 flex items-start gap-4">
          <span className="text-2xl shrink-0">⚡</span>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">How to connect Zapier</p>
            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
              <li>Go to <span className="text-cyan-400">zapier.com</span> and create a new Zap</li>
              <li>Choose <strong className="text-white">Webhooks by Zapier</strong> → <strong className="text-white">Catch Hook</strong> as trigger</li>
              <li>Copy the generated webhook URL and paste it above</li>
              <li>Choose your action app (Notion, Slack, Google Sheets…)</li>
              <li>Click <strong className="text-white">Test webhook</strong> to verify the connection</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
