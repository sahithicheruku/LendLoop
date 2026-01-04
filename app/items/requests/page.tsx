import Link from "next/link";
import ItemsClient from "../ItemsClient";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
  status: string;
};

async function getRequestedItems(): Promise<Item[]> {
  const res = await fetch("http://localhost:3000/api/items?status=REQUESTED", {
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

