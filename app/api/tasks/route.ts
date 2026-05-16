import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import type { ParsedTask } from '@/types'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
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
