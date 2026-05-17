import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

function generateCode(userId: string) {
  return userId.replace(/-/g, '').slice(0, 8).toUpperCase()
}

export async function GET(req: NextRequest) {
  const limited = rateLimit(`referral-get:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let { data: profile } = await supabase
    .from('user_profiles')
    .select('referral_code, bonus_credits')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.referral_code) {
    const code = generateCode(user.id)
    await supabaseAdmin.from('user_profiles').upsert({
      id: user.id,
      referral_code: code,
      bonus_credits: 0,
    })
    profile = { referral_code: code, bonus_credits: 0 }
  }

  const { count: referralCount } = await supabaseAdmin
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', user.id)

  return NextResponse.json({
    code: profile.referral_code,
    bonus_credits: profile.bonus_credits ?? 0,
    referral_count: referralCount ?? 0,
  })
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(`referral-post:${getIP(req)}`, PRESETS.strict)
  if (limited) return limited

  const { code } = await req.json() as { code: string }
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('referred_by')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.referred_by) return NextResponse.json({ error: 'Already referred' }, { status: 400 })

  const { data: referrer } = await supabaseAdmin
    .from('user_profiles')
    .select('id, bonus_credits')
    .eq('referral_code', code.toUpperCase())
    .maybeSingle()

  if (!referrer) return NextResponse.json({ error: 'Invalid code' }, { status: 404 })
  if (referrer.id === user.id) return NextResponse.json({ error: 'Cannot use your own code' }, { status: 400 })

  await Promise.all([
    supabaseAdmin.from('user_profiles').update({
      referred_by: referrer.id,
      bonus_credits: 3,
    }).eq('id', user.id),
    supabaseAdmin.from('user_profiles').update({
      bonus_credits: (referrer.bonus_credits ?? 0) + 3,
    }).eq('id', referrer.id),
  ])

  return NextResponse.json({ success: true })
}
