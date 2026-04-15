import { createClient } from './supabase'
import { createServerSupabaseClient } from './supabase-server'
import type { Tour, TourFull, WildlifeSighting, Tier, Destination } from './types'

export async function getTiers(): Promise<Tier[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('tiers').select('*').order('sort_order')
  if (error) { console.error('getTiers:', error); return [] }
  return data
}

export async function getFeaturedTours(): Promise<Tour[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tours').select(`*, tier:tiers(*), destination:destinations(*)`)
    .eq('is_active', true).eq('is_featured', true).order('base_price', { ascending: true })
  if (error) { console.error('getFeaturedTours:', error); return [] }
  return data
}

export async function getAllTours(): Promise<Tour[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tours').select(`*, tier:tiers(*), destination:destinations(*)`)
    .eq('is_active', true).order('base_price', { ascending: true })
  if (error) { console.error('getAllTours:', error); return [] }
  return data
}

export async function getTourBySlug(slug: string): Promise<TourFull | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tours')
    .select(`*, tier:tiers(*), destination:destinations(*), itinerary_days(*, destination:destinations(*))`)
    .eq('slug', slug).eq('is_active', true).single()
  if (error) { console.error('getTourBySlug:', error); return null }
  if (data?.itinerary_days) {
    data.itinerary_days.sort((a: { day_number: number }, b: { day_number: number }) => a.day_number - b.day_number)
  }
  return data
}

export async function getWildlifeSightings(): Promise<WildlifeSighting[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('wildlife_sightings').select(`*, destination:destinations(name)`)
    .eq('is_active', true).order('spotted_at', { ascending: false }).limit(12)
  if (error) { console.error('getWildlifeSightings:', error); return [] }
  return data
}

export async function getDestinations(): Promise<Destination[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('destinations').select('*').order('name')
  if (error) { console.error('getDestinations:', error); return [] }
  return data
}

// Client-side functions — use directly in client components
export async function submitInquiry(inquiry: import('./types').Inquiry) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inquiries').insert([{ ...inquiry, source: 'website' }]).select().single()
  if (error) throw error
  return data
}

export async function savePlannerSession(session: import('./types').PlannerSession) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('planner_sessions').insert([session]).select().single()
  if (error) throw error
  return data
}