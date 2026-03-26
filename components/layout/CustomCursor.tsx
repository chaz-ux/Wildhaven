'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const mouse   = useRef({ x: 0, y: 0 })
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      dot.style.left = e.clientX + 'px'
      dot.style.top  = e.clientY + 'px'
    }

    const onEnterLink = () => {
      dot.classList.add('hovering')
      ring.classList.add('hovering')
    }
    const onLeaveLink = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
    }

    const animate = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.1
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.1
      ring.style.left = ringPos.current.x + 'px'
      ring.style.top  = ringPos.current.y + 'px'
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    document.addEventListener('mousemove', onMove)

    // Re-attach on DOM changes
    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    }
    attachHoverListeners()

    const observer = new MutationObserver(attachHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
