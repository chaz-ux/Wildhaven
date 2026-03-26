'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import type { TourFull } from '@/lib/types'

interface StickyPricingBarProps {
  tour: TourFull
}

export default function StickyPricingBar({ tour }: StickyPricingBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-[200] glass border-t border-gold/15 transition-transform duration-500',
      visible ? 'translate-y-0' : 'translate-y-full'
    )}>
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        {/* Tour info */}
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[0.62rem] tracking-[0.15em] uppercase text-gold/60">{tour.tier?.name}</p>
            <p className="text-sm text-ivory font-light">{tour.title}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/10" />
          <div className="hidden sm:block">
            <p className="text-[0.6rem] text-ivory/30 uppercase tracking-wide">Duration</p>
            <p className="text-sm text-ivory/70">{tour.days_duration} Days</p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center gap-4">
          {/* Scarcity */}
          {tour.scarcity_text && (
            <div className="hidden md:flex items-center gap-1.5 text-[0.68rem] text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 scarcity-dot" />
              {tour.scarcity_text}
            </div>
          )}

          <div>
            <p className="text-[0.6rem] text-ivory/30 uppercase tracking-wide text-right">From</p>
            <p
              className="text-xl text-gold"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {formatPrice(tour.base_price)}
              <span className="text-xs text-ivory/30 font-sans"> /pp</span>
            </p>
          </div>

          <Link
            href={`/contact?tour=${tour.slug}`}
            className="btn-shine text-[0.72rem] tracking-[0.12em] uppercase font-medium bg-gold text-charcoal px-6 py-2.5 rounded-sm hover:bg-gold-light transition-colors duration-300"
          >
            Book This Safari
          </Link>
        </div>
      </div>
    </div>
  )
}
