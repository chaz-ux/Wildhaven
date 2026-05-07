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
              Zazu <span className="text-gold">Safaris</span>
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
              <a href="mailto:hello@zazusafaris.com">hello@zazusafaris.com</a>
            </li>
            <li className="hover:text-ivory transition-colors duration-300">
              <a href="tel:+254141481665">+254 141 481 665</a>
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

      {/* Developer credit */}
      <div className="border-t border-white/5 bg-white/2 px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-2">
          <span className="text-[0.65rem] text-ivory/25 font-light">Crafted by</span>
          <a href="https://github.com/chaz-ux" target="_blank" rel="noopener noreferrer" 
            className="text-[0.65rem] text-ivory/40 hover:text-gold transition-colors duration-300 flex items-center gap-1">
            <span>chaz-ux</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
