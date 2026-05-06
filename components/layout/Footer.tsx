import Link from 'next/link'

const safariLinks = [
  { href: '/safaris?tier=sovereign', label: 'The Sovereign' },
  { href: '/safaris?tier=horizon',   label: 'The Horizon' },
  { href: '/safaris?tier=tribe',     label: 'The Tribe' },
  { href: '/safaris',                label: 'All Safaris' },
]

const companyLinks = [
  { href: '/about',   label: 'Our Story' },
  { href: '/planner', label: 'Trip Planner' },
  { href: '/contact', label: 'Contact Us' },
]

const legalLinks = [
  { href: '/privacy',        label: 'Privacy Policy' },
  { href: '/terms',          label: 'Terms & Conditions' },
  { href: '/sustainability',  label: 'Sustainability' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/5">
      {/* Main footer grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/">
            <span
              className="text-2xl tracking-[0.12em] text-ivory"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
            >
              Wild<span className="text-gold">haven</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-ivory/40 leading-relaxed font-light max-w-[220px]">
            East Africa's premier safari concierge. Crafting journeys since 2013.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
            <span className="text-xs text-ivory/30 tracking-widest uppercase">Live wildlife sightings</span>
          </div>
        </div>

        {/* Safaris */}
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-gold mb-5">Experiences</p>
          <ul className="flex flex-col gap-3">
            {safariLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ivory/45 hover:text-ivory transition-colors duration-300 font-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-gold mb-5">Company</p>
          <ul className="flex flex-col gap-3">
            {companyLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ivory/45 hover:text-ivory transition-colors duration-300 font-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-gold mb-5">Reach Us</p>
          <ul className="flex flex-col gap-3 text-sm text-ivory/45 font-light">
            <li className="hover:text-ivory transition-colors duration-300">
              <a href="mailto:hello@zazusafaris.co.ke">hello@zazusafaris.co.ke</a>
            </li>
            <li className="hover:text-ivory transition-colors duration-300">
              <a href="tel:+254700000000">+254 700 000 000</a>
            </li>
            <li className="text-ivory/30">Nairobi, Kenya</li>
            <li className="text-ivory/30">Mon–Sun · 7am–8pm EAT</li>
          </ul>
          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            {['KWS Partner', 'SATSA Member', 'SafariBookings'].map(badge => (
              <span key={badge} className="text-[0.6rem] tracking-widest uppercase text-ivory/20 border border-white/8 px-2 py-1 rounded-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 max-w-[1400px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[0.7rem] text-ivory/20 font-light">
          © {new Date().getFullYear()} Zazu Safaris East Africa Ltd. All rights reserved.
        </p>
        <div className="flex gap-5">
          {legalLinks.map(l => (
            <Link key={l.href} href={l.href} className="text-[0.7rem] text-ivory/20 hover:text-ivory/50 transition-colors duration-300">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
