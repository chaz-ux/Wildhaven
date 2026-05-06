'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const WA_NUMBER  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER  || '254700000000'
const WA_MESSAGE = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "Hello! I'd like to enquire about a safari booking."

const channels = [
  {
    id: 'whatsapp',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    label: 'WhatsApp',
    sublabel: 'Fastest response',
    href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`,
    color: 'text-green-400 hover:bg-green-400/10',
    external: true,
  },
  {
    id: 'email',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'Email Us',
    sublabel: 'Within 2 hours',
    href: 'mailto:hello@zazusafaris.com',
    color: 'text-gold hover:bg-gold/10',
    external: false,
  },
  {
    id: 'call',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: 'Call Us',
    sublabel: 'Mon–Sun 7am–8pm',
    href: 'tel:+254700000000',
    color: 'text-sage-light hover:bg-sage/10',
    external: false,
  },
  {
    id: 'planner',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    label: 'AI Trip Planner',
    sublabel: 'Get a custom itinerary',
    href: '/planner',
    color: 'text-ivory/70 hover:bg-white/5',
    external: false,
  },
]

export default function ConciergePod() {
  const [open, setOpen] = useState(false)

  return (
    <div className="concierge-pod">
      {/* Expanded panel */}
      <div className={cn(
        'concierge-panel absolute bottom-20 right-0 w-72 glass-gold rounded-lg overflow-hidden mb-2',
        !open && 'closed'
      )}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
            <p className="text-[0.65rem] tracking-[0.18em] uppercase text-ivory/40">Concierge Online</p>
          </div>
          <p className="font-serif text-lg text-ivory" style={{ fontFamily: 'var(--font-cormorant)' }}>
            How can we help?
          </p>
        </div>

        {/* Channels */}
        <div className="p-2">
          {channels.map(ch => {
            const Tag = ch.external ? 'a' : 'a'
            return (
              <Tag
                key={ch.id}
                href={ch.href}
                target={ch.external ? '_blank' : undefined}
                rel={ch.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex items-center gap-4 px-3 py-3 rounded-md transition-colors duration-200 group cursor-pointer',
                  ch.color
                )}
                onClick={ch.id === 'planner' ? () => setOpen(false) : undefined}
              >
                <span className="flex-shrink-0 opacity-80">{ch.icon}</span>
                <div>
                  <p className="text-sm font-medium text-ivory">{ch.label}</p>
                  <p className="text-xs text-ivory/35">{ch.sublabel}</p>
                </div>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 ml-auto text-ivory/20 group-hover:text-ivory/50 transition-colors" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Tag>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-white/8">
          <p className="text-[0.68rem] text-ivory/25 leading-relaxed">
            Average response: <span className="text-gold/70">under 90 minutes</span> · All enquiries confidential
          </p>
        </div>
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'btn-shine relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-400',
          open
            ? 'bg-charcoal-mid border border-white/15 rotate-45'
            : 'bg-gold hover:bg-gold-light'
        )}
        aria-label="Open concierge"
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
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-25" />
        )}
      </button>
    </div>
  )
}
