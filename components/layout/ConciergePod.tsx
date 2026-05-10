'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// All package knowledge baked in — no PII ever sent to AI
const SYSTEM_PROMPT = `You are Zazu, a friendly safari concierge assistant for Zazu Safaris Kenya. You help visitors understand our safari packages and navigate the site. Be warm, concise, and helpful. Never ask for personal details.

Our 10 packages:
1. 4-Day Maasai Mara Luxury Safari – Ashnil Mara Lodge | $2,744/pp | Big Five, private game drives, full board
2. 7-Day Exclusive Private Family Safari at Sopa Lodges | $2,672/pp | Amboseli, Tsavo, Mara | All meals included
3. 5-Day Private Family Safari: Mara, Nakuru & Hell's Gate | $1,568/pp | Rhinos, flamingos, cycling, Big Five
4. 3-Day Maasai Mara Mid-Range Safari Adventure Camp | $950/pp | Tented camp, Big Five, great value
5. 4-Day Maasai Mara & Lake Nakuru Private Tour with Jeep | $1,420/pp | Private 4x4, rhinos & flamingos + Mara
6. 3-Day Amboseli Private Safari with Mt Kilimanjaro View | $890/pp | Elephants beneath Kilimanjaro
7. 4-Day Maasai Mara & Lake Nakuru Group Joining Safari | $780/pp | Shared vehicle, meet other travellers
8. 3-Day Maasai Mara Private Family Safari Adventure | $1,100/pp | Child-friendly guides, private vehicle
9. 12-Day Honeymoon: Wilderness & Beach Safaris in Kenya | $4,200/pp | Safari parks + Diani Beach coast
10. 10-Day Tour: 7 Best Parks in Kenya Memorable Safari | $3,800/pp | Grand Kenya circuit, maximum wildlife

All packages include: park fees, meals (as specified), professional driver-guide, 4x4 vehicle, airport transfers.
Not included: international flights, travel insurance, visa fees, personal expenses, tips.

Prices are per person. Groups pay per person × number of travellers.

If someone wants a custom safari not on this list, direct them to /planner.
If someone is ready to book a specific package, give them the direct link: /contact?package=SLUG
Package slugs: mara-luxury-ashnil, family-safari-sopa-7day, family-mara-nakuru-5day, mara-midrange-3day, mara-nakuru-jeep-4day, amboseli-kili-3day, mara-nakuru-group-4day, mara-family-3day, honeymoon-12day, kenya-10day-7parks

For urgent questions, suggest WhatsApp: wa.me/254141481665

Keep responses under 120 words. Use plain text only — no markdown headers, no asterisks. Short paragraphs are fine.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_QUESTIONS = [
  "What's the cheapest option?",
  "Best safari for families?",
  "What's included in the price?",
  "Do you have honeymoon packages?",
]

export default function ConciergePod() {
  const [open,     setOpen]     = useState(false)
  const [view,     setView]     = useState<'chat' | 'links'>('chat')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Zazu 🦁 Ask me anything about our safaris — prices, what's included, best options for your group. I'm here to help." }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const userText = (text || input).trim()
    if (!userText || loading) return
    setInput('')
    setLoading(true)

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content || "I'm having trouble connecting right now. Try WhatsApp for instant help!"
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I can't connect right now. WhatsApp us at +254 141 481 665 for instant help!"
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="concierge-pod" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 4000 }}>

      {/* ── Chat / Links Panel ─────────────────────────────── */}
      <div className={cn(
        'concierge-panel absolute bottom-16 right-0 w-80 rounded-lg overflow-hidden mb-2 shadow-2xl',
        'bg-charcoal border border-white/10',
        !open && 'opacity-0 scale-90 pointer-events-none translate-y-2'
      )}
        style={{ transition: 'opacity 0.3s, transform 0.3s, translate 0.3s', transformOrigin: 'bottom right' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #2A1A0A, #1C1008)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-sm">🦁</div>
            <div>
              <p className="text-sm text-ivory font-medium leading-none">Zazu</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
                <p className="text-[0.58rem] text-ivory/35">Safari Concierge · Online</p>
              </div>
            </div>
          </div>
          {/* Tab switcher */}
          <div className="flex gap-1">
            <button onClick={() => setView('chat')}
              className={cn('text-[0.58rem] uppercase tracking-wide px-2 py-1 rounded-sm transition-colors',
                view === 'chat' ? 'bg-gold/20 text-gold' : 'text-ivory/30 hover:text-ivory/60')}>
              Chat
            </button>
            <button onClick={() => setView('links')}
              className={cn('text-[0.58rem] uppercase tracking-wide px-2 py-1 rounded-sm transition-colors',
                view === 'links' ? 'bg-gold/20 text-gold' : 'text-ivory/30 hover:text-ivory/60')}>
              Contact
            </button>
          </div>
        </div>

        {/* ── Chat view ─────────────────────────────────────── */}
        {view === 'chat' && (
          <>
            {/* Messages */}
            <div className="h-72 overflow-y-auto p-3 space-y-3 flex flex-col"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#3D2810 transparent' }}>
              {messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed',
                    m.role === 'user'
                      ? 'bg-gold text-charcoal rounded-br-sm'
                      : 'bg-white/6 text-ivory/80 rounded-bl-sm border border-white/8'
                  )}>
                    {/* Render booking links if message contains /contact?package= */}
                    {m.role === 'assistant' && m.content.includes('/contact?package=') ? (
                      <span dangerouslySetInnerHTML={{
                        __html: m.content.replace(
                          /\/contact\?package=([a-z0-9-]+)/g,
                          '<a href="/contact?package=$1" style="color:#D4820A;text-decoration:underline">Book this →</a>'
                        )
                      }} />
                    ) : m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/6 border border-white/8 px-3 py-2 rounded-lg rounded-bl-sm flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-ivory/30"
                        style={{ animation: `pulse-soft 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick questions (only at start) */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-[0.6rem] text-ivory/50 border border-white/12 px-2 py-1 rounded-full hover:border-gold/40 hover:text-gold/80 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-1 border-t border-white/8 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about our safaris…"
                className="flex-1 min-w-0 bg-white/5 border border-white/15 text-ivory placeholder:text-ivory/25 rounded-sm px-3 py-2 text-xs outline-none focus:border-gold/40 transition-colors"
              />
              <button onClick={() => send()}
                disabled={!input.trim() || loading}
                className={cn(
                  'w-8 h-8 flex-shrink-0 rounded-sm flex items-center justify-center transition-colors',
                  input.trim() && !loading ? 'bg-gold text-charcoal hover:bg-gold-light' : 'bg-white/8 text-ivory/25 cursor-not-allowed'
                )}>
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* ── Contact links view ────────────────────────────── */}
        {view === 'links' && (
          <div className="p-3 space-y-2">
            <a href="https://wa.me/254141481665?text=Hi Zazu Safaris! I'd like to enquire about a safari."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-sm border border-green-400/25 hover:bg-green-400/8 transition-colors group">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <p className="text-sm text-ivory font-medium">WhatsApp</p>
                <p className="text-xs text-ivory/35">+254 141 481 665 · Fastest reply</p>
              </div>
            </a>

            <a href="mailto:hello@zazusafaris.com"
              className="flex items-center gap-3 p-3 rounded-sm border border-white/10 hover:bg-white/4 transition-colors group">
              <span className="w-5 h-5 text-gold flex-shrink-0 text-lg leading-none">@</span>
              <div>
                <p className="text-sm text-ivory font-medium">Email</p>
                <p className="text-xs text-ivory/35">hello@zazusafaris.com · Within 2hrs</p>
              </div>
            </a>

            <a href="tel:+254141481665"
              className="flex items-center gap-3 p-3 rounded-sm border border-white/10 hover:bg-white/4 transition-colors group">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-ivory/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <div>
                <p className="text-sm text-ivory font-medium">Call Us</p>
                <p className="text-xs text-ivory/35">+254 141 481 665 · 7am–8pm EAT</p>
              </div>
            </a>

            <Link href="/planner" onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-sm border border-gold/20 hover:bg-gold/6 transition-colors">
              <span className="text-gold text-lg leading-none flex-shrink-0">✦</span>
              <div>
                <p className="text-sm text-ivory font-medium">Custom Safari Request</p>
                <p className="text-xs text-ivory/35">Build a safari around you</p>
              </div>
            </Link>

            <p className="text-[0.6rem] text-ivory/20 text-center pt-1">Mon–Sun · 7am–8pm East Africa Time</p>
          </div>
        )}
      </div>

      {/* ── Trigger button ─────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
          open ? 'bg-charcoal-mid border border-white/15' : 'bg-gold hover:bg-gold-light btn-shine'
        )}
        aria-label="Open concierge chat"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-ivory" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20 pointer-events-none" />
        )}
      </button>
    </div>
  )
}