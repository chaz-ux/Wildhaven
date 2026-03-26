import { timeAgo } from '@/lib/utils'
import type { WildlifeSighting } from '@/lib/types'

// Fallback sightings when DB is empty
const FALLBACK_SIGHTINGS = [
  { id: '1', animal: 'Cheetah', description: 'Tano Bora coalition sprint in Mara North conservancy', spotted_at: new Date(Date.now() - 3600000).toISOString(), destination: { name: 'Maasai Mara' } },
  { id: '2', animal: 'Elephant', description: 'Herd of 40+ crossing the Amboseli floodplain', spotted_at: new Date(Date.now() - 1800000).toISOString(), destination: { name: 'Amboseli' } },
  { id: '3', animal: 'Lion', description: 'Pride of 8 feeding on wildebeest at Seronera Valley', spotted_at: new Date(Date.now() - 7200000).toISOString(), destination: { name: 'Serengeti' } },
  { id: '4', animal: 'Wildebeest', description: 'River crossing imminent — 3,000 massing at Mara River', spotted_at: new Date(Date.now() - 2700000).toISOString(), destination: { name: 'Maasai Mara' } },
  { id: '5', animal: 'Leopard', description: 'Fresh kill in acacia tree, Samburu riverine forest', spotted_at: new Date(Date.now() - 10800000).toISOString(), destination: { name: 'Samburu' } },
  { id: '6', animal: 'Rhino', description: 'Black rhino mother and calf on crater floor', spotted_at: new Date(Date.now() - 5400000).toISOString(), destination: { name: 'Ngorongoro' } },
  { id: '7', animal: 'Wild Dog', description: 'Pack of 14 actively hunting on the plateau', spotted_at: new Date(Date.now() - 1200000).toISOString(), destination: { name: 'Laikipia' } },
]

interface WildlifeTickerProps {
  sightings?: WildlifeSighting[]
}

export default function WildlifeTicker({ sightings }: WildlifeTickerProps) {
  const items = (sightings && sightings.length > 0 ? sightings : FALLBACK_SIGHTINGS) as Array<{
    id: string
    animal: string
    description: string
    spotted_at: string
    destination?: { name: string } | null
  }>

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="relative border-y border-white/6 bg-charcoal/80 backdrop-blur-sm overflow-hidden">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />

      <div className="ticker-wrap py-3">
        <div className="ticker-track">
          {doubled.map((s, i) => (
            <span key={`${s.id}-${i}`} className="ticker-item inline-flex items-center gap-3 px-10 text-[0.72rem] tracking-wide text-ivory/50 font-light whitespace-nowrap">
              {/* Live dot */}
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 live-dot" />
                <span className="text-green-400/70 text-[0.65rem] tracking-[0.15em] uppercase">Live</span>
              </span>

              {/* Animal */}
              <span className="text-gold/80 font-medium">{s.animal}</span>

              {/* Description */}
              <span>{s.description}</span>

              {/* Location & time */}
              <span className="text-ivory/30">
                {s.destination?.name} · {timeAgo(s.spotted_at)}
              </span>

              {/* Separator */}
              <span className="text-gold/20 mx-2">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
