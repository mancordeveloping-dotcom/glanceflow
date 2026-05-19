export default function Logo({ size = 32 }: { size?: number }) {
  // Each render needs unique gradient IDs to avoid conflicts when rendered multiple times
  const id = typeof window !== 'undefined' ? '' : ''
  const g1 = `gf-g1${id}`
  const g2 = `gf-g2${id}`
  const g3 = `gf-g3${id}`
  const glow = `gf-glow${id}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GlanceFlow"
    >
      <defs>
        {/* Background */}
        <linearGradient id={g1} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#12092e" />
          <stop offset="1" stopColor="#07121f" />
        </linearGradient>

        {/* Main stroke gradient: violet → cyan */}
        <linearGradient id={g2} x1="5" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.55" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>

        {/* Inner glow */}
        <radialGradient id={g3} cx="45%" cy="38%" r="52%">
          <stop stopColor="#7c3aed" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>

        {/* Blur filter for glow layer */}
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
        </filter>
      </defs>

      {/* Background square */}
      <rect width="40" height="40" rx="11" fill={`url(#${g1})`} />
      <rect width="40" height="40" rx="11" fill={`url(#${g3})`} />

      {/* Outer border ring */}
      <rect
        x="0.6" y="0.6" width="38.8" height="38.8" rx="10.4"
        stroke={`url(#${g2})`} strokeWidth="0.6" fill="none" opacity="0.35"
      />

      {/* ── Glow copy (blurred, low opacity) ── */}
      <g filter={`url(#${glow})`} opacity="0.35">
        {/* G arc */}
        <path
          d="M27 12 C20 6, 9 9, 8 20 C7 31, 17 34, 25 30 C29 28, 30 24, 30 21 L22 21"
          stroke={`url(#${g2})`} strokeWidth="3.5" strokeLinecap="round" fill="none"
        />
        {/* Arrow */}
        <path
          d="M22 18 L25.5 21 L22 24"
          stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      </g>

      {/* ── Main G mark ── */}
      {/*
        G letterform: open arc from upper-right, sweeping counterclockwise
        around left side, bottom, back to right, then inward horizontal bar.
        The open "mouth" of the G + the horizontal bar reads as both:
          • the letter G  (brand initial)
          • a camera lens aperture (screenshot concept)
        The arrow at the bar end = "Flow" direction
      */}
      <path
        d="M27 12 C20 6, 9 9, 8 20 C7 31, 17 34, 25 30 C29 28, 30 24, 30 21 L22 21"
        stroke={`url(#${g2})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Horizontal bar arrowhead → "flow" */}
      <path
        d="M22 18 L25.5 21 L22 24"
        stroke={`url(#${g2})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Accent: AI spark dot (top-right) ── */}
      {/* Outer glow ring */}
      <circle cx="31" cy="9.5" r="3.8" fill="#22d3ee" opacity="0.12" />
      {/* Inner dot */}
      <circle cx="31" cy="9.5" r="2" fill="#22d3ee" opacity="0.95" />
      {/* Tiny cross sparkle */}
      <line x1="31" y1="7.2" x2="31" y2="8.2" stroke="#22d3ee" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <line x1="33" y1="9.5" x2="32" y2="9.5" stroke="#22d3ee" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
