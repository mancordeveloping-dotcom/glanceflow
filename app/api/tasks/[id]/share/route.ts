import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(`task-share:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = crypto.randomUUID()

  const { data, error } = await supabase
    .from('tasks')
    .update({ share_token: token })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('share_token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ token: data.share_token })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(`task-unshare:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase
    .from('tasks')
    .update({ share_token: null })
    .eq('id', id)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
