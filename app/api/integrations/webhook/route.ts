import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabaseAdmin
    .from('user_profiles')
    .select('webhook_url')
    .eq('id', user.id)
    .maybeSingle()

  return NextResponse.json({ webhook_url: (data?.webhook_url as string | null) ?? '' })
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { webhook_url } = await req.json() as { webhook_url: string }

  await supabaseAdmin
    .from('user_profiles')
    .update({ webhook_url: webhook_url || null })
    .eq('id', user.id)

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabaseAdmin
    .from('user_profiles')
    .update({ webhook_url: null })
    .eq('id', user.id)

  return NextResponse.json({ ok: true })
}
