-- Use a real wooden table image for table listings.
UPDATE "Item"
SET "imageUrl" = 'https://images.unsplash.com/photo-1688973722953-338b0eabd285?auto=format&fit=crop&w=900&q=80'
WHERE "status" = 'AVAILABLE'
  AND LOWER("title") ~ '(^| )table( |$)';
