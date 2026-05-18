import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(`push-subscribe:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subscription = await req.json()

  await supabaseAdmin
    .from('push_subscriptions')
    .upsert({ user_id: user.id, subscription }, { onConflict: 'user_id' })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const limited = rateLimit(`push-unsubscribe:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabaseAdmin
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
