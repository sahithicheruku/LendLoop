import { BorrowRequestStatus, ItemStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const demoUsers = ["Avery Stone", "Blake Rowan", "Casey North", "Drew Ellis", "Emery Vale", "Finley Hart", "Gray Morgan", "Harper Reed"];

const itemData: [string, string, string, ItemStatus][] = [
  ["Cordless Drill", "Tools", "18V drill with two batteries and a compact carrying case.", ItemStatus.AVAILABLE],
  ["Pressure Washer", "Tools", "Electric pressure washer for patios, decks, and bikes.", ItemStatus.REQUESTED],
  ["Circular Saw", "Tools", "Reliable seven-and-a-quarter-inch saw with a spare blade.", ItemStatus.AVAILABLE],
  ["Tool Kit", "Tools", "All-purpose household kit with sockets, bits, pliers, and a level.", ItemStatus.AVAILABLE],
  ["Extension Ladder", "Tools", "Sturdy 20-foot extension ladder for outdoor maintenance.", ItemStatus.BORROWED],
  ["Electric Sander", "Tools", "Orbital sander with dust collection for weekend woodworking.", ItemStatus.AVAILABLE],
  ["Projector", "Electronics", "Bright 1080p projector with HDMI cable for movie nights.", ItemStatus.AVAILABLE],
  ["DSLR Camera", "Electronics", "Entry-level DSLR with an 18–55mm lens and padded bag.", ItemStatus.BORROWED],
  ["Portable Speaker", "Electronics", "Water-resistant Bluetooth speaker with a long-lasting battery.", ItemStatus.AVAILABLE],
  ["Tripod", "Electronics", "Adjustable aluminum tripod for cameras, phones, or projectors.", ItemStatus.AVAILABLE],
  ["Power Bank", "Electronics", "High-capacity USB-C battery pack with charging cables.", ItemStatus.AVAILABLE],
  ["Two-Person Tent", "Outdoor", "Weather-ready tent with rainfly, footprint, and easy-pitch poles.", ItemStatus.AVAILABLE],
  ["Camping Stove", "Outdoor", "Compact propane camp stove with wind guards and carry case.", ItemStatus.REQUESTED],
  ["Air Mattress", "Outdoor", "Queen air mattress with a built-in pump for overnight guests.", ItemStatus.AVAILABLE],
  ["Folding Chairs", "Outdoor", "Set of four padded folding chairs for picnics and gatherings.", ItemStatus.AVAILABLE],
  ["Cooler", "Outdoor", "Large insulated cooler with wheels and a drain plug.", ItemStatus.AVAILABLE],
  ["Blender", "Kitchen", "Powerful countertop blender for smoothies, soups, and sauces.", ItemStatus.AVAILABLE],
  ["Sewing Machine", "Kitchen", "Beginner-friendly sewing machine with several presser feet.", ItemStatus.BORROWED],
  ["Stand Mixer", "Kitchen", "Stainless stand mixer with dough hook, whisk, and paddle.", ItemStatus.AVAILABLE],
  ["Bicycle Pump", "Sports", "Floor pump with a pressure gauge and Presta/Schrader heads.", ItemStatus.AVAILABLE],
  ["Tennis Rackets", "Sports", "Pair of lightweight rackets with a fresh can of tennis balls.", ItemStatus.REQUESTED],
  ["Yoga Mats", "Sports", "Two washable, non-slip mats for home workouts or classes.", ItemStatus.AVAILABLE],
  ["Board Games", "Books", "Family game bundle with strategy and party favorites.", ItemStatus.AVAILABLE],
  ["Cookbook Collection", "Books", "Curated set of weeknight, baking, and vegetarian cookbooks.", ItemStatus.AVAILABLE],
  ["Carpet Cleaner", "Home", "Portable carpet and upholstery cleaner with an extra solution tank.", ItemStatus.AVAILABLE],
  ["Leaf Blower", "Home", "Quiet cordless leaf blower with charger and one battery.", ItemStatus.AVAILABLE],
  ["Folding Work Table", "Home", "Portable six-foot work table that folds flat for storage.", ItemStatus.AVAILABLE],
];

async function seedSynthetic() {
  await prisma.borrowRequest.deleteMany();
  await prisma.item.deleteMany();

  const users = await Promise.all(demoUsers.map((name) => {
    const email = `${name.toLowerCase().replace(" ", ".")}@demo.invalid`;
    return prisma.user.upsert({ where: { email }, update: { name }, create: { name, email } });
  }));

  const items = await Promise.all(itemData.map(([title, category, description, status], index) => prisma.item.create({
    data: { title, category, description, status, ownerId: users[index % users.length].id },
  })));

  const requests: [number, number, BorrowRequestStatus][] = [
    [1, 2, BorrowRequestStatus.PENDING], [4, 0, BorrowRequestStatus.APPROVED],
    [7, 1, BorrowRequestStatus.APPROVED], [17, 3, BorrowRequestStatus.APPROVED],
    [2, 5, BorrowRequestStatus.DECLINED], [9, 6, BorrowRequestStatus.CANCELLED],
    [12, 7, BorrowRequestStatus.PENDING], [20, 0, BorrowRequestStatus.PENDING],
    [22, 4, BorrowRequestStatus.DECLINED], [24, 6, BorrowRequestStatus.RETURNED],
  ];
  for (const [itemIndex, requesterIndex, status] of requests) {
    const item = items[itemIndex];
    const requester = users[requesterIndex];
    if (item.ownerId === requester.id) throw new Error(`Invalid self-request for ${item.title}`);
    await prisma.borrowRequest.create({ data: { itemId: item.id, requesterId: requester.id, status } });
  }
  console.log(`Seeded ${users.length} demo users, ${items.length} items, and ${requests.length} requests.`);
}

async function seedForRealUsers(emails: string[]) {
  const realUsers = await Promise.all(emails.map((email) => prisma.user.findUnique({ where: { email } })));
  const missing = realUsers.map((user, index) => user ? null : emails[index]).filter((email): email is string => email !== null);
  if (missing.length) throw new Error(`No User found for DEMO_USER_EMAILS: ${missing.join(", ")}`);

  const syntheticUsers = await Promise.all(demoUsers.map((name) => {
    const syntheticEmail = `${name.toLowerCase().replace(" ", ".")}@demo.invalid`;
    return prisma.user.upsert({ where: { email: syntheticEmail }, update: { name }, create: { name, email: syntheticEmail } });
  }));
  const syntheticIds = syntheticUsers.map((user) => user.id);
  const ownedTitles = ["Workshop Drill", "Projector", "Camping Tent", "Folding Chairs", "Stand Mixer", "DSLR Camera"];

  // Remove only previous demo inventory and requests involving these demo users.
  await prisma.borrowRequest.deleteMany({ where: { OR: [
    { requesterId: { in: realUsers.map((user) => user!.id) } },
    { item: { ownerId: { in: syntheticIds } } },
    { item: { ownerId: { in: realUsers.map((user) => user!.id), }, title: { in: ownedTitles } } },
  ] } });
  await prisma.item.deleteMany({ where: { ownerId: { in: syntheticIds } } });
  await prisma.item.deleteMany({ where: { ownerId: { in: realUsers.map((user) => user!.id) }, title: { in: ownedTitles } } });

  for (const [userIndex, realUser] of realUsers.entries()) {
    const owned = await Promise.all(([
      ["Workshop Drill", "Tools", "Cordless drill with two batteries for weekend repairs.", ItemStatus.AVAILABLE],
      ["Projector", "Electronics", "Bright 1080p projector with an HDMI cable for movie nights.", ItemStatus.REQUESTED],
      ["Camping Tent", "Outdoor", "Two-person tent with rainfly and a simple setup.", ItemStatus.AVAILABLE],
      ["Folding Chairs", "Outdoor", "Set of four padded chairs for gatherings and picnics.", ItemStatus.REQUESTED],
      ["Stand Mixer", "Kitchen", "Stainless mixer with dough hook, whisk, and paddle.", ItemStatus.AVAILABLE],
      ["DSLR Camera", "Electronics", "Entry-level DSLR with an 18–55mm lens and padded bag.", ItemStatus.BORROWED],
    ] as [string, string, string, ItemStatus][]).map(([title, category, description, status]) => prisma.item.create({ data: { title, category, description, status, ownerId: realUser!.id } })));
    const shared = await Promise.all([
      ["Circular Saw", "Tools", "Reliable saw with a spare blade for home projects."],
      ["Portable Speaker", "Electronics", "Water-resistant Bluetooth speaker with a long-lasting battery."],
    ].map(([title, category, description]) => prisma.item.create({ data: { title: `${title} (${userIndex + 1})`, category, description, ownerId: syntheticUsers[userIndex % syntheticUsers.length].id } })));
    const requestData = [
      [owned[1], syntheticUsers[(userIndex + 0) % syntheticUsers.length], BorrowRequestStatus.PENDING],
      [owned[3], syntheticUsers[(userIndex + 1) % syntheticUsers.length], BorrowRequestStatus.PENDING],
      [shared[0], realUser!, BorrowRequestStatus.PENDING],
      [shared[1], realUser!, BorrowRequestStatus.DECLINED],
      [owned[5], syntheticUsers[(userIndex + 2) % syntheticUsers.length], BorrowRequestStatus.APPROVED],
      [owned[0], syntheticUsers[(userIndex + 3) % syntheticUsers.length], BorrowRequestStatus.RETURNED],
      [owned[2], syntheticUsers[(userIndex + 4) % syntheticUsers.length], BorrowRequestStatus.CANCELLED],
    ] as const;
    for (const [item, requester, status] of requestData) {
      if (item.ownerId === requester.id) throw new Error(`Invalid self-request for ${item.title}`);
      await prisma.borrowRequest.create({ data: { itemId: item.id, requesterId: requester.id, status } });
    }
    console.log(`Seeded demo data for ${realUser!.email}: ${owned.length + shared.length} items, ${requestData.length} requests.`);
  }
}

async function main() {
  const emails = (process.env.DEMO_USER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
    .filter((email, index, list) => list.indexOf(email) === index);
  if (emails.length) return seedForRealUsers(emails);
  return seedSynthetic();
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
