import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getIdFromUrl(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1]; // last segment
}

export async function DELETE(
  req: Request,
  ctx: { params?: { id?: string } }
) {
  const id = ctx?.params?.id ?? getIdFromUrl(req);

  console.log("DELETE ctx.params =", ctx?.params);
  console.log("DELETE id =", id);

  if (!id || id === "items") {
    return NextResponse.json(
      { ok: false, error: "Missing id (params/url)", params: ctx?.params, url: req.url },
      { status: 400 }
    );
  }

  try {
    await prisma.item.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE prisma error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  ctx: { params?: { id?: string } }
) {
  const id = ctx?.params?.id ?? getIdFromUrl(req);

  console.log("PATCH ctx.params =", ctx?.params);
  console.log("PATCH id =", id);

  if (!id || id === "items") {
    return NextResponse.json(
      { ok: false, error: "Missing id (params/url)", params: ctx?.params, url: req.url },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: { isAvailable: false },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH prisma error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

