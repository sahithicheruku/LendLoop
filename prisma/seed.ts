import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) OPTIONAL: clear existing items to avoid duplicates every time
  // Comment this line if you don't want to delete existing items.
  await prisma.item.deleteMany();

  // 2) Create 120 demo items
  const categories = ["TOOLS", "BOOKS", "CAMPING", "KITCHEN", "ELECTRONICS", "SPORTS"];

  const items = Array.from({ length: 120 }, (_, i) => ({
    title: `Demo Item ${i + 1}`,
    description: `Portfolio demo item #${i + 1}`,
    category: categories[i % categories.length], // change if your category isn't an enum like this
    imageUrl: null,
    isAvailable: true,
    status: "AVAILABLE", // change if your Status enum uses different values
  }));

  await prisma.item.createMany({ data: items });

  console.log("✅ Inserted 120 demo items");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
