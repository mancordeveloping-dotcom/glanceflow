'use client'

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Static gradient base — no animation, no blur filter */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 20% 10%, rgba(124,58,237,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(6,182,212,0.09) 0%, transparent 55%)',
      }} />

      {/* Dot noise — static, no animation */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="#a78bfa" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(6,6,15,0.5) 100%)'
      }} />
    </div>
  )
}
