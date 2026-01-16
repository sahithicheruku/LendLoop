import Link from "next/link";
import ItemsClient from "../ItemsClient";
import type { Item } from "@/lib/types";

async function getBorrowedItems(): Promise<Item[]> {
  const res = await fetch("http://localhost:3000/api/items?status=BORROWED", {
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


