-- Fix: Ensure "Tribe" tier tours are properly linked
-- First, find the tribe tier ID (typically uuid)
-- Then update the two tours to link to the tribe tier

-- Update tours to link to The Tribe tier
-- Note: Replace 'tribe-tier-uuid' with the actual UUID of The Tribe tier from your tiers table

UPDATE tours
SET tier_id = (SELECT id FROM tiers WHERE slug = 'tribe' LIMIT 1)
WHERE slug IN ('mara-midrange-3day', 'mara-nakuru-group-4day');
