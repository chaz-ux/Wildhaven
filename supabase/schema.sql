-- ============================================================
-- WILDHAVEN SAFARI ERP — Supabase PostgreSQL Schema
-- Paste this entire file into: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABLE 1: TIERS ──────────────────────────────────────────────────────────
CREATE TABLE tiers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,   -- 'sovereign' | 'horizon' | 'tribe'
  name        TEXT NOT NULL,          -- 'The Sovereign'
  tagline     TEXT,
  description TEXT,
  vibe_video_url TEXT,               -- Coverr.co video URL
  hero_color  TEXT DEFAULT '#C9A84C',
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLE 2: DESTINATIONS ───────────────────────────────────────────────────
CREATE TABLE destinations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  country          TEXT NOT NULL,    -- 'Kenya' | 'Tanzania'
  lat              DECIMAL(9,6),
  lng              DECIMAL(9,6),
  hero_image_url   TEXT,
  description      TEXT,
  best_months      TEXT[],           -- e.g. ['July','August','September']
  wildlife_tags    TEXT[],           -- e.g. ['Big Five','Migration','Cheetah']
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLE 3: TOURS ──────────────────────────────────────────────────────────
CREATE TABLE tours (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  tier_id         UUID REFERENCES tiers(id) ON DELETE SET NULL,
  destination_id  UUID REFERENCES destinations(id) ON DELETE SET NULL,
  base_price      DECIMAL(10,2) NOT NULL,
  currency        TEXT DEFAULT 'USD',
  days_duration   INT NOT NULL,
  max_group_size  INT DEFAULT 8,
  short_desc      TEXT,
  long_desc       TEXT,
  hero_image_url  TEXT,
  gallery_urls    TEXT[],
  highlights      TEXT[],
  includes        TEXT[],
  excludes        TEXT[],
  scarcity_text   TEXT,             -- '2 jeeps left for October'
  is_featured     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLE 4: ITINERARY DAYS ─────────────────────────────────────────────────
CREATE TABLE itinerary_days (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id          UUID REFERENCES tours(id) ON DELETE CASCADE,
  day_number       INT NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  accommodation    TEXT,
  destination_id   UUID REFERENCES destinations(id) ON DELETE SET NULL,
  meals_included   TEXT[],          -- ['Breakfast','Lunch','Dinner']
  activities       TEXT[],
  hero_image_url   TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tour_id, day_number)
);

-- ─── TABLE 5: INQUIRIES / LEADS ──────────────────────────────────────────────
CREATE TABLE inquiries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  whatsapp        TEXT,
  message         TEXT,
  target_budget   TEXT,             -- '$2000-$5000'
  preferred_tier  TEXT,
  tour_id         UUID REFERENCES tours(id) ON DELETE SET NULL,
  travel_dates    TEXT,
  group_size      INT DEFAULT 1,
  source          TEXT DEFAULT 'website',  -- 'website' | 'planner' | 'whatsapp'
  status          TEXT DEFAULT 'new',      -- 'new' | 'contacted' | 'booked' | 'lost'
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLE 6: PLANNER SESSIONS ───────────────────────────────────────────────
CREATE TABLE planner_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT,
  name          TEXT,
  quiz_answers  JSONB,              -- Full quiz data blob
  ai_response   TEXT,              -- The generated dream board text
  tour_matches  UUID[],            -- Array of matched tour IDs
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLE 7: WILDLIFE SIGHTINGS (live ticker) ───────────────────────────────
CREATE TABLE wildlife_sightings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal          TEXT NOT NULL,
  description     TEXT NOT NULL,   -- 'Cheetah sprint spotted in Mara North'
  destination_id  UUID REFERENCES destinations(id) ON DELETE SET NULL,
  spotted_at      TIMESTAMPTZ DEFAULT NOW(),
  is_active       BOOLEAN DEFAULT TRUE
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_tours_tier ON tours(tier_id);
CREATE INDEX idx_tours_destination ON tours(destination_id);
CREATE INDEX idx_tours_active ON tours(is_active);
CREATE INDEX idx_itinerary_tour ON itinerary_days(tour_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_email ON inquiries(email);
CREATE INDEX idx_sightings_active ON wildlife_sightings(is_active, spotted_at DESC);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wildlife_sightings ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
CREATE POLICY "Public read tiers" ON tiers FOR SELECT USING (true);
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read active tours" ON tours FOR SELECT USING (is_active = true);
CREATE POLICY "Public read itinerary" ON itinerary_days FOR SELECT USING (true);
CREATE POLICY "Public read sightings" ON wildlife_sightings FOR SELECT USING (is_active = true);

-- Anyone can insert inquiries and planner sessions (lead capture)
CREATE POLICY "Anyone can submit inquiry" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can save planner session" ON planner_sessions FOR INSERT WITH CHECK (true);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tours_updated_at BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── SEED DATA ───────────────────────────────────────────────────────────────

-- Tiers
INSERT INTO tiers (slug, name, tagline, description, hero_color, sort_order) VALUES
('sovereign', 'The Sovereign', 'The wild, without compromise', 
 'Private conservancies, butler-attended tented camps, and exclusive game drives with dedicated naturalists. Every detail attended to before you think to ask.',
 '#C9A84C', 1),
('horizon', 'The Horizon', 'Comfort meets the call of the wild',
 'Intimate camps, semi-private vehicles, and expertly curated routes. The perfect balance of authenticity, comfort, and extraordinary wildlife access.',
 '#7A8C6E', 2),
('tribe', 'The Tribe', 'The wildest memories cost the least',
 'Shared vehicles, legendary campsites, and a community of like-minded adventurers. Proof that the most profound experiences are not about price.',
 '#8C7660', 3);

-- Destinations
INSERT INTO destinations (slug, name, country, lat, lng, best_months, wildlife_tags, description) VALUES
('maasai-mara', 'Maasai Mara', 'Kenya', -1.5000, 35.1000, 
 ARRAY['July','August','September','October'], 
 ARRAY['Big Five','Great Migration','Cheetah','Lion','Leopard'],
 'The crown jewel of Kenyan safari. Home to the Great Migration and the world''s most dramatic predator-prey spectacles.'),
('amboseli', 'Amboseli', 'Kenya', -2.6527, 37.2606,
 ARRAY['June','July','August','September','October'],
 ARRAY['Elephant','Big Five','Kilimanjaro Views','Birdlife'],
 'Africa''s elephant paradise. 1,400+ elephants roam the floodplains beneath Kilimanjaro''s snow-capped peak.'),
('serengeti', 'Serengeti', 'Tanzania', -2.3333, 34.8333,
 ARRAY['January','February','June','July','August','September'],
 ARRAY['Great Migration','Big Five','Lion','Cheetah','Leopard'],
 'An endless plain that has hosted the greatest wildlife spectacle on earth for millions of years.'),
('ngorongoro', 'Ngorongoro Crater', 'Tanzania', -3.1756, 35.5873,
 ARRAY['June','July','August','September','October','November'],
 ARRAY['Big Five','Rhino','Hippo','Flamingo'],
 'The world''s largest intact caldera. 25,000 animals live within its walls — including all of the Big Five.'),
('samburu', 'Samburu', 'Kenya', 0.5917, 37.5333,
 ARRAY['January','February','July','August','September','October'],
 ARRAY['Special Five','Reticulated Giraffe','Grevy Zebra','Wild Dog'],
 'Remote, wild, and unlike anywhere else. Home to five species found nowhere else in Kenya — the Samburu Special Five.'),
('tsavo', 'Tsavo East', 'Kenya', -2.9833, 38.5000,
 ARRAY['June','July','August','September','October'],
 ARRAY['Elephant','Lion','Leopard','Hippo','Crocodile'],
 'Africa''s largest national park. Home to the famous red elephants and the legendary man-eating lions of Tsavo.');

-- Tours (referencing tier and destination slugs via subqueries)
INSERT INTO tours (slug, title, tier_id, destination_id, base_price, days_duration, max_group_size, short_desc, highlights, includes, scarcity_text, is_featured) VALUES
(
  'mara-private-immersion',
  'Mara Private Reserve Immersion',
  (SELECT id FROM tiers WHERE slug = 'sovereign'),
  (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  9800, 7, 2,
  'Seven days in an exclusive conservancy with a private naturalist, balloon safari, and the Great Migration as your backdrop.',
  ARRAY['Private balloon safari at dawn','Dedicated naturalist & vehicle','Migration river crossing front-row','Maasai community bead ceremony','Night safari & Milky Way sleeping','Cheetah research participation'],
  ARRAY['All park & conservancy fees','All meals & premium drinks','Private vehicle & guide','Balloon safari','Bush flights'],
  'Only 1 private villa left — September',
  true
),
(
  'classic-mara-migration',
  'Classic Mara Migration Circuit',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  2400, 6, 6,
  'Six days chasing the Great Migration through the Mara''s finest game corridors. Near-guaranteed Big Five sightings.',
  ARRAY['Great Migration river crossing','Hippo pool sundowners','Guided bush walk with Maasai tracker','Big Five game drives','Mara gorge & fig forest exploration'],
  ARRAY['All park fees','All meals','Semi-private 4x4 (max 6 guests)','Expert guide'],
  '2 jeeps available — October',
  true
),
(
  'amboseli-kilimanjaro-panorama',
  'Amboseli & Kilimanjaro Panorama',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'amboseli'),
  1950, 5, 8,
  'Five days with Africa''s greatest elephant herds beneath Kilimanjaro''s eternal snow cap.',
  ARRAY['Big-tusked elephant encounters','Observation Hill panoramic views','Enkongo Narok swamp at dawn','Maasai village experience','Kilimanjaro sunrise photography'],
  ARRAY['All park fees','All meals','4x4 game drive vehicle','Expert naturalist guide'],
  'Filling fast — August',
  false
),
(
  'serengeti-group-adventure',
  'Serengeti Group Adventure',
  (SELECT id FROM tiers WHERE slug = 'tribe'),
  (SELECT id FROM destinations WHERE slug = 'serengeti'),
  1100, 8, 12,
  'Eight days across the Serengeti and Ngorongoro with a legendary crew. The ultimate social safari.',
  ARRAY['Central Serengeti big cat country','Moru Kopjes & ancient rock art','Grumeti River hippos & crocodiles','Ngorongoro Crater descent','Group bush braai evenings'],
  ARRAY['All park & crater fees','All meals at camp','Shared 4x4 (max 7 per vehicle)','Driver-guide'],
  '4 spots remaining — November',
  true
),
(
  'samburu-collectors-safari',
  'Samburu Collector''s Safari',
  (SELECT id FROM tiers WHERE slug = 'sovereign'),
  (SELECT id FROM destinations WHERE slug = 'samburu'),
  8500, 5, 4,
  'The Samburu Special Five, camel-back safaris, and nocturnal drives from a private hilltop villa above the Ewaso River.',
  ARRAY['Samburu Special Five tracking','Private infinity-pool villa','Camel trekking with Samburu warriors','Full night game drives','Riverine walking safari'],
  ARRAY['Private charter flight','All park fees','All meals & drinks','Private vehicle & guide','Night drive permit'],
  '1 suite remaining — September',
  false
),
(
  'tsavo-red-elephant-escape',
  'Tsavo Red Elephant Budget Escape',
  (SELECT id FROM tiers WHERE slug = 'tribe'),
  (SELECT id FROM destinations WHERE slug = 'tsavo'),
  950, 4, 10,
  'Four days with Africa''s most dramatic elephants in the continent''s largest park. Maximum wild, minimum spend.',
  ARRAY['Famous red-dust elephant herds','Aruba Dam wildlife convergence','Lugard Falls on the Galana River','Yatta Plateau lava flow drive','Maneless Tsavo lions'],
  ARRAY['All park fees','All meals at camp','Shared 4x4','Driver-guide'],
  'Multiple departures available',
  false
);

-- Itinerary Days for Mara Private Immersion
INSERT INTO itinerary_days (tour_id, day_number, title, description, accommodation, destination_id, meals_included, activities) VALUES
(
  (SELECT id FROM tours WHERE slug = 'mara-private-immersion'), 1,
  'Arrival & Sundowner Ritual',
  'Met at Wilson Airport for a scenic 45-minute bush flight over the Rift Valley. Your private guide awaits at the airstrip with a chilled towel and fresh juice. Afternoon game drive through the golden savannah, arriving at Angama Mara in time for a champagne sundowner on the Escarpment as the sun melts into Tanzania.',
  'Angama Mara', (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  ARRAY['Dinner'], ARRAY['Private bush flight','Sundowner on the Escarpment','Evening game drive']
),
(
  (SELECT id FROM tours WHERE slug = 'mara-private-immersion'), 2,
  'Dawn Ballooning Over the Mara',
  'Rise at 5am for a pre-dawn transfer to the launch site. Float silently over lion prides and elephant herds as the Mara wakes below you — an hour of absolute silence broken only by the hiss of the burner. Land in the long grass for a champagne bush breakfast prepared by your personal chef. Afternoon: optional fly-camping on a private hill.',
  'Angama Mara', (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  ARRAY['Breakfast','Lunch','Dinner'], ARRAY['Private hot air balloon','Bush breakfast','Afternoon fly-camping option']
),
(
  (SELECT id FROM tours WHERE slug = 'mara-private-immersion'), 3,
  'Wildebeest Crossing, Front Row',
  'Strategic positioning at the Mara River banks with your dedicated naturalist and a picnic cooler. Witness 1.5 million wildebeest thunder toward the crocodile-filled crossing — nature''s most dramatic spectacle. Your private vehicle means you stay until the last animal crosses, without competing for position.',
  'Angama Mara', (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  ARRAY['Breakfast','Lunch','Dinner'], ARRAY['Migration river crossing','Crocodile watching','Picnic lunch on the riverbank']
),
(
  (SELECT id FROM tours WHERE slug = 'mara-private-immersion'), 4,
  'Maasai Community & Bead Ceremony',
  'A private guided walk to a local Maasai enkiama. Learn about cattle-herding, traditional medicine, and the warrior initiation process. Participate in a bead-making ceremony with the women of the community — your beaded bracelet tells a story older than the written word. Proceeds fund 12 education bursaries annually.',
  'Angama Mara', (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  ARRAY['Breakfast','Lunch','Dinner'], ARRAY['Maasai village walk','Bead-making ceremony','Cultural exchange lunch']
),
(
  (SELECT id FROM tours WHERE slug = 'mara-private-immersion'), 5,
  'Night Safari & Star Sleeping',
  'Exclusive nocturnal game drive with a specialist night guide — spot aardvarks, porcupines, servals, and civet cats that vanish with the daylight. Return to camp for a private telescopic stargazing session with a visiting astronomer. Choose to sleep under the Milky Way on the camp''s elevated rooftop deck.',
  'Angama Mara', (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  ARRAY['Breakfast','Lunch','Dinner'], ARRAY['Night game drive','Stargazing with astronomer','Optional rooftop sleeping']
),
(
  (SELECT id FROM tours WHERE slug = 'mara-private-immersion'), 6,
  'Cheetah Run & Big Cat Tracking',
  'The Mara hosts the world''s highest cheetah density per km². Today you track the resident Tano Bora coalition alongside a wildlife researcher — and contribute real data to their conservation project. Afternoon at leisure, with the option of a spa treatment using indigenous botanicals or a sunset yoga session on the Escarpment edge.',
  'Angama Mara', (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  ARRAY['Breakfast','Lunch','Dinner'], ARRAY['Cheetah research tracking','Conservation data collection','Optional spa or sunset yoga']
),
(
  (SELECT id FROM tours WHERE slug = 'mara-private-immersion'), 7,
  'Farewell Bush Breakfast & Departure',
  'A final 90-minute sunrise game drive — always the best light, always the most active hour. A bush breakfast is laid out in the long grass as the Mara awakens around you. Private charter flight back to Nairobi Wilson. On landing, your naturalist emails a personalised wildlife journal compiling every sighting from your seven days.',
  'Departure', (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  ARRAY['Breakfast'], ARRAY['Sunrise game drive','Bush breakfast','Private charter return flight']
);

-- Wildlife Sightings (for ticker)
INSERT INTO wildlife_sightings (animal, description, destination_id, spotted_at) VALUES
('Cheetah', 'Tano Bora cheetah coalition sprint spotted in Mara North conservancy', 
 (SELECT id FROM destinations WHERE slug = 'maasai-mara'), NOW() - INTERVAL '1 hour'),
('Elephant', 'Herd of 40+ elephants crossing the Amboseli floodplain toward Kilimanjaro',
 (SELECT id FROM destinations WHERE slug = 'amboseli'), NOW() - INTERVAL '30 minutes'),
('Lion', 'Serengeti pride of 8 lions feeding on wildebeest kill at Seronera',
 (SELECT id FROM destinations WHERE slug = 'serengeti'), NOW() - INTERVAL '2 hours'),
('Wildebeest', 'River crossing imminent — 3,000+ wildebeest massing at Mara River bank',
 (SELECT id FROM destinations WHERE slug = 'maasai-mara'), NOW() - INTERVAL '45 minutes'),
('Leopard', 'Leopard with fresh impala kill in acacia tree, Samburu riverine forest',
 (SELECT id FROM destinations WHERE slug = 'samburu'), NOW() - INTERVAL '3 hours'),
('Rhino', 'Black rhino mother and calf spotted on Ngorongoro crater floor',
 (SELECT id FROM destinations WHERE slug = 'ngorongoro'), NOW() - INTERVAL '90 minutes'),
('Wild Dog', 'African wild dog pack of 14 active and hunting, Laikipia plateau',
 (SELECT id FROM destinations WHERE slug = 'tsavo'), NOW() - INTERVAL '20 minutes'),
('Giraffe', 'Reticulated giraffe tower of 12 at sunset, Samburu watering hole',
 (SELECT id FROM destinations WHERE slug = 'samburu'), NOW() - INTERVAL '15 minutes');

-- ============================================================
-- DONE. Your Wildhaven database is ready.
-- Next steps:
-- 1. Go to Supabase Dashboard → SQL Editor → New Query
-- 2. Paste this entire file and click Run
-- 3. Check Table Editor to confirm all tables and seed data
-- 4. Copy your project URL and anon key into .env.local
-- ============================================================
