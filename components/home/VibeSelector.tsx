'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { cn, getTierBadgeStyle } from '@/lib/utils'
import type { Tier } from '@/lib/types'

const TIER_ICONS: Record<string, string> = {
  sovereign: '♔',
  horizon:   '◎',
  tribe:     '◉',
}

const TIER_PRICE: Record<string, string> = {
  sovereign: 'From $8,500',
  horizon:   'From $2,400',
  tribe:     'From $950',
}

const TIER_FEATURES: Record<string, string[]> = {
  sovereign: ['Private conservancy access', 'Dedicated naturalist & vehicle', 'Butler-attended tented camp', 'Hot air balloon included', 'Max 2 guests per vehicle'],
  horizon:   ['Semi-private game drives', 'Intimate lodge or camp', 'Expert guide (max 6 guests)', 'All meals included', 'Flexible routing'],
  tribe:     ['Shared 4x4 vehicles', 'Legendary campsites', 'Professional driver-guide', 'All meals included', 'Social group energy'],
}

interface VibeCardProps {
  tier: Tier
  index: number
}

function VibeCard({ tier, index }: VibeCardProps) {
  const features = TIER_FEATURES[tier.slug] || []
  const badgeClass = getTierBadgeStyle(tier.slug)

  return (
    <div
      className="reveal-hidden group relative border border-white/8 rounded-sm overflow-hidden transition-all duration-600 hover:border-gold/30 hover:-translate-y-2 bg-charcoal-mid/40"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Top accent line */}
      <div
        className="h-px w-0 group-hover:w-full transition-all duration-700"
        style={{ background: tier.hero_color || '#C9A84C' }}
      />

      <div className="p-8">
        {/* Icon + Tier badge */}
        <div className="flex items-start justify-between mb-6">
          <span className="text-3xl opacity-70">{TIER_ICONS[tier.slug]}</span>
          <span className={cn('text-[0.6rem] tracking-[0.2em] uppercase border px-2 py-1 rounded-sm', badgeClass)}>
            Tier {index + 1}
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-3xl text-ivory mb-1"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
        >
          {tier.name}
        </h3>
        <p className="text-[0.72rem] tracking-[0.15em] uppercase text-gold/70 mb-4">{tier.tagline}</p>

        {/* Description */}
        <p className="text-sm text-ivory/45 leading-relaxed mb-6 font-light">{tier.description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-8">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[0.8rem] text-ivory/50">
              <span className="w-3.5 h-px bg-gold/40 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-6 border-t border-white/6">
          <div>
            <p className="text-[0.65rem] text-ivory/30 tracking-wide uppercase mb-1">Starting from</p>
            <p
              className="text-2xl text-sand"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {TIER_PRICE[tier.slug]}
              <span className="text-sm text-ivory/30 font-sans"> /person</span>
            </p>
          </div>
          <Link
            href={`/safaris?tier=${tier.slug}`}
            className="flex items-center gap-1.5 text-[0.72rem] tracking-[0.12em] uppercase text-gold border-b border-transparent hover:border-gold transition-colors duration-300 pb-0.5"
          >
            View
            <svg viewBox="0 0 16 16" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VibeSelector({ tiers }: { tiers: Tier[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const cards = section.querySelectorAll('.reveal-hidden')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    cards.forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [])

  const displayTiers = tiers.length > 0 ? tiers : [
    { id: '1', slug: 'sovereign' as const, name: 'The Sovereign', tagline: 'The wild, without compromise', description: 'Private conservancies, butler-attended tented camps, and exclusive game drives with dedicated naturalists.', hero_color: '#C9A84C', sort_order: 1, vibe_video_url: null, created_at: '' },
    { id: '2', slug: 'horizon'   as const, name: 'The Horizon',   tagline: 'Comfort meets the call of the wild', description: 'Intimate camps, semi-private vehicles, and expertly curated routes.', hero_color: '#7A8C6E', sort_order: 2, vibe_video_url: null, created_at: '' },
    { id: '3', slug: 'tribe'     as const, name: 'The Tribe',     tagline: 'The wildest memories cost the least', description: 'Shared vehicles, legendary campsites, and a community of like-minded adventurers.', hero_color: '#8C7660', sort_order: 3, vibe_video_url: null, created_at: '' },
  ]

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-charcoal-mid/50">
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="reveal-hidden text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-3">Choose Your Journey</p>
          <h2
            className="reveal-hidden text-display-md text-ivory delay-100"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            How Do You Wild?
          </h2>
          <p className="reveal-hidden text-sm text-ivory/40 mt-3 max-w-md mx-auto font-light delay-200">
            Three distinct philosophies. One unforgettable continent.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTiers.map((tier, i) => (
            <VibeCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
