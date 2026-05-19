import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
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
    description?: string | null
    date?: string | null
    time?: string | null
    location?: string | null
    type?: string
    project_id?: string | null
    priority?: TaskPriority | null
    recurrence?: TaskRecurrence | null
    recurrence_paused?: boolean | null
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.status      !== undefined) updates.status      = body.status
  if (body.title       !== undefined) updates.title       = body.title
  if (body.description !== undefined) updates.description = body.description
  if (body.date        !== undefined) updates.date        = body.date
  if (body.time        !== undefined) updates.time        = body.time
  if (body.location    !== undefined) updates.location    = body.location
  if (body.type        !== undefined) updates.type        = body.type
  if (body.project_id  !== undefined) updates.project_id  = body.project_id
  if (body.priority    !== undefined) updates.priority    = body.priority
  if (body.recurrence          !== undefined) updates.recurrence          = body.recurrence
  if (body.recurrence_paused   !== undefined) updates.recurrence_paused   = body.recurrence_paused

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update gamification stats when task marked done
  if (body.status === 'done') {
    void (async () => {
      try {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('streak_days, last_active_date, total_done, badges')
          .eq('id', user.id)
          .maybeSingle()

        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const lastActive = profile?.last_active_date ?? null
        const currentStreak = profile?.streak_days ?? 0
        const newStreak = lastActive === yesterday ? currentStreak + 1 : lastActive === today ? currentStreak : 1
        const newTotal = (profile?.total_done ?? 0) + 1
        const badges: string[] = profile?.badges ?? []
        if (newTotal >= 1  && !badges.includes('first_task')) badges.push('first_task')
        if (newTotal >= 10 && !badges.includes('tasks_10'))   badges.push('tasks_10')
        if (newTotal >= 50 && !badges.includes('tasks_50'))   badges.push('tasks_50')
        if (newStreak >= 3 && !badges.includes('streak_3'))   badges.push('streak_3')
        if (newStreak >= 7 && !badges.includes('streak_7'))   badges.push('streak_7')

        await supabaseAdmin
          .from('user_profiles')
          .update({ streak_days: newStreak, last_active_date: today, total_done: newTotal, badges })
          .eq('id', user.id)
      } catch { /* non-critical */ }
    })()
  }

  // Auto-create next occurrence for recurring tasks when marked done (skip if paused)
  if (body.status === 'done' && data.recurrence && data.date && !data.recurrence_paused) {
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
