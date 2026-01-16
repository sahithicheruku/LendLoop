import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUS = ["AVAILABLE", "REQUESTED", "BORROWED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUS)[number];

function parseStatus(value: string | null): AllowedStatus | null {
  if (!value) return null;
  const up = value.toUpperCase();
  return (ALLOWED_STATUS as readonly string[]).includes(up)
    ? (up as AllowedStatus)
    : null;
}

// GET /api/items?status=AVAILABLE|REQUESTED|BORROWED
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = parseStatus(url.searchParams.get("status"));

    const items = await prisma.item.findMany({
      where: status ? { status } : {},
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
        status: "AVAILABLE",
        isAvailable: true,
      },
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/items error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Create failed" },
      { status: 500 }
    );
  }
}

