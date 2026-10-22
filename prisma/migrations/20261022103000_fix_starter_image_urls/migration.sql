-- Replace invalid image sources used by a few starter listings.
UPDATE "Item"
SET "imageUrl" = CASE
  WHEN LOWER("title") ~ '(^| )table( |$)' THEN 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%tool kit%' OR LOWER("title") LIKE '%socket set%' OR LOWER("title") LIKE '%tool box%' THEN 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%suitcase%' OR LOWER("title") LIKE '%luggage%' THEN 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%garden hose%' OR LOWER("title") LIKE '%leaf blower%' THEN 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80'
  ELSE "imageUrl"
END
WHERE "status" = 'AVAILABLE'
  AND (LOWER("title") ~ '(^| )table( |$)' OR LOWER("title") LIKE '%tool kit%' OR LOWER("title") LIKE '%socket set%' OR LOWER("title") LIKE '%tool box%' OR LOWER("title") LIKE '%suitcase%' OR LOWER("title") LIKE '%luggage%' OR LOWER("title") LIKE '%garden hose%' OR LOWER("title") LIKE '%leaf blower%');
