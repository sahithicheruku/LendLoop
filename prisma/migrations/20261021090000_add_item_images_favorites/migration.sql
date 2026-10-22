CREATE TABLE IF NOT EXISTS "ItemImage" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ItemImage_itemId_storagePath_key"
  ON "ItemImage"("itemId", "storagePath");
CREATE INDEX IF NOT EXISTS "ItemImage_itemId_position_idx"
  ON "ItemImage"("itemId", "position");
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_itemId_key"
  ON "Favorite"("userId", "itemId");
CREATE INDEX IF NOT EXISTS "Favorite_userId_createdAt_idx"
  ON "Favorite"("userId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ItemImage_itemId_fkey') THEN
    ALTER TABLE "ItemImage"
      ADD CONSTRAINT "ItemImage_itemId_fkey"
      FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Favorite_userId_fkey') THEN
    ALTER TABLE "Favorite"
      ADD CONSTRAINT "Favorite_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Favorite_itemId_fkey') THEN
    ALTER TABLE "Favorite"
      ADD CONSTRAINT "Favorite_itemId_fkey"
      FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
