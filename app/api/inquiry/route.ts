export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, phone, message,
      preferred_tier, target_budget,
      tour_id, travel_dates, group_size,
      package_slug, travel_start, travel_end,
      payment_intent, source,
    } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // ── 1. Save to Supabase ──────────────────────────────
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name,
        email,
        phone:          phone || null,
        message:        message || null,
        preferred_tier: preferred_tier || package_slug || null,
        target_budget:  target_budget || null,
        tour_id:        tour_id || null,
        travel_dates:   travel_dates || (travel_start ? `${travel_start}${travel_end ? ` to ${travel_end}` : ''}` : null),
        group_size:     group_size || 1,
        source:         source || 'website',
        status:         'new',
        notes:          payment_intent ? `Payment intent: ${payment_intent}` : null,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
    }

    // ── 2. Send email notification via Resend ────────────
    // Only runs when RESEND_API_KEY is set
    if (process.env.RESEND_API_KEY) {
      const notifyEmail = process.env.NOTIFY_EMAIL || 'hello@zazusafaris.com'
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from:    'Zazu Safaris <noreply@zazusafaris.com>',
          to:      [notifyEmail],
          subject: `New Safari Inquiry — ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <h2 style="color:#D4820A;border-bottom:1px solid #eee;padding-bottom:10px">
                New Safari Inquiry
              </h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#666;width:140px">Name</td><td style="padding:8px 0;font-weight:500">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Package</td><td style="padding:8px 0">${package_slug || preferred_tier || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Group Size</td><td style="padding:8px 0">${group_size || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Travel Dates</td><td style="padding:8px 0">${travel_dates || (travel_start ? `${travel_start}${travel_end ? ` → ${travel_end}` : ''}` : '—')}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Budget</td><td style="padding:8px 0">${target_budget || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Payment Intent</td><td style="padding:8px 0;color:#D4820A;font-weight:500">${payment_intent || 'enquire'}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Source</td><td style="padding:8px 0">${source || 'website'}</td></tr>
                <tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td style="padding:8px 0">${message || '—'}</td></tr>
              </table>
              <div style="margin-top:20px;padding:15px;background:#fff8ee;border-left:3px solid #D4820A;border-radius:3px">
                <p style="margin:0;font-size:13px;color:#666">
                  Reply directly to this email or WhatsApp the client${phone ? ` at ${phone}` : ''}.
                  Inquiry ID: <code>${data.id}</code>
                </p>
              </div>
            </div>
          `,
          reply_to: email,
        }),
      }).catch(err => console.error('Resend error:', err))

      // ── 3. Send confirmation email to client ───────────
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from:    'Zazu Safaris <noreply@zazusafaris.com>',
          to:      [email],
          subject: 'We received your safari enquiry ✦',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1C1008;color:#F7F0E4;padding:40px 30px;border-radius:6px">
              <h1 style="font-family:Georgia,serif;font-weight:300;font-size:28px;color:#F7F0E4;margin:0 0 8px">
                Safari Brief Received
              </h1>
              <p style="color:#D4820A;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:0 0 30px">Zazu Safaris</p>

              <p style="color:rgba(247,240,228,0.7);line-height:1.7;margin:0 0 20px">
                Hi ${name}, thank you for reaching out. We've received your safari enquiry and our team will be in touch within <strong style="color:#F7F0E4">2 hours</strong> with a personalised proposal.
              </p>

              ${package_slug && package_slug !== 'custom' ? `
              <div style="background:rgba(212,130,10,0.1);border:1px solid rgba(212,130,10,0.3);border-radius:4px;padding:16px;margin:24px 0">
                <p style="margin:0;font-size:12px;color:rgba(212,130,10,0.8);letter-spacing:2px;text-transform:uppercase">Your Selected Package</p>
                <p style="margin:6px 0 0;color:#F7F0E4;font-size:15px">${package_slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                ${payment_intent !== 'enquire' ? `<p style="margin:4px 0 0;font-size:12px;color:rgba(247,240,228,0.5)">Payment intent: ${payment_intent} — we'll send a secure Pesapal link shortly</p>` : ''}
              </div>` : ''}

              <p style="color:rgba(247,240,228,0.5);line-height:1.7;font-size:13px;margin:20px 0 0">
                Questions in the meantime? Reply to this email or WhatsApp us at 
                <a href="https://wa.me/254141481665" style="color:#D4820A">+254 141 481 665</a>.
              </p>

              <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1)">
                <p style="margin:0;font-size:11px;color:rgba(247,240,228,0.25)">
                  Zazu Safaris · Nairobi, Kenya · zazusafaris.com
                </p>
              </div>
            </div>
          `,
        }),
      }).catch(err => console.error('Client confirmation email error:', err))
    }

    // ── 4. WhatsApp notification to operator ─────────────
    // Uses Callmebot (free WhatsApp API for personal numbers)
    // Set CALLMEBOT_PHONE and CALLMEBOT_APIKEY in .env.local to enable
    if (process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_APIKEY) {
      const waText = encodeURIComponent(
        `🦁 NEW INQUIRY — Zazu Safaris\n` +
        `👤 ${name}\n` +
        `📧 ${email}\n` +
        `📱 ${phone || 'no phone'}\n` +
        `📦 ${package_slug || preferred_tier || 'not specified'}\n` +
        `👥 Group: ${group_size || '—'}\n` +
        `📅 ${travel_dates || travel_start || 'flexible'}\n` +
        `💳 Intent: ${payment_intent || 'enquire'}\n` +
        `💬 ${message ? message.substring(0, 100) : 'No message'}`
      )
      await fetch(
        `https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${waText}&apikey=${process.env.CALLMEBOT_APIKEY}`
      ).catch(err => console.error('Callmebot error:', err))
    }

    return NextResponse.json({ success: true, id: data.id })

  } catch (err) {
    console.error('Inquiry API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}