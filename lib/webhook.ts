import { supabaseAdmin } from '@/lib/supabase-admin'

export async function fireWebhook(userId: string, event: string, payload: Record<string, unknown>) {
  try {
    const { data } = await supabaseAdmin
      .from('user_profiles')
      .select('webhook_url')
      .eq('id', userId)
      .maybeSingle()

    const url = data?.webhook_url as string | null
    if (!url) return

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-GlanceFlow-Event': event },
      body: JSON.stringify({ event, timestamp: new Date().toISOString(), ...payload }),
      signal: AbortSignal.timeout(5000),
    })
  } catch { /* non-critical */ }
}
