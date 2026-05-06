export const runtime = 'edge';

import type { Metadata } from 'next'
import { getAllTours } from '@/lib/data'
import TourGrid from '@/components/home/TourGrid'
import QuickNavigation from '@/components/layout/QuickNavigation'

export const metadata: Metadata = {
  title: 'Safari Experiences',
  description: 'Browse all Zazu Safaris experiences across Kenya and Tanzania. From private luxury conservancies to social group adventures.',
}

export const revalidate = 60

export default async function SafarisPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; country?: string }>
}) {
  const params = await searchParams
  const tours = await getAllTours()

  return (
    <>
      <QuickNavigation pageName="Safari Experiences" tierSlug={params.tier} />
      
      {/* Page hero */}
      <section className="relative pt-40 pb-20 px-6 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-mid to-charcoal" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">All Experiences</p>
          <h1
            className="text-display-lg text-ivory mb-4"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            Every Safari.<br />Hand-Crafted.
          </h1>
          <p className="text-sm text-ivory/40 max-w-lg font-light leading-relaxed">
            {tours.length} curated journeys across Kenya & Tanzania.
            Every camp personally vetted. Every route tested by our guides.
          </p>
        </div>
      </section>

      {/* Tour grid with filters */}
      <TourGrid tours={tours} initialFilter={params.tier || 'all'} />
    </>
  )
}
