import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServer } from '@/lib/supabase-server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'
import { Resend } from 'resend'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const limited = rateLimit(`summary:${getIP(req)}`, PRESETS.ai)
  if (limited) return limited

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Premium only
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.subscription_status !== 'premium') {
    return NextResponse.json({ error: 'PREMIUM_REQUIRED' }, { status: 403 })
  }

  // Fetch pending tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('title, type, date, priority, recurrence')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ error: 'No pending tasks to summarize.' }, { status: 400 })
  }

  const taskList = tasks.map((t, i) =>
    `${i + 1}. [${t.type}] ${t.title}${t.date ? ` (due: ${t.date})` : ''}${t.priority ? ` [${t.priority}]` : ''}`
  ).join('\n')

  const prompt = `You are a productivity coach. Analyze these pending tasks and write a concise, motivating weekly summary email in HTML.

Tasks:
${taskList}

Write an HTML email body (no <html>/<body> tags) with:
1. A short motivating intro (1-2 sentences)
2. Top 3 priority tasks to focus on this week (bold them)
3. A quick overview of all tasks grouped by type
4. A brief closing encouragement

Use clean HTML with inline styles. Use dark-friendly colors: background #06060f, text #f1f5f9, accent #7c3aed.
Keep it concise and actionable. No fluff.`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const htmlBody = result.response.text().trim()

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'GlanceFlow <noreply@glanceflow.app>',
      to: user.email!,
      subject: `📋 Your GlanceFlow Weekly Summary — ${tasks.length} tasks pending`,
      html: `
        <div style="background:#06060f;color:#f1f5f9;font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;border-radius:16px;">
          <div style="margin-bottom:24px;">
            <span style="font-size:24px;font-weight:900;background:linear-gradient(135deg,#a78bfa,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">GlanceFlow</span>
          </div>
          ${htmlBody}
          <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:#64748b;">
            Sent by GlanceFlow AI Summary • <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="color:#7c3aed;">Open Dashboard</a>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, taskCount: tasks.length })
  } catch (err) {
    console.error('[api/summary]', err)
    return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 500 })
  }
}
