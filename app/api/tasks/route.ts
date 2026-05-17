import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'
import type { ParsedTask } from '@/types'

const FREE_HISTORY_DAYS = 30

export async function GET(req: NextRequest) {
  const limited = rateLimit(`tasks-get:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .maybeSingle()

  const isPremium = profile?.subscription_status === 'premium'

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Free users: only last 30 days
  if (!isPremium) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - FREE_HISTORY_DAYS)
    query = query.gte('created_at', cutoff.toISOString())
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ tasks: data, isPremium, historyLimited: !isPremium })
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(`tasks-post:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { tasks: ParsedTask[] }
  if (!Array.isArray(body.tasks) || body.tasks.length === 0) {
    return NextResponse.json({ error: 'No tasks to save' }, { status: 400 })
  }

  const rows = body.tasks.map((t) => ({
    title: t.title,
    date: t.date,
    time: t.time,
    location: t.location,
    type: t.type,
    status: 'pending',
    description: null,
    screenshot_url: null,
    user_id: user.id,
  }))

  const { data, error } = await supabase.from('tasks').insert(rows).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
