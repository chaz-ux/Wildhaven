'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn, TIER_POSTERS } from '@/lib/utils'
import type { Tier } from '@/lib/types'

const TIER_VIDEOS: Record<string, string> = {
  sovereign: '/videos/hero-sovereign.mp4',
  horizon:   '/videos/hero-horizon.mp4',
  tribe:     '/videos/hero-tribe.mp4',
}

// Poster snapshots (extracted frames) from the hero videos.
// Place JPGs in `/public/posters/` using ffmpeg. Example:
// ffmpeg -i public/videos/hero-horizon.mp4 -ss 00:00:02 -frames:v 1 -q:v 3 public/posters/horizon.jpg
// (poster mapping is provided by `lib/utils.ts` as `TIER_POSTERS`)

const TIER_GRADIENTS: Record<string, string> = {
  sovereign: 'radial-gradient(ellipse at 70% 40%, #3d2a0a 0%, #1A1A18 60%)',
  horizon:   'radial-gradient(ellipse at 60% 50%, #0d2010 0%, #1A1A18 60%)',
  tribe:     'radial-gradient(ellipse at 50% 40%, #1a1208 0%, #1A1A18 60%)',
}

interface HeroSectionProps {
  tiers: Tier[]
}

export default function HeroSection({ tiers }: HeroSectionProps) {
  const [activeTier, setActiveTier] = useState<string>('horizon')
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!headlineRef.current) return
      const y = window.scrollY * 0.35
      headlineRef.current.style.transform = `translateY(${y}px)`
      headlineRef.current.style.opacity   = `${1 - window.scrollY / (window.innerHeight * 0.7)}`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Swap video on tier change
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Clear any pending timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setVideoReady(false)
    video.src = TIER_VIDEOS[activeTier]
    video.load()
    video.play().catch(() => {})

    // Safety net: if video hasn't loaded in 4s, show it anyway
    // (avoids leaving the user on the image forever if video is very slow)
    timeoutRef.current = setTimeout(() => setVideoReady(true), 4000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [activeTier])

  // Auto-cycle tiers every 20s
  useEffect(() => {
    const keys = ['sovereign', 'horizon', 'tribe']
    const timer = setInterval(() => {
      setActiveTier(cur => {
        const next = (keys.indexOf(cur) + 1) % keys.length
        return keys[next]
      })
    }, 20000)
    return () => clearInterval(timer)
  }, [])

  const handleVideoReady = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVideoReady(true)
  }

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden flex flex-col items-center justify-center">

      {/* Layer 1: Gradient — always visible as base */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: TIER_GRADIENTS[activeTier] }}
      />

      {/* Layer 2: Poster snapshot — permanent background (from video frames) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={TIER_POSTERS[activeTier]}
        alt=""
        aria-hidden="true"
        className={cn('absolute inset-0 w-full h-full object-cover object-center z-[1]')}
      />

      {/* Layer 3: Video — fades in on top only when ready */}
      <video
        ref={videoRef}
        className={cn(
          'absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1500 z-[5]',
          videoReady ? 'opacity-100' : 'opacity-0'
        )}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        onCanPlayThrough={handleVideoReady}
        onCanPlay={handleVideoReady}
      />

      {/* Cinematic overlays */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700 z-10',
          videoReady
            ? 'bg-gradient-to-t from-charcoal via-charcoal/25 to-charcoal/60 opacity-90'
            : 'bg-gradient-to-t from-charcoal via-charcoal/20 to-charcoal/50 opacity-70'
        )}
      />

      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700 z-10',
          videoReady ? 'bg-gradient-to-r from-charcoal/40 to-transparent' : 'bg-gradient-to-r from-charcoal/30 to-transparent'
        )}
      />

      <div className={cn('noise-overlay z-10', videoReady ? 'opacity-90' : 'opacity-60')} />

      {/* ── Main content ────────────────────────────────── */}
      <div ref={headlineRef} className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <p
          className="text-[0.65rem] tracking-[0.35em] uppercase text-gold mb-6 opacity-0"
          style={{ animation: 'fade-up 1s cubic-bezier(0.25,0.1,0.25,1) 0.4s forwards' }}
        >
          East Africa&apos;s Premier Safari Concierge
        </p>

        <h1
          className="text-display-xl text-ivory mb-6 opacity-0"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            animation: 'fade-up 1.2s cubic-bezier(0.25,0.1,0.25,1) 0.6s forwards',
          }}
        >
          Don&apos;t Just See<br />
          the Wild.{' '}
          <em className="text-gradient-gold not-italic">Feel&nbsp;It.</em>
        </h1>

        <p
          className="text-base md:text-lg text-ivory/55 font-light tracking-wide mb-12 opacity-0 max-w-xl mx-auto"
          style={{ animation: 'fade-up 1s cubic-bezier(0.25,0.1,0.25,1) 0.9s forwards' }}
        >
          Bespoke safaris across Kenya & Tanzania — crafted for how you travel.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0"
          style={{ animation: 'fade-up 1s cubic-bezier(0.25,0.1,0.25,1) 1.1s forwards' }}
        >
          <Link
            href="/safaris"
            className="btn-shine w-full sm:w-auto text-center text-[0.75rem] tracking-[0.14em] uppercase font-medium bg-gold text-charcoal px-8 py-4 rounded-sm hover:bg-gold-light transition-colors duration-300"
          >
            Explore Safaris
          </Link>
          <Link
            href="/planner"
            className="w-full sm:w-auto text-center text-[0.75rem] tracking-[0.14em] uppercase font-light border border-ivory/25 text-ivory px-8 py-4 rounded-sm hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Custom Safari ✦
          </Link>
        </div>

        <div
          className="flex items-center justify-center gap-3 mt-10 opacity-0"
          style={{ animation: 'fade-up 1s cubic-bezier(0.25,0.1,0.25,1) 1.4s forwards' }}
        >
          {(tiers.length > 0 ? tiers : [
            { slug: 'sovereign', name: 'The Sovereign' },
            { slug: 'horizon',   name: 'The Horizon' },
            { slug: 'tribe',     name: 'The Tribe' },
          ]).map((tier) => (
            <button
              key={tier.slug}
              onClick={() => setActiveTier(tier.slug)}
              className={cn(
                'text-[0.65rem] tracking-[0.15em] uppercase px-4 py-1.5 rounded-full border transition-all duration-400',
                activeTier === tier.slug
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-white/15 text-ivory/35 hover:border-white/30 hover:text-ivory/60'
              )}
            >
              {tier.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0"
        style={{ animation: 'fade-up 1s ease 2s forwards' }}
      >
        <span className="text-[0.6rem] tracking-[0.25em] uppercase text-ivory/30">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent animate-pulse-soft" />
      </div>
    </section>
  )
}