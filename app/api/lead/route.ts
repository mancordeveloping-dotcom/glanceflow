import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIP, PRESETS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(`lead:${getIP(req)}`, PRESETS.strict)
  if (limited) return limited

  const { email } = await req.json() as { email?: string }
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'GlanceFlow <onboarding@resend.dev>',
      to: email,
      subject: '⚡ Le tue 5 mosse per smettere di perdere task nei messaggi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #06060f; color: #f1f5f9; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 14px 20px; border-radius: 14px; margin-bottom: 16px;">
              <span style="font-size: 28px;">⚡</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #ffffff;">
              5 mosse per smettere di perdere task
            </h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 6px;">La guida veloce che ti ho promesso</p>
          </div>

          ${[
            ['📱', 'Installa GlanceFlow come app', 'Sul tuo telefono, vai su glanceflow.app, tocca "Condividi" e poi "Aggiungi a Home". Ora hai l\'app sul telefono come WhatsApp.'],
            ['📸', 'Scatta screenshot subito', 'Ogni volta che vedi un task in un messaggio — scatta lo screenshot prima di chiudere la chat. Costo: 1 secondo.'],
            ['⚡', 'Carica subito, non "dopo"', 'Il problema con "lo faccio dopo" è che dopo non arriva mai. Carica lo screenshot nello stesso momento.'],
            ['🏷️', 'Usa i progetti per categoria', 'Crea un progetto per ogni area della tua vita: Lavoro, Casa, Personale. I task estratti vanno direttamente lì.'],
            ['🔁', 'Attiva i reminder settimanali', 'Nel profilo puoi attivare un\'email riepilogo settimanale con tutti i task in scadenza. Non perdi più nulla.'],
          ].map(([icon, title, text], i) => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 18px; margin-bottom: 12px; display: flex; gap: 14px; align-items: flex-start;">
              <div style="background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2)); border-radius: 10px; padding: 10px; font-size: 20px; line-height: 1; flex-shrink: 0;">${icon}</div>
              <div>
                <p style="color: #ffffff; font-weight: 700; margin: 0 0 4px; font-size: 14px;">${i + 1}. ${title}</p>
                <p style="color: #94a3b8; margin: 0; font-size: 13px; line-height: 1.5;">${text}</p>
              </div>
            </div>
          `).join('')}

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px;">
              Inizia gratis — 10 task/giorno →
            </a>
          </div>

          <p style="color: #334155; font-size: 11px; text-align: center; margin-top: 24px; line-height: 1.6;">
            GlanceFlow · Made with ♥ in Italy<br>
            Hai ricevuto questa email perché l'hai richiesta su glanceflow.app.<br>
            <a href="${process.env.NEXT_PUBLIC_URL}" style="color: #475569;">Visita il sito →</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
