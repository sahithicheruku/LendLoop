-- Add the listing metadata used by the current Prisma schema and item API.
-- These changes are nullable so existing items remain valid.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ItemCondition') THEN
    CREATE TYPE "ItemCondition" AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR');
  END IF;
END $$;

ALTER TABLE "Item"
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "region" TEXT,
  ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "availableFrom" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "availableUntil" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "condition" "ItemCondition";
