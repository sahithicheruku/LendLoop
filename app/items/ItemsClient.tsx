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
  const [busyId, setBusyId] = useState<string | null>(null);

  async function requestItem(id: string) {
    try {
      setBusyId(id);
      const res = await fetch(`/api/items/${id}`, { method: "PATCH" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        alert(`Request failed (${res.status})\n${text}`);
        return;
      }

      window.location.reload(); // strong refresh
    } finally {
      setBusyId(null);
    }
  }

  async function deleteItem(id: string) {
    const ok = confirm("Delete this item?");
    if (!ok) return;

    try {
      setBusyId(id);

      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        alert(`Delete failed (${res.status})\n${text}`);
        return;
      }

      // strongest refresh to avoid caching issues
      window.location.reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.id} className="rounded-xl border p-4">
          <div className="text-xs text-zinc-500">{it.category}</div>
          <div className="mt-1 text-lg font-semibold">{it.title}</div>

          {it.description ? (
            <p className="mt-2 text-sm text-zinc-600">{it.description}</p>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => requestItem(it.id)}
              disabled={!it.isAvailable || busyId === it.id}
              className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
            >
              {it.isAvailable ? "Request to Borrow" : "Not Available"}
            </button>

            <button
              onClick={() => deleteItem(it.id)}
              disabled={busyId === it.id}
              className="rounded-md border border-red-500 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
