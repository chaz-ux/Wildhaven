import { createClient } from './supabase'

export async function createServerSupabaseClient() {
  return createClient()
}