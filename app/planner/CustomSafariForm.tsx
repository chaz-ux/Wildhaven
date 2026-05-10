'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const DESTINATIONS = [
  'Maasai Mara', 'Amboseli', 'Tsavo East', 'Tsavo West',
  'Lake Nakuru', "Hell's Gate", 'Lake Naivasha', 'Samburu',
  'Laikipia / Ol Pejeta', 'Mombasa / Diani Beach', 'Mount Kenya',
  'Serengeti (Tanzania)', 'Ngorongoro (Tanzania)', 'Not sure — recommend for me',
]

const COUNTRY_CODES = [
  { code: '+254', label: '🇰🇪 +254' }, { code: '+255', label: '🇹🇿 +255' },
  { code: '+256', label: '🇺🇬 +256' }, { code: '+250', label: '🇷🇼 +250' },
  { code: '+27',  label: '🇿🇦 +27'  }, { code: '+1',   label: '🇺🇸 +1'   },
  { code: '+44',  label: '🇬🇧 +44'  }, { code: '+61',  label: '🇦🇺 +61'  },
  { code: '+49',  label: '🇩🇪 +49'  }, { code: '+33',  label: '🇫🇷 +33'  },
  { code: '+31',  label: '🇳🇱 +31'  }, { code: '+39',  label: '🇮🇹 +39'  },
  { code: '+34',  label: '🇪🇸 +34'  }, { code: '+91',  label: '🇮🇳 +91'  },
  { code: '+971', label: '🇦🇪 +971' }, { code: '+966', label: '🇸🇦 +966' },
  { code: '+86',  label: '🇨🇳 +86'  }, { code: '+81',  label: '🇯🇵 +81'  },
  { code: '+other', label: '🌍 Other' },
]

const BUDGETS = [
  'Under $500/pp', '$500–$1,000/pp', '$1,000–$2,000/pp',
  '$2,000–$4,000/pp', '$4,000–$6,000/pp', '$6,000+/pp',
]

const DURATIONS = [
  '1–3 days', '4–5 days', '6–7 days', '8–10 days', '11–14 days', '15+ days',
]

export default function CustomSafariForm() {
  const [countryCode, setCC] = useState('+254')
  const [phoneNum, setPN]    = useState('')
  const [selectedDests, setDests] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '', email: '', country: '',
    budget: '', duration: '', travellers: '',
    traveller_ages: '', safari_date: '',
    description: '',
  })
  const [submitting, setSub] = useState(false)
  const [success,    setOk]  = useState(false)
  const [error,      setErr] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const fullPhone = countryCode !== '+other' ? `${countryCode} ${phoneNum}`.trim() : phoneNum

  const toggleDest = (d: string) =>
    setDests(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const submit = async () => {
    if (!form.name || !form.email) { setErr('Name and email are required.'); return }
    setSub(true); setErr('')
    try {
      const message = [
        form.description ? `Vision: ${form.description}` : '',
        selectedDests.length ? `Destinations: ${selectedDests.join(', ')}` : '',
        form.traveller_ages ? `Traveller ages: ${form.traveller_ages}` : '',
        form.country ? `Country: ${form.country}` : '',
      ].filter(Boolean).join('\n')

      const res = await fetch('/api/inquiry', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:             form.name,
          email:            form.email,
          phone:            fullPhone || null,
          package_slug:     'custom',
          group_size:       parseInt(form.travellers) || 1,
          travel_start:     form.safari_date || null,
          target_budget:    form.budget || null,
          payment_intent:   'enquire',
          message:          message || null,
          preferred_tier:   `Custom | Duration: ${form.duration || 'TBD'}`,
          source:           'custom-safari-form',
        }),
      })
      const data = await res.json()
      if (data.success) setOk(true)
      else setErr(data.error || 'Something went wrong. Please try again.')
    } catch {
      setErr('Network error. Please try again.')
    } finally {
      setSub(false)
    }
  }

  const iCls = "w-full bg-white/5 border border-white/15 text-ivory placeholder:text-ivory/30 rounded-sm px-3 py-2.5 text-sm font-light outline-none focus:border-gold/50 transition-colors [color-scheme:dark]"
  const lCls = "block text-[0.6rem] tracking-[0.16em] uppercase text-ivory/40 mb-1.5"

  if (success) return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-gold text-2xl">✦</span>
        </div>
        <h2 className="text-3xl text-ivory mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
          Custom Safari Request Received
        </h2>
        <p className="text-sm text-ivory/45 leading-relaxed font-light mb-2">
          Confirmation sent to <span className="text-ivory/70">{form.email}</span>.
        </p>
        <p className="text-sm text-ivory/40 leading-relaxed font-light mb-8">
          Our team will reach out within 2 hours with a personalised safari proposal built around your vision.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-shine text-[0.72rem] tracking-wide uppercase font-medium bg-gold text-charcoal px-8 py-3 rounded-sm hover:bg-gold-light transition-colors">
            Back to Home
          </Link>
          <Link href="/safaris" className="text-[0.72rem] tracking-wide uppercase border border-white/20 text-ivory/60 px-8 py-3 rounded-sm hover:border-gold hover:text-gold transition-colors">
            Browse Packages
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Header */}
      <section className="pt-36 pb-12 px-6">
        <div className="max-w-[760px] mx-auto">
          <Link href="/safaris" className="text-[0.65rem] tracking-wide text-gold/50 hover:text-gold transition-colors mb-6 inline-block">
            ← Browse Standard Packages
          </Link>
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-3">Custom Safari</p>
          <h1 className="text-4xl md:text-5xl text-ivory mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
            Build Your Safari<br />
            <em className="text-gradient-gold not-italic">From Scratch.</em>
          </h1>
          <p className="text-sm text-ivory/45 font-light leading-relaxed max-w-xl">
            None of our standard packages quite fit? Tell us exactly what you have in mind — budget, destinations, duration, group — and we'll design a safari around you and send a full proposal within 2 hours.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-6">
        <div className="max-w-[760px] mx-auto space-y-8">

          {/* Personal details */}
          <div className="border border-white/8 rounded-sm p-6 space-y-4">
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-gold/60 mb-4">Your Details</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lCls}>Full Name *</label>
                <input type="text" placeholder="Your name" value={form.name}
                  onChange={e => set('name', e.target.value)} className={iCls} />
              </div>
              <div>
                <label className={lCls}>Email Address *</label>
                <input type="email" placeholder="your@email.com" value={form.email}
                  onChange={e => set('email', e.target.value)} className={iCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lCls}>WhatsApp / Phone</label>
                <div className="flex gap-2">
                  <select value={countryCode} onChange={e => setCC(e.target.value)}
                    className="bg-white/5 border border-white/15 text-ivory rounded-sm px-2 py-2.5 text-sm font-light outline-none focus:border-gold/50 [color-scheme:dark] flex-shrink-0 w-24">
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <input type="tel" inputMode="numeric" placeholder="700 000 000"
                    value={phoneNum} onChange={e => setPN(e.target.value)}
                    className={cn(iCls, 'min-w-0 flex-1')} />
                </div>
              </div>
              <div>
                <label className={lCls}>Your Country</label>
                <input type="text" placeholder="e.g. United Kingdom" value={form.country}
                  onChange={e => set('country', e.target.value)} className={iCls} />
              </div>
            </div>
          </div>

          {/* Safari details */}
          <div className="border border-white/8 rounded-sm p-6 space-y-5">
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-gold/60 mb-4">Safari Details</p>

            {/* Budget */}
            <div>
              <label className={lCls}>Budget Per Person</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUDGETS.map(b => (
                  <button key={b} onClick={() => set('budget', b)}
                    className={cn(
                      'text-xs px-3 py-2.5 border rounded-sm transition-all text-left',
                      form.budget === b ? 'border-gold bg-gold/8 text-ivory' : 'border-white/12 text-ivory/45 hover:border-white/25 hover:text-ivory/70'
                    )}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className={lCls}>Safari Duration</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => set('duration', d)}
                    className={cn(
                      'text-xs px-2 py-2.5 border rounded-sm transition-all text-center',
                      form.duration === d ? 'border-gold bg-gold/8 text-ivory' : 'border-white/12 text-ivory/45 hover:border-white/25 hover:text-ivory/70'
                    )}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Travellers + ages */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div>
                <label className={lCls}>Number of Travellers</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => set('travellers', String(Math.max(1, (parseInt(form.travellers) || 1) - 1)))}
                    className="w-10 h-10 border border-white/15 rounded-sm text-ivory/60 hover:border-gold/40 hover:text-gold transition-all text-lg flex-shrink-0 flex items-center justify-center">
                    −
                  </button>
                  
                  {/* FIX: Removed iCls here so it doesn't inherit w-full. Hardcoded to w-16 */}
                  <input type="number" min="1" max="50" placeholder="1"
                    value={form.travellers} onChange={e => set('travellers', e.target.value)}
                    className="bg-white/5 border border-white/15 text-ivory rounded-sm py-2 text-sm font-light outline-none focus:border-gold/50 transition-colors [color-scheme:dark] text-center w-16 h-10 flex-shrink-0" />
                  
                  <button
                    onClick={() => set('travellers', String((parseInt(form.travellers) || 0) + 1))}
                    className="w-10 h-10 border border-white/15 rounded-sm text-ivory/60 hover:border-gold/40 hover:text-gold transition-all text-lg flex-shrink-0 flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>
              
              {/* Ages input now takes up the remaining space */}
              <div className="flex-1 w-full max-w-full">
                <label className={lCls}>Ages of Travellers</label>
                <input type="text" placeholder="e.g. 35, 34, 8, 6"
                  value={form.traveller_ages} onChange={e => set('traveller_ages', e.target.value)}
                  className={iCls} />
                <p className="text-[0.58rem] text-ivory/22 mt-1">Helps us suggest child-friendly options if needed</p>
              </div>
            </div>

            {/* Desired start date */}
            <div>
              <label className={lCls}>Desired Safari Start Date</label>
              <input type="date" value={form.safari_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => set('safari_date', e.target.value)}
                className={cn(iCls, 'max-w-[200px]')} />
              <p className="text-[0.58rem] text-ivory/22 mt-1">Flexible? Leave blank — we'll discuss dates with you.</p>
            </div>
          </div>

          {/* Destinations */}
          <div className="border border-white/8 rounded-sm p-6">
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-gold/60 mb-4">Preferred Destinations</p>
            <p className="text-xs text-ivory/35 mb-4 font-light">Select all that interest you. We'll build the best route.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DESTINATIONS.map(d => (
                <button key={d} onClick={() => toggleDest(d)}
                  className={cn(
                    'text-xs px-3 py-2.5 border rounded-sm transition-all text-left leading-snug',
                    selectedDests.includes(d)
                      ? 'border-gold bg-gold/8 text-ivory'
                      : 'border-white/12 text-ivory/45 hover:border-white/25 hover:text-ivory/70'
                  )}>
                  {selectedDests.includes(d) && <span className="text-gold mr-1 text-[0.6rem]">✓</span>}
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Free description */}
          <div className="border border-white/8 rounded-sm p-6">
            <label className={cn(lCls, 'mb-3')}>
              Tell Us Your Vision <span className="text-ivory/20 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea rows={4}
              placeholder="E.g. We want a mix of wildlife and culture, nothing too rushed. We have young kids so child-friendly lodges are important. We'd love to see elephants and lions. A beach day at the end would be a bonus…"
              value={form.description} onChange={e => set('description', e.target.value)}
              className={cn(iCls, 'resize-none')} />
          </div>

          {error && <p className="text-red-400/75 text-sm">{error}</p>}

          {/* Submit */}
          <div className="space-y-3">
            <button onClick={submit} disabled={submitting || !form.name || !form.email}
              className={cn(
                'btn-shine w-full text-[0.78rem] tracking-[0.14em] uppercase font-medium py-4 rounded-sm transition-all',
                !submitting && form.name && form.email
                  ? 'bg-gold text-charcoal hover:bg-gold-light'
                  : 'bg-white/10 text-ivory/30 cursor-not-allowed'
              )}>
              {submitting ? 'Sending Your Request…' : 'Send My Custom Safari Request →'}
            </button>
            <p className="text-[0.6rem] text-ivory/20 text-center">
              Our team reviews every custom request personally · Response within 2 hours · No obligation
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}