'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

// Lazy load react-phone-number-input to avoid hydration issues
const PhoneField = lazy(() => import('react-phone-number-input').then(mod => ({ default: mod.default })))

const PACKAGES = [
  { value: 'mara-luxury-ashnil',       label: '4-Day Maasai Mara Luxury Safari – Ashnil Mara Lodge',      price: 2744, days: 4  },
  { value: 'family-safari-sopa-7day',  label: '7-Day Exclusive Private Family Safari at Sopa Lodges',     price: 2672, days: 7  },
  { value: 'family-mara-nakuru-5day',  label: '5-Day Private Family Safari: Mara, Nakuru & Hell\'s Gate',  price: 1568, days: 5  },
  { value: 'mara-midrange-3day',       label: '3-Day Maasai Mara Mid-Range Safari Adventure Camp',         price: 950,  days: 3  },
  { value: 'mara-nakuru-jeep-4day',    label: '4-Day Maasai Mara & Lake Nakuru Private Tour with Jeep',   price: 1420, days: 4  },
  { value: 'amboseli-kili-3day',       label: '3-Day Amboseli Private Safari with Mt Kilimanjaro View',   price: 890,  days: 3  },
  { value: 'mara-nakuru-group-4day',   label: '4-Day Maasai Mara & Lake Nakuru Group Joining Safari',     price: 780,  days: 4  },
  { value: 'mara-family-3day',         label: '3-Day Maasai Mara Private Family Safari Adventure',        price: 1100, days: 3  },
  { value: 'honeymoon-12day',          label: '12-Day Honeymoon – Wilderness & Beach Safaris in Kenya',   price: 4200, days: 12 },
  { value: 'kenya-10day-7parks',       label: '10-Day Tour: 7 Best Parks in Kenya Memorable Safari',      price: 3800, days: 10 },
  { value: 'custom',                   label: 'Custom / Not sure yet — help me choose',                    price: 0,    days: 0  },
]

function calcEndDate(start: string, days: number): string {
  if (!start || !days) return ''
  const d = new Date(start)
  d.setDate(d.getDate() + days - 1)
  return d.toISOString().split('T')[0]
}

function fmtDate(s: string): string {
  if (!s) return ''
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtUSD(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// ── Phone input with all countries via react-phone-number-input ──────────────────
function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Suspense fallback={<input type="tel" placeholder="+254 700 000 000" className="w-full bg-white/5 border border-white/20 text-ivory rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 transition-colors" />}>
      <PhoneField
        value={value}
        onChange={(v: string | undefined) => onChange(v || '')}
        defaultCountry="KE"
        international
        placeholder="+254 700 000 000"
        className="PhoneInput"
      />
    </Suspense>
  )
}

// ── Styles for react-phone-number-input ────────────────────────────────────────
const phoneInputStyles = `
  .PhoneInput {
    display: flex;
    gap: 8px;
    width: 100%;
    align-items: stretch;
  }
  .PhoneInputCountry {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    padding: 0 12px;
    gap: 6px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .PhoneInputCountry:hover {
    border-color: rgba(212, 130, 10, 0.5);
  }
  .PhoneInputCountrySelect {
    background: #1C1008;
    color: #F7F0E4;
    border: none;
    outline: none;
    font-size: 13px;
    cursor: pointer;
    padding: 4px 0;
    font-weight: 300;
  }
  .PhoneInputCountryIcon {
    font-size: 18px;
  }
  .PhoneInputInput {
    flex: 1;
    min-width: 0;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #F7F0E4;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 300;
    border-radius: 2px;
    outline: none;
    transition: border-color 0.3s;
  }
  .PhoneInputInput:focus {
    border-color: rgba(212, 130, 10, 0.5);
  }
  .PhoneInputInput::placeholder {
    color: rgba(247, 240, 228, 0.35);
  }
  @media (max-width: 640px) {
    .PhoneInput {
      flex-direction: column;
      gap: 8px;
    }
    .PhoneInputCountry {
      width: 100%;
      padding: 0 12px;
      justify-content: space-between;
      height: 46px;
    }
    .PhoneInputCountrySelect {
      font-size: 13px;
      width: 100%;
      background: transparent;
      padding: 0 4px;
    }
    .PhoneInputCountryIcon {
      font-size: 18px;
      flex-shrink: 0;
    }
    .PhoneInputInput {
      padding: 12px 16px;
      font-size: 14px;
      width: 100%;
    }
  }
`

// ── Main form ─────────────────────────────────────────────────────────────────
function ContactForm() {
  const searchParams  = useSearchParams()
  const prePackage    = searchParams.get('package') || ''
  const preName       = searchParams.get('name')  ? decodeURIComponent(searchParams.get('name')!)  : ''
  const preEmail      = searchParams.get('email') ? decodeURIComponent(searchParams.get('email')!) : ''

  const hasPreselected = !!prePackage && prePackage !== 'custom'
  const [step, setStep]         = useState(hasPreselected ? 2 : 1)
  const [phone, setPhone]       = useState('')
  const [submitting, setSub]    = useState(false)
  const [success, setOk]        = useState(false)
  const [error, setErr]         = useState('')

  const [form, setForm] = useState({
    name:           preName,
    email:          preEmail,
    package_slug:   prePackage,
    travellers:     '1',
    safari_start:   '',
    payment_intent: 'half',
    message:        '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const pkg       = PACKAGES.find(p => p.value === form.package_slug)
  const travCount = Math.max(1, parseInt(form.travellers) || 1)
  const endDate   = pkg ? calcEndDate(form.safari_start, pkg.days) : ''
  const ppPrice   = pkg?.price || 0
  const totalFull = ppPrice * travCount
  const totalHalf = Math.round(totalFull / 2)

  const PAYMENT_OPTIONS = [
    { value: 'full',         label: 'Pay in Full',           desc: ppPrice ? `${fmtUSD(totalFull)} total (${fmtUSD(ppPrice)}/pp × ${travCount})` : 'Full payment to confirm booking' },
    { value: 'half',         label: 'Pay 50% Now',           desc: ppPrice ? `${fmtUSD(totalHalf)} now — balance due 30 days before departure` : '50% now, balance 30 days before', badge: 'Popular' },
    { value: 'installments', label: 'Installment Plan',      desc: 'Discuss a custom payment schedule on WhatsApp' },
  ]

  const inputCls = "w-full bg-white/5 border border-white/20 text-ivory placeholder:text-ivory/35 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 transition-colors [color-scheme:dark]"
  const labelCls = "block text-[0.62rem] tracking-[0.18em] uppercase text-ivory/40 mb-2"

  const submit = async () => {
    if (!form.name || !form.email) { setErr('Name and email are required.'); return }
    setSub(true); setErr('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: phone || null,
          package_slug: form.package_slug, group_size: travCount,
          travel_start: form.safari_start || null, package_duration: pkg?.days || 0,
          payment_intent: form.payment_intent, message: form.message || null,
          target_budget: ppPrice ? `${fmtUSD(ppPrice)}/pp` : null,
          source: 'booking-form',
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (form.payment_intent === 'installments') {
          const msg = `Hi Zazu Safaris! I'm ${form.name}, I'd like to discuss an installment plan for the ${pkg?.label || 'safari'}. Total: ${fmtUSD(totalFull)}. Email: ${form.email}`
          window.open(`https://wa.me/254141481665?text=${encodeURIComponent(msg)}`, '_blank')
        }
        setOk(true)
      } else {
        setErr(data.error || 'Something went wrong. Please try again.')
      }
    } catch { setErr('Network error. Please try again.') }
    finally { setSub(false) }
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (success) return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
        <span className="text-gold text-2xl">✦</span>
      </div>
      <h3 className="text-3xl text-ivory mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>Safari Brief Received</h3>
      <p className="text-sm text-ivory/45 max-w-sm mx-auto leading-relaxed font-light mb-2">
        Confirmation sent to <span className="text-ivory/70">{form.email}</span>.
      </p>
      <p className="text-sm text-ivory/40 max-w-sm mx-auto leading-relaxed font-light">
        Our team will reach out within 2 hours with your personalised proposal.
      </p>
      {(form.payment_intent === 'full' || form.payment_intent === 'half') && pkg && (
        <div className="mt-8 p-4 border border-gold/20 rounded-sm max-w-sm mx-auto text-left">
          <p className="text-xs text-gold/70 mb-1.5 uppercase tracking-widest">Payment</p>
          <p className="text-sm text-ivory/55 font-light leading-relaxed">
            A secure Pesapal link for <strong className="text-ivory">{form.payment_intent === 'full' ? fmtUSD(totalFull) : fmtUSD(totalHalf)}</strong> will arrive in your email within 2 hours. Accepted: M-Pesa & card.
          </p>
        </div>
      )}
      <Link href="/safaris" className="inline-block mt-8 text-[0.72rem] tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
        Browse more safaris →
      </Link>
    </div>
  )

  const stepLabels = hasPreselected ? ['Your Details', 'Confirm'] : ['Choose Safari', 'Your Details', 'Confirm']
  const stepNums   = hasPreselected ? [2, 3] : [1, 2, 3]

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => {
          const sn = stepNums[i]
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={cn('flex items-center gap-1.5 text-[0.62rem] tracking-wide uppercase transition-colors whitespace-nowrap', step === sn ? 'text-gold' : step > sn ? 'text-ivory/35' : 'text-ivory/20')}>
                <span className={cn('w-5 h-5 rounded-full border flex items-center justify-center text-[0.58rem] flex-shrink-0', step === sn ? 'border-gold text-gold' : step > sn ? 'border-ivory/25 text-ivory/40' : 'border-white/12 text-ivory/20')}>
                  {step > sn ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div className={cn('flex-1 h-px', step > sn ? 'bg-ivory/15' : 'bg-white/6')} />}
            </div>
          )
        })}
      </div>

      {/* ── STEP 1: Choose package ──────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className={labelCls}>Which Safari Package?</label>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {PACKAGES.map(p => (
                <label key={p.value} className={cn('flex items-center gap-4 p-3 border rounded-sm cursor-pointer transition-all', form.package_slug === p.value ? 'border-gold bg-gold/6' : 'border-white/10 hover:border-white/25')}>
                  <input type="radio" name="package" value={p.value} checked={form.package_slug === p.value} onChange={e => set('package_slug', e.target.value)} className="flex-shrink-0 accent-[#D4820A]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ivory font-light">{p.label}</p>
                    {p.value !== 'custom' && p.price > 0 && (
                      <p className="text-xs text-gold/55 mt-0.5">{fmtUSD(p.price)}/pp · {p.days} days</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!form.package_slug}
            className={cn('btn-shine w-full text-[0.78rem] tracking-[0.14em] uppercase font-medium py-4 rounded-sm transition-all', form.package_slug ? 'bg-gold text-charcoal hover:bg-gold-light' : 'bg-white/10 text-ivory/30 cursor-not-allowed')}>
            Continue → Your Details
          </button>
        </div>
      )}

      {/* ── STEP 2: Contact details ─────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          {pkg && (
            <div className="border border-gold/20 bg-gold/5 rounded-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-[0.58rem] tracking-widest uppercase text-gold/55 mb-0.5">Selected Package</p>
                <p className="text-sm text-ivory font-medium">{pkg.label}</p>
                {pkg.price > 0 && <p className="text-xs text-gold/55 mt-0.5">{fmtUSD(pkg.price)}/pp · {pkg.days} days</p>}
              </div>
              <button onClick={() => { set('package_slug', ''); setStep(1) }} className="text-[0.62rem] text-ivory/30 hover:text-ivory/60 transition-colors uppercase tracking-wide border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-sm">
                Change
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input type="text" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email Address *</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelCls}>WhatsApp / Phone</label>
            <div className="w-full">
              <PhoneInput value={phone} onChange={setPhone} />
            </div>
          </div>

          {/* Number of travellers — specific number */}
          <div>
            <label className={labelCls}>Number of Travellers *</label>
            <div className="flex items-center gap-3">
              <button onClick={() => set('travellers', String(Math.max(1, travCount - 1)))}
                className="w-10 h-10 flex-shrink-0 rounded-sm border border-white/20 text-ivory text-lg hover:border-gold/50 transition-colors flex items-center justify-center">−</button>
              <input
                type="number" min="1" max="30"
                value={form.travellers}
                onChange={e => set('travellers', String(Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 text-center bg-white/5 border border-white/20 text-ivory rounded-sm px-3 py-2.5 text-sm outline-none focus:border-gold/50 transition-colors [color-scheme:dark]"
              />
              <button onClick={() => set('travellers', String(Math.min(30, travCount + 1)))}
                className="w-10 h-10 flex-shrink-0 rounded-sm border border-white/20 text-ivory text-lg hover:border-gold/50 transition-colors flex items-center justify-center">+</button>
              {ppPrice > 0 && (
                <span className="text-sm text-gold/70 ml-2">= {fmtUSD(ppPrice * travCount)} total</span>
              )}
            </div>
          </div>

          {/* Date — compact */}
          <div>
            <label className={labelCls}>Preferred Safari Start Date</label>
            <input
              type="date"
              value={form.safari_start}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => set('safari_start', e.target.value)}
              className="max-w-xs bg-white/5 border border-white/20 text-ivory rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 transition-colors [color-scheme:dark]"
            />
            {form.safari_start && pkg && pkg.days > 0 && (
              <p className="text-xs text-ivory/45 mt-2">
                <span className="text-gold/60">✓</span> {fmtDate(form.safari_start)} → {fmtDate(endDate)} <span className="text-ivory/30">({pkg.days} days)</span>
              </p>
            )}
            <p className="text-[0.6rem] text-ivory/22 mt-1.5">Not sure yet? Leave blank — we'll work around your schedule.</p>
          </div>

          <div>
            <label className={labelCls}>Anything to Know? (Optional)</label>
            <textarea rows={3} placeholder="Special occasions, dietary requirements, accessibility needs…" value={form.message} onChange={e => set('message', e.target.value)} className={cn(inputCls, 'resize-none')} />
          </div>

          {error && <p className="text-red-400/75 text-sm">{error}</p>}

          <div className="flex gap-3">
            {!hasPreselected && (
              <button onClick={() => setStep(1)} className="text-[0.72rem] tracking-wide uppercase text-ivory/35 border border-white/12 px-5 py-3 rounded-sm hover:border-white/25 hover:text-ivory/55 transition-all">← Back</button>
            )}
            <button
              onClick={() => { if (!form.name || !form.email) { setErr('Name and email are required.'); return } setErr(''); setStep(3) }}
              className="btn-shine flex-1 text-[0.78rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal py-3 rounded-sm hover:bg-gold-light transition-all">
              Continue → Confirm
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Summary + Payment ───────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="border border-white/10 rounded-sm p-5 space-y-2.5 text-sm">
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gold/55 mb-3">Booking Summary</p>
            {[
              { label: 'Package',       value: pkg?.label || 'Custom' },
              { label: 'Price/person',  value: ppPrice ? fmtUSD(ppPrice) : 'TBD', gold: true },
              { label: 'Travellers',    value: `${travCount} ${travCount === 1 ? 'person' : 'people'}` },
              { label: 'Total',         value: ppPrice ? fmtUSD(totalFull) : 'TBD', gold: true },
              { label: 'Safari Start',  value: form.safari_start ? fmtDate(form.safari_start) : 'Flexible' },
              { label: 'Safari End',    value: endDate ? fmtDate(endDate) : (form.safari_start ? '—' : 'Flexible') },
              { label: 'Name',          value: form.name },
              { label: 'Email',         value: form.email },
              { label: 'Phone',         value: phone || '—' },
            ].map(row => (
              <div key={row.label} className="flex justify-between gap-4">
                <span className="text-ivory/35 flex-shrink-0">{row.label}</span>
                <span className={cn('text-right break-all', row.gold ? 'text-gold' : 'text-ivory/80')}>{row.value}</span>
              </div>
            ))}
          </div>

          <div>
            <label className={labelCls}>How Would You Like to Proceed?</label>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map(opt => (
                <label key={opt.value} className={cn('flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-all', form.payment_intent === opt.value ? 'border-gold bg-gold/6' : 'border-white/10 hover:border-white/22')}>
                  <input type="radio" name="payment" value={opt.value} checked={form.payment_intent === opt.value} onChange={e => set('payment_intent', e.target.value)} className="mt-0.5 flex-shrink-0 accent-[#D4820A]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-ivory font-medium">{opt.label}</p>
                      {'badge' in opt && opt.badge && (
                        <span className="text-[0.52rem] tracking-widest uppercase border border-gold/30 text-gold/60 px-1.5 py-0.5 rounded-sm">{opt.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-ivory/40 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {form.payment_intent === 'installments' && (
              <div className="mt-3 p-3 bg-green-900/20 border border-green-400/20 rounded-sm flex gap-3">
                <span className="text-green-400 flex-shrink-0 mt-0.5">💬</span>
                <p className="text-xs text-ivory/50 leading-relaxed">After submitting, you'll be redirected to WhatsApp to arrange your payment schedule directly with our team.</p>
              </div>
            )}
            {(form.payment_intent === 'full' || form.payment_intent === 'half') && ppPrice > 0 && (
              <div className="mt-3 p-3 bg-gold/5 border border-gold/15 rounded-sm">
                <p className="text-xs text-ivory/50 leading-relaxed">
                  <span className="text-gold font-medium">Amount due: </span>
                  <strong className="text-ivory">{form.payment_intent === 'full' ? fmtUSD(totalFull) : fmtUSD(totalHalf)}</strong>
                  {' '}— a secure Pesapal link (M-Pesa or card) will be sent to your email within 2 hours.
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-red-400/75 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="text-[0.72rem] tracking-wide uppercase text-ivory/35 border border-white/12 px-5 py-4 rounded-sm hover:border-white/25 hover:text-ivory/55 transition-all">← Back</button>
            <button onClick={submit} disabled={submitting}
              className={cn('btn-shine flex-1 text-[0.78rem] tracking-[0.14em] uppercase font-medium py-4 rounded-sm transition-all', submitting ? 'bg-gold/50 text-charcoal/50 cursor-not-allowed' : 'bg-gold text-charcoal hover:bg-gold-light')}>
              {submitting ? 'Sending…' : form.payment_intent === 'installments' ? 'Submit & Chat on WhatsApp →' : 'Submit & Await Payment Link →'}
            </button>
          </div>
          <p className="text-[0.6rem] text-ivory/20 text-center">We respond within 2 hours · No spam · Your data is never sold</p>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <style>{phoneInputStyles}</style>
      <section className="pt-36 pb-16 px-6 bg-charcoal">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Book Your Safari</p>
          <h1 className="text-display-lg text-ivory mb-4 leading-tight" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
            Let&apos;s Make It<br />Happen.
          </h1>
          <p className="text-sm text-ivory/40 max-w-md font-light leading-relaxed">Three steps. Two minutes. One unforgettable safari.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-charcoal">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* Left: trust points */}
          <div className="space-y-10">
            <div className="space-y-6">
              {[
                { icon: '🔒', title: 'Secure Payments',       desc: 'Pay via M-Pesa or card through Pesapal. No hidden charges, ever.' },
                { icon: '✦',  title: 'Free Custom Itinerary', desc: 'Every booking includes a personalised day-by-day plan.' },
                { icon: '📅', title: 'Flexible Safari Dates', desc: "Can't commit yet? Enquire now, lock in dates later." },
                { icon: '💬', title: 'Human Support',         desc: 'Real people on WhatsApp and email — usually within the hour.' },
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

            <div className="glass p-6 rounded-sm space-y-4">
              <p className="text-[0.62rem] tracking-[0.2em] uppercase text-gold/60">Reach Us Directly</p>
              <a href="mailto:hello@zazusafaris.com" className="flex items-center gap-3 text-sm text-ivory/55 hover:text-ivory transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors text-xs">@</span>
                hello@zazusafaris.com
              </a>
              <a href="https://wa.me/254141481665" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-ivory/55 hover:text-green-400 transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-green-400/30 transition-colors text-xs">💬</span>
                WhatsApp: +254 141 481 665
              </a>
              <p className="text-[0.68rem] text-ivory/20">Mon–Sun · 7am–8pm East Africa Time</p>
            </div>
          </div>

          {/* Right: booking form */}
          <div>
            <Suspense fallback={<div className="text-ivory/30 text-sm py-8">Loading form…</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
