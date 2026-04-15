// components/home/WildlifeTicker.tsx

const FALLBACK_ITEMS = [
  { id: '1',  text: '★ 5.0 Top Rated Safari Operator' },
  { id: '2',  text: '100% Private Tours — no shared vehicles, ever' },
  { id: '3',  text: 'Kenya · Tanzania · Uganda · Rwanda' },
  { id: '4',  text: '4-Day Maasai Mara Luxury Safari — Ashnil Mara Lodge — from $2,744' },
  { id: '5',  text: '7-Day Family Circuit — Amboseli, Tsavo & Mara — from $2,672' },
  { id: '6',  text: '8-Day Kenya Odyssey ending at Diani Beach — from $2,480' },
  { id: '7',  text: 'Ol Pejeta — the last northern white rhinos on earth' },
  { id: '8',  text: 'Salt Lick Lodge — game-viewing from stilts above the waterhole' },
  { id: '9',  text: 'Hell\'s Gate cycling · Lake Naivasha boat safari · Nakuru flamingos' },
  { id: '10', text: 'Fly-in safaris available — Elewana collection properties' },
  { id: '11', text: 'Weekly departures from Nairobi · Custom dates on request' },
]

export default function WildlifeTicker() {
  const doubled = [...FALLBACK_ITEMS, ...FALLBACK_ITEMS]
  
  return (
    <div className="relative border-y border-white/6 bg-charcoal/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />
      <div className="ticker-wrap py-3">
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <span key={`${item.id}-${i}`} className="inline-flex items-center gap-3 px-10 text-[0.72rem] tracking-wide text-ivory/50 font-light whitespace-nowrap">
              <span className="text-gold/40 text-[0.5rem]">◆</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}