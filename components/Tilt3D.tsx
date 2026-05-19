'use client'

import { useRef } from 'react'
import type React from 'react'

interface Tilt3DProps {
  children: React.ReactNode
  className?: string
  /** Max tilt angle in degrees (default 12) */
  intensity?: number
  /** Scale on hover (default 1.04) */
  scale?: number
  /** Show glare highlight (default true) */
  glare?: boolean
  style?: React.CSSProperties
}

/**
 * Tilt3D — 60fps mouse-tracking 3D perspective tilt.
 * Uses rAF + direct DOM writes — zero re-renders.
 * Add `data-depth="N"` (px) to child elements to make them float at different Z depths.
 */
export default function Tilt3D({
  children,
  className = '',
  intensity = 12,
  scale = 1.04,
  glare = true,
  style: propStyle,
}: Tilt3DProps) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rafRef   = useRef<number>(0)
  const isIn     = useRef(false)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const el = cardRef.current
      if (!el) return
      const r   = el.getBoundingClientRect()
      const x   = e.clientX - r.left
      const y   = e.clientY - r.top
      const cx  = r.width  / 2
      const cy  = r.height / 2
      const rx  = ((y - cy) / cy) * -intensity
      const ry  = ((x - cx) / cx) *  intensity

      el.style.transform   = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${scale},${scale},${scale})`
      el.style.boxShadow   = `${-ry * 1.5}px ${rx * 1.5}px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.18)`
      el.style.borderColor = 'rgba(139,92,246,0.4)'

      if (glare && glareRef.current) {
        const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90
        const dist  = Math.min(Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / Math.max(cx, cy), 1)
        glareRef.current.style.transform = `rotate(${angle}deg)`
        glareRef.current.style.opacity   = String(dist * 0.22)
      }
    })
  }

  function onEnter() {
    isIn.current = true
    const el = cardRef.current
    if (el) el.style.transition = 'transform 0.12s linear, box-shadow 0.12s linear, border-color 0.2s ease'
  }

  function onLeave() {
    isIn.current = false
    cancelAnimationFrame(rafRef.current)
    const el = cardRef.current
    if (el) {
      el.style.transition  = 'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s ease, border-color 0.4s ease'
      el.style.transform   = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
      el.style.boxShadow   = ''
      el.style.borderColor = ''
    }
    if (glare && glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...propStyle,
      }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}

      {/* Specular glare */}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            overflow: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 10,
            transition: 'opacity 0.15s ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-80%',
              left: '-80%',
              width: '260%',
              height: '260%',
              transformOrigin: '50% 50%',
              background: 'linear-gradient(0deg, transparent 25%, rgba(255,255,255,0.12) 55%, transparent 80%)',
            }}
          />
        </div>
      )}
    </div>
  )
}
