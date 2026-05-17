'use client'

import { useRef, useState } from 'react'

interface Tilt3DProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export default function Tilt3D({ children, className = '', intensity = 12 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({})

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setStyle({
      transform: `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.03)`,
      transition: 'transform 0.1s ease',
      boxShadow: `${-x * 20}px ${-y * 20}px 40px rgba(139,92,246,0.15), 0 20px 60px rgba(0,0,0,0.4)`,
    })
  }

  function handleMouseLeave() {
    setStyle({
      transform: 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease',
      boxShadow: '',
    })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
