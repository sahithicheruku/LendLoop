import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { BorrowRequestStatus, ItemCondition, ItemStatus } from "@prisma/client";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { createNotification } from "@/lib/notifications";
import { parseAvailabilityDate } from "@/lib/availability";

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

    if (action === "update") {
      if (item.ownerId !== session.user.id) return NextResponse.json({ ok: false, error: "Only the owner can edit this item" }, { status: 403 });
      const body = await req.json().catch(() => null);
      const title = typeof body?.title === "string" ? body.title.trim() : "";
      const category = typeof body?.category === "string" ? body.category.trim() : "";
      const description = typeof body?.description === "string" ? body.description.trim() : null;
      const city = typeof body?.city === "string" ? body.city.trim() || null : null;
      const region = typeof body?.region === "string" ? body.region.trim() || null : null;
      const condition = body?.condition ? Object.values(ItemCondition).find((value) => value === body.condition) ?? null : null;
      const availableFrom = parseAvailabilityDate(body?.availableFrom);
      const availableUntil = parseAvailabilityDate(body?.availableUntil, true);
      if (!title || !category || (body?.condition && !condition) || availableFrom === undefined || availableUntil === undefined || (availableFrom && availableUntil && availableUntil <= availableFrom)) return NextResponse.json({ ok: false, error: "Please provide valid item details and availability dates." }, { status: 400 });
      const hasApprovedBorrow = item.requests.some((request) => request.status === BorrowRequestStatus.APPROVED);
      if (hasApprovedBorrow && (availableFrom?.getTime() !== item.availableFrom?.getTime() || availableUntil?.getTime() !== item.availableUntil?.getTime())) return NextResponse.json({ ok: false, error: "Availability cannot change while this item is being borrowed." }, { status: 400 });
      const updated = await prisma.item.update({ where: { id }, data: { title, description, category, condition, city, region, availableFrom, availableUntil } });
      return NextResponse.json({ ok: true, item: updated }, { status: 200 });
    }

    if (action === "request") {
      const now = new Date();
      if (item.availableFrom && item.availableFrom > now) return NextResponse.json({ ok: false, error: "This item is not available yet." }, { status: 400 });
      if (item.availableUntil && item.availableUntil < now) return NextResponse.json({ ok: false, error: "This item's availability window has ended." }, { status: 400 });
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
      const requester = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true } });
      await createNotification({ userId: item.ownerId, type: "REQUEST_RECEIVED", title: "New borrow request", message: `${requester?.name ?? "Someone"} requested your ${item.title}.`, itemId: id, requestId: request.id });

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
      await createNotification({ userId: pending.requesterId, type: "REQUEST_APPROVED", title: "Request approved", message: `Your request for ${item.title} was approved.`, itemId: id, requestId: pending.id });

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
      await createNotification({ userId: item.ownerId, type: "ITEM_RETURNED", title: "Item returned", message: `Your ${item.title} was marked as returned.`, itemId: id, requestId: approved?.id });

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
      await createNotification({ userId: pending.requesterId, type: "REQUEST_DECLINED", title: "Request declined", message: `Your request for ${item.title} was declined.`, itemId: id, requestId: pending.id });
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
      await createNotification({ userId: item.ownerId, type: "REQUEST_CANCELLED", title: "Request cancelled", message: `A request for ${item.title} was cancelled.`, itemId: id, requestId: pending.id });

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
    const item = await prisma.item.findUnique({ where: { id }, select: { ownerId: true, status: true, requests: { where: { status: BorrowRequestStatus.APPROVED }, select: { id: true } }, images: { select: { storagePath: true } } } });
    if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    if (item.ownerId !== session.user.id) return NextResponse.json({ ok: false, error: "Only the owner can delete this item" }, { status: 403 });
    if (item.status === ItemStatus.BORROWED || item.requests.length) return NextResponse.json({ ok: false, error: "Borrowed items cannot be deleted until the active borrow is complete." }, { status: 400 });
    await prisma.item.delete({ where: { id } });
    if (item.images.length) {
      try {
        const { error } = await getSupabaseServerClient().storage.from("item-images").remove(item.images.map((image) => image.storagePath));
        if (error) throw error;
      } catch (storageError) {
        console.error("Storage cleanup failed:", storageError instanceof Error ? storageError.message : "unknown error");
        return NextResponse.json({ ok: false, error: "Item deleted, but image cleanup failed" }, { status: 502 });
      }
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}
