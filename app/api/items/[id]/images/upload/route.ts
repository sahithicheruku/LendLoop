import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const session = await getAuthSession();
  if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    select: { ownerId: true, images: { select: { position: true } } },
  });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  if (item.ownerId !== session.user.id) return NextResponse.json({ error: "Only the owner can add images" }, { status: 403 });

  const form = await req.formData();
  const files = form.getAll("images").filter((value): value is File => value instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
  if (item.images.length + files.length > 3) return NextResponse.json({ error: "An item can have up to 3 images" }, { status: 400 });
  if (files.some((file) => file.size === 0 || !ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE)) {
    return NextResponse.json({ error: "Images must be non-empty JPG, PNG, or WEBP files smaller than 5 MB" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const firstPosition = item.images.reduce((max, image) => Math.max(max, image.position), -1) + 1;
  const uploaded: { url: string; storagePath: string; position: number }[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
      const storagePath = `${session.user.id}/${id}/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("item-images").upload(storagePath, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type,
        upsert: false,
      });
      if (upload.error) throw upload.error;
      const { data } = supabase.storage.from("item-images").getPublicUrl(storagePath);
      uploaded.push({ url: data.publicUrl, storagePath, position: firstPosition + index });
    }

    await prisma.itemImage.createMany({ data: uploaded.map((image) => ({ ...image, itemId: id })) });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (uploaded.length) await supabase.storage.from("item-images").remove(uploaded.map((image) => image.storagePath));
    console.error("POST /api/items/:id/images/upload error:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
