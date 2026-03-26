'use client'

import { useEffect, useRef, useState } from 'react'

export function useParallax(speed = 0.4) {
  const ref    = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      // Only calculate when element is near viewport
      if (rect.bottom < -200 || rect.top > viewH + 200) return
      const relY = (viewH / 2 - rect.top - rect.height / 2)
      setOffset(relY * speed)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return { ref, offset }
}

// Simple scroll progress (0 → 1) for a section
export function useScrollProgress() {
  const ref      = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      const prog = 1 - (rect.bottom / (viewH + rect.height))
      setProgress(Math.max(0, Math.min(1, prog)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { ref, progress }
}
