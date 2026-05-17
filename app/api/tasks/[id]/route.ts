import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'
import type { TaskStatus, TaskPriority, TaskRecurrence } from '@/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(`tasks-patch:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    status?: TaskStatus
    title?: string
    date?: string | null
    time?: string | null
    location?: string | null
    type?: string
    project_id?: string | null
    priority?: TaskPriority | null
    recurrence?: TaskRecurrence | null
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.status    !== undefined) updates.status     = body.status
  if (body.title     !== undefined) updates.title      = body.title
  if (body.date      !== undefined) updates.date       = body.date
  if (body.time      !== undefined) updates.time       = body.time
  if (body.location  !== undefined) updates.location   = body.location
  if (body.type      !== undefined) updates.type       = body.type
  if (body.project_id !== undefined) updates.project_id = body.project_id
  if (body.priority  !== undefined) updates.priority   = body.priority
  if (body.recurrence !== undefined) updates.recurrence = body.recurrence

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-create next occurrence for recurring tasks when marked done
  if (body.status === 'done' && data.recurrence && data.date) {
    const next = new Date(data.date + 'T00:00:00')
    if (data.recurrence === 'daily')   next.setDate(next.getDate() + 1)
    if (data.recurrence === 'weekly')  next.setDate(next.getDate() + 7)
    if (data.recurrence === 'monthly') next.setMonth(next.getMonth() + 1)

    await supabase.from('tasks').insert({
      user_id:    user.id,
      title:      data.title,
      type:       data.type,
      status:     'pending',
      date:       next.toISOString().split('T')[0],
      time:       data.time,
      location:   data.location,
      priority:   data.priority,
      recurrence: data.recurrence,
      project_id: data.project_id,
    })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(`tasks-delete:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
