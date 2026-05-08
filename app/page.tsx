import { Suspense } from 'react'
import HeroSection from '@/components/home/HeroSection'
import WildlifeTicker from '@/components/home/WildlifeTicker'
import VibeSelector from '@/components/home/VibeSelector'
import TierGuide from '@/components/home/TierGuide'
import TourGrid from '@/components/home/TourGrid'
import TrustBanner from '@/components/home/TrustBanner'
import { getTiers, getFeaturedTours, getWildlifeSightings } from '@/lib/data'
import Link from 'next/link'

export const revalidate = 60 // ISR: revalidate every 60s

export default async function HomePage() {
  const [tiers, tours] = await Promise.all([
    getTiers(),
    getFeaturedTours(),
    
  ])

  return (
    <>
      {/* 1. Cinematic hero with video */}
      <HeroSection tiers={tiers} />

      

      {/* 3. Tier vibe selector */}
      <VibeSelector tiers={tiers} />

      {/* 3b. Tier comparison guide */}
      <TierGuide />

      {/* 4. Featured tour grid */}
      <TourGrid tours={tours} />

      {/* 5. Mid-page CTA — AI Planner teaser */}
      <section className="relative py-32 px-6 overflow-hidden bg-charcoal-mid">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">AI Safari Concierge</p>
          <h2
            className="text-4xl md:text-5xl text-ivory mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            Not Sure Where to Start?
          </h2>
          <p className="text-sm text-ivory/45 leading-relaxed mb-10 font-light">
            Answer 5 visual questions. Our AI concierge builds you a personalised Dream Board — the right tier, destination, and itinerary, made for you.
          </p>
          <Link
            href="/planner"
            className="btn-shine inline-block text-[0.75rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal px-10 py-4 rounded-sm hover:bg-gold-light transition-colors duration-300"
          >
            Find My Wild ✦
          </Link>
        </div>
      </section>

      {/* 6. Trust & social proof */}
      <TrustBanner />

      {/* 7. Final CTA */}
      <section className="py-28 px-6 bg-charcoal text-center">
        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Ready to Begin?</p>
        <h2
          className="text-4xl md:text-6xl text-ivory mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
        >
          Your Safari Awaits.
          <br />
          <em className="text-gradient-gold not-italic">Let&apos;s Build It Together.</em>
        </h2>
        <p className="text-sm text-ivory/40 mb-10 max-w-md mx-auto font-light">
          Our concierge team responds within 2 hours. No pressure, just expertise.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn-shine inline-block text-[0.75rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal px-10 py-4 rounded-sm hover:bg-gold-light transition-colors duration-300">
            Start Planning →
          </Link>
          <Link href="/safaris" className="inline-block text-[0.75rem] tracking-[0.14em] uppercase font-light border border-white/20 text-ivory/70 px-10 py-4 rounded-sm hover:border-gold hover:text-gold transition-colors duration-300">
            Browse All Safaris
          </Link>
        </div>
      </section>
    </>
  )
}
