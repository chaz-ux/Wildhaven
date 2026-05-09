import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name, email, phone, message,
      preferred_tier, target_budget,
      tour_id, travel_dates, group_size,
      package_slug, travel_start,
      payment_intent, source,
      package_duration,
    } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Auto-calculate end date from start + duration
    let computedDates = travel_dates || null
    if (travel_start && package_duration) {
      const start = new Date(travel_start)
      const end   = new Date(start)
      end.setDate(end.getDate() + Number(package_duration))
      computedDates = `${travel_start} to ${end.toISOString().split('T')[0]}`
    } else if (travel_start) {
      computedDates = travel_start
    }

    // ── 1. Save to Supabase via REST API (edge-compatible) ──
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let supabaseError = false
    let inquiry: any = null

    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        name,
        email,
        phone:          phone || null,
        message:        message || null,
        preferred_tier: preferred_tier || package_slug || null,
        target_budget:  target_budget || null,
        tour_id:        tour_id || null,
        travel_dates:   computedDates,
        group_size:     group_size || 1,
        source:         source || 'website',
        status:         'new',
        notes:          payment_intent ? `Payment intent: ${payment_intent}` : null,
      }),
    }).catch(e => {
      console.error('Supabase Network Error:', e)
      supabaseError = true
      return null
    })

    // If database is down, still proceed with email notifications
    if (!supabaseResponse || !supabaseResponse.ok) {
      supabaseError = true
      console.error('Supabase Save Failed - continuing to email notification')
    } else {
      const data = await supabaseResponse.json()
      inquiry = Array.isArray(data) ? data[0] : data
    }

    // ── 2. Notify team via Resend ────────────────────────
    if (process.env.RESEND_API_KEY) {
      const notifyEmail = process.env.NOTIFY_EMAIL || 'hello@zazusafaris.com'

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from:     'Zazu Safaris <noreply@zazusafaris.com>',
          to:       [notifyEmail],
          subject:  `New Safari Inquiry — ${name}`,
          reply_to: email,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#D4820A;border-bottom:2px solid #f0e8d8;padding-bottom:12px;margin:0 0 20px">🦁 New Safari Inquiry</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr style="border-bottom:1px solid #f5f0e8"><td style="padding:10px 0;color:#888;width:140px">Name</td><td style="padding:10px 0;font-weight:600">${name}</td></tr>
              <tr style="border-bottom:1px solid #f5f0e8"><td style="padding:10px 0;color:#888">Email</td><td style="padding:10px 0"><a href="mailto:${email}" style="color:#D4820A">${email}</a></td></tr>
              <tr style="border-bottom:1px solid #f5f0e8"><td style="padding:10px 0;color:#888">Phone</td><td style="padding:10px 0">${phone || '—'}</td></tr>
              <tr style="border-bottom:1px solid #f5f0e8"><td style="padding:10px 0;color:#888">Package</td><td style="padding:10px 0;font-weight:600">${package_slug || preferred_tier || '—'}</td></tr>
              <tr style="border-bottom:1px solid #f5f0e8"><td style="padding:10px 0;color:#888">Group</td><td style="padding:10px 0">${group_size || '—'}</td></tr>
              <tr style="border-bottom:1px solid #f5f0e8"><td style="padding:10px 0;color:#888">Safari Dates</td><td style="padding:10px 0">${computedDates || '—'}</td></tr>
              <tr style="border-bottom:1px solid #f5f0e8"><td style="padding:10px 0;color:#888">Payment</td><td style="padding:10px 0;color:#D4820A;font-weight:600">${payment_intent || 'enquire'}</td></tr>
              <tr><td style="padding:10px 0;color:#888;vertical-align:top">Message</td><td style="padding:10px 0">${message || '—'}</td></tr>
            </table>
            <div style="margin-top:20px;padding:14px;background:#fff8ee;border-left:3px solid #D4820A;border-radius:3px;font-size:13px;color:#666">
              Reply to this email to respond directly.${inquiry?.id ? ` Inquiry ID: <code>${inquiry.id}</code>` : ' ⚠️ Database save failed - lead logged via email.'}
            </div></div>`,
        }),
      }).catch(e => console.error('Resend notify error:', e))

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from:    'Zazu Safaris <noreply@zazusafaris.com>',
          to:      [email],
          subject: 'Your safari enquiry is confirmed ✦',
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1C1008;color:#F7F0E4;padding:40px 30px;border-radius:8px">
            <p style="color:#D4820A;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px">Zazu Safaris</p>
            <h1 style="font-family:Georgia,serif;font-weight:300;font-size:28px;color:#F7F0E4;margin:0 0 20px">We've received your safari brief</h1>
            <p style="color:rgba(247,240,228,0.65);line-height:1.8;margin:0 0 20px">Hi ${name}, our team will be in touch within <strong style="color:#F7F0E4">2 hours</strong> with your personalised proposal.</p>
            ${package_slug && package_slug !== 'custom' ? `
            <div style="background:rgba(212,130,10,0.12);border:1px solid rgba(212,130,10,0.3);border-radius:6px;padding:16px;margin:0 0 20px">
              <p style="margin:0 0 4px;font-size:11px;color:rgba(212,130,10,0.8);letter-spacing:3px;text-transform:uppercase">Selected Package</p>
              <p style="margin:0;color:#F7F0E4;font-size:15px">${package_slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
              ${computedDates ? `<p style="margin:4px 0 0;font-size:13px;color:rgba(247,240,228,0.45)">Safari dates: ${computedDates}</p>` : ''}
            </div>` : ''}
            <p style="color:rgba(247,240,228,0.4);font-size:13px">Questions? <a href="https://wa.me/254141481665" style="color:#D4820A">WhatsApp us</a> or reply to this email.</p>
            <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(247,240,228,0.2)">Zazu Safaris · Nairobi, Kenya · zazusafaris.com</div>
          </div>`,
        }),
      }).catch(e => console.error('Resend confirm error:', e))
    }

    // ── 3. WhatsApp alert via Callmebot ──────────────────
    if (process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_APIKEY) {
      const msg = encodeURIComponent(
        `🦁 NEW INQUIRY\n👤 ${name}\n📧 ${email}\n📱 ${phone || '—'}\n` +
        `📦 ${package_slug || '—'}\n👥 ${group_size || '—'}\n` +
        `📅 ${computedDates || 'flexible'}\n💳 ${payment_intent || 'enquire'}`
      )
      await fetch(
        `https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${msg}&apikey=${process.env.CALLMEBOT_APIKEY}`
      ).catch(e => console.error('Callmebot error:', e))
    }

    // ── Return response ──────────────────────────────────
    return NextResponse.json({
      success: true,
      id: inquiry?.id || null,
      database_error: supabaseError,
      message: supabaseError
        ? 'Inquiry received and emailed to team (database temporarily unavailable)'
        : 'Inquiry saved and confirmation sent',
    })

  } catch (e) {
    console.error('Inquiry API error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}