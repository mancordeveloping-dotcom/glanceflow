'use client'

import { useRef, useState } from 'react'
import type React from 'react'

interface Tilt3DProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  style?: React.CSSProperties
}

export default function Tilt3D({ children, className = '', intensity = 14, style: propStyle }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mouseStyle, setMouseStyle] = useState<React.CSSProperties>({})

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMouseStyle({
      transform: `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.04)`,
      transition: 'transform 0.08s linear',
      boxShadow: `${-x * 28}px ${-y * 28}px 60px rgba(139,92,246,0.25), 0 24px 60px rgba(0,0,0,0.55)`,
      borderColor: 'rgba(139,92,246,0.45)',
    })
  }

  function handleMouseLeave() {
    setMouseStyle({
      transform: 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)',
      transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s ease, border-color 0.4s ease',
      boxShadow: '',
      borderColor: '',
    })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...propStyle, ...mouseStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
