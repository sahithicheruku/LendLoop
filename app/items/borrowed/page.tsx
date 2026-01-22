import Link from "next/link";
import ItemsClient from "../ItemsClient";
import type { Item } from "@/lib/types";
import { headers } from "next/headers";

async function getBorrowedItems(): Promise<Item[]> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1")
    ? "http"
    : (h.get("x-forwarded-proto") ?? "http");

  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/api/items?status=BORROWED`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function BorrowedPage() {
  const items = await getBorrowedItems();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Borrowed Items</h1>
        <Link href="/items" className="rounded-md border px-3 py-2 text-sm">
          ← Back to Available
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-zinc-600">No borrowed items.</p>
      ) : (
        <ItemsClient items={items} />
      )}
    </main>
  );
}
