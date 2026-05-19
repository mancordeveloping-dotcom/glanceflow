import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServer } from '@/lib/supabase-server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'
import type { Task } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export async function POST(req: NextRequest) {
  const limited = rateLimit(`ai-chat:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { message: string; tasks: Task[] }
  if (!body.message?.trim()) return NextResponse.json({ error: 'No message' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  const tasksContext = (body.tasks ?? [])
    .slice(0, 80)
    .map((t, i) =>
      `${i + 1}. [${t.status}] ${t.title}` +
      (t.priority ? ` (${t.priority})` : '') +
      (t.date ? ` — due ${t.date}` : '') +
      (t.type !== 'task' ? ` [${t.type}]` : '')
    )
    .join('\n')

  const systemPrompt = `You are GlanceFlow AI, a helpful task management assistant. Today is ${today}.

The user has the following tasks:
${tasksContext || 'No tasks yet.'}

Answer the user's question concisely and helpfully. You can:
- Summarize tasks (pending, urgent, due today, etc.)
- Give productivity advice
- Suggest what to work on next
- Answer questions about specific tasks
- Be encouraging and motivating

Keep replies short (2-4 sentences max). Use emoji sparingly. Reply in the same language as the user's message.`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `User: ${body.message.trim()}` },
    ])
    const reply = result.response.text().trim()
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[api/ai/chat]', err)
    return NextResponse.json({ error: 'AI unavailable, try again.' }, { status: 500 })
  }
}
