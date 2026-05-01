import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'We are a Kenya-based safari concierge connecting travellers with Kenya\'s finest tour operators. Honest, transparent, and built for the modern explorer.',
}

const REVIEWS = [
  {
    name: 'Sarah M.',
    country: 'United Kingdom',
    tour: '4-Day Maasai Mara Luxury Safari',
    rating: 5,
    text: 'From the first enquiry to the last game drive, everything was handled flawlessly. The lodge exceeded every expectation and our guide knew exactly where to find the lions. Will absolutely book again.',
    date: 'March 2025',
  },
  {
    name: 'David & Priya K.',
    country: 'United States',
    tour: '7-Day Family Safari at Sopa Lodges',
    rating: 5,
    text: 'We travelled with three kids and were nervous about logistics. Every single detail was sorted before we arrived. The kids still talk about the elephants at Amboseli every day. Incredible value.',
    date: 'January 2025',
  },
  {
    name: 'Anouk V.',
    country: 'Netherlands',
    tour: '5-Day Mara, Nakuru & Hell\'s Gate',
    rating: 5,
    text: 'Cycling inside Hell\'s Gate was unlike anything I\'ve done. The whole circuit felt perfectly paced — not rushed, never boring. The flamingos at Nakuru were a bonus I did not expect to love as much as I did.',
    date: 'February 2025',
  },
  {
    name: 'James O.',
    country: 'Canada',
    tour: '8-Day Kenya Odyssey to Mombasa',
    rating: 5,
    text: 'Safari by day, Indian Ocean by night. The Diani Beach extension was genius. I came for the wildlife and stayed for the coast. The booking process was completely transparent — no hidden surprises.',
    date: 'April 2025',
  },
]

const PARTNERS = [
  { name: 'Savanna Sojourns', role: 'Ground Operations Partner', desc: 'Nairobi-based, 5.0★ rated operator handling all ground logistics, guides, and vehicles.' },
  { name: 'Pollman\'s Tours & Safaris', role: 'Scheduled Safari Partner', desc: "Kenya's most experienced tour operator, founded in the 1950s. World Travel Award winners." },
]

const MILESTONES = [
  { year: '2013', event: 'Founded in Nairobi with two vehicles and one guide' },
  { year: '2015', event: 'First Sovereign-tier partnership with private conservancy' },
  { year: '2017', event: '1,000th safari delivered. Celebrated on the Mara.' },
  { year: '2019', event: 'Expanded into Tanzania with Serengeti operations' },
  { year: '2021', event: 'Launched Wildhaven Conservation Fund — 2% of every booking' },
  { year: '2023', event: '4,000+ safaris. 47 conservancy partners. Still growing.' },
]

export default function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-20 px-6 bg-charcoal">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Who We Are</p>
          <h1 className="text-5xl md:text-6xl text-ivory mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
            Kenya, Curated.<br />
            <em className="text-amber not-italic">No Compromises.</em>
          </h1>
          <p className="text-base text-ivory/55 leading-relaxed font-light max-w-2xl">
            We are a safari concierge built for travellers who want Kenya done properly. We partner exclusively with Kenya's most trusted, verified operators — handling your enquiry, planning your route, and making sure every detail is right before you board your flight.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="py-20 px-6 bg-charcoal-mid/50">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: '◎', title: 'We Plan It', desc: 'Tell us your dates, group size, and budget. We match you with the right package from Kenya\'s verified operators — no guesswork.' },
            { icon: '✦', title: 'They Run It', desc: 'Your safari is executed on the ground by our operator partners — experienced guides, well-maintained 4x4s, quality lodges.' },
            { icon: '◆', title: 'You Experience It', desc: 'You show up, we\'ve handled the rest. Park fees, transfers, accommodation, meals — all confirmed before you land.' },
          ].map(item => (
            <div key={item.title} className="border-t border-white/8 pt-8">
              <span className="text-2xl text-amber block mb-4">{item.icon}</span>
              <h3 className="text-xl text-ivory mb-3"
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}>{item.title}</h3>
              <p className="text-sm text-ivory/45 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 px-6 bg-charcoal">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.28em] uppercase text-gold mb-3">Our Operator Partners</p>
          <h2 className="text-4xl text-ivory mb-12"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
            Verified. Experienced. Trusted.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PARTNERS.map(p => (
              <div key={p.name} className="bg-amber/5 border border-amber/20 p-8 rounded-sm">
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-amber/60 mb-2">{p.role}</p>
                <h3 className="text-2xl text-ivory mb-3"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}>{p.name}</h3>
                <p className="text-sm text-ivory/50 leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-6 bg-charcoal-mid/50">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.28em] uppercase text-gold mb-3 text-center">Guest Reviews</p>
          <h2 className="text-4xl text-ivory mb-14 text-center"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
            Straight From the Safari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map(r => (
              <div key={r.name} className="border border-white/8 rounded-sm p-8 bg-charcoal/40">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} className="text-amber text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-ivory/65 leading-relaxed font-light mb-6 italic">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-white/6 pt-4">
                  <div>
                    <p className="text-sm text-ivory font-medium">{r.name}</p>
                    <p className="text-xs text-ivory/30">{r.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-amber/70">{r.tour}</p>
                    <p className="text-xs text-ivory/25">{r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-charcoal text-center">
        <h2 className="text-4xl text-ivory mb-5"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
          Ready to Plan Your Safari?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/safaris"
            className="inline-block text-[0.75rem] tracking-[0.14em] uppercase font-medium bg-amber text-charcoal px-10 py-4 rounded-sm hover:bg-amber-light transition-colors">
            Browse Packages →
          </Link>
          <Link href="/planner"
            className="inline-block text-[0.75rem] tracking-[0.14em] uppercase border border-white/20 text-ivory/70 px-10 py-4 rounded-sm hover:border-amber hover:text-amber transition-colors">
            Talk to Our AI Planner ✦
          </Link>
        </div>
      </section>
    </>
  )
}
