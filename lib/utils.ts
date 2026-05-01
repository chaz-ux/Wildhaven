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

// Pexels image URLs by destination slug
// All sourced from Pexels — free to use with no attribution required
// High-quality wildlife photography from Kenya and East African safaris
export const DESTINATION_IMAGES: Record<string, string> = {
  // Maasai Mara — majestic male lion striding through golden savannah grass
  // Source: pexels.com/photo/majestic-lion-in-the-maasai-mara-grasslands-28924821
  'maasai-mara':   'https://images.pexels.com/photos/28924821/pexels-photo-28924821.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Amboseli — elephant herd with Kilimanjaro backdrop (the iconic shot)
  // Source: pexels.com/photo/mount-kilimanjaro-in-tanzania-8427984 (Sergey Pesterev, Kajiado County, Kenya)
  'amboseli':      'https://images.pexels.com/photos/8427984/pexels-photo-8427984.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Serengeti — wildebeest river crossing, Mara River
  // Source: pexels.com/photo/herd-of-wildebeest-on-the-river-12339600
  'serengeti':     'https://images.pexels.com/photos/12339600/pexels-photo-12339600.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Ngorongoro — male lion resting in Serengeti/Ngorongoro ecosystem (Tomáš Malík)
  // Source: pexels.com/photo/male-lion-resting-in-serengeti-savanna-10399169
  'ngorongoro':    'https://images.pexels.com/photos/10399169/pexels-photo-10399169.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Samburu — two rhinos in Kenya savannah near Nairobi (Ethan Ngure, Kenya)
  // Source: pexels.com/photo/rhinos-covered-in-mud-near-lake-26052069
  'samburu':       'https://images.pexels.com/photos/26052069/pexels-photo-26052069.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Tsavo — elephant at waterhole, African savannah
  // Source: pexels.com/photo/elephant-on-green-grass-field-5267250
  'tsavo':         'https://images.pexels.com/photos/5267250/pexels-photo-5267250.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Lake Naivasha — elephant on brown grass field, Kenya plains
  // Source: pexels.com/photo/elephant-on-brown-grass-field-609749
  'lake-naivasha': 'https://images.pexels.com/photos/609749/pexels-photo-609749.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Lake Nakuru — large African elephant portrait, green grass, Kenya
  // Source: pexels.com/photo/photo-of-a-big-african-elephant-on-green-grass-7781629
  'lake-nakuru':   'https://images.pexels.com/photos/7781629/pexels-photo-7781629.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Hell's Gate — grayscale elephants (Casey Allen — timeless Kenya wildlife)
  // Source: pexels.com/photo/grayscale-photography-of-elephants-16023
  'hells-gate':    'https://images.pexels.com/photos/16023/pexels-photo-16023.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Taita Hills — elephant walking on grass field, Serengeti/Tanzania
  // Source: pexels.com/photo/an-elephant-walking-on-a-grass-field-7001091
  'taita-hills':   'https://images.pexels.com/photos/7001091/pexels-photo-7001091.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Laikipia — elephant close-up portrait, grey savanna
  // Source: pexels.com/photo/grayscale-photo-of-elephant-842729
  'laikipia':      'https://images.pexels.com/photos/842729/pexels-photo-842729.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Mombasa Coast — African elephant drinking at waterhole (open savannah)
  // Source: pexels.com/photo/an-african-elephant-on-the-grass-9518321
  'mombasa-coast': 'https://images.pexels.com/photos/9518321/pexels-photo-9518321.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Mount Kenya — lion cubs in Maasai Mara grasslands (playful, familial)
  // Source: pexels.com/photo/playful-lion-cubs-in-maasai-mara-grasslands-30705114
  'mount-kenya':   'https://images.pexels.com/photos/30705114/pexels-photo-30705114.jpeg?auto=compress&cs=tinysrgb&w=1600',

  // Aberdare — lion rolling playfully in Maasai Mara savannah
  // Source: pexels.com/photo/playful-lion-rolling-in-african-savannah-at-maasai-mara-28571447
  'aberdare':      'https://images.pexels.com/photos/28571447/pexels-photo-28571447.jpeg?auto=compress&cs=tinysrgb&w=1600',
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
