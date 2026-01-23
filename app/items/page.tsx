import ItemsClient from "./ItemsClient";
import Link from "next/link";
import type { Item } from "@/lib/types";

export const dynamic = "force-dynamic"; // important

function getBaseUrl() {
  // Vercel provides this automatically in production/preview
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Your manual fallback
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  // Local fallback
  return "http://localhost:3000";
}

async function getItems(): Promise<Item[]> {
  const base = getBaseUrl();

  const res = await fetch(`${base}/api/items?status=AVAILABLE`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // Helpful debugging (will show in Vercel logs)
    console.error("GET /api/items failed:", res.status, await res.text());
    return [];
  }

  return res.json();
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-[#78716c] transition hover:text-[#d97706]"
          >
            ← Back to Home
          </Link>

          <div className="flex gap-3">
            <Link
              href="/items/requests"
              className="rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#2d1810] transition hover:border-[#d97706]"
            >
              My Requests
            </Link>
            <Link
              href="/items/borrowed"
              className="rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#2d1810] transition hover:border-[#d97706]"
            >
              Borrowed
            </Link>
            <Link
              href="/items/new"
              className="rounded-md bg-[#d97706] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#b45309]"
            >
              + Add Item
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="rounded-lg bg-white border border-[#e7e5e4] p-8 shadow-sm">
          <div>
            <div className="inline-block rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold text-[#92400e] mb-3">
              Browse Catalog
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1917]">
              Available Items
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[#57534e]">
              Browse items from your community. Found something you need? Send a
              request and coordinate pickup with the owner.
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#e7e5e4] bg-gradient-to-br from-[#fef3c7] to-white p-5">
              <div className="text-sm font-semibold text-[#78350f]">
                Available Now
              </div>
              <div className="mt-2 text-3xl font-extrabold text-[#92400e]">
                {items.length}
              </div>
              <div className="mt-1 text-sm text-[#78716c]">
                {items.length === 1 ? "item ready" : "items ready"} to borrow
              </div>
            </div>

            <div className="rounded-lg border border-[#e7e5e4] bg-white p-5">
              <div className="text-sm font-semibold text-[#57534e]">
                💡 Quick Tip
              </div>
              <div className="mt-2 text-base font-bold text-[#2d1810]">
                Check descriptions
              </div>
              <div className="mt-1 text-sm text-[#78716c]">
                Owners add pickup details & conditions
              </div>
            </div>

            <div className="rounded-lg border border-[#e7e5e4] bg-white p-5">
              <div className="text-sm font-semibold text-[#57534e]">
                🤝 Be Respectful
              </div>
              <div className="mt-2 text-base font-bold text-[#2d1810]">
                Return on time
              </div>
              <div className="mt-1 text-sm text-[#78716c]">
                Help keep the community thriving
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-[#1c1917]">
              Browse Items {items.length > 0 && `(${items.length})`}
            </h2>
            {items.length > 0 && (
              <p className="text-sm text-[#78716c]">Updated in real-time</p>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-[#e7e5e4] bg-white p-16 text-center">
              <div className="mx-auto max-w-sm">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-[#2d1810]">
                  No items available yet
                </h3>
                <p className="mt-3 text-sm text-[#78716c]">
                  Be the first to share something from your garage, closet, or
                  shed. Help build the community!
                </p>
                <Link
                  href="/items/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#d97706] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#b45309]"
                >
                  <span>+ List Your First Item</span>
                </Link>
              </div>
            </div>
          ) : (
            <ItemsClient items={items} />
          )}
        </div>
      </div>
    </main>
  );
}
