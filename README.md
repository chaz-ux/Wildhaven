# 🌿 Zazu Safaris — Full Setup Guide

## Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (custom safari design tokens)
- **Supabase** (PostgreSQL database + auth)
- **Mapbox GL JS** (interactive route maps)
- **GSAP + Lenis** (cinematic animations + smooth scroll)
- **Framer Motion** (page transitions)
- **Anthropic Claude API** (AI trip planner)

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token
ANTHROPIC_API_KEY=sk-ant-your_key
NEXT_PUBLIC_WHATSAPP_NUMBER=254141481665
```

### Where to get each key:

| Key | Source |
|-----|--------|
| Supabase URL + Anon Key | supabase.com → Project → Settings → API |
| Mapbox Token | account.mapbox.com/access-tokens |
| Anthropic Key | console.anthropic.com |

---

## 3. Set up the database

1. Go to **supabase.com → your project → SQL Editor → New Query**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run**

This creates all 7 tables, indexes, RLS policies, and seeds them with:
- 3 tiers (Sovereign, Horizon, Tribe)
- 6 destinations (Mara, Amboseli, Serengeti, Ngorongoro, Samburu, Tsavo)
- 6 tours with full itinerary days
- 8 wildlife sightings for the live ticker

---

## 4. Add videos (hero backgrounds)

Download free 4K safari videos from **coverr.co** and save them to `public/videos/`:

| File | Search term on Coverr |
|------|-----------------------|
| `hero-sovereign.mp4` | "lion sunset africa" |
| `hero-horizon.mp4`   | "elephant herd savannah" |
| `hero-tribe.mp4`     | "wildebeest migration" |

The site works without videos — it falls back to gradient backgrounds.

---

## 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 6. Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## File Structure

```
wildhaven/
├── app/
│   ├── layout.tsx              ← Root: fonts, cursor, nav, footer, concierge pod
│   ├── page.tsx                ← Home page
│   ├── loading.tsx             ← Global loading skeleton
│   ├── not-found.tsx           ← 404 page
│   ├── globals.css             ← All animations, design tokens, base styles
│   ├── safaris/
│   │   ├── page.tsx            ← All safaris listing
│   │   └── [slug]/page.tsx     ← Individual tour detail
│   ├── planner/
│   │   ├── page.tsx            ← Metadata wrapper (server)
│   │   └── PlannerClient.tsx   ← AI quiz UI (client)
│   ├── contact/page.tsx        ← Inquiry form
│   ├── about/page.tsx          ← Story, team, conservation
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── sustainability/page.tsx
│   └── api/
│       ├── planner/route.ts    ← Claude API call (server-side)
│       └── inquiry/route.ts    ← Saves lead to Supabase
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          ← Glass, scroll-aware, mobile menu
│   │   ├── Footer.tsx
│   │   ├── CustomCursor.tsx    ← Gold dot + lagging ring
│   │   ├── PageTransition.tsx  ← GSAP wipe between routes
│   │   ├── SmoothScroll.tsx    ← Lenis smooth scroll
│   │   └── ConciergePod.tsx    ← Floating contact button
│   ├── home/
│   │   ├── HeroSection.tsx     ← Video BG, parallax, tier switcher
│   │   ├── WildlifeTicker.tsx  ← Live marquee from DB
│   │   ├── VibeSelector.tsx    ← 3 tier cards
│   │   ├── TourGrid.tsx        ← Filterable grid
│   │   └── TrustBanner.tsx     ← Animated counting stats
│   └── tours/
│       ├── TourCard.tsx        ← Hover breathing card
│       ├── RouteMap.tsx        ← Mapbox with glowing route line
│       ├── ItineraryTimeline.tsx ← Scroll-story days
│       └── StickyPricingBar.tsx  ← Fixed bottom pricing
│
├── lib/
│   ├── types.ts                ← All TypeScript types
│   ├── supabase.ts             ← Browser Supabase client
│   ├── supabase-server.ts      ← SSR Supabase client
│   ├── data.ts                 ← All data-fetching functions
│   └── utils.ts                ← formatPrice, timeAgo, image URLs
│
├── hooks/
│   ├── useScrollReveal.ts      ← IntersectionObserver reveal
│   └── useParallax.ts          ← Scroll parallax values
│
├── supabase/
│   └── schema.sql              ← PASTE THIS INTO SUPABASE SQL EDITOR
│
└── public/
    ├── videos/                 ← Add hero-sovereign/horizon/tribe.mp4 here
    └── images/                 ← Add destination images here (optional)
```

---

## Tier Clarity System

The website includes a **4-layer navigation system** to help users understand the three safari tiers:

1. **Home Page - VibeSelector** — Visual tier cards with key features
2. **Home Page - TierGuide** — Interactive comparison with pricing, features, and "who it's for"
3. **Safaris Page - TierExplainer** — Context-aware explanation when filtering by tier
4. **Contact Form** — Radio buttons with tier descriptions for clear selection

### Components:

| Component | Location | Purpose |
|-----------|----------|---------|
| `VibeSelector.tsx` | `components/home/` | Three tier cards with icons and features |
| `TierGuide.tsx` | `components/home/` | Detailed tier comparison with pricing |
| `TierExplainer.tsx` | `components/home/` | Inline tier explanation on safaris page |
| `QuickNavigation.tsx` | `components/layout/` | Sticky breadcrumb with tier switcher |

### How users navigate:
- **Comparing tiers?** → TierGuide shows side-by-side pricing/features
- **Browsing safaris?** → TierExplainer clarifies what tier means before showing results
- **Switching tiers?** → QuickNavigation breadcrumb has quick tier buttons
- **Booking?** → Contact form shows tier options with descriptions

All tier information is centralized—update pricing/features in one place, changes appear everywhere.

---

## Updating content (no code needed)

Once live, all content can be updated via the **Supabase Dashboard → Table Editor**:

- **Tours** — change prices, descriptions, scarcity text
- **Tiers** — update descriptions and video URLs
- **Wildlife Sightings** — add new live sightings for the ticker
- **Inquiries** — view and manage all leads

---

## WhatsApp integration

When you have a WhatsApp Business number:

1. Update `.env.local`:
   ```
   NEXT_PUBLIC_WHATSAPP_NUMBER=254141481665
   NEXT_PUBLIC_WHATSAPP_MESSAGE=Hello! I'd like to book a safari.
   ```
2. The floating concierge pod will automatically link to WhatsApp.

---

## Questions?

Everything in this codebase is production-ready. The only things you add are:
1. Your Supabase/Mapbox/Anthropic credentials
2. Three hero videos
3. Your real WhatsApp number when ready
