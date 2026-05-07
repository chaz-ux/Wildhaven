'use client'

import { useState } from 'react'
import Link from 'next/link'
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
      { value: 'luxury',    icon: '♔', label: 'The Sovereign', sub: 'Private, exclusive, bespoke' },
      { value: 'midrange',  icon: '◎', label: 'The Horizon',   sub: 'Comfort meets adventure' },
      { value: 'budget',    icon: '◉', label: 'The Tribe',      sub: 'Social, raw, affordable' },
      { value: 'undecided', icon: '?', label: 'Surprise me',    sub: 'AI picks the perfect tier' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget per person?",
    hint: 'Every dollar goes directly into your experience.',
    type: 'slider',
    min: 500, max: 15000, step: 250, default: 3500,
  },
  {
    id: 'animals',
    question: 'Which experiences top your list?',
    hint: "Select everything that excites you.",
    type: 'multi',
    options: [
      { value: 'big5',      icon: '🦁', label: 'Big Five', sub: undefined },
      { value: 'migration', icon: '🦬', label: 'Great Migration', sub: undefined },
      { value: 'cheetah',   icon: '🐆', label: 'Cheetah & Cats', sub: undefined },
      { value: 'elephant',  icon: '🐘', label: 'Elephant Herds', sub: undefined },
      { value: 'birdlife',  icon: '🦜', label: 'Bird Life', sub: undefined },
      { value: 'culture',   icon: '🏹', label: 'Maasai Culture', sub: undefined },
    ],
  },
  {
    id: 'duration',
    question: 'How long is your adventure?',
    hint: 'The longer you stay, the deeper you go.',
    type: 'single',
    options: [
      { value: '3-4',  icon: '📅', label: '3–4 Days',  sub: 'Quick escape' },
      { value: '5-7',  icon: '🗓',  label: '5–7 Days',  sub: 'The sweet spot' },
      { value: '8-12', icon: '🌍', label: '8–12 Days', sub: 'Multi-park circuit' },
      { value: '13+',  icon: '✈️', label: '13+ Days',  sub: 'Full immersion' },
    ],
  },
  {
    id: 'email',
    question: 'One last thing.',
    hint: 'Enter your details to unlock your personalised Dream Board.',
    type: 'form',
  },
]

export default function PlannerClient() {
  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({ style: null, budget: 3500, animals: [], duration: null })
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState<string | null>(null)

  const currentStep = STEPS[step]
  const progress = (step / (STEPS.length - 1)) * 100

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const selectSingle = (key: keyof QuizAnswers, val: string) =>
    setAnswers(a => ({ ...a, [key]: val }))

  const toggleMulti = (val: string) =>
    setAnswers(a => {
      const arr = (a.animals || [])
      return { ...a, animals: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })

  const generate = async () => {
    if (!email) return
    setLoading(true)
    const prompt = `You are a friendly, knowledgeable safari planning assistant for Zazu Safaris Kenya. 
A visitor has shared their preferences:
- Travel style: ${answers.style || 'not specified'}
- Budget: $${answers.budget} per person
- Interests: ${answers.animals.join(', ') || 'general wildlife'}
- Duration: ${answers.duration || '5-7 days'}
- Name: ${name || 'there'}

You have access to these exact packages Zazu Safaris offers:

1. 4-Day Maasai Mara Luxury Safari — Ashnil Mara Lodge — $2,744/pp
   Includes: Full board, daily private game drives, Big Five, park fees, airport transfers
   
2. 7-Day Family Safari at Sopa Lodges — $2,672/pp  
   Route: Nairobi → Amboseli → Tsavo → Maasai Mara
   Includes: Sopa Lodges throughout, all meals, private 4x4, park fees
   
3. 5-Day Mara, Nakuru & Hell's Gate — $1,568/pp
   Route: Nairobi → Nakuru → Hell's Gate → Maasai Mara
   Includes: All accommodation, meals, private vehicle, park fees

4. 5-Day Rift Valley Tour — $1,420/pp
   Lake Nakuru, Lake Naivasha, Hell's Gate Gorge, scenic Rift Valley

5. 7-Day Kenya Classic Safari — $2,190/pp
   Amboseli, Tsavo, Maasai Mara circuit

6. 8-Day Kenya Odyssey to Mombasa — $2,480/pp
   Safari parks + Diani Beach finale

7. 5-Day Taita Hills & Salt Lick — $1,680/pp
   Amboseli, Taita Hills Lodge (on stilts), Mombasa coast

8. 4-Day Ol Pejeta Conservancy — $3,200/pp
   Last northern white rhinos, wild dog tracking, Big Five

Respond warmly and helpfully. Recommend 1-2 specific packages by name with reasons tied to their preferences. Explain what they'll see, what meals/transfers are included, and why the pace matches their travel style. If their budget is below $1,568, suggest ways to make it work or mention the 5-day options. Use plain HTML only: <h3>, <p>, <strong>, <ul>, <li>. Max 300 words. Sound like a knowledgeable human travel advisor, not a brochure.`

    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, answers, name, email }),
      })
      const data = await res.json()
      setResult(data.content || 'Unable to generate. Our team will email you shortly.')
    } catch {
      setResult(`<h3>Your Safari Blueprint, ${name || 'Explorer'}</h3><p>Based on your <strong>$${Number(answers.budget).toLocaleString()}</strong> budget and interest in <strong>${answers.animals.join(', ') || 'East African wildlife'}</strong>, our concierge will send a personalised proposal to <strong>${email}</strong> within 2 hours.</p><p><em>"The wild is patient. It will wait. But the best camps won't."</em></p>`)
    } finally {
      try { await savePlannerSession({ name, email, quiz_answers: answers }) } catch {}
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-white/5 border border-white/20 text-ivory placeholder:text-ivory/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-gold/50 focus:bg-white/8 transition-colors"

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
                <div key={i} className={cn('h-0.5 flex-1 rounded-full transition-all duration-500',
                  i < step ? 'bg-gold' : i === step ? 'bg-gold/50' : 'bg-white/10')} />
              ))}
            </div>

            <p className="text-[0.62rem] tracking-[0.25em] uppercase text-gold/60 mb-6">Step {step + 1} of {STEPS.length}</p>

            <h2 className="text-4xl md:text-5xl text-ivory mb-2 leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>
              {currentStep.question}
            </h2>
            <p className="text-sm text-ivory/35 mb-10 font-light">{currentStep.hint}</p>

            {/* Single select */}
            {currentStep.type === 'single' && currentStep.options && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {currentStep.options.map(opt => (
                  <button key={opt.value}
                    onClick={() => selectSingle(currentStep.id as keyof QuizAnswers, opt.value)}
                    className={cn('text-left p-5 border rounded-sm transition-all duration-300',
                      answers[currentStep.id as keyof QuizAnswers] === opt.value
                        ? 'border-gold bg-gold/8' : 'border-white/10 hover:border-gold/40')}>
                    <span className="text-2xl block mb-3">{opt.icon}</span>
                    <p className="text-sm font-medium text-ivory mb-0.5">{opt.label}</p>
                    {opt.sub && <p className="text-xs text-ivory/35">{opt.sub}</p>}
                  </button>
                ))}
              </div>
            )}

            {/* Slider */}
            {currentStep.type === 'slider' && (
              <div className="mb-10">
                <p className="text-5xl text-gold mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  ${answers.budget.toLocaleString()}
                  <span className="text-base text-ivory/30 font-sans ml-2">per person</span>
                </p>
                <input type="range" min={500} max={15000} step={250} value={answers.budget}
                  onChange={e => setAnswers(a => ({ ...a, budget: +e.target.value }))}
                  className="w-full mt-4 appearance-none h-0.5 bg-white/15 rounded-full outline-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-charcoal" />
                <div className="flex justify-between text-[0.65rem] text-ivory/20 mt-2">
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
                      className={cn('p-4 border rounded-sm transition-all duration-300 text-center',
                        sel ? 'border-gold bg-gold/8' : 'border-white/10 hover:border-gold/30')}>
                      <span className="text-2xl block mb-2">{opt.icon}</span>
                      <p className="text-xs text-ivory/70">{opt.label}</p>
                      {sel && <span className="text-gold text-xs">✓</span>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Email form */}
            {currentStep.type === 'form' && (
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/30 block mb-2">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. Amara Osei" className={inputCls} />
                </div>
                <div>
                  <label className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/30 block mb-2">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" className={inputCls} />
                </div>
              </div>
            )}

            {/* Nav */}
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
                  className={cn('btn-shine text-[0.72rem] tracking-[0.12em] uppercase font-medium px-8 py-3 rounded-sm transition-all',
                    email && !loading ? 'bg-gold text-charcoal hover:bg-gold-light' : 'bg-white/10 text-ivory/30 cursor-not-allowed')}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-charcoal/40 border-t-charcoal animate-spin" />
                      Crafting your plan…
                    </span>
                  ) : '✦ Generate My Safari Plan'}
                </button>
              )}
            </div>
          </>
        ) : (
          /* Result */
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Your Dream Board</p>
            <div className="glass-gold p-8 rounded-sm mb-8 text-sm text-ivory/75 leading-relaxed font-light
              [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-ivory [&_h3]:mt-6 [&_h3]:mb-2 [&_h3:first-child]:mt-0
              [&_strong]:text-gold [&_strong]:font-medium
              [&_em]:text-ivory/50 [&_em]:font-serif [&_em]:text-base [&_em]:not-italic
              [&_ul]:mt-3 [&_ul]:space-y-2 [&_li]:flex [&_li]:gap-2 [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: result }} />
            
            {/* Action buttons */}
            <div className="space-y-3 mb-6">
              <p className="text-[0.65rem] tracking-[0.15em] uppercase text-ivory/40 mb-3">Next Steps</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Book */}
                <Link href={`/contact?from=planner&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`}
                  className="btn-shine text-center text-[0.75rem] tracking-[0.12em] uppercase font-medium bg-gold text-charcoal px-6 py-3 rounded-sm hover:bg-gold-light transition-colors">
                  💳 Book Now
                </Link>
                
                {/* Email Inquiry */}
                <a href={`mailto:hello@zazusafaris.com?subject=Safari Inquiry from ${encodeURIComponent(name)}&body=Hi Zazu Safaris,%0A%0AI'm interested in booking a safari based on my Dream Board.%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0APlease send me more details and pricing options.%0A%0AThank you!`}
                  className="text-center text-[0.75rem] tracking-[0.12em] uppercase font-medium border border-gold text-gold px-6 py-3 rounded-sm hover:bg-gold/10 transition-colors">
                  ✉️ Email Inquiry
                </a>
                
                {/* WhatsApp */}
                <a href={`https://wa.me/254141481665?text=Hi Zazu Safaris! I'm ${encodeURIComponent(name)} and I'm interested in booking a safari. My email is ${encodeURIComponent(email)}. Can you help me?`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-center text-[0.75rem] tracking-[0.12em] uppercase font-medium border border-green-400 text-green-400 px-6 py-3 rounded-sm hover:bg-green-400/10 transition-colors">
                  💬 WhatsApp
                </a>
              </div>
            </div>
            
            {/* Reset */}
            <button onClick={() => { setResult(null); setStep(0); setAnswers({ style: null, budget: 3500, animals: [], duration: null }); setName(''); setEmail('') }}
              className="w-full text-center text-[0.72rem] tracking-[0.12em] uppercase font-light border border-white/15 text-ivory/50 px-8 py-3 rounded-sm hover:border-white/30 hover:text-ivory/70 transition-colors">
              ← Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
