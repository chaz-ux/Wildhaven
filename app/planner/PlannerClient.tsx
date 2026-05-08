'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { savePlannerSession } from '@/lib/data'
import type { QuizAnswers } from '@/lib/types'

const STEPS = [
  {
    id: 'style',
    question: 'What kind of traveller are you?',
    hint: 'This shapes your camp, vehicle, and guide.',
    type: 'single',
    options: [
      { value: 'luxury',    icon: '♔', label: 'Luxury',       sub: 'Private lodges, exclusive access' },
      { value: 'midrange',  icon: '◎', label: 'Comfortable',  sub: 'Quality camps, expert guides' },
      { value: 'budget',    icon: '◉', label: 'Adventure',    sub: 'Great value, real safari feel' },
      { value: 'undecided', icon: '?', label: 'Not sure yet', sub: 'Let me recommend the best fit' },
    ],
  },
  {
    id: 'group',
    question: 'Who\'s coming with you?',
    hint: 'This helps us suggest the right package and vehicle.',
    type: 'group',
    options: [
      { value: '1',    icon: '🧍', label: 'Solo',        sub: 'Just me' },
      { value: '2',    icon: '👫', label: 'Couple',      sub: '2 travellers' },
      { value: '3-5',  icon: '👨‍👩‍👧', label: 'Family',     sub: '3–5 people' },
      { value: '6+',   icon: '👥', label: 'Group',       sub: '6 or more' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget per person?",
    hint: 'We\'ll show you exactly what\'s available at your range.',
    type: 'slider',
    min: 500, max: 15000, step: 250,
  },
  {
    id: 'animals',
    question: 'What do you most want to experience?',
    hint: 'Select everything that excites you — we\'ll route through it.',
    type: 'multi',
    options: [
      { value: 'big5',      icon: '🦁', label: 'Big Five' },
      { value: 'migration', icon: '🦬', label: 'Great Migration' },
      { value: 'cheetah',   icon: '🐆', label: 'Big Cats' },
      { value: 'elephant',  icon: '🐘', label: 'Elephants' },
      { value: 'beach',     icon: '🏖️', label: 'Beach Finish' },
      { value: 'culture',   icon: '🏹', label: 'Local Culture' },
    ],
  },
  {
    id: 'duration',
    question: 'How many days are you thinking?',
    hint: 'The longer you stay, the more you see.',
    type: 'single',
    options: [
      { value: '3-4',  icon: '📅', label: '3–4 Days',  sub: 'Quick escape' },
      { value: '5-7',  icon: '🗓',  label: '5–7 Days',  sub: 'Sweet spot' },
      { value: '8-12', icon: '🌍', label: '8–12 Days', sub: 'Multi-park' },
      { value: '13+',  icon: '✈️', label: '13+ Days',  sub: 'Full immersion' },
    ],
  },
  {
    id: 'contact',
    question: 'Almost there.',
    hint: 'Enter your name and email to receive your personalised safari plan.',
    type: 'form',
  },
]

// Extended QuizAnswers to include group
interface FullAnswers extends QuizAnswers {
  group: string
}

export default function PlannerClient() {
  const router = useRouter()
  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState<FullAnswers>({
    style: null, group: '', budget: 2500, animals: [], duration: null,
  })
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState<string | null>(null)

  const currentStep = STEPS[step]
  const progress    = ((step) / (STEPS.length - 1)) * 100

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const selectSingle = (key: keyof FullAnswers, val: string) =>
    setAnswers(a => ({ ...a, [key]: val }))

  const toggleMulti = (val: string) =>
    setAnswers(a => ({
      ...a,
      animals: a.animals.includes(val)
        ? a.animals.filter(x => x !== val)
        : [...a.animals, val],
    }))

  const generate = async () => {
    if (!email) return
    setLoading(true)

    const prompt = `You are a knowledgeable safari advisor for Zazu Safaris Kenya. A visitor has completed our quiz:
- Travel style: ${answers.style || 'not specified'}
- Group: ${answers.group || 'not specified'}
- Budget per person: $${answers.budget}
- Interests: ${answers.animals.join(', ') || 'general wildlife'}
- Duration: ${answers.duration || '5-7 days'}
- Name: ${name || 'there'}

Our exact packages:
1. 4-Day Maasai Mara Luxury Safari — Ashnil Mara Lodge — $2,744/pp — Big Five, private game drives, full board
2. 7-Day Family Safari at Sopa Lodges — $2,672/pp — Amboseli, Tsavo, Mara — great for families
3. 5-Day Mara, Nakuru & Hell's Gate — $1,568/pp — rhinos, flamingos, cycling, Big Five
4. 5-Day Rift Valley Tour — $1,420/pp — lakes, flamingos, gorge cycling, Naivasha hippos
5. 7-Day Kenya Classic Safari — $2,190/pp — Amboseli, Tsavo, Mara full circuit
6. 8-Day Kenya Odyssey to Mombasa — $2,480/pp — safari parks + Diani Beach finale
7. 5-Day Taita Hills & Salt Lick via Mombasa — $1,680/pp — Salt Lick Lodge on stilts + coast
8. 4-Day Ol Pejeta Conservancy — $3,200/pp — last northern white rhinos, wild dogs, Big Five

Respond as a helpful human travel advisor. In plain HTML only (<h3><p><strong><ul><li>):
1. Greet them by name warmly
2. Recommend 1-2 specific packages that match their budget, group type, duration AND interests — explain exactly why each fits
3. Briefly explain what each day feels like (not a bullet list of logistics, but the actual experience)
4. Note what's included (meals, transfers, park fees) so they know the price is all-in
5. If their budget is below our lowest package ($1,420), explain honestly and offer the closest option
6. End with a clear next step — encourage them to book or ask questions

Max 320 words. No markdown. Sound human and warm, not like a brochure.`

    try {
      const res  = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, answers, name, email }),
      })
      const data = await res.json()
      setResult(data.content || 'Unable to generate plan right now.')

      // Save session
      try {
        await savePlannerSession({ name, email, quiz_answers: answers })
      } catch {}

      // Also fire an inquiry to notify the team
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email,
          message: `AI Planner session completed. Style: ${answers.style}, Group: ${answers.group}, Budget: $${answers.budget}, Duration: ${answers.duration}, Interests: ${answers.animals.join(', ')}`,
          source: 'planner',
          group_size: answers.group,
          target_budget: `$${answers.budget}`,
        }),
      }).catch(() => {})

    } catch {
      setResult(`<h3>Here's Your Safari Plan, ${name || 'Explorer'}</h3><p>Based on your <strong>$${Number(answers.budget).toLocaleString()}</strong> budget and interest in <strong>${answers.animals.join(', ') || 'East African wildlife'}</strong>, we have great options for you.</p><p>Our team will send a personalised proposal to <strong>${email}</strong> within 2 hours.</p>`)
    } finally {
      setLoading(false)
    }
  }

  // Direct book from AI result — passes all known info to contact form
  const bookNow = (packageSlug?: string) => {
    const params = new URLSearchParams({
      from:       'planner',
      name:       name,
      email:      email,
      travellers: answers.group,
      ...(packageSlug ? { package: packageSlug } : {}),
    })
    router.push(`/contact?${params.toString()}`)
  }

  const inputCls = "w-full bg-charcoal border border-white/20 text-ivory placeholder:text-ivory/30 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 transition-colors"

  return (
    <div className="min-h-screen bg-charcoal-mid flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
        <div className="h-full bg-gold transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-32 max-w-2xl mx-auto w-full">
        {!result ? (
          <>
            {/* Step dots */}
            <div className="flex gap-1.5 mb-10">
              {STEPS.map((_, i) => (
                <div key={i} className={cn(
                  'h-0.5 flex-1 rounded-full transition-all duration-500',
                  i < step ? 'bg-gold' : i === step ? 'bg-gold/50' : 'bg-white/10'
                )} />
              ))}
            </div>

            <p className="text-[0.62rem] tracking-[0.25em] uppercase text-gold/60 mb-4">
              Step {step + 1} of {STEPS.length}
            </p>

            <h2 className="text-4xl md:text-5xl text-ivory mb-2 leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
              {currentStep.question}
            </h2>
            <p className="text-sm text-ivory/35 mb-10 font-light">{currentStep.hint}</p>

            {/* Single select (style, duration) */}
            {(currentStep.type === 'single' || currentStep.type === 'group') && currentStep.options && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {currentStep.options.map(opt => {
                  const key    = currentStep.type === 'group' ? 'group' : currentStep.id as keyof FullAnswers
                  const active = answers[key] === opt.value
                  return (
                    <button key={opt.value}
                      onClick={() => selectSingle(key, opt.value)}
                      className={cn(
                        'text-left p-5 border rounded-sm transition-all duration-300',
                        active ? 'border-gold bg-gold/8' : 'border-white/10 hover:border-gold/40'
                      )}>
                      <span className="text-2xl block mb-3">{opt.icon}</span>
                      <p className="text-sm font-medium text-ivory mb-0.5">{opt.label}</p>
                      {'sub' in opt && opt.sub && <p className="text-xs text-ivory/35">{opt.sub}</p>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Budget slider */}
            {currentStep.type === 'slider' && (
              <div className="mb-10">
                <p className="text-5xl text-gold mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  ${answers.budget.toLocaleString()}
                  <span className="text-base text-ivory/30 font-sans ml-2">per person</span>
                </p>
                <p className="text-xs text-ivory/30 mb-4">
                  {answers.budget < 1420 ? 'Below our current packages — we\'ll find a solution' :
                   answers.budget < 2000 ? 'Matches our 4–5 day packages perfectly' :
                   answers.budget < 3000 ? 'Opens up our best mid-range circuits' :
                   'Full access to all packages including luxury'}
                </p>
                <input type="range" min={500} max={15000} step={250} value={answers.budget}
                  onChange={e => setAnswers(a => ({ ...a, budget: +e.target.value }))}
                  className="w-full appearance-none h-0.5 bg-white/15 rounded-full outline-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gold
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-charcoal" />
                <div className="flex justify-between text-[0.62rem] text-ivory/20 mt-2">
                  <span>$500</span><span>$15,000+</span>
                </div>
              </div>
            )}

            {/* Multi select */}
            {currentStep.type === 'multi' && currentStep.options && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {currentStep.options.map(opt => {
                  const sel = answers.animals.includes(opt.value)
                  return (
                    <button key={opt.value} onClick={() => toggleMulti(opt.value)}
                      className={cn(
                        'p-4 border rounded-sm transition-all duration-300 text-center',
                        sel ? 'border-gold bg-gold/8' : 'border-white/10 hover:border-gold/30'
                      )}>
                      <span className="text-2xl block mb-2">{opt.icon}</span>
                      <p className="text-xs text-ivory/70">{opt.label}</p>
                      {sel && <p className="text-gold text-xs mt-1">✓</p>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Contact form */}
            {currentStep.type === 'form' && (
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/30 block mb-2">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" className={inputCls} />
                </div>
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/30 block mb-2">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" className={inputCls} />
                </div>
                <p className="text-[0.65rem] text-ivory/20 leading-relaxed">
                  We'll send your safari plan to this email. No spam, ever.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button onClick={goBack}
                  className="text-[0.72rem] tracking-[0.1em] uppercase text-ivory/30 border border-white/12 px-5 py-3 rounded-sm hover:border-white/30 hover:text-ivory/60 transition-all">
                  ← Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={goNext}
                  className="btn-shine text-[0.72rem] tracking-[0.12em] uppercase font-medium bg-gold text-charcoal px-8 py-3 rounded-sm hover:bg-gold-light transition-colors">
                  Continue →
                </button>
              ) : (
                <button onClick={generate} disabled={!email || loading}
                  className={cn(
                    'btn-shine text-[0.72rem] tracking-[0.12em] uppercase font-medium px-8 py-3 rounded-sm transition-all',
                    email && !loading
                      ? 'bg-gold text-charcoal hover:bg-gold-light'
                      : 'bg-white/10 text-ivory/30 cursor-not-allowed'
                  )}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-charcoal/40 border-t-charcoal animate-spin" />
                      Building your plan…
                    </span>
                  ) : '✦ Get My Safari Plan'}
                </button>
              )}
            </div>
          </>
        ) : (
          /* ── Result ─────────────────────────────────────── */
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Your Safari Plan</p>

            {/* AI response */}
            <div
              className="border border-white/10 bg-charcoal/60 p-8 rounded-sm mb-8 text-sm text-ivory/75 leading-relaxed font-light
                [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-ivory [&_h3]:mt-6 [&_h3]:mb-3 [&_h3:first-child]:mt-0
                [&_strong]:text-gold [&_strong]:font-medium
                [&_ul]:mt-3 [&_ul]:space-y-2 [&_li]:flex [&_li]:gap-2
                [&_p]:mb-3 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: result }}
            />

            {/* Package options */}
            <div className="space-y-2 mb-8">
              <p className="text-[0.62rem] tracking-[0.2em] uppercase text-ivory/30 mb-3">Quick Book a Package</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { slug: 'mara-luxury-ashnil' as const,     label: '4-Day Mara Luxury',    price: '$2,744/pp' },
                  { slug: 'family-circuit-sopa' as const,    label: '7-Day Family Safari',  price: '$2,672/pp' },
                  { slug: 'mara-nakuru-hells-gate' as const, label: '5-Day Mara & Nakuru',  price: '$1,568/pp' },
                  { slug: 'rift-valley-naivasha' as const,   label: '5-Day Rift Valley',    price: '$1,420/pp' },
                  { slug: 'kenya-classic-circuit' as const,  label: '7-Day Kenya Classic',  price: '$2,190/pp' },
                  { slug: 'mombasa-beach-safari' as const,   label: '8-Day to Mombasa',     price: '$2,480/pp' },
                  { slug: 'taita-salt-lick' as const,        label: '5-Day Taita & Coast',  price: '$1,680/pp' },
                  { slug: 'ol-pejeta-laikipia' as const,     label: '4-Day Ol Pejeta',      price: '$3,200/pp' },
                ].map((pkg) => (
                  <button key={pkg.slug} onClick={() => bookNow(pkg.slug)}
                    className="flex items-center justify-between px-3 py-2 border border-white/10 rounded-sm hover:border-gold/40 hover:bg-gold/5 transition-all group text-xs">
                    <span className="text-ivory/70 group-hover:text-ivory transition-colors">{pkg.label}</span>
                    <span className="text-[0.65rem] text-gold/60 group-hover:text-gold transition-colors">{pkg.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action row */}
            <div className="space-y-3">
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-ivory/30">Ready to book?</p>

              {/* Primary: Book directly - pre-fills form */}
              <button onClick={() => bookNow()}
                className="btn-shine w-full text-center text-[0.78rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal py-4 rounded-sm hover:bg-gold-light transition-colors">
                Book This Safari — Your Details Are Pre-Filled →
              </button>

              {/* Secondary: WhatsApp */}
              <a href={`https://wa.me/254141481665?text=Hi! I'm ${encodeURIComponent(name)}, I just completed the Zazu Safaris planner. Budget: $${answers.budget}/pp, Group: ${answers.group}, Duration: ${answers.duration}. Can you help me book?`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 text-[0.75rem] tracking-[0.12em] uppercase border border-green-400/40 text-green-400 py-3 rounded-sm hover:bg-green-400/8 transition-colors">
                💬 Ask on WhatsApp Instead
              </a>

              {/* Reset */}
              <button
                onClick={() => {
                  setResult(null)
                  setStep(0)
                  setAnswers({ style: null, group: '', budget: 2500, animals: [], duration: null })
                  setName('')
                  setEmail('')
                }}
                className="w-full text-center text-[0.7rem] tracking-wide uppercase text-ivory/25 hover:text-ivory/45 transition-colors py-2">
                ← Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}