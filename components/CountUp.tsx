'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  end: string
  duration?: number
  className?: string
}

export default function CountUp({ end, duration = 2000, className = '' }: CountUpProps) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        // Extract numeric part
        const numeric = parseFloat(end.replace(/[^0-9.]/g, ''))
        const suffix = end.replace(/[0-9.]/g, '')
        if (isNaN(numeric)) { setDisplay(end); return }

        const startTime = performance.now()
        function update(now: number) {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.round(eased * numeric * 10) / 10
          setDisplay(`${Number.isInteger(current) ? current : current.toFixed(1)}${suffix}`)
          if (progress < 1) requestAnimationFrame(update)
        }
        requestAnimationFrame(update)
      }
    }, { threshold: 0.5 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref} className={className}>{display}</span>
}
