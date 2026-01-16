import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/items/:id -> mark as REQUESTED
export async function PATCH(_req: Request, { params }: Ctx) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: { status: "REQUESTED", isAvailable: false },
    });

    return NextResponse.json({ ok: true, item: updated }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Request failed" },
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

