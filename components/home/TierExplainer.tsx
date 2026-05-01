'use client'

/**
 * TierExplainer - A cleaner, more scannable explanation of tier differences
 * Perfect for displaying when a user filters by tier on the safaris page
 */

interface TierExplainerProps {
  selectedTier?: string
}

const TIER_EXPLAINERS = {
  sovereign: {
    name: 'The Sovereign',
    headline: 'Pure Luxury — Your Private Africa',
    description: 'These are our most exclusive experiences. Private conservancies, dedicated guides, and accommodations that rival world-class hotels. Zero crowds. Maximum intimacy.',
    keyPoints: [
      'Private game drives (just you & your guide)',
      'Exclusive camp access',
      'Premium amenities (gourmet meals, spa, etc)',
      'Tailor-made itineraries',
    ],
  },
  horizon: {
    name: 'The Horizon',
    headline: 'Exceptional Value — Real Africa, Real Guides, Real Connection',
    description: 'The sweet spot for most travelers. You get authentic wildlife experiences with expert guides, comfortable lodges, and the flexibility to follow where the animals lead.',
    keyPoints: [
      'Expert naturalists & guides',
      'Semi-private game drives',
      'Authentic lodge experiences',
      'Mix of comfort and adventure',
    ],
  },
  tribe: {
    name: 'The Tribe',
    headline: 'The Most Authentic Safari — Community, Adventure, Honest Wildlife',
    description: 'For travelers who value genuine connection over luxury amenities. Shared vehicles with other adventurers, legendary campfire conversations, and unforgettable friendships.',
    keyPoints: [
      'Meet other adventurers from around the world',
      'Professional guides & drivers',
      'Authentic campsites',
      'Memories that cost less but mean more',
    ],
  },
}

export default function TierExplainer({ selectedTier }: TierExplainerProps) {
  if (!selectedTier || selectedTier === 'all' || !TIER_EXPLAINERS[selectedTier as keyof typeof TIER_EXPLAINERS]) {
    return null
  }

  const tier = TIER_EXPLAINERS[selectedTier as keyof typeof TIER_EXPLAINERS]

  return (
    <div className="mb-12 p-8 rounded-lg border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">
          {selectedTier === 'sovereign' && '♔'}
          {selectedTier === 'horizon' && '◎'}
          {selectedTier === 'tribe' && '◉'}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className="text-2xl text-gold mb-1"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            {tier.headline}
          </h3>
          <p className="text-sm text-ivory/70 mb-4 leading-relaxed">{tier.description}</p>

          {/* Key points as a clean list */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[0.75rem]">
            {tier.keyPoints.map((point) => (
              <div key={point} className="flex gap-2">
                <span className="text-gold/60 flex-shrink-0">✓</span>
                <span className="text-ivory/60">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
