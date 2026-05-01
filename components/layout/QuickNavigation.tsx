'use client'

/**
 * QuickNavigation - A floating/sticky breadcrumb-style navigation
 * that helps users understand:
 * 1. Where they are
 * 2. What tier they're viewing (if applicable)
 * 3. Quick links to switch tiers
 * 
 * This makes navigation crystal clear across pages.
 */

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TIER_INFO = {
  sovereign: { name: 'The Sovereign', color: 'from-gold/10 to-transparent border-gold/20', badge: 'bg-gold/10 text-gold border-gold/30' },
  horizon: { name: 'The Horizon', color: 'from-sage/10 to-transparent border-sage/20', badge: 'bg-sage/10 text-sage-light border-sage/30' },
  tribe: { name: 'The Tribe', color: 'from-sand/10 to-transparent border-sand/20', badge: 'bg-sand/10 text-sand border-sand/30' },
}

interface QuickNavigationProps {
  pageName: string
  tierSlug?: string
}

export default function QuickNavigation({ pageName, tierSlug }: QuickNavigationProps) {
  const searchParams = useSearchParams()
  const currentTier = tierSlug || searchParams.get('tier')

  if (!currentTier || currentTier === 'all') {
    return null // Only show when viewing a specific tier
  }

  const tierInfo = TIER_INFO[currentTier as keyof typeof TIER_INFO]
  if (!tierInfo) return null

  return (
    <div className={cn(
      'sticky top-0 z-40 bg-gradient-to-r px-6 py-3 border-b border-white/10 backdrop-blur-sm',
      tierInfo.color
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-ivory/60">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-ivory/30">/</span>
          <span className="text-ivory">{pageName}</span>
          {currentTier !== 'all' && (
            <>
              <span className="text-ivory/30">/</span>
              <span className={cn('px-3 py-1 rounded-full border text-[0.7rem] tracking-wide uppercase', tierInfo.badge)}>
                {tierInfo.name}
              </span>
            </>
          )}
        </div>

        {/* Right: Quick tier switcher */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[0.65rem] text-ivory/40 uppercase tracking-wide mr-1">Switch tier:</span>
          {Object.entries(TIER_INFO).map(([slug, info]) => (
            <Link
              key={slug}
              href={`?tier=${slug}`}
              className={cn(
                'text-[0.65rem] tracking-wide uppercase px-2 py-1 rounded border transition-all duration-200',
                currentTier === slug
                  ? `${info.badge}`
                  : 'border-white/15 text-ivory/40 hover:text-ivory/60 hover:border-white/25'
              )}
            >
              {info.name.split(' ')[1]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
