import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Wildhaven was born from a single conviction: that the wild changes you. Learn about our guides, our philosophy, and our commitment to conservation.',
}

const TEAM = [
  {
    name: 'Joseph Kamau',
    role: 'Head Safari Guide — Maasai Mara',
    years: '18 years in the field',
    bio: 'Joseph grew up on the Mara\'s eastern edge. He has guided over 2,000 safaris and holds a Kenya Professional Safari Guides Association platinum rating — the highest in the country.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Akinyi Odhiambo',
    role: 'Concierge Director',
    years: '12 years crafting safaris',
    bio: 'Akinyi has personally slept in every camp Wildhaven recommends. She designs every Sovereign-tier itinerary from scratch and refuses to recommend anything she wouldn\'t give her own family.',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
  },
  {
    name: 'David Mwangi',
    role: 'Lead Naturalist — Tanzania',
    years: '15 years, Serengeti specialist',
    bio: 'David studied zoology at Nairobi University and spent three years with the Serengeti Lion Project. His ability to predict migration movement has become the stuff of Wildhaven legend.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
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
      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=60"
            alt="African savannah at dusk"
            fill className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/80 to-charcoal" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Our Story</p>
          <h1
            className="text-display-lg text-ivory mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            Born from the Belief<br />
            <em className="text-gradient-gold not-italic">the Wild Changes You</em>
          </h1>
          <p className="text-base text-ivory/50 leading-relaxed font-light max-w-xl mx-auto">
            Wildhaven started as a single conviction held by two people in a Land Cruiser in 2013: that anyone who truly encounters the wild — not from a hotel balcony, but inside it, breathing it — comes home different.
          </p>
        </div>
      </section>

      {/* Mission statement */}
      <section className="py-20 px-6 bg-charcoal-mid/50">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[0.65rem] tracking-[0.28em] uppercase text-gold mb-4">Philosophy</p>
            <h2
              className="text-4xl text-ivory mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
            >
              We Don&apos;t Sell Safaris.<br />We Build Encounters.
            </h2>
            <p className="text-sm text-ivory/45 leading-relaxed font-light mb-4">
              Every itinerary at Wildhaven is built from the ground up. We visit every camp. We drive every route. We eat the food before we serve it to guests. If something doesn't move us, it doesn't make the list.
            </p>
            <p className="text-sm text-ivory/45 leading-relaxed font-light">
              This means we sometimes say no to clients who want something we can't stand behind. We'd rather lose a booking than send someone somewhere disappointing.
            </p>
          </div>
          <div className="relative h-80 rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80"
              alt="Wildhaven guide with guests"
              fill className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-charcoal">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.28em] uppercase text-gold mb-3 text-center">Journey</p>
          <h2
            className="text-4xl text-ivory mb-14 text-center"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            A Decade in the Wild
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-8 items-start">
                  <div className="flex-shrink-0 w-14 text-right">
                    <span
                      className="text-gold/70 text-sm"
                      style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}
                    >
                      {m.year}
                    </span>
                  </div>
                  <div className="relative flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full border ${i === MILESTONES.length - 1 ? 'border-gold bg-gold/30' : 'border-gold/40 bg-charcoal'}`} />
                  </div>
                  <p className="text-sm text-ivory/55 font-light leading-relaxed pt-0.5">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-charcoal-mid/50">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.28em] uppercase text-gold mb-3 text-center">The People</p>
          <h2
            className="text-4xl text-ivory mb-14 text-center"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            Your Safari Is Their Life&apos;s Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map(person => (
              <div key={person.name} className="group">
                <div className="relative h-64 rounded-sm overflow-hidden mb-5">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[0.6rem] tracking-[0.15em] uppercase text-gold/70">{person.years}</p>
                  </div>
                </div>
                <h3
                  className="text-xl text-ivory mb-0.5"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}
                >
                  {person.name}
                </h3>
                <p className="text-[0.7rem] tracking-wide text-sage-light mb-3">{person.role}</p>
                <p className="text-xs text-ivory/40 leading-relaxed font-light">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conservation */}
      <section className="py-20 px-6 bg-charcoal border-t border-white/5">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[0.65rem] tracking-[0.28em] uppercase text-gold mb-4">Conservation</p>
          <h2
            className="text-4xl text-ivory mb-5"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            2% of Every Booking Protects the Wild
          </h2>
          <p className="text-sm text-ivory/45 leading-relaxed font-light max-w-xl mx-auto mb-12">
            The Wildhaven Conservation Fund directs 2% of every booking directly to anti-poaching operations, community ranger training, and school bursaries for children living inside wildlife corridors. Because the wild only exists if the communities around it choose to protect it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { stat: '47', label: 'Rangers funded in 2024' },
              { stat: '120+', label: 'School bursaries active' },
              { stat: '$180K', label: 'Directed to conservation' },
            ].map(s => (
              <div key={s.label} className="border border-white/8 rounded-sm p-6">
                <p
                  className="text-4xl text-gold mb-2"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
                >
                  {s.stat}
                </p>
                <p className="text-[0.68rem] tracking-[0.15em] uppercase text-ivory/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-charcoal-mid text-center">
        <h2
          className="text-4xl text-ivory mb-5"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
        >
          Ready to Meet the Wild?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/safaris" className="btn-shine inline-block text-[0.75rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal px-10 py-4 rounded-sm hover:bg-gold-light transition-colors duration-300">
            Browse Safaris →
          </Link>
          <Link href="/planner" className="inline-block text-[0.75rem] tracking-[0.14em] uppercase font-light border border-white/20 text-ivory/70 px-10 py-4 rounded-sm hover:border-gold hover:text-gold transition-colors duration-300">
            Find My Wild ✦
          </Link>
        </div>
      </section>
    </>
  )
}
