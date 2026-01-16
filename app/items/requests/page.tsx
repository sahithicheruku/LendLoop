import Link from "next/link";
import ItemsClient from "../ItemsClient";
import type { Item } from "@/lib/types";
import { headers } from "next/headers";

async function getRequestedItems(): Promise<Item[]> {
  const h = await headers();
  const host = h.get("host");

  // dev = http, production = https
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const base = `${protocol}://${host}`;

  const res = await fetch(`${base}/api/items?status=REQUESTED`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function RequestsPage() {
  const items = await getRequestedItems();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Requests</h1>
        <Link href="/items" className="rounded-md border px-3 py-2 text-sm">
          ← Back to Available
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-zinc-600">No requests yet.</p>
      ) : (
        <ItemsClient items={items} />
      )}
    </main>
  );
}







