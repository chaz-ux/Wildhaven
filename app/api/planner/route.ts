export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.8,
          }
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini API error:', err)
      return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 })
    }

    const data = await response.json()

    // Gemini response: candidates[0].content.parts[0].text
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    console.log("🚦 FINISH REASON:", data.candidates?.[0]?.finishReason)

    return NextResponse.json({ content })
  } catch (err) {
    console.error('Planner API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
