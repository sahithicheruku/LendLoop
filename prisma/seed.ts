import { BorrowRequestStatus, ItemStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const demoUsers = ["Avery Stone", "Blake Rowan", "Casey North", "Drew Ellis", "Emery Vale", "Finley Hart", "Gray Morgan", "Harper Reed", "Indigo Lane", "Jordan West", "Kai Mercer", "Logan Brooks"];

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
  ["Garden Hose", "Garden", "Flexible 50-foot hose with adjustable spray nozzle.", ItemStatus.AVAILABLE],
  ["Hedge Trimmer", "Garden", "Cordless hedge trimmer with charger and safety guard.", ItemStatus.BORROWED],
  ["Picnic Basket", "Outdoor", "Insulated picnic basket with reusable plates and cutlery.", ItemStatus.AVAILABLE],
  ["Kayak Paddle", "Outdoor", "Lightweight adjustable paddle for weekend lake trips.", ItemStatus.REQUESTED],
  ["Acoustic Guitar", "Music", "Steel-string acoustic guitar with a soft case and tuner.", ItemStatus.BORROWED],
  ["Portable Microphone", "Music", "USB microphone for recording, calls, or karaoke.", ItemStatus.AVAILABLE],
  ["Travel Backpack", "Travel", "Carry-on backpack with padded laptop sleeve and organizer pockets.", ItemStatus.AVAILABLE],
  ["Luggage Set", "Travel", "Three-piece spinner luggage set with expandable compartments.", ItemStatus.REQUESTED],
  ["Sewing Kit", "Home", "Compact sewing kit with thread, needles, scissors, and buttons.", ItemStatus.AVAILABLE],
  ["Instant Camera", "Electronics", "Easy-to-use instant camera with a protective case.", ItemStatus.AVAILABLE],
  ["Rice Cooker", "Kitchen", "Five-cup rice cooker with steaming basket and measuring cup.", ItemStatus.AVAILABLE],
  ["Air Fryer", "Kitchen", "Compact air fryer with a removable nonstick basket.", ItemStatus.AVAILABLE],
  ["Soccer Ball", "Sports", "Match-size soccer ball with hand pump and spare needles.", ItemStatus.AVAILABLE],
  ["Basketball Hoop", "Sports", "Portable adjustable hoop with weighted base.", ItemStatus.BORROWED],
  ["Bike Helmet", "Sports", "Adjustable helmet with vents and removable padding.", ItemStatus.AVAILABLE],
  ["Hand Vacuum", "Home", "Cordless hand vacuum for quick cleanups and car interiors.", ItemStatus.AVAILABLE],
  ["Paint Sprayer", "Tools", "Electric paint sprayer for furniture and small renovation projects.", ItemStatus.AVAILABLE],
  ["Picnic Blanket", "Outdoor", "Water-resistant blanket that folds into a carrying tote.", ItemStatus.AVAILABLE],
  ["Stud Finder", "Tools", "Digital stud finder with deep-scan mode for hanging shelves safely.", ItemStatus.AVAILABLE],
  ["Socket Set", "Tools", "Metric and SAE socket set with ratchet and organized case.", ItemStatus.AVAILABLE],
  ["Sleeping Bags", "Outdoor", "Pair of three-season sleeping bags rated for cool nights.", ItemStatus.AVAILABLE],
  ["Food Processor", "Kitchen", "Multi-function food processor with slicing and shredding discs.", ItemStatus.AVAILABLE],
  ["Steam Mop", "Home", "Lightweight steam mop for sealed floors and quick cleanups.", ItemStatus.AVAILABLE],
  ["Lawn Spreader", "Garden", "Push spreader for grass seed, fertilizer, and winter salt.", ItemStatus.AVAILABLE],
  ["Basketball", "Sports", "Indoor/outdoor basketball with a pump and spare valve needles.", ItemStatus.AVAILABLE],
  ["Acoustic Guitar", "Music", "Steel-string guitar with soft case, tuner, and spare picks.", ItemStatus.BORROWED],
  ["Keyboard", "Music", "Portable keyboard with stand, sustain pedal, and power adapter.", ItemStatus.AVAILABLE],
  ["Microphone", "Music", "Dynamic microphone with stand and cable for events or recording.", ItemStatus.REQUESTED],
  ["Suitcase", "Travel", "Medium spinner suitcase with expandable storage and TSA lock.", ItemStatus.AVAILABLE],
  ["Travel Adapter", "Travel", "Universal travel adapter with USB-A and USB-C charging ports.", ItemStatus.AVAILABLE],
  ["Folding Table", "Party & Events", "Six-foot folding table for dinners, markets, or craft projects.", ItemStatus.AVAILABLE],
  ["Party Lights", "Party & Events", "String lights with warm bulbs and several indoor modes.", ItemStatus.AVAILABLE],
  ["Pop-up Canopy", "Party & Events", "10-by-10-foot canopy with sidewalls and wheeled carry bag.", ItemStatus.AVAILABLE],
  ["Tool Box", "Tools", "Lockable tool box with removable tray and deep storage compartment.", ItemStatus.AVAILABLE],
  ["Shop Vacuum", "Tools", "Wet/dry shop vacuum with hose attachments for workshop cleanup.", ItemStatus.AVAILABLE],
  ["Hand Truck", "Home", "Folding hand truck rated for moving boxes and small appliances.", ItemStatus.AVAILABLE],
  ["Portable Fan", "Home", "Rechargeable portable fan with quiet overnight setting.", ItemStatus.AVAILABLE],
  ["Extension Cords", "Tools", "Bundle of outdoor-rated extension cords in several lengths.", ItemStatus.AVAILABLE],
  ["Camera Lens", "Photography", "Portrait lens compatible with common DSLR camera mounts.", ItemStatus.BORROWED],
  ["Ring Light", "Photography", "Adjustable LED ring light with phone holder and tripod stand.", ItemStatus.AVAILABLE],
  ["Binoculars", "Photography", "Compact binoculars for birdwatching, travel, and outdoor events.", ItemStatus.AVAILABLE],
  ["Beach Umbrella", "Outdoor", "Large tilting beach umbrella with carry sleeve and sand anchor.", ItemStatus.AVAILABLE],
  ["Bookshelf Speaker Set", "Electronics", "Compact stereo speakers for a desk or small living room.", ItemStatus.AVAILABLE],
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
    [28, 1, BorrowRequestStatus.APPROVED], [30, 2, BorrowRequestStatus.PENDING],
    [31, 3, BorrowRequestStatus.APPROVED], [34, 5, BorrowRequestStatus.PENDING],
    [40, 6, BorrowRequestStatus.APPROVED], [43, 7, BorrowRequestStatus.DECLINED],
    [35, 8, BorrowRequestStatus.CANCELLED], [36, 9, BorrowRequestStatus.RETURNED],
    [52, 0, BorrowRequestStatus.APPROVED], [54, 1, BorrowRequestStatus.PENDING],
    [65, 2, BorrowRequestStatus.APPROVED], [66, 3, BorrowRequestStatus.DECLINED],
    [67, 4, BorrowRequestStatus.CANCELLED], [68, 5, BorrowRequestStatus.RETURNED],
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
  const ownedTitles = ["Workshop Drill", "Projector", "Camping Tent", "Folding Chairs", "Stand Mixer", "DSLR Camera", "Tool Cart", "Camping Cooler"];

  // Remove only previous demo inventory and requests involving these demo users.
  await prisma.borrowRequest.deleteMany({ where: { OR: [
    { requesterId: { in: realUsers.map((user) => user!.id) } },
    { item: { ownerId: { in: syntheticIds } } },
    { item: { ownerId: { in: realUsers.map((user) => user!.id), }, title: { in: ownedTitles } } },
  ] } });
  await prisma.item.deleteMany({ where: { ownerId: { in: syntheticIds } } });
  await prisma.item.deleteMany({ where: { ownerId: { in: realUsers.map((user) => user!.id) }, title: { in: ownedTitles } } });

  const catalog = await Promise.all(itemData.slice(0, 62).map(([title, category, description, status], index) => prisma.item.create({
    data: { title, category, description, status, ownerId: syntheticUsers[index % syntheticUsers.length].id },
  })));
  const catalogRequests: [number, BorrowRequestStatus][] = [
    [1, BorrowRequestStatus.PENDING], [4, BorrowRequestStatus.APPROVED], [7, BorrowRequestStatus.APPROVED],
    [12, BorrowRequestStatus.PENDING], [17, BorrowRequestStatus.APPROVED], [20, BorrowRequestStatus.PENDING],
    [28, BorrowRequestStatus.APPROVED], [30, BorrowRequestStatus.PENDING], [31, BorrowRequestStatus.APPROVED],
    [34, BorrowRequestStatus.PENDING], [40, BorrowRequestStatus.APPROVED], [52, BorrowRequestStatus.APPROVED],
    [54, BorrowRequestStatus.PENDING], [56, BorrowRequestStatus.DECLINED], [58, BorrowRequestStatus.CANCELLED],
  ];
  for (const [itemIndex, status] of catalogRequests) {
    const item = catalog[itemIndex];
    const requester = syntheticUsers[(itemIndex + 1) % syntheticUsers.length];
    await prisma.borrowRequest.create({ data: { itemId: item.id, requesterId: requester.id, status } });
  }

  for (const [userIndex, realUser] of realUsers.entries()) {
    const owned = await Promise.all(([
      ["Workshop Drill", "Tools", "Cordless drill with two batteries for weekend repairs.", ItemStatus.AVAILABLE],
      ["Projector", "Electronics", "Bright 1080p projector with an HDMI cable for movie nights.", ItemStatus.REQUESTED],
      ["Camping Tent", "Outdoor", "Two-person tent with rainfly and a simple setup.", ItemStatus.AVAILABLE],
      ["Folding Chairs", "Outdoor", "Set of four padded chairs for gatherings and picnics.", ItemStatus.REQUESTED],
      ["Stand Mixer", "Kitchen", "Stainless mixer with dough hook, whisk, and paddle.", ItemStatus.AVAILABLE],
      ["DSLR Camera", "Electronics", "Entry-level DSLR with an 18–55mm lens and padded bag.", ItemStatus.BORROWED],
      ["Tool Cart", "Tools", "Rolling tool cart with drawers for organizing household projects.", ItemStatus.REQUESTED],
      ["Camping Cooler", "Outdoor", "Large insulated cooler with wheels for day trips and camping.", ItemStatus.BORROWED],
    ] as [string, string, string, ItemStatus][]).map(([title, category, description, status]) => prisma.item.create({ data: { title, category, description, status, ownerId: realUser!.id } })));
    const shared = await Promise.all([
      ["Circular Saw", "Tools", "Reliable saw with a spare blade for home projects."],
      ["Portable Speaker", "Electronics", "Water-resistant Bluetooth speaker with a long-lasting battery."],
      ["Travel Backpack", "Travel", "Carry-on backpack with a padded laptop sleeve."]
    ].map(([title, category, description]) => prisma.item.create({ data: { title: `${title} (${userIndex + 1})`, category, description, ownerId: syntheticUsers[userIndex % syntheticUsers.length].id } })));
    const requestData = [
      [owned[1], syntheticUsers[(userIndex + 0) % syntheticUsers.length], BorrowRequestStatus.PENDING],
      [owned[3], syntheticUsers[(userIndex + 1) % syntheticUsers.length], BorrowRequestStatus.PENDING],
      [owned[6], syntheticUsers[(userIndex + 2) % syntheticUsers.length], BorrowRequestStatus.PENDING],
      [shared[0], realUser!, BorrowRequestStatus.PENDING],
      [shared[1], realUser!, BorrowRequestStatus.DECLINED],
      [shared[2], realUser!, BorrowRequestStatus.CANCELLED],
      [owned[5], syntheticUsers[(userIndex + 3) % syntheticUsers.length], BorrowRequestStatus.APPROVED],
      [owned[7], syntheticUsers[(userIndex + 4) % syntheticUsers.length], BorrowRequestStatus.APPROVED],
      [owned[0], syntheticUsers[(userIndex + 5) % syntheticUsers.length], BorrowRequestStatus.RETURNED],
      [owned[2], syntheticUsers[(userIndex + 6) % syntheticUsers.length], BorrowRequestStatus.CANCELLED],
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
