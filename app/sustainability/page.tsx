import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sustainability' }

export default function SustainabilityPage() {
  return (
    <>
      <section className="pt-36 pb-24 px-6 bg-charcoal">
        <div className="max-w-[900px] mx-auto">
          <Link href="/" className="text-[0.65rem] tracking-wide text-gold/60 hover:text-gold transition-colors mb-8 inline-block">← Back to Wildhaven</Link>
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Our Commitment</p>
          <h1 className="text-5xl text-ivory mb-6 leading-tight" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
            The Wild Only Exists<br />If We Protect It
          </h1>
          <p className="text-base text-ivory/45 leading-relaxed font-light max-w-2xl mb-20">
            Tourism is only worth something if the ecosystem it depends on survives. Every decision Wildhaven makes — which camps we work with, which routes we drive, which communities we partner — is filtered through one question: does this help the wild endure?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            {[
              { title: '2% Conservation Levy', desc: 'Built into every booking. Directed to anti-poaching, community ranger training, and school bursaries for children in wildlife corridors. Not a donation — a commitment.' },
              { title: 'Conservancy-First Routing', desc: 'Wherever possible, we route guests through private conservancies rather than over-trafficked national park circuits. This generates direct revenue for communities choosing conservation over agriculture.' },
              { title: 'Small Vehicle Policy', desc: 'Sovereign and Horizon tier safaris use a maximum of one vehicle per booking. No convoys. Less stress on animals, more intimate encounters, smaller footprint.' },
              { title: 'Carbon Offset', desc: 'We calculate the carbon cost of every safari (flights, drives, accommodation) and purchase verified offsets through Gold Standard projects in East Africa — reforestation and clean cookstove programmes.' },
              { title: 'Community Ownership', desc: 'We prioritise camps that are majority-owned by local communities. Currently 60% of our supplier revenue stays within 50km of the park it serves.' },
              { title: 'No Single-Use Plastics', desc: 'Every camp in our portfolio has eliminated single-use plastics in guest-facing operations. We audit this annually and remove suppliers who regress.' },
            ].map(item => (
              <div key={item.title} className="border-t border-white/6 pt-8">
                <h3 className="text-xl text-ivory mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}>{item.title}</h3>
                <p className="text-sm text-ivory/45 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-ivory/30 font-light italic mb-6" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.2rem' }}>
              &ldquo;We are not custodians of the wild. We are guests. And guests leave things better than they found them.&rdquo;
            </p>
            <p className="text-[0.65rem] tracking-widest uppercase text-ivory/20">— Wildhaven Founder</p>
          </div>
        </div>
      </section>
    </>
  )
}
