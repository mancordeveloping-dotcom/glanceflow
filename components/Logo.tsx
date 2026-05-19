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
        {/* Dark background gradient */}
        <linearGradient id={bgId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e0820" />
          <stop offset="1" stopColor="#060f1e" />
        </linearGradient>

        {/* Violet → indigo → cyan brand gradient */}
        <linearGradient id={gradId} x1="2" y1="4" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>

        {/* Soft glow filter */}
        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background tile */}
      <rect width="40" height="40" rx="11" fill={`url(#${bgId})`} />

      {/* Hairline gradient border */}
      <rect
        x="0.65" y="0.65" width="38.7" height="38.7" rx="10.35"
        stroke={`url(#${gradId})`} strokeWidth="0.8" fill="none" opacity="0.35"
      />

      {/* Glow layer (blurred copy behind the text) */}
      <text
        x="20" y="26"
        textAnchor="middle"
        fontFamily="'Inter', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="17"
        letterSpacing="-1"
        fill={`url(#${gradId})`}
        filter={`url(#${glowId})`}
        opacity="0.45"
      >GF</text>

      {/* Crisp GF monogram */}
      <text
        x="20" y="26"
        textAnchor="middle"
        fontFamily="'Inter', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="17"
        letterSpacing="-1"
        fill={`url(#${gradId})`}
      >GF</text>
    </svg>
  )
}
