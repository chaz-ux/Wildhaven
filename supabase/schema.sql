-- ============================================================
-- ZAZU SAFARIS ERP — Supabase PostgreSQL Schema
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
 'Africa''s largest national park. Home to the famous red elephants and the legendary man-eating lions of Tsavo.'),
('lake-nakuru', 'Lake Nakuru', 'Kenya', -0.3031, 36.0800,
 ARRAY['June','July','August','September','October'],
 ARRAY['Rhino','Flamingo','Buffalo','Leopard'],
 'Famous for its rhino sanctuary and vast flocks of flamingo on the lake shores.'),
('hells-gate', 'Hell''s Gate', 'Kenya', -0.8967, 36.3167,
 ARRAY['January','February','June','July','August','September'],
 ARRAY['Cycling','Gorge','Geothermal','Wildlife'],
 'One of Kenya''s only parks where you can cycle and walk freely among wildlife through dramatic volcanic gorges.'),
('lake-naivasha', 'Lake Naivasha', 'Kenya', -0.7667, 36.3500,
 ARRAY['January','February','June','July','August','September'],
 ARRAY['Hippo','Giraffe','Birdlife','Boat Safari'],
 'A scenic freshwater lake in the Rift Valley. Boat trips, Crescent Island walks, and the dramatic Hell''s Gate gorge next door.'),
('taita-hills', 'Taita Hills & Salt Lick', 'Kenya', -3.4167, 38.3500,
 ARRAY['June','July','August','September','October'],
 ARRAY['Elephant','Buffalo','Zebra','Leopard','Waterbuck'],
 'A 113 sq km conservancy bordering Tsavo West. Home to the iconic Salt Lick Lodge, elevated on stilts above the wildlife corridors.'),
('laikipia', 'Laikipia & Ol Pejeta', 'Kenya', 0.0000, 36.9000,
 ARRAY['January','February','July','August','September','October'],
 ARRAY['Big Five','Black Rhino','Wild Dog','Cheetah'],
 'Kenya''s largest private conservation area. Ol Pejeta hosts the last northern white rhinos and one of the highest predator densities in East Africa.'),
('mombasa-coast', 'Mombasa & Diani Coast', 'Kenya', -4.0435, 39.6682,
 ARRAY['January','February','March','June','July','August','September','October'],
 ARRAY['Beach','Snorkelling','Diving','Swahili Culture','Marine Life'],
 'Kenya''s 536km Indian Ocean coastline. Diani Beach is the jewel — powder-white sand, warm water, and world-class dive sites on the coral reef.'),
('mount-kenya', 'Mount Kenya', 'Kenya', -0.1522, 37.3084,
 ARRAY['January','February','August','September'],
 ARRAY['Trekking','Elephant','Buffalo','Leopard','Bongo'],
 'Africa''s second highest mountain and a UNESCO World Heritage Site. Sacred to the Kikuyu people, rich in high-altitude wildlife and scenery.'),
('aberdare', 'Aberdare National Park', 'Kenya', -0.4000, 36.7000,
 ARRAY['June','July','August','September'],
 ARRAY['Black Rhino','Elephant','Lion','Leopard','Bongo','Waterfalls'],
-- Tours (referencing tier and destination slugs via subqueries)
INSERT INTO tours (slug, title, tier_id, destination_id, base_price, days_duration, max_group_size, short_desc, highlights, includes, scarcity_text, is_featured) VALUES
(
  'mara-luxury-ashnil',
  '4-Day Maasai Mara Luxury Safari',
  (SELECT id FROM tiers WHERE slug = 'sovereign'),
  (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  2744, 4, 6,
  'Stay at the prestigious Ashnil Mara Lodge. Daily game drives, Big Five sightings, sundowners on the open plains.',
  ARRAY['Ashnil Mara Lodge — full board','Daily private game drives','Big Five sightings','Sundowners on the open plains','Nairobi airport transfers'],
  ARRAY['Accommodation at Ashnil Mara Lodge','All meals','Private game drive vehicle','Park fees','Airport transfers'],
  'Limited dates — July & August',
  true
),
(
  'family-circuit-sopa',
  '7-Day Private Family Safari at Sopa Lodges',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'amboseli'),
  2672, 7, 8,
  'Kenya''s ultimate family circuit through Amboseli, Tsavo and the Maasai Mara, staying at the family-friendly Sopa Lodges.',
  ARRAY['3 iconic parks in one journey','Sopa Lodges throughout — family friendly','Elephants beneath Kilimanjaro at Amboseli','Red elephants of Tsavo East','Big Five at the Maasai Mara'],
  ARRAY['Accommodation at Sopa Lodges','All meals','Private 4x4 vehicle','All park fees','Airport transfers'],
  '3 vehicles available — August',
  true
),
(
  'mara-nakuru-hells-gate',
  '5-Day Mara, Nakuru & Hell''s Gate Safari',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  1568, 5, 8,
  'Rhinos at Nakuru, cycling through volcanic gorges at Hell''s Gate, then the Big Five at the Mara.',
  ARRAY['Rhino tracking at Lake Nakuru','Cycling inside Hell''s Gate Gorge','Big Five game drives at the Mara','Scenic Rift Valley route','Fully private vehicle throughout'],
  ARRAY['All accommodation','All meals','Private vehicle','Park & conservancy fees','Airport transfers'],
  'Popular — book 3 weeks ahead',
  true
),
(
  'rift-valley-naivasha',
  '5-Day Through the Rift Valley',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'lake-naivasha'),
  1420, 5, 8,
  'Lake Nakuru''s flamingos and rhinos, Lake Naivasha''s hippos by boat, and cycling the volcanic gorges of Hell''s Gate.',
  ARRAY['Lake Nakuru rhino & flamingo','Boat safari on Lake Naivasha','Cycling inside Hell''s Gate Gorge','Lake Elmentaita Serena Camp','Rift Valley escarpment viewpoints'],
  ARRAY['All accommodation','All meals','Private 4x4','Park fees','Airport transfers'],
  'Weekly departures available',
  false
),
(
  'kenya-classic-circuit',
  '7-Day Kenya Classic Safari',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'maasai-mara'),
  2190, 7, 8,
  'The definitive Kenya circuit — Amboseli, Tsavo, and the Maasai Mara in one seamless week-long journey.',
  ARRAY['Big Five across three iconic parks','Elephants beneath Kilimanjaro','Tsavo''s red dust elephant herds','Maasai Mara game drives','Expert driver-guide throughout'],
  ARRAY['All accommodation','All meals','Private 4x4','All park fees','Airport transfers'],
  'Popular — book 2 weeks ahead',
  true
),
(
  'mombasa-beach-safari',
  '8-Day Kenya Odyssey to Mombasa',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'mombasa-coast'),
  2480, 8, 8,
  'Safari through Kenya''s finest parks ending at the Indian Ocean — wildlife by day, sundowners on Diani Beach by night.',
  ARRAY['Maasai Mara Big Five safari','Amboseli beneath Kilimanjaro','Tsavo red elephant herds','Diani Beach finale','Snorkelling on coral reef'],
  ARRAY['All accommodation','All meals','Private 4x4','Park fees','Beach resort transfer'],
  '2 departures per week',
  true
),
(
  'taita-salt-lick',
  '5-Day Kilimanjaro to Mombasa via Taita Hills',
  (SELECT id FROM tiers WHERE slug = 'horizon'),
  (SELECT id FROM destinations WHERE slug = 'taita-hills'),
  1680, 5, 8,
  'Kilimanjaro views at Amboseli, the iconic Salt Lick Lodge on stilts in Taita Hills, then Mombasa''s warm Indian Ocean coast.',
  ARRAY['Amboseli elephants & Kilimanjaro backdrop','Night game viewing at Salt Lick Lodge','Taita Hills wildlife corridor','Tsavo East en route','Mombasa coast arrival'],
  ARRAY['All accommodation','All meals','Private 4x4','Park & conservancy fees','Transfers'],
  'Weekly departures',
  false
),
(
  'ol-pejeta-laikipia',
  '4-Day Laikipia & Ol Pejeta Conservancy',
  (SELECT id FROM tiers WHERE slug = 'sovereign'),
  (SELECT id FROM destinations WHERE slug = 'laikipia'),
  3200, 4, 4,
  'Africa''s most biodiverse conservancy — the last northern white rhinos, wild dog packs, and all of the Big Five in one private landscape.',
  ARRAY['Last northern white rhinos on earth','African wild dog tracking','Night game drives permitted','Ol Pejeta''s Big Five','Chimpanzee sanctuary visit'],
  ARRAY['All accommodation','All meals & drinks','Private conservancy vehicle','Conservation fees','Nairobi transfers'],
  'Limited availability — book early',
  false
);
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

-- Itinerary Days - simplified for multiple tours
-- Sample days for tours (guide structure, can be expanded per tour)

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
-- DONE. Your Zazu Safaris database is ready.
-- Next steps:
-- 1. Go to Supabase Dashboard → SQL Editor → New Query
-- 2. Paste this entire file and click Run
-- 3. Check Table Editor to confirm all tables and seed data
-- 4. Copy your project URL and anon key into .env.local
-- ============================================================
