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

        {/* Page Header */}
        <div className="rounded-lg border-2 border-[#d97706] bg-gradient-to-br from-[#fef3c7] to-[#fed7aa] p-8 shadow-md">
          <div className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#92400e] mb-3">
            Pending Requests
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#78350f]">
            My Requests
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#92400e]">
            Track items you've requested. Owners will review and approve your requests. You'll coordinate pickup details once approved.
          </p>
          
          {items.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#78350f] shadow-sm">
              <span className="text-lg">⏳</span>
              {items.length} pending {items.length === 1 ? 'request' : 'requests'}
            </div>
          )}
        </div>

        {/* Info Cards */}
        {items.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#e7e5e4] bg-white p-5">
              <div className="text-sm font-semibold text-[#57534e]">⚡ What happens next?</div>
              <p className="mt-2 text-sm text-[#78716c]">
                The item owner will review your request and either approve or decline it. Be patient!
              </p>
            </div>
            
            <div className="rounded-lg border border-[#e7e5e4] bg-white p-5">
              <div className="text-sm font-semibold text-[#57534e]">💬 Communication</div>
              <p className="mt-2 text-sm text-[#78716c]">
                Once approved, coordinate pickup details directly with the owner via their contact info.
              </p>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="mt-10">
          {items.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-[#e7e5e4] bg-white p-16 text-center">
              <div className="mx-auto max-w-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#2d1810]">
                  No pending requests
                </h3>
                <p className="mt-3 text-sm text-[#78716c]">
                  You haven't requested any items yet. Browse the catalog to find tools, books, or gear you need!
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
                  Pending Requests ({items.length})
                </h2>
                <p className="mt-2 text-sm text-[#78716c]">
                  Waiting for owner approval
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







