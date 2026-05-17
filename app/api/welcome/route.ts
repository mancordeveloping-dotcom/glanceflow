import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(`welcome:${getIP(req)}`, PRESETS.strict)
  if (limited) return limited

  const { email } = await req.json() as { email: string }
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'GlanceFlow <onboarding@resend.dev>',
      to: email,
      subject: 'Benvenuto su GlanceFlow! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #06060f; color: #f1f5f9; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
              <span style="font-size: 32px;">⚡</span>
            </div>
            <h1 style="font-size: 28px; font-weight: 900; margin: 0; background: linear-gradient(135deg, #a78bfa, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              Benvenuto su GlanceFlow!
            </h1>
          </div>

          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Ciao! Il tuo account è attivo. Ora puoi trasformare qualsiasi screenshot in task con l'AI — in meno di 3 secondi.
          </p>

          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #a78bfa; font-weight: 700; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Come iniziare</p>
            <div style="space-y: 12px;">
              <p style="color: #e2e8f0; margin: 8px 0;">📸 <strong>1.</strong> Fai uno screenshot di WhatsApp, email o note</p>
              <p style="color: #e2e8f0; margin: 8px 0;">⚡ <strong>2.</strong> Caricalo su GlanceFlow</p>
              <p style="color: #e2e8f0; margin: 8px 0;">✅ <strong>3.</strong> L'AI estrae tutti i task automaticamente</p>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.NEXT_PUBLIC_URL}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px;">
              Inizia ora →
            </a>
          </div>

          <p style="color: #475569; font-size: 12px; text-align: center; margin: 0;">
            Piano gratuito: 3 screenshot al giorno.
            <a href="${process.env.NEXT_PUBLIC_URL}/pricing" style="color: #a78bfa;">Upgrade a Premium →</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
