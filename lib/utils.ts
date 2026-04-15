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
  // Maasai Mara — wildebeest migration, open savannah
  'maasai-mara':    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80',
  
  // Amboseli — elephants with Kilimanjaro backdrop
  'amboseli':       'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=1600&q=80',
  
  // Serengeti — vast golden plains, Tanzania
  'serengeti':      'https://images.unsplash.com/photo-1504945005722-33670dcaf685?w=1600&q=80',
  
  // Ngorongoro — crater floor, Tanzania
  'ngorongoro':     'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80',
  
  // Samburu — dry northern Kenya, acacia, river
  'samburu':        'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1600&q=80',
  
  // Tsavo — red earth, baobab trees
  'tsavo':          'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=1600&q=80',
  
  // Lake Naivasha — green freshwater lake, hippos
  'lake-naivasha':  'https://images.unsplash.com/photo-1612968609497-e51f2c1c4e14?w=1600&q=80',
  
  // Lake Nakuru — flamingos on soda lake
  'lake-nakuru':    'https://images.unsplash.com/photo-1551969014-7d2c4cdcfeef?w=1600&q=80',
  
  // Hell's Gate — volcanic gorge, dramatic cliffs
  'hells-gate':     'https://images.unsplash.com/photo-1580746738099-b2d16e4f7a7e?w=1600&q=80',
  
  // Taita Hills — lodge on stilts, savannah at dusk
  'taita-hills':    'https://images.unsplash.com/photo-1503516459261-40c66117780a?w=1600&q=80',
  
  // Laikipia / Ol Pejeta — open conservancy, rhino country
  'laikipia':       'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1600&q=80',
  
  // Mombasa Coast — turquoise Indian Ocean, white sand Diani
  'mombasa-coast':  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80',
  
  // Mount Kenya — snow-capped peak, alpine forest
  'mount-kenya':    'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&q=80',
  
  // Aberdare — misty mountain forest, waterfall
  'aberdare':       'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80',
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
