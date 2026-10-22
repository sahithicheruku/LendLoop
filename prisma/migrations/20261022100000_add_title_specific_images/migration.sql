-- Use title-specific representative images where the listing is clear.
UPDATE "Item"
SET "imageUrl" = CASE
  WHEN LOWER("title") LIKE '%circular saw%' THEN 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%drill%' THEN 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%projector%' THEN 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%camera%' THEN 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%portable speaker%' THEN 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%tent%' THEN 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%cooler%' THEN 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%folding chair%' THEN 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") ~ '(^| )table( |$)' THEN 'https://images.unsplash.com/photo-1532372320572-a993f3f7f529?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%stand mixer%' THEN 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%blender%' OR LOWER("title") LIKE '%rice cooker%' THEN 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%air fryer%' THEN 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%guitar%' THEN 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%basketball%' THEN 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%soccer ball%' THEN 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%backpack%' THEN 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%suitcase%' OR LOWER("title") LIKE '%luggage%' THEN 'https://images.unsplash.com/photo-1565026057447-bc90a39d4e63?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%book%' OR LOWER("title") LIKE '%cookbook%' THEN 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%party light%' THEN 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'
  WHEN LOWER("title") LIKE '%air mattress%' THEN 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
  ELSE "imageUrl"
END
WHERE "status" = 'AVAILABLE';
