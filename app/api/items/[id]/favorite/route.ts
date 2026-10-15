import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

async function getUserAndItem(req: Request, id: string) {
  const session = await getAuthSession();
  if (!session?.user.id) return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const item = await prisma.item.findUnique({ where: { id }, select: { id: true } });
  if (!item) return { response: NextResponse.json({ error: "Item not found" }, { status: 404 }) };
  return { userId: session.user.id };
}

export async function POST(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const result = await getUserAndItem(_req, id);
  if (result.response) return result.response;
  await prisma.favorite.upsert({ where: { userId_itemId: { userId: result.userId, itemId: id } }, update: {}, create: { userId: result.userId, itemId: id } });
  return NextResponse.json({ ok: true, saved: true }, { status: 200 });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const result = await getUserAndItem(_req, id);
  if (result.response) return result.response;
  await prisma.favorite.deleteMany({ where: { userId: result.userId, itemId: id } });
  return NextResponse.json({ ok: true, saved: false }, { status: 200 });
}
