'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const TIER_DETAILS = {
  sovereign: {
    name: 'The Sovereign',
    tagline: 'Pure Luxury — Your Private Africa',
    icon: '♔',
    priceRange: '$8,500 – $18,000+',
    pricePerPerson: 'Per person, 5-8 days',
    whoItFor: 'Discerning travelers wanting zero compromises, ultimate privacy, and VIP experiences',
    groupSize: 'Up to 2 guests per vehicle',
    bestFor: [
      'Honeymoons & anniversaries',
      'Executives & dignitaries',
      'Families seeking privacy',
      'Photography expeditions',
    ],
    whatsIncluded: [
      'Private conservancy access (no crowds)',
      'Dedicated naturalist & 4x4 vehicle',
      'Butler-attended tented camp',
      'Premium meats & wine pairings',
      'Hot air balloon safari',
      'Gemstone massages at camp',
      'Bespoke itinerary design',
      'Priority booking at all camps',
    ],
    experience: 'Handpicked camps with world-class service. Your guide knows your preferences. Zero crowds. Maximum connection.',
    color: 'border-gold/40 bg-gradient-to-br from-gold/5 to-transparent',
    badge: 'border-gold/50 text-gold bg-gold/8',
  },
  horizon: {
    name: 'The Horizon',
    tagline: 'Exceptional Value — Authentic Comfort',
    icon: '◎',
    priceRange: '$2,400 – $5,500',
    pricePerPerson: 'Per person, 5-7 days',
    whoItFor: 'Thoughtful travelers who want authentic experiences, expert guides, and great value without unnecessary frills',
    groupSize: 'Up to 6 guests per vehicle',
    bestFor: [
      'First-time safari visitors',
      'Couples seeking adventure',
      'Small groups of friends',
      'Nature & wildlife enthusiasts',
    ],
    whatsIncluded: [
      'Intimate lodge or semi-private camp',
      'Expert guide with max 6 guests',
      'Semi-private game drives',
      'All meals included (hearty & fresh)',
      'Flexible daily routing',
      'Campfire conversations',
      'Professional photography tips',
      'Wildlife education lectures',
    ],
    experience: 'Authentic African hospitality meets real wildlife. You see the big cats, meet your guides, and leave as friends.',
    color: 'border-sage/40 bg-gradient-to-br from-sage/5 to-transparent',
    badge: 'border-sage/50 text-sage-light bg-sage/8',
  },
  tribe: {
    name: 'The Tribe',
    tagline: 'The Wild Truth — Community Adventure',
    icon: '◉',
    priceRange: '$950 – $2,200',
    pricePerPerson: 'Per person, 4-5 days',
    whoItFor: 'Adventurers who value authentic connection, community spirit, and memories over amenities. Budget-conscious explorers.',
    groupSize: 'Up to 12 guests per vehicle',
    bestFor: [
      'Budget travelers',
      'Young adventurers',
      'Group trips & reunions',
      'Solo travelers (safe groups)',
    ],
    whatsIncluded: [
      'Shared safari vehicles (legendary energy)',
      'Community campsites with other adventurers',
      'Professional driver-guide',
      'All meals included (filling & authentic)',
      'Morning & evening game drives',
      'Campfire bonding sessions',
      'Elephant encounter memories',
      'Lifetime friendships (guaranteed)',
    ],
    experience: 'No luxury nonsense—just wild Africa, honest guides, and 10 new best friends. Some of the most profound safaris start here.',
    color: 'border-sand/40 bg-gradient-to-br from-sand/5 to-transparent',
    badge: 'border-sand/50 text-sand bg-sand/8',
  },
}

export default function TierGuide() {
  const [selectedTier, setSelectedTier] = useState<'sovereign' | 'horizon' | 'tribe'>('horizon')
  const tier = TIER_DETAILS[selectedTier]

  return (
    <section className="py-32 px-6 bg-charcoal-mid/50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Understand Your Options</p>
          <h2
            className="text-display-md text-ivory mb-4"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            Three Tier Options. Honest Comparison.
          </h2>
          <p className="text-sm text-ivory/50 max-w-2xl mx-auto font-light">
            Whether you're dreaming of absolute luxury, authentic adventure, or making memories on a budget—we have the perfect tier for you. No upsell. No compromise.
          </p>
        </div>

        {/* Tab-style tier selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          {(Object.entries(TIER_DETAILS) as [keyof typeof TIER_DETAILS, any][]).map(([key, details]) => (
            <button
              key={key}
              onClick={() => setSelectedTier(key)}
              className={cn(
                'flex-1 sm:flex-none px-6 py-4 rounded-sm border-2 transition-all duration-300 text-left sm:text-center',
                selectedTier === key
                  ? `${details.color} border-gold`
                  : 'border-white/10 hover:border-white/20 bg-charcoal/30'
              )}
            >
              <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-1">
                <span className="text-2xl">{details.icon}</span>
                <div>
                  <p className="text-sm font-medium text-ivory">{details.name}</p>
                  <p className="text-[0.65rem] text-ivory/50">{details.priceRange}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tier details card */}
        <div className={cn(
          'rounded-lg border-2 p-10 transition-all duration-400',
          tier.color
        )}>
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl opacity-80">{tier.icon}</span>
              <div className="flex-1">
                <h3
                  className="text-4xl text-ivory mb-1"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
                >
                  {tier.name}
                </h3>
                <p className="text-sm text-gold mb-3">{tier.tagline}</p>
                <p className="text-[0.75rem] tracking-[0.1em] uppercase text-ivory/40 font-light">
                  {tier.whoItFor}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div>
                <p className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/40 mb-1">Price Range</p>
                <p className="text-2xl text-ivory font-light">{tier.priceRange}</p>
                <p className="text-[0.7rem] text-ivory/30 mt-1">{tier.pricePerPerson}</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/40 mb-1">Group Size</p>
                <p className="text-2xl text-ivory font-light">{tier.groupSize}</p>
              </div>
              <div>
                <p className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/40 mb-1">Best For</p>
                <ul className="space-y-0.5">
                  {tier.bestFor.slice(0, 2).map((item) => (
                    <p key={item} className="text-sm text-ivory/60">{item}</p>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Two-column layout for details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* What's included */}
            <div>
              <h4 className="text-sm font-medium text-gold mb-4 tracking-wide">✓ What's Included</h4>
              <ul className="space-y-2.5">
                {tier.whatsIncluded.map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <span className="text-gold mt-1 flex-shrink-0">+</span>
                    <span className="text-sm text-ivory/70 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience description + CTA */}
            <div className="flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-medium text-gold mb-4 tracking-wide">~ Experience Philosophy</h4>
                <p className="text-sm text-ivory/70 leading-relaxed mb-8 italic">"{tier.experience}"</p>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <Link
                  href={`/safaris?tier=${selectedTier}`}
                  className="flex-1 text-center px-4 py-3 bg-gold text-charcoal text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-gold-light transition-colors duration-300"
                >
                  View {tier.name} Safaris
                </Link>
                <Link
                  href={`/contact?tier=${selectedTier}`}
                  className="flex-1 text-center px-4 py-3 border border-gold/40 text-gold text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-gold/5 transition-colors duration-300"
                >
                  Book Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom explainer */}
        <div className="mt-12 p-8 rounded-lg border border-white/8 bg-charcoal/50">
          <p className="text-[0.65rem] tracking-[0.15em] uppercase text-gold mb-2">💡 Unsure which is right for you?</p>
          <p className="text-sm text-ivory/60 mb-4">
            Our concierge team is here to match you with the perfect tier. Every tier delivers authentic African safaris—the difference is in the style, pace, and privacy.
          </p>
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
          >
            Take our AI-powered questionnaire
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
