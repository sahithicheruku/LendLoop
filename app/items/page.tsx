import ItemsClient from "./ItemsClient";
import Link from "next/link";
import type { Item } from "@/lib/types";
import { headers } from "next/headers";

async function getItems(): Promise<Item[]> {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const base = `${protocol}://${host}`;

  const res = await fetch(`${base}/api/items?status=AVAILABLE`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header / Hero */}
        <div className="rounded-3xl border bg-white/70 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600">
                LendLoop • Community Lending
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
                Available Items
              </h1>
              <p className="mt-3 max-w-2xl text-base text-zinc-600">
                Browse items from the community. Request what you need, lend what you
                own, and reduce waste.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/items/new"
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                + Add Item
              </Link>

              <Link
                href="/items/requests"
                className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                My Requests
              </Link>

              <Link
                href="/items/borrowed"
                className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                Borrowed Items
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm text-zinc-500">Available now</div>
              <div className="mt-1 text-3xl font-bold text-zinc-900">
                {items.length}
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                Items you can request immediately
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm text-zinc-500">Tip</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">
                Add clear categories
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                Helps others find your items faster.
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm text-zinc-500">Safety</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">
                Meet in public
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                Prefer public locations for exchanges.
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">
              Browse ({items.length})
            </h2>
            <p className="text-sm text-zinc-500">
              Updated in real-time as requests happen
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border bg-white p-10 text-center">
              <p className="text-lg font-semibold text-zinc-900">
                No items available right now
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Be the first to add something for others to borrow.
              </p>
              <Link
                href="/items/new"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                + Add Item
              </Link>
            </div>
          ) : (
            <ItemsClient items={items} />
          )}
        </div>
      </div>
    </main>
  );
}

