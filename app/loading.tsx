export default function Loading() {
  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span
          className="text-2xl tracking-[0.3em] text-gold/30 animate-pulse"
          style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
        >
          ZAZU SAFARIS
        </span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-gold/40"
              style={{ animation: `pulse-soft 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
