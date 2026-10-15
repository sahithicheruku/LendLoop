import { NextResponse } from "next/server";
import { BorrowRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const request = await prisma.borrowRequest.findUnique({ where: { id }, include: { review: true, item: { select: { id: true, title: true, ownerId: true } } } });
  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  if (request.requesterId !== session.user.id) return NextResponse.json({ error: "Only the borrower can review this request" }, { status: 403 });
  if (request.status !== BorrowRequestStatus.RETURNED) return NextResponse.json({ error: "Reviews are available after an item is returned" }, { status: 403 });
  if (request.review) return NextResponse.json({ error: "This request has already been reviewed" }, { status: 409 });

  const body = await req.json().catch(() => ({}));
  const rating = body && typeof body === "object" && "rating" in body ? body.rating : undefined;
  const comment = body && typeof body === "object" && "comment" in body && typeof body.comment === "string" ? body.comment.trim() : "";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be an integer from 1 to 5" }, { status: 400 });
  if (comment.length > 500) return NextResponse.json({ error: "Comment must be 500 characters or fewer" }, { status: 400 });

  const review = await prisma.review.create({ data: { requestId: id, reviewerId: session.user.id, itemId: request.itemId, rating, comment: comment || null } });
  await createNotification({ userId: request.item.ownerId, type: "NEW_REVIEW", title: "New review", message: `Your ${request.item.title} received a new review.`, itemId: request.itemId, requestId: id });
  return NextResponse.json({ ok: true, review }, { status: 201 });
}
