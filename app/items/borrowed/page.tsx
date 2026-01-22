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
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/items"
            className="text-sm font-medium text-[#78716c] transition hover:text-[#d97706]"
          >
            ← Back to Available Items
          </Link>
          
          <div className="flex gap-3">
            <Link
              href="/items/requests"
              className="rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#2d1810] transition hover:border-[#d97706]"
            >
              My Requests
            </Link>
            <Link
              href="/items/new"
              className="rounded-md bg-[#d97706] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#b45309]"
            >
              + Add Item
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="rounded-lg bg-gradient-to-br from-[#292524] to-[#44403c] p-8 text-white shadow-md">
          <div className="inline-block rounded-full bg-[#fbbf24] px-3 py-1 text-xs font-semibold text-[#78350f] mb-3">
            Currently Borrowed
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Items You're Borrowing
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#d6d3d1]">
            Keep track of what you've borrowed. Remember to return items on time to keep the community running smoothly.
          </p>
          
          {items.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#fef3c7] px-4 py-2 text-sm font-semibold text-[#78350f]">
              <span className="text-lg">📋</span>
              You have {items.length} {items.length === 1 ? 'item' : 'items'} borrowed
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="mt-10">
          {items.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-[#e7e5e4] bg-white p-16 text-center">
              <div className="mx-auto max-w-sm">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-[#2d1810]">
                  No borrowed items yet
                </h3>
                <p className="mt-3 text-sm text-[#78716c]">
                  When you request and receive items from others, they'll appear here. Start browsing to find what you need!
                </p>
                <Link
                  href="/items"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#d97706] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#b45309]"
                >
                  <span>Browse Available Items</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1c1917]">
                  Your Borrowed Items ({items.length})
                </h2>
                <p className="mt-2 text-sm text-[#78716c]">
                  Remember to coordinate return times with the owners
                </p>
              </div>
              <ItemsClient items={items} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
