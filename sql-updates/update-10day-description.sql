-- Update 10-Day Tour description to include destinations
UPDATE tours
SET short_desc = 'Nairobi → Amboseli → Tsavo E → Tsavo W → Nakuru → Naivasha → Mara'
WHERE slug = 'kenya-10day-7parks'
  AND title LIKE '%10-Day%'
  AND title LIKE '%7%parks%';
