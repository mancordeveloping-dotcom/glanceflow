import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

const FREE_LIMIT = 10

export async function GET(req: NextRequest) {
  const limited = rateLimit(`usage:${getIP(req)}`, PRESETS.default)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [{ count }, { data: profile }] = await Promise.all([
    supabase
      .from('usage_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString()),
    supabase
      .from('user_profiles')
      .select('subscription_status, subscription_interval')
      .eq('id', user.id)
      .maybeSingle(),
  ])

  const isPremium = profile?.subscription_status === 'premium'
  const isPro = isPremium && profile?.subscription_interval === 'pro'
  return NextResponse.json({
    used: count ?? 0,
    limit: FREE_LIMIT,
    isPremium,
    isPro,
    remaining: isPremium ? null : Math.max(0, FREE_LIMIT - (count ?? 0)),
  })
}
