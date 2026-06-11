import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'
import type { ParsedTask } from '@/types'

const FREE_LIMIT = 10
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

function friendlyError(message: string): string {
  if (message.includes('LIMIT_REACHED')) return 'You have reached your daily limit. Upgrade to Premium for unlimited processing.'
  if (message.includes('quota') || message.includes('429')) return 'AI service is busy right now. Please try again in a few seconds.'
  if (message.includes('timeout') || message.includes('DEADLINE')) return 'The AI took too long to respond. Please try again.'
  if (message.includes('file type') || message.includes('Invalid')) return 'Invalid image format. Please use PNG, JPG or WEBP.'
  if (message.includes('No tasks found')) return 'No tasks found in this screenshot. Try a different image with text content.'
  if (message.includes('parse') || message.includes('JSON')) return 'Could not read the AI response. Please try again.'
  return 'Something went wrong. Please try again.'
}

const PROMPT = `Extract all tasks, to-dos, action items, reminders, or events from this screenshot.

Return ONLY valid JSON, no other text:
{
  "tasks": [
    {
      "title": "brief actionable title",
      "date": null,
      "time": null,
      "location": null,
      "type": "task",
      "priority": "medium"
    }
  ]
}

Rules:
- title: short and actionable (max 80 chars)
- date: ISO date string if visible, otherwise null
- time: time string if visible, otherwise null
- location: location string if visible, otherwise null
- type: "task", "event", or "reminder"
- priority: assign based on urgency/importance — "urgent" (deadlines, ASAP, overdue), "high" (important but not immediate), "medium" (normal tasks), "low" (nice to have, someday)
- If nothing found: {"tasks": []}
- ONLY JSON, no explanation`

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const
type AllowedMediaType = (typeof ALLOWED_TYPES)[number]

function isAllowedType(t: string): t is AllowedMediaType {
  return (ALLOWED_TYPES as readonly string[]).includes(t)
}

function sanitizeType(t: string): ParsedTask['type'] {
  if (t === 'event' || t === 'reminder') return t
  return 'task'
}

function sanitizePriority(p: string): ParsedTask['priority'] {
  if (p === 'urgent' || p === 'high' || p === 'medium' || p === 'low') return p
  return 'medium'
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(`process:${getIP(req)}`, PRESETS.ai)
  if (limited) return limited

  // Auth
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

  // Image validation
  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  if (!isAllowedType(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use PNG, JPG, WEBP or GIF.' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent([
      PROMPT,
      { inlineData: { mimeType: file.type as AllowedMediaType, data: base64 } },
    ])

    const text = result.response.text().trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Could not parse AI response' }, { status: 500 })

    const parsed = JSON.parse(jsonMatch[0]) as { tasks: Array<Record<string, unknown>> }
    const tasks: ParsedTask[] = (parsed.tasks ?? []).map((t) => ({
      title: String(t.title ?? '').slice(0, 80),
      date: t.date ? String(t.date) : null,
      time: t.time ? String(t.time) : null,
      location: t.location ? String(t.location) : null,
      type: sanitizeType(String(t.type ?? 'task')),
      priority: sanitizePriority(String(t.priority ?? 'medium')),
    }))

    // Log usage
    await supabaseAdmin.from('usage_logs').insert({ user_id: user.id })

    return NextResponse.json({ tasks })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api/process]', message)
    return NextResponse.json({ error: friendlyError(message) }, { status: 500 })
  }
}
