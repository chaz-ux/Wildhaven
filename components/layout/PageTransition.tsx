'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname   = usePathname()
  const isFirst    = useRef(true)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    if (isFirst.current) {
      isFirst.current = false
      // Initial page load: just fade the overlay out
      gsap.set(el, { yPercent: -100 })
      return
    }

    // Wipe in (cover the screen)
    gsap.timeline()
      .set(el, { yPercent: 100 })
      .to(el, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' })
      .to(el, { yPercent: -100, duration: 0.5, ease: 'power3.inOut', delay: 0.1 })
  }, [pathname])

  return (
    <div
      ref={overlayRef}
      className="page-transition-overlay"
      style={{ background: 'var(--color-charcoal)', position: 'fixed', inset: 0, zIndex: 9000, transform: 'translateY(-100%)' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-serif text-gold/40 text-2xl tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          ZAZU SAFARIS
        </span>
      </div>
    </div>
  )
}
