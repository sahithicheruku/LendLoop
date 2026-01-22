"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Item } from "@/lib/types";

type Action = "request" | "approve" | "return" | "cancel";

export default function ItemsClient({ items }: { items: Item[] }) {
  const router = useRouter();

  const [list, setList] = useState<Item[]>(items);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => setList(items), [items]);

  async function patchItem(id: string, action: Action) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const text = await res.text(); // read raw first
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      console.error("PATCH failed:", { status: res.status, data });
      alert(`Update failed (${res.status})\n${JSON.stringify(data, null, 2)}`);
      return null;
    }

    return data;
  }

  function updateLocal(id: string, nextStatus: Item["status"], isAvailable: boolean) {
    setList((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status: nextStatus, isAvailable } : it
      )
    );
  }

  async function requestItem(id: string) {
    try {
      setBusyId(id);

      const data = await patchItem(id, "request");
      if (!data) return;

      // Local update so you see change instantly
      updateLocal(id, "REQUESTED", false);

      // On Available page, remove it (optional)
      setList((prev) => prev.filter((it) => it.id !== id));

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function approveBorrow(id: string) {
    try {
      setBusyId(id);

      const data = await patchItem(id, "approve");
      if (!data) return;

      // Local update (so you see it become BORROWED)
      updateLocal(id, "BORROWED", false);

      // On Requests page, remove it (so it disappears)
      setList((prev) => prev.filter((it) => it.id !== id));

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function cancelRequest(id: string) {
    try {
      setBusyId(id);

      const data = await patchItem(id, "cancel");
      if (!data) return;

      updateLocal(id, "AVAILABLE", true);

      // On Requests page, remove it
      setList((prev) => prev.filter((it) => it.id !== id));

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function returnItem(id: string) {
    try {
      setBusyId(id);

      const data = await patchItem(id, "return");
      if (!data) return;

      updateLocal(id, "AVAILABLE", true);

      // On Borrowed page, remove it
      setList((prev) => prev.filter((it) => it.id !== id));

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteItem(id: string) {
    const ok = confirm("Delete this item?");
    if (!ok) return;

    const toRestore = list.find((x) => x.id === id);
    setList((prev) => prev.filter((it) => it.id !== id));

    try {
      setBusyId(id);

      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        if (toRestore) setList((prev) => [toRestore, ...prev]);
        console.error("DELETE failed:", { status: res.status, data });
        alert(`Delete failed (${res.status})\n${JSON.stringify(data, null, 2)}`);
        return;
      }

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {list.map((it) => {
        const status = it.status ?? "AVAILABLE";
        const isBusy = busyId === it.id;

        return (
          <li key={it.id} className="rounded-xl border p-4">
            <div className="text-xs text-zinc-500">{it.category}</div>
            <div className="mt-1 text-lg font-semibold">{it.title}</div>

            {it.description ? (
              <p className="mt-2 text-sm text-zinc-600">{it.description}</p>
            ) : null}

            <div className="mt-2 text-xs font-medium text-blue-600">
              Status: {status}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {status === "AVAILABLE" ? (
                <button
                  onClick={() => requestItem(it.id)}
                  disabled={isBusy}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
                >
                  Request to Borrow
                </button>
              ) : null}

              {status === "REQUESTED" ? (
                <>
                  <button
                    onClick={() => approveBorrow(it.id)}
                    disabled={isBusy}
                    className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
                  >
                    Approve → Borrowed
                  </button>

                  <button
                    onClick={() => cancelRequest(it.id)}
                    disabled={isBusy}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
                  >
                    Cancel Request
                  </button>
                </>
              ) : null}

              {status === "BORROWED" ? (
                <button
                  onClick={() => returnItem(it.id)}
                  disabled={isBusy}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
                >
                  Mark as Returned
                </button>
              ) : null}

              <button
                onClick={() => deleteItem(it.id)}
                disabled={isBusy}
                className="rounded-md border border-red-500 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
