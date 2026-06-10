'use client'

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Static gradient base — stronger depth, no animation */}
      <div className="absolute inset-0" style={{
        background:
          'radial-gradient(ellipse 65% 55% at 15% 5%, rgba(124,58,237,0.22) 0%, transparent 60%), ' +
          'radial-gradient(ellipse 55% 45% at 85% 85%, rgba(6,182,212,0.18) 0%, transparent 60%), ' +
          'radial-gradient(ellipse 40% 35% at 80% 10%, rgba(139,92,246,0.10) 0%, transparent 55%)',
      }} />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), ' +
          'linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* Dot noise — static, no animation */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="#a78bfa" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Vignette edges */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 70% at 50% 0%, transparent 50%, rgba(6,6,15,0.6) 100%)'
      }} />
    </div>
  )
}
