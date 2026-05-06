export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message, preferred_tier, target_budget, tour_id, travel_dates, group_size } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name, email, phone, message,
        preferred_tier, target_budget,
        tour_id: tour_id || null,
        travel_dates,
        group_size: group_size || 1,
        source: 'website',
        status: 'new',
      }])
      .select()
      .single()

    if (error) {
      console.error('Inquiry insert error:', error)
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Inquiry API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
