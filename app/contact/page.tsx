'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'

const TIERS = [
  { value: 'sovereign', label: 'The Sovereign — Luxury (from $8,500)' },
  { value: 'horizon',   label: 'The Horizon — Mid-Range (from $2,400)' },
  { value: 'tribe',     label: 'The Tribe — Group/Budget (from $950)' },
]

const BUDGETS = [
  { value: '<2000',       label: 'Under $2,000' },
  { value: '2000-5000',   label: '$2,000 – $5,000' },
  { value: '5000-10000',  label: '$5,000 – $10,000' },
  { value: '10000+',      label: '$10,000+' },
]

const GROUP_SIZES = [
  { value: '1', label: 'Solo traveller' },
  { value: '2', label: 'Couple (2)' },
  { value: '3-5', label: 'Small group (3–5)' },
  { value: '6-12', label: 'Group (6–12)' },
  { value: '13+', label: 'Large group (13+)' },
]

function ContactForm() {
  const searchParams = useSearchParams()
  const tourSlug = searchParams.get('tour')
  const fromPlanner = searchParams.get('from') === 'planner'
  const plannerName = searchParams.get('name')
  const plannerEmail = searchParams.get('email')

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    preferred_tier: '', target_budget: '',
    travel_dates: '', group_size: '',
    message: '',
    tour_id: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  // Pre-fill from planner
  useEffect(() => {
    if (fromPlanner && (plannerName || plannerEmail)) {
      setForm(f => ({
        ...f,
        name: plannerName ? decodeURIComponent(plannerName) : f.name,
        email: plannerEmail ? decodeURIComponent(plannerEmail) : f.email,
        message: f.message || 'I loved my Dream Board suggestion and would like to proceed with booking.',
      }))
    }
  }, [fromPlanner, plannerName, plannerEmail])

  const submit = async () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/20 text-ivory placeholder:text-ivory/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 focus:bg-white/8 transition-colors duration-300"
  const selectClass = "w-full bg-white/5 border border-white/20 text-ivory rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 focus:bg-white/8 transition-colors duration-300"
  const labelClass  = "block text-[0.62rem] tracking-[0.18em] uppercase text-ivory/30 mb-2"

  return (
    <>
      <style>{`
        select option {
          background-color: #1a1a1a;
          color: #fffbf7;
          padding: 8px;
        }
        select option:checked {
          background: linear-gradient(#ffc41a, #ffc41a);
          background-color: #ffc41a !important;
          color: #1a1a1a;
        }
      `}</style>
      <div>
      {!success ? (
        <div className="space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Phone + Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>WhatsApp / Phone</label>
              <input type="tel" placeholder="+254 700 000 000" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preferred Travel Dates</label>
              <input type="text" placeholder="e.g. July–August 2025" value={form.travel_dates} onChange={e => set('travel_dates', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Tier + Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Preferred Tier</label>
              <div className="space-y-2">
                {TIERS.map(t => (
                  <label key={t.value} className="flex items-start gap-3 p-3 border border-white/10 rounded-sm cursor-pointer hover:bg-white/3 transition-colors duration-200" style={{ background: form.preferred_tier === t.value ? 'rgba(255, 184, 28, 0.05)' : 'transparent' }}>
                    <input
                      type="radio"
                      name="tier"
                      value={t.value}
                      checked={form.preferred_tier === t.value}
                      onChange={e => set('preferred_tier', e.target.value)}
                      className="mt-1 flex-shrink-0 w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-ivory font-light">{t.label}</p>
                      <p className="text-[0.65rem] text-ivory/40 mt-0.5">
                        {t.value === 'sovereign' && 'Private luxury, max 2 guests per vehicle, butler service'}
                        {t.value === 'horizon' && 'Authentic comfort, up to 6 guests, expert guides'}
                        {t.value === 'tribe' && 'Social adventure, shared vehicles, community vibes'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Budget per Person</label>
              <select value={form.target_budget} onChange={e => set('target_budget', e.target.value)} className={selectClass}>
                <option value="">Select range…</option>
                {BUDGETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          </div>

          {/* Group size */}
          <div>
            <label className={labelClass}>Group Size</label>
            <select value={form.group_size} onChange={e => set('group_size', e.target.value)} className={selectClass}>
              <option value="">How many travellers?</option>
              {GROUP_SIZES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className={labelClass}>Message / Dream Safari Details</label>
            <textarea
              rows={4}
              placeholder="Tell us about your dream safari — specific animals, destinations, special occasions, accessibility needs…"
              value={form.message}
              onChange={e => set('message', e.target.value)}
              className={cn(inputClass, 'resize-none')}
            />
          </div>

          {error && <p className="text-red-400/80 text-sm">{error}</p>}

          <button
            onClick={submit}
            disabled={submitting}
            className={cn(
              'btn-shine w-full text-[0.78rem] tracking-[0.14em] uppercase font-medium py-4 rounded-sm transition-all duration-300',
              submitting ? 'bg-gold/50 text-charcoal/50 cursor-not-allowed' : 'bg-gold text-charcoal hover:bg-gold-light'
            )}
          >
            {submitting ? 'Sending…' : 'Send My Safari Enquiry →'}
          </button>

          <p className="text-[0.68rem] text-ivory/20 text-center">
            We respond within 2 hours. No spam, ever. Your data is never sold.
          </p>
        </div>
      ) : (
        /* Success */
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-gold text-2xl">✦</span>
          </div>
          <h3
            className="text-3xl text-ivory mb-3"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            Safari Brief Received
          </h3>
          <p className="text-sm text-ivory/40 max-w-sm mx-auto leading-relaxed font-light">
            Our concierge team will reach out to <span className="text-ivory/70">{form.email}</span> within 2 hours with a personalised proposal.
          </p>
          <Link href="/safaris" className="inline-block mt-8 text-[0.72rem] tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
            Browse more safaris →
          </Link>
        </div>
      )}
    </div>
    </>
  )
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 px-6 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Start Planning</p>
          <h1
            className="text-display-lg text-ivory mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            Let&apos;s Build<br />Your Safari.
          </h1>
          <p className="text-sm text-ivory/40 max-w-md font-light leading-relaxed">
            No templates. No packages pulled off a shelf. Every enquiry is answered personally by one of our senior safari specialists.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="py-16 px-6 bg-charcoal">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Perks */}
          <div>
            <div className="space-y-8 mb-12">
              {[
                { icon: '✦', title: 'Free Custom Itinerary', desc: 'We design a bespoke route based on your dates, budget, and wish list. Zero obligation.' },
                { icon: '✦', title: 'Flexible Payment', desc: '30% deposit to secure. Balance due 60 days before departure. ABTA protected.' },
                { icon: '✦', title: 'Price Match Promise', desc: 'Found the same safari cheaper anywhere? We match it, plus add a complimentary Bush Dinner.' },
                { icon: '✦', title: 'Expert Concierge', desc: "Your specialist has personally visited every camp we recommend. Ask anything — they've slept there." },
              ].map(p => (
                <div key={p.title} className="flex gap-4">
                  <span className="text-gold mt-1 flex-shrink-0 text-sm">{p.icon}</span>
                  <div>
                    <p className="text-sm text-ivory font-medium mb-1">{p.title}</p>
                    <p className="text-sm text-ivory/40 leading-relaxed font-light">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct contacts */}
            <div className="glass p-6 rounded-sm space-y-4">
              <p className="text-[0.62rem] tracking-[0.2em] uppercase text-gold/60">Prefer to reach out directly?</p>
              <a href="mailto:hello@zazusafaris.com" className="flex items-center gap-3 text-sm text-ivory/60 hover:text-ivory transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors">@</span>
                hello@zazusafaris.com
              </a>
              <a href="tel:+254141481665" className="flex items-center gap-3 text-sm text-ivory/60 hover:text-ivory transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors text-xs">☏</span>
                +254 141 481 665
              </a>
              <p className="text-[0.68rem] text-ivory/20">Mon–Sun · 7am–8pm East Africa Time</p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <Suspense fallback={<div className="text-ivory/30 text-sm">Loading form…</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
