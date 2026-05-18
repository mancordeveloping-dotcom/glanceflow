import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'
import type { ParsedTask } from '@/types'

const FREE_LIMIT = 3
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const PROMPT = `Extract all tasks, to-dos, action items, reminders, or events from this screenshot.

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
- date: ISO date string if visible, otherwise null
- time: time string if visible, otherwise null
- location: location string if visible, otherwise null
- type: "task", "event", or "reminder"
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

export async function POST(req: NextRequest) {
  const limited = rateLimit(`ext-process:${getIP(req)}`, PRESETS.ai)
  if (limited) return limited

  // Auth via Bearer token
  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Usage check
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [{ data: profile }, { count: usedToday }] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('subscription_status, bonus_credits').eq('id', user.id).maybeSingle(),
    supabaseAdmin.from('usage_logs').select('*', { count: 'exact', head: true })
      .eq('user_id', user.id).gte('created_at', today.toISOString()),
  ])

  const isPremium = profile?.subscription_status === 'premium'
  const totalLimit = FREE_LIMIT + (profile?.bonus_credits ?? 0)
  if (!isPremium && (usedToday ?? 0) >= totalLimit) {
    return NextResponse.json({ error: 'Daily limit reached. Upgrade to Premium.' }, { status: 403 })
  }

  // Image
  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  if (!isAllowedType(file.type)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })

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
    }))

    await supabaseAdmin.from('usage_logs').insert({ user_id: user.id })

    return NextResponse.json({ tasks })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
