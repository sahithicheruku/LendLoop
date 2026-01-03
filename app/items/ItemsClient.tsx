"use client";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
};

export default function ItemsClient({ items }: { items: Item[] }) {
  async function requestItem(id: string) {
    await fetch(`/api/items/${id}/request`, {
      method: "POST",
    });
    window.location.reload();
  }

  async function deleteItem(id: string) {
    await fetch(`/api/items/${id}`, {
      method: "DELETE",
    });
    window.location.reload();
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl border p-4">
          <div className="text-xs text-zinc-500">{item.category}</div>
          <div className="mt-1 text-lg font-semibold">{item.title}</div>

          {item.description && (
            <p className="mt-2 text-sm text-zinc-600">
              {item.description}
            </p>
          )}

          {/* BUTTONS */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => requestItem(item.id)}
              className="rounded-md border px-3 py-2"
            >
              Request to Borrow
            </button>

            <button
              onClick={() => deleteItem(item.id)}
              className="rounded-md border border-red-500 text-red-600 px-3 py-2"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
