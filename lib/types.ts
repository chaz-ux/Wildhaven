export interface Tier {
  id: string
  slug: 'sovereign' | 'horizon' | 'tribe'
  name: string
  tagline: string
  description: string
  vibe_video_url: string | null
  hero_color: string
  sort_order: number
  created_at: string
}

export interface Destination {
  id: string
  slug: string
  name: string
  country: string
  lat: number
  lng: number
  hero_image_url: string | null
  description: string
  best_months: string[]
  wildlife_tags: string[]
  created_at: string
}

export interface Tour {
  id: string
  slug: string
  title: string
  tier_id: string
  destination_id: string
  base_price: number
  currency: string
  days_duration: number
  max_group_size: number
  short_desc: string
  long_desc: string | null
  hero_image_url: string | null
  gallery_urls: string[]
  highlights: string[]
  includes: string[]
  excludes: string[]
  scarcity_text: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // joined
  tier?: Tier
  destination?: Destination
}

export interface ItineraryDay {
  id: string
  tour_id: string
  day_number: number
  title: string
  description: string
  accommodation: string
  destination_id: string
  meals_included: string[]
  activities: string[]
  hero_image_url: string | null
  created_at: string
  // joined
  destination?: Destination
}

export interface Inquiry {
  id?: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  message?: string
  target_budget?: string
  preferred_tier?: string
  tour_id?: string
  travel_dates?: string
  group_size?: number
  source?: string
  status?: string
  notes?: string
}

export interface PlannerSession {
  id?: string
  email: string
  name: string
  quiz_answers: QuizAnswers
  ai_response?: string
  tour_matches?: string[]
}

export interface QuizAnswers {
  style: 'luxury' | 'midrange' | 'budget' | 'undecided' | null
  budget: number
  animals: string[]
  duration: string | null
  destination_pref?: string
}

export interface WildlifeSighting {
  id: string
  animal: string
  description: string
  destination_id: string
  spotted_at: string
  is_active: boolean
  destination?: Destination
}

// Tour with full relations
export interface TourFull extends Tour {
  tier: Tier
  destination: Destination
  itinerary_days: ItineraryDay[]
}
