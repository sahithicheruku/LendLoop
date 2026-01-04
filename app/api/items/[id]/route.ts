import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/items/[id]
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const item = await prisma.item.findUnique({ where: { id } });

  if (!item) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

// PATCH /api/items/[id]
// This is your "Request to Borrow" action
export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: {
        status: "REQUESTED",
        isAvailable: false,
      },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error: any) {
    // record not found
    if (error?.code === "P2025") {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    console.error("PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Request failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  try {
    await prisma.item.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    // Prisma "Record not found" -> treat as already deleted (success)
    if (error?.code === "P2025") {
      return NextResponse.json({ ok: true, alreadyDeleted: true });
    }

    console.error("DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Delete failed" },
      { status: 500 }
    );
  }
}

