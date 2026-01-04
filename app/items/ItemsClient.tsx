"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
  status?: string;
};

export default function ItemsClient({ items }: { items: Item[] }) {
  const router = useRouter();

  const [list, setList] = useState<Item[]>(items);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setList(items);
  }, [items]);

  async function requestItem(id: string) {
    try {
      setBusyId(id);

      const res = await fetch(`/api/items/${id}`, { method: "PATCH" });
      const text = await res.text().catch(() => "");

      if (!res.ok) {
        alert(`Request failed (${res.status})\n${text}`);
        return;
      }

      // ✅ Since this component is also used on /items (Available),
      // remove requested item immediately so it disappears from Available list
      setList((prev) => prev.filter((it) => it.id !== id));

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteItem(id: string) {
    const ok = confirm("Delete this item?");
    if (!ok) return;

    // ✅ store the item so we can rollback if needed
    const toRestore = list.find((x) => x.id === id);

    // ✅ remove from UI immediately
    setList((prev) => prev.filter((it) => it.id !== id));

    try {
      setBusyId(id);

      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      const text = await res.text().catch(() => "");

      if (!res.ok) {
        // ✅ rollback safely
        if (toRestore) setList((prev) => [toRestore, ...prev]);
        alert(`Delete failed (${res.status})\n${text}`);
        return;
      }

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {list.map((it) => (
        <li key={it.id} className="rounded-xl border p-4">
          <div className="text-xs text-zinc-500">{it.category}</div>
          <div className="mt-1 text-lg font-semibold">{it.title}</div>

          {it.description ? (
            <p className="mt-2 text-sm text-zinc-600">{it.description}</p>
          ) : null}

          <div className="mt-4 flex gap-2">
           {it.status === "AVAILABLE" ? (
  <button
    onClick={() => requestItem(it.id)}
    disabled={busyId === it.id}
    className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
  >
    Request to Borrow
  </button>
) : (
  <span className="rounded-md border px-3 py-2 text-sm text-zinc-500">
    {it.status}
  </span>
)}


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
