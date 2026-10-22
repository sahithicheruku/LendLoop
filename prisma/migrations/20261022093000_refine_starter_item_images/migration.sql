-- Use more specific representative images for saw and table listings.
UPDATE "Item"
SET "imageUrl" = CASE
  WHEN LOWER("title") LIKE '%saw%' THEN 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80'
  ELSE 'https://images.unsplash.com/photo-1532372320572-a993f3f7f529?auto=format&fit=crop&w=900&q=80'
END
WHERE "status" = 'AVAILABLE'
  AND (LOWER("title") LIKE '%saw%' OR LOWER("title") ~ '(^| )table( |$)');
