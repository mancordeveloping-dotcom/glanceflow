import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const limited = rateLimit(`gamification:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('streak_days, last_active_date, total_done, badges')
    .eq('id', user.id)
    .maybeSingle()

  return NextResponse.json({
    streak_days: profile?.streak_days ?? 0,
    last_active_date: profile?.last_active_date ?? null,
    total_done: profile?.total_done ?? 0,
    badges: profile?.badges ?? [],
  })
}
