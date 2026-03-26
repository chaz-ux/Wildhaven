'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { cn, DESTINATION_IMAGES } from '@/lib/utils'
import type { ItineraryDay } from '@/lib/types'

interface ItineraryTimelineProps {
  days: ItineraryDay[]
}

export default function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  const [activeDay, setActiveDay] = useState(1)
  const dayRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = dayRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveDay(days[i]?.day_number || i + 1) },
        { threshold: 0.6 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [days])

  return (
    <div className="relative">
      {/* Sticky background image that morphs per day */}
      <div className="hidden lg:block sticky top-0 h-screen w-full overflow-hidden -z-10" style={{ marginTop: '-100vh' }}>
        {days.map(day => {
          const img = day.hero_image_url || DESTINATION_IMAGES[day.destination?.slug || ''] || DESTINATION_IMAGES['maasai-mara']
          return (
            <div
              key={day.day_number}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                activeDay === day.day_number ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Image src={img} alt={day.title} fill className="object-cover" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
            </div>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {days.map((day, i) => (
          <div
            key={day.id}
            ref={el => { dayRefs.current[i] = el }}
            className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[50vh]"
          >
            {/* Left: content */}
            <div className="flex items-center py-16 px-6 lg:px-12">
              <div className="max-w-lg">
                {/* Day number + line */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    'w-10 h-10 rounded-full border flex items-center justify-center text-sm transition-all duration-500',
                    activeDay === day.day_number
                      ? 'border-gold text-gold bg-gold/10'
                      : 'border-white/15 text-ivory/30'
                  )}>
                    {String(day.day_number).padStart(2, '0')}
                  </div>
                  {i < days.length - 1 && (
                    <div className={cn(
                      'flex-1 h-px transition-all duration-700',
                      activeDay > day.day_number ? 'bg-gold/40' : 'bg-white/8'
                    )} />
                  )}
                </div>

                {/* Location */}
                {day.destination && (
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-sage-light mb-2">
                    {day.destination.name}
                  </p>
                )}

                {/* Title */}
                <h3
                  className={cn(
                    'text-3xl mb-4 transition-colors duration-500',
                    activeDay === day.day_number ? 'text-ivory' : 'text-ivory/50'
                  )}
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
                >
                  {day.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-ivory/50 leading-relaxed font-light mb-6">
                  {day.description}
                </p>

                {/* Activities */}
                {day.activities && day.activities.length > 0 && (
                  <div className="space-y-1.5">
                    {day.activities.map(a => (
                      <div key={a} className="flex items-center gap-2 text-xs text-ivory/35">
                        <span className="w-3 h-px bg-gold/35 flex-shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                )}

                {/* Accommodation */}
                {day.accommodation && day.accommodation !== 'Departure' && (
                  <div className="mt-6 flex items-center gap-2 text-[0.72rem] text-ivory/30 border-t border-white/6 pt-4">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" d="M2 12V6a6 6 0 0112 0v6M1 12h14M5 12v-2a3 3 0 016 0v2"/>
                    </svg>
                    {day.accommodation}
                  </div>
                )}

                {/* Meals */}
                {day.meals_included && day.meals_included.length > 0 && (
                  <div className="mt-2 flex items-center gap-3 text-[0.65rem] text-ivory/25">
                    {day.meals_included.map(m => (
                      <span key={m} className="border border-white/10 px-2 py-0.5 rounded-sm">{m}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: image (mobile only — desktop uses sticky bg) */}
            <div className="lg:hidden relative h-64 overflow-hidden">
              <Image
                src={day.hero_image_url || DESTINATION_IMAGES[day.destination?.slug || ''] || DESTINATION_IMAGES['maasai-mara']}
                alt={day.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
