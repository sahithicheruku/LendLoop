import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { BorrowRequestStatus, ItemStatus, Prisma } from "@prisma/client";

const ALLOWED_STATUS = ["AVAILABLE", "REQUESTED", "BORROWED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUS)[number];

function parseStatus(value: string | null): AllowedStatus | null {
  if (!value) return null;
  const up = value.toUpperCase();
  return (ALLOWED_STATUS as readonly string[]).includes(up)
    ? (up as AllowedStatus)
    : null;
}

// GET /api/items?status=AVAILABLE|REQUESTED|BORROWED&scope=owned|incoming|borrowed
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = parseStatus(url.searchParams.get("status"));
    const scope = url.searchParams.get("scope");

    const session = await getAuthSession();
    const requesterId = session?.user.id;
    if ((scope === "owned" || scope === "incoming" || status === "BORROWED") && !requesterId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (scope !== null && !["owned", "incoming", "borrowed"].includes(scope)) {
      return NextResponse.json({ ok: false, error: "Invalid scope" }, { status: 400 });
    }
    const scopedUserId = requesterId ?? "";
    const where: Prisma.ItemWhereInput = scope === "owned"
      ? { ownerId: scopedUserId }
      : scope === "incoming"
        ? { ownerId: scopedUserId, requests: { some: { status: BorrowRequestStatus.PENDING } } }
        : status === "BORROWED"
          ? { status: ItemStatus.BORROWED, requests: { some: { requesterId: scopedUserId, status: BorrowRequestStatus.APPROVED } } }
          : status
            ? { status }
            : {};
    const items = await prisma.item.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        imageUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ...(scope === "owned" || scope === "incoming" ? { ownerId: true, requests: { include: { requester: { select: { id: true, name: true, email: true } } } } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    console.error("GET /api/items error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/items -> ALWAYS create AVAILABLE
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const title = String(body.title ?? "").trim();
    const category = String(body.category ?? "").trim();

    if (!title || !category) {
      return NextResponse.json(
        { ok: false, error: "title and category are required" },
        { status: 400 }
      );
    }

    const created = await prisma.item.create({
      data: {
        title,
        category,
        description: body.description ?? null,
        imageUrl: body.imageUrl ?? null,
        status: ItemStatus.AVAILABLE,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/items error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Create failed" },
      { status: 500 }
    );
  }
}
