import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'GlanceFlow — Screenshot to Task with AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#06060f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
        }} />

        {/* Logo + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            ⚡
          </div>
          <span style={{
            fontSize: 48, fontWeight: 900,
            background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            GlanceFlow
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 56, fontWeight: 900, color: '#f1f5f9',
          textAlign: 'center', lineHeight: 1.1,
          maxWidth: 900,
        }}>
          Screenshot → Task in{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
            backgroundClip: 'text', color: 'transparent',
          }}>
            3 secondi
          </span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 24, color: '#94a3b8', marginTop: 24,
          textAlign: 'center', maxWidth: 700,
        }}>
          AI estrae automaticamente task, eventi e reminder dai tuoi screenshot.
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
          {['📸 Screenshot', '🔗 Link & Testo', '📬 AI Summary', '📅 Calendar'].map(f => (
            <div key={f} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 50, padding: '10px 20px',
              fontSize: 18, color: '#cbd5e1', fontWeight: 600,
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute', bottom: 36,
          fontSize: 18, color: '#475569', fontWeight: 600,
        }}>
          glanceflow.app
        </div>
      </div>
    ),
    { ...size }
  )
}
