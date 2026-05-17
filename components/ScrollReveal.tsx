'use client'

import { useEffect, useRef, useState } from 'react'
import type React from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const hiddenStyles: Record<string, React.CSSProperties> = {
    up:    { opacity: 0, transform: 'translateY(52px)' },
    left:  { opacity: 0, transform: 'translateX(-52px)' },
    right: { opacity: 0, transform: 'translateX(52px)' },
    scale: { opacity: 0, transform: 'scale(0.85)' },
  }

  const style: React.CSSProperties = visible
    ? {
        opacity: 1,
        transform: 'none',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }
    : { ...hiddenStyles[direction], transition: 'none' }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
