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

        {/* violet → indigo → cyan */}
        <linearGradient id={gradId} x1="3" y1="5" x2="37" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.45" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>

        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="b" />
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

      {/* ── Glow pass (blurred behind) ── */}
      <g filter={`url(#${glowId})`} opacity="0.35">
        {/* G arc */}
        <path d="M 21,11 A 10,10 0 1 0 21,27 L 13,27"
          stroke={`url(#${gradId})`} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Lightning F: top bar → diagonal → mid bar → diagonal */}
        <path d="M 22,10 L 31,10 L 23,20 L 29,20 L 21,31"
          stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* ── G — open arc with horizontal bar ── */}
      <path
        d="M 21,11 A 10,10 0 1 0 21,27 L 13,27"
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Lightning bolt shaped as F ──
           top bar  →  diagonal ↙  →  mid bar →  diagonal ↙
           reads as F, strikes as ⚡                        ── */}
      <path
        d="M 22,10 L 31,10 L 23,20 L 29,20 L 21,31"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
