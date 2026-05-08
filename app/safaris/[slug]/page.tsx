import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTourBySlug, getAllTours } from '@/lib/data'
import { formatPrice, DESTINATION_IMAGES, getTierBadgeStyle } from '@/lib/utils'
import { cn } from '@/lib/utils'
import RouteMap from '@/components/tours/RouteMap'
import ItineraryTimeline from '@/components/tours/ItineraryTimeline'
import StickyPricingBar from '@/components/tours/StickyPricingBar'
import TourCard from '@/components/tours/TourCard'

export const revalidate = 60

// Generate static paths for all tours
export async function generateStaticParams() {
  const tours = await getAllTours()
  return tours.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) return { title: 'Safari Not Found' }
  return {
    title: tour.title,
    description: tour.short_desc,
    openGraph: {
      title: tour.title,
      description: tour.short_desc,
      images: [tour.hero_image_url || DESTINATION_IMAGES[tour.destination?.slug || ''] || ''],
    },
  }
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) notFound()

  const heroImg = tour.hero_image_url
    || DESTINATION_IMAGES[tour.destination?.slug || '']
    || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80'

  const badgeClass = getTierBadgeStyle(tour.tier?.slug || '')

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex flex-col justify-end overflow-hidden">
        <Image
          src={heroImg}
          alt={tour.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 to-transparent" />
        <div className="noise-overlay" />

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-16 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.65rem] text-ivory/30 tracking-wide mb-6">
            <Link href="/" className="hover:text-ivory/60 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/safaris" className="hover:text-ivory/60 transition-colors">Safaris</Link>
            <span>/</span>
            <span className="text-ivory/50">{tour.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* Tier badge */}
              <span className={cn('inline-block text-[0.6rem] tracking-[0.18em] uppercase border px-2.5 py-1 rounded-sm mb-4', badgeClass)}>
                {tour.tier?.name}
              </span>

              {/* Title */}
              <h1
                className="text-5xl md:text-7xl text-ivory mb-3 leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
              >
                {tour.title}
              </h1>

              {/* Destination */}
              <p className="text-sm text-ivory/50 tracking-wide">
                {tour.destination?.name}, {tour.destination?.country}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 glass px-6 py-4 rounded-sm">
              {[
                { label: 'Duration', value: `${tour.days_duration} Days` },
                { label: 'From',     value: formatPrice(tour.base_price) },
                { label: 'Max Group', value: `${tour.max_group_size} guests` },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-[0.6rem] tracking-[0.15em] uppercase text-ivory/30 mb-1">{s.label}</p>
                  <p
                    className="text-lg text-ivory"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-charcoal">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: description + highlights */}
          <div className="lg:col-span-2">
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-4">Overview</p>
            <p className="text-lg text-ivory/60 leading-relaxed font-light mb-10">
              {tour.short_desc}
            </p>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-ivory/30 mb-5">Highlights</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.highlights.map(h => (
                    <div key={h} className="flex items-start gap-3 text-sm text-ivory/55 font-light">
                      <span className="text-gold mt-0.5 flex-shrink-0">✦</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: includes / enquire */}
          <div className="space-y-6">
            {/* Included */}
            {tour.includes && tour.includes.length > 0 && (
              <div className="glass-gold p-6 rounded-sm">
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-gold mb-4">What's Included</p>
                <ul className="space-y-2">
                  {tour.includes.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-ivory/60">
                      <span className="text-green-400 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scarcity */}
            {tour.scarcity_text && (
              <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-400/15 px-4 py-3 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 scarcity-dot flex-shrink-0" />
                <p className="text-xs text-amber-300">{tour.scarcity_text}</p>
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/contact?tour=${tour.slug}`}
              className="btn-shine block text-center text-[0.75rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal px-6 py-4 rounded-sm hover:bg-gold-light transition-colors duration-300"
            >
              Enquire About This Safari
            </Link>
            <Link
              href="/planner"
              className="block text-center text-[0.72rem] tracking-[0.12em] uppercase font-light border border-white/15 text-ivory/50 px-6 py-3.5 rounded-sm hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Not sure? Try the Planner ✦
            </Link>
          </div>
        </div>
      </section>

      {/* ── Route Map ─────────────────────────────────────── */}
      {tour.itinerary_days && tour.itinerary_days.length > 0 && tour.destination && (
        <section className="py-6 px-6 bg-charcoal">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-4">Your Route</p>
            <RouteMap days={tour.itinerary_days} mainDestination={tour.destination} />
          </div>
        </section>
      )}

      {/* ── Itinerary ─────────────────────────────────────── */}
      {tour.itinerary_days && tour.itinerary_days.length > 0 && (
        <section className="bg-charcoal py-10">
          <div className="max-w-[1400px] mx-auto px-6 mb-10">
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-2">Day by Day</p>
            <h2
              className="text-4xl text-ivory"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
            >
              Your Journey Unfolds
            </h2>
          </div>
          <ItineraryTimeline days={tour.itinerary_days} />
        </section>
      )}

      {/* ── Sticky Pricing Bar ────────────────────────────── */}
      <StickyPricingBar tour={tour} />

      {/* Bottom padding for sticky bar */}
      <div className="h-20 bg-charcoal" />
    </>
  )
}
