import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.item.update({
      where: { id: params.id },
      data: { isAvailable: false },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("PATCH /api/items/[id] failed:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "PATCH failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.item.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/items/[id] failed:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "DELETE failed" },
      { status: 500 }
    );
  }
}
