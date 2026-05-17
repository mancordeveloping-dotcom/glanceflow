'use client'

const particles = [
  { x: 15, y: 20, size: 2, delay: 0, duration: 8 },
  { x: 80, y: 10, size: 1.5, delay: 1, duration: 10 },
  { x: 45, y: 60, size: 2.5, delay: 2, duration: 7 },
  { x: 70, y: 80, size: 1, delay: 0.5, duration: 12 },
  { x: 25, y: 75, size: 2, delay: 3, duration: 9 },
  { x: 90, y: 45, size: 1.5, delay: 1.5, duration: 11 },
  { x: 55, y: 30, size: 1, delay: 4, duration: 8 },
  { x: 10, y: 50, size: 2, delay: 2.5, duration: 13 },
  { x: 65, y: 15, size: 1.5, delay: 0.8, duration: 9 },
  { x: 35, y: 90, size: 1, delay: 3.5, duration: 10 },
  { x: 85, y: 65, size: 2, delay: 1.2, duration: 8 },
  { x: 5,  y: 35, size: 1, delay: 4.5, duration: 11 },
]

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-40" style={{
        background: 'radial-gradient(ellipse 80% 80% at 20% 20%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(6,182,212,0.12) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(244,63,94,0.06) 0%, transparent 60%)',
        animation: 'aurora 15s ease-in-out infinite',
      }} />

      {/* Aurora blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div className="bg-blob bg-blob-4" />

      {/* Grid */}
      <div className="bg-grid" />

      {/* Light beams */}
      <div className="beam beam-top" />
      <div className="beam beam-bottom" />

      {/* Floating particles */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill={i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#38bdf8' : '#f472b6'}
            opacity="0.4"
            style={{
              animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </svg>

      {/* Dot noise */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="#a78bfa" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Radial vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(6,6,15,0.6) 100%)'
      }} />
    </div>
  )
}
