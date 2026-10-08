import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { BorrowRequestStatus, ItemStatus } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/items/:id
// Body: { action: "request" | "approve" | "decline" | "return" | "cancel" }
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAuthSession();
  if (!session?.user.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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
    const item = await prisma.item.findUnique({ where: { id }, include: { requests: true } });
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
      if (item.ownerId === session.user.id) {
        return NextResponse.json({ ok: false, error: "You cannot request your own item" }, { status: 403 });
      }

      const request = await prisma.borrowRequest.create({
        data: { itemId: id, requesterId: session.user.id },
      });
      const updated = await prisma.item.update({ where: { id }, data: { status: ItemStatus.REQUESTED } });

      return NextResponse.json({ ok: true, item: updated, request }, { status: 200 });
    }

    if (action === "approve") {
      // REQUESTED -> BORROWED
      if (item.status !== "REQUESTED") {
        return NextResponse.json(
          { ok: false, error: `Cannot approve when status=${item.status}` },
          { status: 400 }
        );
      }
      if (item.ownerId !== session.user.id) return NextResponse.json({ ok: false, error: "Only the owner can approve requests" }, { status: 403 });
      const pending = item.requests.find((request) => request.status === BorrowRequestStatus.PENDING);
      if (!pending) return NextResponse.json({ ok: false, error: "No pending request" }, { status: 400 });

      const updated = await prisma.item.update({
        where: { id },
        data: { status: ItemStatus.BORROWED, requests: { update: { where: { id: pending.id }, data: { status: BorrowRequestStatus.APPROVED } } } },
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
      const approved = item.requests.find((request) => request.status === BorrowRequestStatus.APPROVED);
      if (item.ownerId !== session.user.id && approved?.requesterId !== session.user.id) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 });

      const updated = await prisma.item.update({
        where: { id },
        data: { status: ItemStatus.AVAILABLE, requests: { updateMany: { where: { status: BorrowRequestStatus.APPROVED }, data: { status: BorrowRequestStatus.RETURNED } } } },
      });

      return NextResponse.json({ ok: true, item: updated }, { status: 200 });
    }

    if (action === "decline") {
      if (item.status !== ItemStatus.REQUESTED) {
        return NextResponse.json({ ok: false, error: `Cannot decline when status=${item.status}` }, { status: 400 });
      }
      if (item.ownerId !== session.user.id) {
        return NextResponse.json({ ok: false, error: "Only the owner can decline requests" }, { status: 403 });
      }
      const pending = item.requests.find((request) => request.status === BorrowRequestStatus.PENDING);
      if (!pending) return NextResponse.json({ ok: false, error: "No pending request" }, { status: 400 });
      const updated = await prisma.item.update({
        where: { id },
        data: { status: ItemStatus.AVAILABLE, requests: { update: { where: { id: pending.id }, data: { status: BorrowRequestStatus.DECLINED } } } },
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
      const pending = item.requests.find((request) => request.status === BorrowRequestStatus.PENDING);
      if (!pending || pending.requesterId !== session.user.id) return NextResponse.json({ ok: false, error: "Only the requester can cancel this request" }, { status: 403 });

      const updated = await prisma.item.update({
        where: { id },
        data: { status: ItemStatus.AVAILABLE, requests: { update: { where: { id: pending.id }, data: { status: BorrowRequestStatus.CANCELLED } } } },
      });

      return NextResponse.json({ ok: true, item: updated }, { status: 200 });
    }

    return NextResponse.json(
      { ok: false, error: "Unknown action" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/:id
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAuthSession();
  if (!session?.user.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  try {
    const item = await prisma.item.findUnique({ where: { id }, select: { ownerId: true } });
    if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    if (item.ownerId !== session.user.id) return NextResponse.json({ ok: false, error: "Only the owner can delete this item" }, { status: 403 });
    await prisma.item.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}
