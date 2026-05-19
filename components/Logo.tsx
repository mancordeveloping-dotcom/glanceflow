'use client'

import { useId } from 'react'

export default function Logo({ size = 32 }: { size?: number }) {
  const uid = useId().replace(/:/g, '')
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
          <stop stopColor="#120929" />
          <stop offset="1" stopColor="#07121f" />
        </linearGradient>
        <linearGradient id={gradId} x1="5" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="11" fill={`url(#${bgId})`} />

      {/* Subtle border */}
      <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="10.4"
        stroke={`url(#${gradId})`} strokeWidth="0.7" fill="none" opacity="0.4" />

      {/* Glow layer behind the G */}
      <path
        d="M27 12 C20 6 9 9 8 20 C7 31 17 34 25 30 C29 28 30 24 30 21 L22 21"
        stroke={`url(#${gradId})`} strokeWidth="5" strokeLinecap="round" fill="none"
        opacity="0.25" filter={`url(#${glowId})`}
      />

      {/* Main G arc */}
      <path
        d="M27 12 C20 6 9 9 8 20 C7 31 17 34 25 30 C29 28 30 24 30 21 L22 21"
        stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round" fill="none"
      />

      {/* Arrow on the G bar → Flow */}
      <path
        d="M22 18.5 L25.5 21 L22 23.5"
        stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />

      {/* Accent dot — AI spark */}
      <circle cx="31" cy="9.5" r="3.5" fill="#22d3ee" opacity="0.15" />
      <circle cx="31" cy="9.5" r="1.9" fill="#22d3ee" />
    </svg>
  )
}
