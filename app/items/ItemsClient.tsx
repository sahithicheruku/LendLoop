"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
};

export default function ItemsClient({ items }: { items: Item[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function requestItem(id: string) {
    try {
      setLoadingId(id);

      // OPTION A (recommended): PATCH /api/items/[id]
      const res = await fetch(`/api/items/${id}`, { method: "PATCH" });

      // If you REALLY have /request route, switch to OPTION B below
      // const res = await fetch(`/api/items/${id}/request`, { method: "POST" });

      if (!res.ok) throw new Error("Request failed");
      router.refresh();
    } catch (e) {
      alert("Failed to request item.");
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteItem(id: string) {
    const ok = confirm("Delete this item?");
    if (!ok) return;

    try {
      setLoadingId(id);
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch (e) {
      alert("Failed to delete item.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl border p-4">
          <div className="text-xs text-zinc-500">{item.category}</div>
          <div className="mt-1 text-lg font-semibold">{item.title}</div>

          {item.description && (
            <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
          )}

          {/* BUTTONS */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => requestItem(item.id)}
              disabled={loadingId === item.id || !item.isAvailable}
              className="rounded-md border px-3 py-2"
            >
              {item.isAvailable ? "Request to Borrow" : "Not Available"}
            </button>

            <button
              onClick={() => deleteItem(item.id)}
              disabled={loadingId === item.id}
              className="rounded-md border border-red-500 px-3 py-2 text-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
