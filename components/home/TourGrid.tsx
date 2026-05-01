'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import TourCard from '@/components/tours/TourCard'
import TierExplainer from './TierExplainer'
import type { Tour } from '@/lib/types'

const FILTERS = [
  { id: 'all',       label: 'All Safaris',        description: 'Browse every safari experience' },
  { id: 'sovereign', label: 'The Sovereign',      description: 'Private luxury, $8.5k+' },
  { id: 'horizon',   label: 'The Horizon',        description: 'Authentic comfort, $2.4k–$5.5k' },
  { id: 'tribe',     label: 'The Tribe',          description: 'Community adventure, $950+' },
]

interface TourGridProps {
  tours: Tour[]
  initialFilter?: string
}

export default function TourGrid({ tours, initialFilter = 'all' }: TourGridProps) {
  const [active, setActive] = useState(initialFilter)
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Update filter from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tier = params.get('tier')
    if (tier) setActive(tier)
  }, [])

  const filtered = tours.filter(t => {
    if (active === 'all') return true
    if (active === 'kenya'    || active === 'tanzania')
      return t.destination?.country?.toLowerCase() === active
    return t.tier?.slug === active
  })

  // Reveal on scroll
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const cards = section.querySelectorAll('.reveal-hidden')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    cards.forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [filtered])

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-charcoal">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-2">Safari Experiences</p>
            <h2
              className="text-display-md text-ivory"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
            >
              Find Your Safari
            </h2>
          </div>

          {/* Filter pills with hover info */}
          <div className="flex flex-wrap gap-2 relative">
            {FILTERS.map(f => (
              <div key={f.id} className="relative group">
                <button
                  onMouseEnter={() => setHoveredFilter(f.id)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  onClick={() => setActive(f.id)}
                  className={cn(
                    'text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 rounded-sm border transition-all duration-300',
                    active === f.id
                      ? 'border-gold text-gold bg-gold/8'
                      : 'border-white/12 text-ivory/35 hover:border-white/25 hover:text-ivory/60'
                  )}
                >
                  {f.label}
                </button>
                
                {/* Tooltip on hover for non-'all' filters */}
                {f.id !== 'all' && hoveredFilter === f.id && (
                  <div className="absolute bottom-full left-0 mb-2 w-max bg-charcoal border border-white/15 rounded-sm px-3 py-2 text-[0.65rem] text-ivory/60 whitespace-nowrap pointer-events-none z-50">
                    {f.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info banner when tier is selected */}
        {active !== 'all' && (
          <div className="mb-8 p-4 bg-white/5 border border-white/8 rounded-sm text-sm text-ivory/60">
            <span className="text-gold">💡</span> Showing {filtered.length} safari{filtered.length !== 1 ? 's' : ''} in the <span className="text-ivory">{FILTERS.find(f => f.id === active)?.label}</span> tier
          </div>
        )}

        {/* Tier explanation when tier is selected */}
        <TierExplainer selectedTier={active} />

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tour, i) => (
              <div key={tour.id} className={cn('reveal-hidden', `delay-${Math.min(i * 100, 400)}`)}>
                <TourCard tour={tour} priority={i < 3} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-ivory/30">
            <p className="font-serif text-2xl mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>No safaris match this filter</p>
            <button onClick={() => setActive('all')} className="text-sm text-gold hover:text-gold-light transition-colors">
              View all safaris →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
