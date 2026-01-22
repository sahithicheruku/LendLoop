import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/items/:id
// Body: { action: "request" | "approve" | "return" | "cancel" }
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  let action: string | null = null;
  try {
    const body = await req.json().catch(() => null);
    action = body?.action ?? null;
  } catch {
    action = null;
  }

  if (!action) {
    return NextResponse.json(
      { ok: false, error: "Missing action" },
      { status: 400 }
    );
  }

  try {
    // Fetch current item so we can validate transitions
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    if (action === "request") {
      // AVAILABLE -> REQUESTED
      if (item.status !== "AVAILABLE") {
        return NextResponse.json(
          { ok: false, error: `Cannot request when status=${item.status}` },
          { status: 400 }
        );
      }

      const updated = await prisma.item.update({
        where: { id },
        data: { status: "REQUESTED", isAvailable: false },
      });

      return NextResponse.json({ ok: true, item: updated }, { status: 200 });
    }

    if (action === "approve") {
      // REQUESTED -> BORROWED
      if (item.status !== "REQUESTED") {
        return NextResponse.json(
          { ok: false, error: `Cannot approve when status=${item.status}` },
          { status: 400 }
        );
      }

      const updated = await prisma.item.update({
        where: { id },
        data: { status: "BORROWED", isAvailable: false },
      });

      return NextResponse.json({ ok: true, item: updated }, { status: 200 });
    }

    if (action === "return") {
      // BORROWED -> AVAILABLE
      if (item.status !== "BORROWED") {
        return NextResponse.json(
          { ok: false, error: `Cannot return when status=${item.status}` },
          { status: 400 }
        );
      }

      const updated = await prisma.item.update({
        where: { id },
        data: { status: "AVAILABLE", isAvailable: true },
      });

      return NextResponse.json({ ok: true, item: updated }, { status: 200 });
    }

    if (action === "cancel") {
      // REQUESTED -> AVAILABLE
      if (item.status !== "REQUESTED") {
        return NextResponse.json(
          { ok: false, error: `Cannot cancel when status=${item.status}` },
          { status: 400 }
        );
      }

      const updated = await prisma.item.update({
        where: { id },
        data: { status: "AVAILABLE", isAvailable: true },
      });

      return NextResponse.json({ ok: true, item: updated }, { status: 200 });
    }

    return NextResponse.json(
      { ok: false, error: "Unknown action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Update failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/:id
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  try {
    await prisma.item.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ ok: true, alreadyDeleted: true }, { status: 200 });
    }
    console.error("DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Delete failed" },
      { status: 500 }
    );
  }
}


