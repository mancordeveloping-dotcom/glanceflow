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

      {/* Glow layer behind lightning bolt */}
      <path
        d="M23 6 L13 22 L19.5 22 L17 34 L27 18 L20.5 18 Z"
        fill={`url(#${gradId})`} opacity="0.25" filter={`url(#${glowId})`}
      />

      {/* Lightning bolt */}
      <path
        d="M23 6 L13 22 L19.5 22 L17 34 L27 18 L20.5 18 Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  )
}
