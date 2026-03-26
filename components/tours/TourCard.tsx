import Link from 'next/link'
import Image from 'next/image'
import { cn, formatPrice, getTierBadgeStyle, DESTINATION_IMAGES } from '@/lib/utils'
import type { Tour } from '@/lib/types'

interface TourCardProps {
  tour: Tour
  priority?: boolean
}

export default function TourCard({ tour, priority = false }: TourCardProps) {
  const imageUrl = tour.hero_image_url
    || DESTINATION_IMAGES[tour.destination?.slug || '']
    || `https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=75`

  const tierSlug = tour.tier?.slug || ''
  const badgeClass = getTierBadgeStyle(tierSlug)

  return (
    <Link href={`/safaris/${tour.slug}`} className="tour-card block group rounded-sm overflow-hidden bg-charcoal-mid border border-white/6">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="tour-image-inner"
          priority={priority}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-mid/80 via-transparent to-transparent" />

        {/* Tier badge */}
        <div className={cn('absolute top-3 left-3 text-[0.6rem] tracking-[0.15em] uppercase border px-2 py-1 rounded-sm backdrop-blur-sm', badgeClass)}>
          {tour.tier?.name}
        </div>

        {/* Scarcity badge */}
        {tour.scarcity_text && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-charcoal/80 backdrop-blur-sm text-[0.62rem] tracking-wide text-amber-300 px-2.5 py-1 rounded-sm border border-amber-400/15">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 scarcity-dot flex-shrink-0" />
            {tour.scarcity_text}
          </div>
        )}

        {/* Duration pill */}
        <div className="absolute bottom-3 right-3 glass text-[0.65rem] tracking-wide text-ivory/60 px-2.5 py-1 rounded-sm">
          {tour.days_duration} days
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Destination */}
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-sage-light mb-1.5">
          {tour.destination?.name}
        </p>

        {/* Title */}
        <h3
          className="text-xl text-ivory mb-2 leading-snug group-hover:text-gold transition-colors duration-300"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}
        >
          {tour.title}
        </h3>

        {/* Short desc */}
        <p className="text-xs text-ivory/40 leading-relaxed mb-4 line-clamp-2 font-light">
          {tour.short_desc}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4 text-[0.72rem] text-ivory/35">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="8" cy="8" r="6"/><path strokeLinecap="round" d="M8 5v3l2 1.5"/>
            </svg>
            {tour.days_duration} Days
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M8 2a4 4 0 100 8A4 4 0 008 2zM2 14c0-2.2 2.686-4 6-4s6 1.8 6 4"/>
            </svg>
            Max {tour.max_group_size}
          </span>
        </div>

        {/* Footer: price + arrow */}
        <div className="flex items-center justify-between pt-4 border-t border-white/6">
          <div>
            <p className="text-[0.6rem] text-ivory/25 uppercase tracking-wide">From</p>
            <p className="font-serif text-xl text-sand" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {formatPrice(tour.base_price)}
              <span className="text-xs text-ivory/25 font-sans"> /pp</span>
            </p>
          </div>
          <div className="w-8 h-8 rounded-full border border-gold/25 flex items-center justify-center text-gold group-hover:bg-gold group-hover:border-gold transition-all duration-300">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 group-hover:text-charcoal transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
