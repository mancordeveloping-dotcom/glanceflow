import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'
import webpush from 'web-push'

const resend = new Resend(process.env.RESEND_API_KEY)

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  // Get all pending tasks due today
  const { data: tasks, error } = await supabaseAdmin
    .from('tasks')
    .select('user_id, title, time')
    .eq('date', today)
    .eq('status', 'pending')

  if (error || !tasks?.length) {
    return NextResponse.json({ sent: 0 })
  }

  // Group by user
  const byUser = new Map<string, { title: string; time: string | null }[]>()
  for (const t of tasks) {
    if (!byUser.has(t.user_id)) byUser.set(t.user_id, [])
    byUser.get(t.user_id)!.push({ title: t.title, time: t.time })
  }

  // Get user emails
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })

  let sent = 0
  const from = process.env.RESEND_FROM_EMAIL ?? 'GlanceFlow <noreply@glanceflow.app>'
  const appUrl = process.env.NEXT_PUBLIC_URL ?? 'https://glanceflow.app'

  for (const [userId, userTasks] of byUser) {
    const user = users.find(u => u.id === userId)
    if (!user?.email) continue

    const taskRows = userTasks.map(t =>
      `<tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#a78bfa;font-size:16px;">◆</span>
            <span style="color:#e2e8f0;font-size:14px;">${t.title}</span>
            ${t.time ? `<span style="color:#64748b;font-size:12px;margin-left:auto;">🕐 ${t.time}</span>` : ''}
          </div>
        </td>
      </tr>`
    ).join('')

    await resend.emails.send({
      from,
      to: user.email,
      subject: `📅 Hai ${userTasks.length} task in scadenza oggi — GlanceFlow`,
      html: `
        <div style="background:#06060f;color:#f1f5f9;font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;border-radius:16px;">
          <div style="margin-bottom:24px;">
            <span style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#a78bfa,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">GlanceFlow</span>
          </div>

          <h2 style="font-size:22px;font-weight:800;color:#f1f5f9;margin:0 0 8px;">
            Buona giornata! 👋
          </h2>
          <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;line-height:1.6;">
            Hai <strong style="color:#a78bfa;">${userTasks.length} task</strong> in scadenza oggi. Ecco un riepilogo:
          </p>

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              ${taskRows}
            </table>
          </div>

          <a href="${appUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:white;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:12px;font-size:14px;">
            Apri il Dashboard →
          </a>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:#475569;">
            Ricevi questa email perché hai task in scadenza oggi su GlanceFlow.
          </div>
        </div>
      `,
    })
    sent++
  }

  // Send push notifications
  const { data: pushSubs } = await supabaseAdmin
    .from('push_subscriptions')
    .select('user_id, subscription')

  if (pushSubs?.length) {
    for (const [userId, userTasks] of byUser) {
      const sub = pushSubs.find(s => s.user_id === userId)
      if (!sub) continue
      try {
        await webpush.sendNotification(
          sub.subscription,
          JSON.stringify({
            title: 'GlanceFlow — Tasks due today',
            body: `You have ${userTasks.length} task${userTasks.length > 1 ? 's' : ''} due today`,
            url: '/dashboard',
          })
        )
      } catch { /* subscription may be expired */ }
    }
  }

  return NextResponse.json({ sent, date: today })
}
