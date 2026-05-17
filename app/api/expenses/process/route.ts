import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

const PROMPT = `Analyze this receipt or expense screenshot and extract the expense information.

Return ONLY valid JSON, no other text:
{
  "expenses": [
    {
      "description": "brief description of what was purchased",
      "amount": 12.50,
      "currency": "EUR",
      "category": "food",
      "merchant": "Store name or null",
      "date": "2024-01-15 or null"
    }
  ],
  "total": 12.50
}

Categories must be one of: food, transport, shopping, entertainment, health, utilities, other

Rules:
- amount must be a number (no currency symbols)
- currency: detect from receipt (EUR, USD, GBP, etc.) default EUR
- If multiple items on receipt, create one expense per item OR one total expense
- date: ISO date string if visible, otherwise null
- If nothing found: {"expenses": [], "total": 0}
- ONLY JSON, no explanation`

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const
type AllowedMediaType = (typeof ALLOWED_TYPES)[number]

function isAllowedType(t: string): t is AllowedMediaType {
  return (ALLOWED_TYPES as readonly string[]).includes(t)
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(`expenses-process:${getIP(req)}`, PRESETS.ai)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  if (!isAllowedType(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use PNG, JPG or WEBP.' }, { status: 400 })
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

    const parsed = JSON.parse(jsonMatch[0]) as {
      expenses: Array<{ description: string; amount: number; currency: string; category: string; merchant: string | null; date: string | null }>
      total: number
    }

    if (!parsed.expenses?.length) {
      return NextResponse.json({ error: 'No expenses found in this image.' }, { status: 400 })
    }

    const rows = parsed.expenses.map(e => ({
      user_id: user.id,
      description: String(e.description ?? '').slice(0, 120),
      amount: Math.abs(Number(e.amount) || 0),
      currency: String(e.currency ?? 'EUR').toUpperCase().slice(0, 3),
      category: ['food', 'transport', 'shopping', 'entertainment', 'health', 'utilities', 'other'].includes(e.category) ? e.category : 'other',
      merchant: e.merchant ? String(e.merchant).slice(0, 80) : null,
      date: e.date || null,
    }))

    const { data, error } = await supabaseAdmin.from('expenses').insert(rows).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ expenses: data, total: parsed.total })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api/expenses/process]', message)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
