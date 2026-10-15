import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  const session = await getAuthSession();
  if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, imageId } = await params;
  const image = await prisma.itemImage.findUnique({ where: { id: imageId }, select: { itemId: true, storagePath: true, item: { select: { ownerId: true } } } });
  if (!image || image.itemId !== id) return NextResponse.json({ error: "Image not found" }, { status: 404 });
  if (image.item.ownerId !== session.user.id) return NextResponse.json({ error: "Only the owner can remove images" }, { status: 403 });
  await prisma.itemImage.delete({ where: { id: imageId } });
  const { error } = await getSupabaseServerClient().storage.from("item-images").remove([image.storagePath]);
  if (error) console.error("Image storage cleanup failed:", error.message);
  return NextResponse.json({ ok: true });
}
