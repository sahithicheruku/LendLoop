import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { z } from "zod";

const CreateItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  category: z.string().min(2),
  condition: z.string().min(2),
});

export async function GET() {
  const items = await prisma.item.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
    include: { owner: true },
  });

  return NextResponse.json(items);
}

// TEMP: demo owner (we’ll add real auth in Phase 2)
const DEMO_OWNER_EMAIL = "demo@lendloop.com";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = CreateItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const owner = await prisma.user.upsert({
    where: { email: DEMO_OWNER_EMAIL },
    update: {},
    create: { email: DEMO_OWNER_EMAIL, name: "Demo Owner" },
  });

  const item = await prisma.item.create({
    data: {
      ...parsed.data,
      ownerId: owner.id,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
