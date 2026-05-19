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
          {/* G + lightning-F icon */}
          <svg width="72" height="72" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="11" fill="#0e0820"/>
            <rect x="0.65" y="0.65" width="38.7" height="38.7" rx="10.35"
              stroke="#818cf8" strokeWidth="0.8" fill="none" opacity="0.35"/>
            <path d="M 21,11 A 10,10 0 1 0 21,27 L 13,27"
              stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M 22,10 L 31,10 L 23,20 L 29,20 L 21,31"
              stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
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
