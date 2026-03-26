import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Lost in the Wild</p>
      <h1
        className="text-7xl text-ivory/20 mb-4"
        style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
      >
        404
      </h1>
      <h2
        className="text-3xl text-ivory mb-5"
        style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
      >
        This trail doesn&apos;t exist.
      </h2>
      <p className="text-sm text-ivory/35 mb-10 max-w-sm font-light">
        Even the best guides sometimes take a wrong turn. Let&apos;s get you back on the right path.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="btn-shine text-[0.75rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal px-8 py-4 rounded-sm hover:bg-gold-light transition-colors"
        >
          Back to Home →
        </Link>
        <Link
          href="/safaris"
          className="text-[0.75rem] tracking-[0.14em] uppercase font-light border border-white/20 text-ivory/60 px-8 py-4 rounded-sm hover:border-gold hover:text-gold transition-colors"
        >
          Browse Safaris
        </Link>
      </div>
    </div>
  )
}
