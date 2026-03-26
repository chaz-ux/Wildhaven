import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}hr${hrs > 1 ? 's' : ''} ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// Pexels / Unsplash image URLs by destination slug
// Replace these with actual downloaded images in /public/images/
export const DESTINATION_IMAGES: Record<string, string> = {
  'maasai-mara':  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80',
  'amboseli':     'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80',
  'serengeti':    'https://images.unsplash.com/photo-1504945005722-33670dcaf685?w=1600&q=80',
  'ngorongoro':   'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=1600&q=80',
  'samburu':      'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1600&q=80',
  'tsavo':        'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=1600&q=80',
}

// Fallback videos from Coverr/Pexels (replace with your own downloads)
export const TIER_VIDEOS: Record<string, string> = {
  sovereign: '/videos/hero-sovereign.mp4',
  horizon:   '/videos/hero-horizon.mp4',
  tribe:     '/videos/hero-tribe.mp4',
  default:   '/videos/hero-horizon.mp4',
}

// Pexels video IDs for reference (download from pexels.com/video/ID)
// sovereign: 3048087 (lion at sunset)
// horizon:   4988534 (elephant herd)
// tribe:     4000046 (wildebeest migration)

export const TIER_FALLBACK_GRADIENT: Record<string, string> = {
  sovereign: 'from-amber-950 via-stone-900 to-charcoal',
  horizon:   'from-green-950 via-stone-900 to-charcoal',
  tribe:     'from-stone-800 via-stone-900 to-charcoal',
}

export function getTierBadgeStyle(tierSlug: string) {
  const styles: Record<string, string> = {
    sovereign: 'border-gold/30 text-gold bg-gold/5',
    horizon:   'border-sage/30 text-sage-light bg-sage/5',
    tribe:     'border-sand/30 text-sand bg-sand/5',
  }
  return styles[tierSlug] || styles.horizon
}
