'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/safaris',  label: 'Safaris' },
  { href: '/planner',  label: 'Find My Wild' },
  { href: '/about',    label: 'Our Story' },
  { href: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [heroVisible,  setHeroVisible]  = useState(true)
  const pathname = usePathname()
  const isHome   = pathname === '/'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      setHeroVisible(window.scrollY < window.innerHeight * 0.7)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isTransparent = isHome && heroVisible && !menuOpen

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-700',
          isTransparent
            ? 'py-6'
            : 'py-3 glass border-b border-white/5'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 group">
            <span
              className="text-2xl tracking-[0.12em] text-ivory transition-colors duration-300"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
            >
              Zazu <span className="text-gold">Safaris</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(link => (
              link.href === '/contact' ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="btn-shine relative text-[0.72rem] tracking-[0.14em] uppercase text-charcoal font-medium bg-gold hover:bg-gold-light px-5 py-2.5 rounded-sm transition-colors duration-300"
                >
                  Book Now
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-[0.72rem] tracking-[0.12em] uppercase transition-colors duration-300 relative group',
                    pathname === link.href ? 'text-gold' : 'text-ivory/60 hover:text-ivory'
                  )}
                >
                  {link.label}
                  <span className={cn(
                    'absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300',
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )} />
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center gap-[5px]"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={cn(
              'h-px bg-ivory transition-all duration-400',
              menuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'
            )} />
            <span className={cn(
              'h-px bg-ivory transition-all duration-400',
              menuOpen ? 'opacity-0 w-0' : 'w-4'
            )} />
            <span className={cn(
              'h-px bg-ivory transition-all duration-400',
              menuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-6'
            )} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn(
        'fixed inset-0 z-[90] glass flex flex-col justify-center items-center gap-8 transition-all duration-500',
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-serif text-3xl text-ivory/80 hover:text-gold transition-colors duration-300"
            style={{ transitionDelay: `${i * 60}ms`, fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}
