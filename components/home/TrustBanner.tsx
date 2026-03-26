'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 4200, suffix: '+', label: 'Safaris Delivered' },
  { value: 47,   suffix: '',  label: 'Conservancy Partners' },
  { value: 9.7,  suffix: '',  label: 'Average Guest Rating', decimal: true },
  { value: 12,   suffix: '',  label: 'Years in the Wild' },
]

const PARTNERS = ['SafariBookings', 'TripAdvisor', 'Kenya Wildlife Service', 'TANAPA', 'SATSA', 'Virtuoso']

function AnimatedStat({ value, suffix, label, decimal }: { value: number; suffix: string; label: string; decimal?: boolean }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const duration = 1800
        const start = Date.now()
        const step = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCurrent(eased * value)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        obs.unobserve(el)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-center">
      <p
        className="text-5xl md:text-6xl text-gold mb-2"
        style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
      >
        {decimal ? current.toFixed(1) : Math.floor(current).toLocaleString()}{suffix}
      </p>
      <p className="text-[0.65rem] tracking-[0.2em] uppercase text-ivory/30">{label}</p>
    </div>
  )
}

export default function TrustBanner() {
  return (
    <section className="py-24 px-6 bg-charcoal border-y border-white/5">
      <div className="max-w-[1400px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
          {STATS.map(s => (
            <AnimatedStat key={s.label} {...s} />
          ))}
        </div>

        {/* Divider with text */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex-1 h-px bg-white/6" />
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-ivory/20">Trusted by global travellers</p>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        {/* Partner logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {PARTNERS.map(p => (
            <span key={p} className="text-[0.7rem] tracking-[0.2em] uppercase text-ivory/15 hover:text-ivory/35 transition-colors duration-500 font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
