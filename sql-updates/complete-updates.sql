-- SUPABASE SQL EDITOR - Complete Updates
-- Run this script to:
-- 1. Link the two Tribe tier tours correctly
-- 2. Update the 10-Day tour description with destinations

-- Fix 1: Link "mara-midrange-3day" and "mara-nakuru-group-4day" to The Tribe tier
UPDATE tours
SET tier_id = (SELECT id FROM tiers WHERE slug = 'tribe' LIMIT 1)
WHERE slug IN ('mara-midrange-3day', 'mara-nakuru-group-4day');

-- Fix 2: Update 10-Day tour description to include destinations
UPDATE tours
SET short_desc = 'Nairobi → Amboseli → Tsavo E → Tsavo W → Nakuru → Naivasha → Mara'
WHERE slug = 'kenya-10day-7parks';
