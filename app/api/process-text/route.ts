import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'
import type { ParsedTask } from '@/types'

const FREE_LIMIT = 3
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const TEXT_PROMPT = `Extract all tasks, to-dos, action items, reminders, or events from the following text.

Return ONLY valid JSON, no other text:
{
  "tasks": [
    {
      "title": "brief actionable title",
      "date": null,
      "time": null,
      "location": null,
      "type": "task"
    }
  ]
}

Rules:
- title: short and actionable (max 80 chars)
- date: ISO date string if found, otherwise null
- time: time string if found, otherwise null
- location: location string if found, otherwise null
- type: "task", "event", or "reminder"
- If nothing found: {"tasks": []}
- ONLY JSON, no explanation

TEXT TO ANALYZE:
`

function sanitizeType(t: string): ParsedTask['type'] {
  if (t === 'event' || t === 'reminder') return t
  return 'task'
}

async function fetchUrlText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GlanceFlow/1.0)' },
    signal: AbortSignal.timeout(8000),
  })
  const html = await res.text()
  // Strip HTML tags and collapse whitespace
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Usage check
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [{ data: profile }, { count: usedToday }] = await Promise.all([
    supabase.from('user_profiles').select('subscription_status, bonus_credits').eq('id', user.id).maybeSingle(),
    supabase.from('usage_logs').select('*', { count: 'exact', head: true })
      .eq('user_id', user.id).gte('created_at', today.toISOString()),
  ])

  const isPremium = profile?.subscription_status === 'premium'
  const totalLimit = FREE_LIMIT + (profile?.bonus_credits ?? 0)
  if (!isPremium && (usedToday ?? 0) >= totalLimit) {
    return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 })
  }

  // Premium-only feature
  if (!isPremium) {
    return NextResponse.json({ error: 'PREMIUM_REQUIRED' }, { status: 403 })
  }

  const limited = rateLimit(`process-text:${getIP(req)}`, PRESETS.ai)
  if (limited) return limited

  const body = await req.json() as { input: string }
  if (!body.input?.trim()) {
    return NextResponse.json({ error: 'No input provided' }, { status: 400 })
  }

  try {
    let text = body.input.trim()

    // If it's a URL, fetch the page content
    if (/^https?:\/\//i.test(text)) {
      try {
        text = await fetchUrlText(text)
      } catch {
        return NextResponse.json({ error: 'Could not fetch the URL. Make sure it is accessible.' }, { status: 400 })
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(TEXT_PROMPT + text)
    const raw = result.response.text().trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Could not parse AI response' }, { status: 500 })

    const parsed = JSON.parse(jsonMatch[0]) as { tasks: Array<Record<string, unknown>> }
    const tasks: ParsedTask[] = (parsed.tasks ?? []).map((t) => ({
      title: String(t.title ?? '').slice(0, 80),
      date: t.date ? String(t.date) : null,
      time: t.time ? String(t.time) : null,
      location: t.location ? String(t.location) : null,
      type: sanitizeType(String(t.type ?? 'task')),
    }))

    await supabaseAdmin.from('usage_logs').insert({ user_id: user.id })
    return NextResponse.json({ tasks })
  } catch (err) {
    console.error('[api/process-text]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
