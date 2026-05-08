'use client'

export const runtime = 'edge';

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

// ─── Real packages matching Savanna Sojourns ────────────────────────────────
const PACKAGES = [
  { value: 'mara-luxury-ashnil',    label: '4-Day Maasai Mara Luxury Safari',          price: '$2,744/pp', badge: 'Luxury' },
  { value: 'family-circuit-sopa',   label: '7-Day Family Safari at Sopa Lodges',        price: '$2,672/pp', badge: 'Family' },
  { value: 'mara-nakuru-hells-gate',label: '5-Day Mara, Nakuru & Hell\'s Gate',         price: '$1,568/pp', badge: 'Popular' },
  { value: 'rift-valley-naivasha',  label: '5-Day Through the Rift Valley',             price: '$1,420/pp', badge: '' },
  { value: 'kenya-classic-circuit', label: '7-Day Kenya Classic Safari',                price: '$2,190/pp', badge: '' },
  { value: 'mombasa-beach-safari',  label: '8-Day Kenya Odyssey to Mombasa',            price: '$2,480/pp', badge: '' },
  { value: 'taita-salt-lick',       label: '5-Day Taita Hills & Salt Lick via Mombasa', price: '$1,680/pp', badge: '' },
  { value: 'ol-pejeta-laikipia',    label: '4-Day Ol Pejeta Conservancy',               price: '$3,200/pp', badge: 'Exclusive' },
  { value: 'custom',                label: 'Custom / Not sure yet',                     price: 'TBD',       badge: '' },
]

const GROUP_OPTIONS = [
  { value: '1',   label: 'Solo',         icon: '🧍', desc: '1 traveller' },
  { value: '2',   label: 'Couple',       icon: '👫', desc: '2 travellers' },
  { value: '3-5', label: 'Small Group',  icon: '👨‍👩‍👧', desc: '3–5 travellers' },
  { value: '6+',  label: 'Large Group',  icon: '👥', desc: '6 or more' },
]

// Payment intent options
const PAYMENT_OPTIONS = [
  {
    value: 'booking_fee',
    label: 'Pay Booking Fee Now',
    desc: '$150 to secure your slot — deducted from total',
    badge: 'Recommended',
  },
  {
    value: 'deposit',
    label: 'Pay 30% Deposit',
    desc: 'Confirms booking, balance due 60 days before travel',
    badge: '',
  },
  {
    value: 'full',
    label: 'Pay in Full',
    desc: 'Pay 100% now and get 3% discount on total',
    badge: 'Best Value',
  },
  {
    value: 'enquire',
    label: 'Enquire First',
    desc: 'No payment now — talk to us before committing',
    badge: '',
  },
]

function ContactForm() {
  const searchParams = useSearchParams()
  const fromPlanner  = searchParams.get('from') === 'planner'
  const prefPackage  = searchParams.get('package') || ''
  const prefTravellers = searchParams.get('travellers') || ''

  const [step, setStep] = useState(1) // 3-step form
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    package_slug: prefPackage,
    group_size: prefTravellers,
    travel_start: '',
    travel_end: '',
    payment_intent: 'enquire',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  // Pre-fill from planner redirect
  useEffect(() => {
    const n = searchParams.get('name')
    const e = searchParams.get('email')
    if (n || e) {
      setForm(f => ({
        ...f,
        name:    n ? decodeURIComponent(n) : f.name,
        email:   e ? decodeURIComponent(e) : f.email,
        message: fromPlanner ? 'I reviewed my AI safari suggestion and would like to proceed.' : f.message,
      }))
    }
  }, [fromPlanner, searchParams])

  const submit = async () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return }
    setSubmitting(true); setError('')
    try {
      const res  = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          travel_dates: form.travel_start && form.travel_end
            ? `${form.travel_start} to ${form.travel_end}`
            : form.travel_start || '',
        }),
      })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.error || 'Something went wrong.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = "w-full bg-white/5 border border-white/20 text-ivory placeholder:text-ivory/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 transition-colors [color-scheme:dark]"
  const labelCls = "block text-[0.62rem] tracking-[0.18em] uppercase text-ivory/40 mb-2"

  const selectedPackage = PACKAGES.find(p => p.value === form.package_slug)

  if (success) return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
        <span className="text-gold text-2xl">✦</span>
      </div>
      <h3 className="text-3xl text-ivory mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
        Safari Brief Received
      </h3>
      <p className="text-sm text-ivory/40 max-w-sm mx-auto leading-relaxed font-light mb-2">
        We've sent a confirmation to <span className="text-ivory/70">{form.email}</span>.
      </p>
      <p className="text-sm text-ivory/40 max-w-sm mx-auto leading-relaxed font-light">
        Our team will reach out within 2 hours via email{form.phone ? ' and WhatsApp' : ''} with your personalised proposal.
      </p>
      {form.payment_intent !== 'enquire' && (
        <div className="mt-8 p-4 border border-gold/20 rounded-sm max-w-sm mx-auto">
          <p className="text-xs text-gold/70 mb-1 uppercase tracking-widest">Payment</p>
          <p className="text-sm text-ivory/60 font-light">
            Our team will send you a secure Pesapal payment link for your{' '}
            <strong className="text-ivory">
              {form.payment_intent === 'booking_fee' ? '$150 booking fee' :
               form.payment_intent === 'deposit'     ? '30% deposit'      : 'full payment'}
            </strong>{' '}
            via M-Pesa or card.
          </p>
        </div>
      )}
      <Link href="/safaris" className="inline-block mt-8 text-[0.72rem] tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
        Browse more safaris →
      </Link>
    </div>
  )

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Choose Safari', 'Your Details', 'Confirm'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 text-[0.65rem] tracking-wide uppercase transition-colors',
              step === i + 1 ? 'text-gold' : step > i + 1 ? 'text-ivory/40' : 'text-ivory/20'
            )}>
              <span className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center text-[0.6rem] flex-shrink-0',
                step === i + 1 ? 'border-gold text-gold' :
                step > i + 1  ? 'border-ivory/30 bg-ivory/10 text-ivory/50' :
                                 'border-white/15 text-ivory/20'
              )}>
                {step > i + 1 ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < 2 && <div className={cn('flex-1 h-px min-w-[20px]', step > i + 1 ? 'bg-ivory/20' : 'bg-white/8')} />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Choose Safari & Group ─────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Package */}
          <div>
            <label className={labelCls}>Which Safari Package?</label>
            <div className="space-y-2">
              {PACKAGES.map(pkg => (
                <label key={pkg.value}
                  className={cn(
                    'flex items-center gap-4 p-3 border rounded-sm cursor-pointer transition-all duration-200',
                    form.package_slug === pkg.value
                      ? 'border-gold bg-gold/6'
                      : 'border-white/10 hover:border-white/25'
                  )}>
                  <input type="radio" name="package" value={pkg.value}
                    checked={form.package_slug === pkg.value}
                    onChange={e => set('package_slug', e.target.value)}
                    className="flex-shrink-0 accent-[#D4820A]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-ivory font-light">{pkg.label}</p>
                      {pkg.badge && (
                        <span className="text-[0.55rem] tracking-widest uppercase border border-gold/30 text-gold/70 px-1.5 py-0.5 rounded-sm">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    {pkg.value !== 'custom' && (
                      <p className="text-xs text-gold/60 mt-0.5">{pkg.price}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Group size */}
          <div>
            <label className={labelCls}>How Many Are Travelling?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GROUP_OPTIONS.map(g => (
                <button key={g.value}
                  onClick={() => set('group_size', g.value)}
                  className={cn(
                    'p-3 border rounded-sm text-center transition-all duration-200',
                    form.group_size === g.value
                      ? 'border-gold bg-gold/8'
                      : 'border-white/10 hover:border-gold/30'
                  )}>
                  <span className="text-xl block mb-1">{g.icon}</span>
                  <p className="text-xs text-ivory font-medium">{g.label}</p>
                  <p className="text-[0.6rem] text-ivory/35">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Travel dates */}
          <div>
            <label className={labelCls}>Preferred Travel Dates</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[0.6rem] text-ivory/30 mb-1.5">Departure Date</p>
                <input type="date" value={form.travel_start}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => set('travel_start', e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <p className="text-[0.6rem] text-ivory/30 mb-1.5">Return Date</p>
                <input type="date" value={form.travel_end}
                  min={form.travel_start || new Date().toISOString().split('T')[0]}
                  onChange={e => set('travel_end', e.target.value)}
                  className={inputCls} />
              </div>
            </div>
            <p className="text-[0.62rem] text-ivory/25 mt-1.5">Not sure yet? Leave blank — we'll work around your schedule.</p>
          </div>

          <button onClick={() => setStep(2)}
            disabled={!form.package_slug}
            className={cn(
              'btn-shine w-full text-[0.78rem] tracking-[0.14em] uppercase font-medium py-4 rounded-sm transition-all',
              form.package_slug ? 'bg-gold text-charcoal hover:bg-gold-light' : 'bg-white/10 text-ivory/30 cursor-not-allowed'
            )}>
            Continue → Your Details
          </button>
        </div>
      )}

      {/* ── STEP 2: Contact Details ────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input type="text" placeholder="Your name" value={form.name}
                onChange={e => set('name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email Address *</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => set('email', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>WhatsApp / Phone</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/50 text-sm font-medium pointer-events-none">
                {form.phone.split(' ')[0] || '+254'}
              </span>
              <input type="tel" placeholder="700 000 000" 
                value={form.phone.split(' ').slice(1).join(' ')}
                onChange={e => {
                  const countryCode = form.phone.split(' ')[0] || '+254'
                  set('phone', `${countryCode} ${e.target.value}`.trim())
                }}
                onFocus={() => {
                  // Show country code selector on focus if no code set
                  if (!form.phone) set('phone', '+254 ')
                }}
                className={cn(inputCls, 'pl-16')}
              />
              {/* Hidden country code selector - accessible via click */}
              <select value={form.phone.split(' ')[0] || '+254'}
                onChange={e => {
                  const currentNumber = form.phone.split(' ').slice(1).join(' ') || ''
                  set('phone', `${e.target.value} ${currentNumber}`.trim())
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-16">
                <option value="+254">🇰🇪 +254</option>
                <option value="+255">🇹🇿 +255</option>
                <option value="+256">🇺🇬 +256</option>
                <option value="+27">🇿🇦 +27</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+39">🇮🇹 +39</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+91">🇮🇳 +91</option>
              </select>
              <p className="text-[0.62rem] text-ivory/25 mt-1.5">Click code to change country. We'll send confirmation here.</p>
            </div>
          </div>

          <div>
            <label className={labelCls}>Anything Specific? (Optional)</label>
            <textarea rows={3} placeholder="Special occasions, dietary needs, accessibility, specific animals you want to see…"
              value={form.message} onChange={e => set('message', e.target.value)}
              className={cn(inputCls, 'resize-none')} />
          </div>

          {error && <p className="text-red-400/80 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="text-[0.72rem] tracking-wide uppercase text-ivory/40 border border-white/12 px-5 py-3 rounded-sm hover:border-white/25 hover:text-ivory/60 transition-all">
              ← Back
            </button>
            <button onClick={() => { if (!form.name || !form.email) { setError('Name and email are required.'); return }; setError(''); setStep(3) }}
              className="btn-shine flex-1 text-[0.78rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal py-3 rounded-sm hover:bg-gold-light transition-all">
              Continue → Confirm
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Confirm & Payment Intent ──────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="border border-white/10 rounded-sm p-5 space-y-3">
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-gold/60">Booking Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ivory/40">Package</span>
                <span className="text-ivory text-right max-w-[60%]">{selectedPackage?.label || 'Custom'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/40">Price</span>
                <span className="text-gold">{selectedPackage?.price || 'TBD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/40">Group</span>
                <span className="text-ivory">{GROUP_OPTIONS.find(g => g.value === form.group_size)?.label || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/40">Dates</span>
                <span className="text-ivory">
                  {form.travel_start && form.travel_end
                    ? `${form.travel_start} → ${form.travel_end}`
                    : form.travel_start || 'Flexible'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/40">Name</span>
                <span className="text-ivory">{form.name}</span>
              </div>
            </div>
          </div>

          {/* Payment intent */}
          <div>
            <label className={labelCls}>How Would You Like to Proceed?</label>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map(opt => (
                <label key={opt.value}
                  className={cn(
                    'flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-all duration-200',
                    form.payment_intent === opt.value
                      ? 'border-gold bg-gold/6'
                      : 'border-white/10 hover:border-white/25'
                  )}>
                  <input type="radio" name="payment" value={opt.value}
                    checked={form.payment_intent === opt.value}
                    onChange={e => set('payment_intent', e.target.value)}
                    className="mt-0.5 flex-shrink-0 accent-[#D4820A]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-ivory font-medium">{opt.label}</p>
                      {opt.badge && (
                        <span className="text-[0.55rem] tracking-widest uppercase border border-gold/30 text-gold/70 px-1.5 py-0.5 rounded-sm">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ivory/40 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {form.payment_intent !== 'enquire' && (
              <div className="mt-3 p-3 bg-gold/5 border border-gold/15 rounded-sm">
                <p className="text-xs text-ivory/50 leading-relaxed">
                  <span className="text-gold">Accepted:</span> M-Pesa, Visa, Mastercard via Pesapal.
                  A secure payment link will be sent to <span className="text-ivory/70">{form.email}</span> within 2 hours of your submission.
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-red-400/80 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)}
              className="text-[0.72rem] tracking-wide uppercase text-ivory/40 border border-white/12 px-5 py-4 rounded-sm hover:border-white/25 hover:text-ivory/60 transition-all">
              ← Back
            </button>
            <button onClick={submit} disabled={submitting}
              className={cn(
                'btn-shine flex-1 text-[0.78rem] tracking-[0.14em] uppercase font-medium py-4 rounded-sm transition-all',
                submitting ? 'bg-gold/50 text-charcoal/50 cursor-not-allowed' : 'bg-gold text-charcoal hover:bg-gold-light'
              )}>
              {submitting ? 'Sending…' :
               form.payment_intent === 'enquire' ? 'Send Enquiry →' : 'Submit & Await Payment Link →'}
            </button>
          </div>

          <p className="text-[0.65rem] text-ivory/20 text-center">
            We respond within 2 hours · No spam · Your data is never sold
          </p>
        </div>
      )}
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-36 pb-16 px-6 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Book Your Safari</p>
          <h1 className="text-display-lg text-ivory mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
            Let&apos;s Make It<br />Happen.
          </h1>
          <p className="text-sm text-ivory/40 max-w-md font-light leading-relaxed">
            Three steps. Two minutes. One unforgettable safari — confirmed and waiting for you.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-charcoal">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* Left: Why book with us */}
          <div className="space-y-10">
            <div className="space-y-6">
              {[
                { icon: '🔒', title: 'Secure & Transparent', desc: 'Pay via M-Pesa or card through Pesapal — Kenya\'s most trusted payment gateway. No hidden charges, ever.' },
                { icon: '✦',  title: 'Free Custom Itinerary', desc: 'Every booking includes a personalised day-by-day itinerary built around your group and interests.' },
                { icon: '📅', title: 'Flexible Dates', desc: 'Can\'t commit to exact dates? Enquire now, lock in dates later. We hold your slot for 48 hours.' },
                { icon: '💬', title: 'Human Support', desc: 'Real people, real answers. We reply on WhatsApp and email — usually within the hour.' },
              ].map(p => (
                <div key={p.title} className="flex gap-4">
                  <span className="text-lg flex-shrink-0 mt-0.5">{p.icon}</span>
                  <div>
                    <p className="text-sm text-ivory font-medium mb-1">{p.title}</p>
                    <p className="text-sm text-ivory/40 leading-relaxed font-light">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct contact */}
            <div className="glass p-6 rounded-sm space-y-4">
              <p className="text-[0.62rem] tracking-[0.2em] uppercase text-gold/60">Reach Us Directly</p>
              <a href="mailto:hello@zazusafaris.com"
                className="flex items-center gap-3 text-sm text-ivory/60 hover:text-ivory transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors text-xs">@</span>
                hello@zazusafaris.com
              </a>
              <a href="https://wa.me/254141481665"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-ivory/60 hover:text-green-400 transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-green-400/30 transition-colors text-xs">💬</span>
                WhatsApp: +254 141 481 665
              </a>
              <p className="text-[0.68rem] text-ivory/20">Mon–Sun · 7am–8pm East Africa Time</p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <Suspense fallback={<div className="text-ivory/30 text-sm">Loading…</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}