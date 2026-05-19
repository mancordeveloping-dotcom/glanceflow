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

        {/* violet → cyan */}
        <linearGradient id={gradId} x1="2" y1="4" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>

        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="11" fill={`url(#${bgId})`} />

      {/* Hairline border */}
      <rect x="0.65" y="0.65" width="38.7" height="38.7" rx="10.35"
        stroke={`url(#${gradId})`} strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* ── Glow pass ── */}
      <g filter={`url(#${glowId})`} opacity="0.35">
        {/* G — big open arc, opening on the right, bar at bottom of opening */}
        <path d="M 18,10 A 9,9 0 1 0 18,28 L 11,28"
          stroke={`url(#${gradId})`} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Lightning bolt shaped like F */}
        <path d="M 23,9 L 33,9 L 25,20 L 31,20 L 23,32"
          stroke={`url(#${gradId})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* ── G — clear open arc ── */}
      <path
        d="M 18,10 A 9,9 0 1 0 18,28 L 11,28"
        stroke={`url(#${gradId})`}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Lightning bolt / F
            top bar  (23,9)→(33,9)
            diag ↙   (33,9)→(25,20)
            mid bar  (25,20)→(31,20)
            diag ↙   (31,20)→(23,32)   ── */}
      <path
        d="M 23,9 L 33,9 L 25,20 L 31,20 L 23,32"
        stroke={`url(#${gradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
