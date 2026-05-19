'use client'

import { useId } from 'react'

export default function Logo({ size = 32 }: { size?: number }) {
  const uid    = useId().replace(/:/g, '')
  const bgId   = `lg-bg-${uid}`
  const gradId = `lg-gr-${uid}`
  const glowId = `lg-gw-${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e0820" />
          <stop offset="1" stopColor="#060f1e" />
        </linearGradient>
        <linearGradient id={gradId} x1="2" y1="4" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="11" fill={`url(#${bgId})`} />
      <rect x="0.65" y="0.65" width="38.7" height="38.7" rx="10.35"
        stroke={`url(#${gradId})`} strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* ── Glow pass ── */}
      <g filter={`url(#${glowId})`} opacity="0.3">
        {/*
          G — geometrico, apre a destra, barra orizzontale al centro-destra
          Costruzione:
            partenza in alto destra dell'apertura → arco grande CCW attorno → arrivo a destra centro
            poi barra sinistra → segmento verticale giù
        */}
        <path
          d="M 16.5,8.5 C 9,8.5 4,13.5 4,20 C 4,26.5 9,31.5 16.5,31.5 C 21,31.5 24.5,29.5 26,27 L 26,20.5 L 18,20.5"
          stroke={`url(#${gradId})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Lightning bolt F */}
        <path d="M 30,8 L 38,8 L 31,19 L 37,19 L 30,32"
          stroke={`url(#${gradId})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* ── G lettera vera ──
          C-shape che si chiude a destra con barra orizzontale
          apre a destra, barra entra da destra verso il centro
      */}
      <path
        d="M 16.5,8.5 C 9,8.5 4,13.5 4,20 C 4,26.5 9,31.5 16.5,31.5 C 21,31.5 24.5,29.5 26,27 L 26,20.5 L 18,20.5"
        stroke={`url(#${gradId})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Lightning bolt come F ──
          barra top → diagonale ↙ → barra mid → diagonale ↙
      */}
      <path
        d="M 30,8 L 38,8 L 31,19 L 37,19 L 30,32"
        stroke={`url(#${gradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
