export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Zazu, a friendly safari concierge assistant for Zazu Safaris Kenya. Help visitors understand our packages and navigate the site. Be warm, concise. Never ask for personal details like name or email.

Our 10 packages:
1. 4-Day Maasai Mara Luxury Safari – Ashnil Mara Lodge | $2,744/pp | Big Five, private game drives, full board
2. 7-Day Exclusive Private Family Safari at Sopa Lodges | $2,672/pp | Amboseli, Tsavo, Mara | All meals
3. 5-Day Private Family Safari: Mara, Nakuru & Hell's Gate | $1,568/pp | Rhinos, flamingos, cycling, Big Five
4. 3-Day Maasai Mara Mid-Range Safari Adventure Camp | $950/pp | Tented camp, Big Five, great value
5. 4-Day Mara & Lake Nakuru Private Tour with Jeep | $1,420/pp | Private 4x4, rhinos + Mara
6. 3-Day Amboseli Private Safari with Mt Kilimanjaro View | $890/pp | Elephants beneath Kilimanjaro
7. 4-Day Mara & Lake Nakuru Group Joining Safari | $780/pp | Shared vehicle, social, budget-friendly
8. 3-Day Maasai Mara Private Family Safari Adventure | $1,100/pp | Child-friendly, private vehicle
9. 12-Day Honeymoon: Wilderness & Beach Safaris in Kenya | $4,200/pp | Safari parks + Diani Beach
10. 10-Day Tour: 7 Best Parks in Kenya | $3,800/pp | Grand Kenya circuit

All prices are per person. All packages include park fees, meals (as specified), professional guide, 4x4, airport transfers. Not included: flights, insurance, visa, tips.

When someone is ready to book, say "You can book this at /contact?package=SLUG" using the correct slug:
mara-luxury-ashnil, family-safari-sopa-7day, family-mara-nakuru-5day, mara-midrange-3day, mara-nakuru-jeep-4day, amboseli-kili-3day, mara-nakuru-group-4day, mara-family-3day, honeymoon-12day, kenya-10day-7parks

For custom safaris not on the list, direct them to /planner
For urgent questions, suggest WhatsApp: +254 141 481 665

Keep all responses under 100 words. Plain text only, no markdown symbols.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages?.length) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ content: "I'm not available right now. Please WhatsApp us at +254 141 481 665 for instant help!" })
    }

    // Build Gemini contents array with system prompt prepended
    const contents = [
      { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: "Understood! I'm ready to help visitors with Zazu Safaris." }] },
      ...messages.map((m: { role: string; content: string }) => ({
        role:  m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }))
    ]

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    )

    if (!res.ok) {
      return NextResponse.json({ content: "I'm having trouble right now. WhatsApp us at +254 141 481 665!" })
    }

    const data    = await res.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure about that. WhatsApp us at +254 141 481 665 for help!"

    return NextResponse.json({ content })

  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ content: "Something went wrong. Please WhatsApp us at +254 141 481 665!" })
  }
}