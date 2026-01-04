import ItemsClient from "./ItemsClient";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
};

async function getItems(): Promise<Item[]> {
  const res = await fetch("http://localhost:3000/api/items?available=true", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-bold">Available Items</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/items/new"
          className="inline-block rounded-md bg-black px-4 py-2 text-white"
        >
          + Add Item
        </Link>

        <Link
          href="/items/requests"
          className="rounded-md border px-3 py-2 text-sm"
        >
          My Requests
        </Link>

        <Link
          href="/items/borrowed"
          className="rounded-md border px-3 py-2 text-sm"
        >
          Borrowed Items
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-zinc-600">No items available.</p>
      ) : (
        <ItemsClient items={items} />
      )}
    </main>
  );
}

