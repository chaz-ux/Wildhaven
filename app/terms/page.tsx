import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms & Conditions' }

const sections = [
  { title: 'Bookings & Deposits', content: 'A 30% non-refundable deposit is required to confirm any safari booking. The balance is due 60 days prior to departure. Bookings made within 60 days of departure require full payment at time of booking.' },
  { title: 'Cancellation Policy', content: 'Cancellations more than 60 days before departure: deposit forfeited. 30–60 days: 50% of total cost. Less than 30 days: 100% of total cost. We strongly recommend comprehensive travel insurance including cancellation cover.' },
  { title: 'Changes to Itinerary', content: 'Wildhaven reserves the right to modify itineraries due to weather, safety concerns, wildlife activity, or factors beyond our control. Every change is made to optimise your experience, not reduce it.' },
  { title: 'Health & Fitness', content: 'Clients are responsible for ensuring they are fit to participate in safari activities. Some parks require walking ability; certain activities have age or fitness requirements. Please disclose any health conditions at time of booking.' },
  { title: 'Liability', content: 'Wildhaven acts as agent for accommodation providers, airlines, and ground operators. While we vet every supplier rigorously, we cannot be held liable for their acts or omissions. All guests must have valid travel insurance.' },
  { title: 'Conservation Levy', content: '2% of every booking is directed to the Wildhaven Conservation Fund. This is included in your quoted price — no hidden charges.' },
]

export default function TermsPage() {
  return (
    <section className="pt-36 pb-24 px-6 bg-charcoal min-h-screen">
      <div className="max-w-[800px] mx-auto">
        <Link href="/" className="text-[0.65rem] tracking-wide text-gold/60 hover:text-gold transition-colors mb-8 inline-block">← Back to Wildhaven</Link>
        <h1 className="text-5xl text-ivory mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>Terms & Conditions</h1>
        <p className="text-sm text-ivory/35 mb-16 font-light">Last updated: January 2025</p>
        <div className="space-y-12">
          {sections.map(s => (
            <div key={s.title} className="border-t border-white/6 pt-10">
              <h2 className="text-xl text-ivory mb-4" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}>{s.title}</h2>
              <p className="text-sm text-ivory/45 leading-relaxed font-light">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
