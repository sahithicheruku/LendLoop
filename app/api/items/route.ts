import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(2),
  imageUrl: z.string().url().optional(),
});

export async function GET() {
  const items = await prisma.item.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = CreateItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const item = await prisma.item.create({ data: parsed.data });
  return NextResponse.json(item, { status: 201 });
}

