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
  const res = await fetch("http://localhost:3000/api/items", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-bold">Available Items</h1>
      <a
  href="/items/new"
  className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-white"
>
  + Add Item
</a>

      {items.length === 0 ? (
        <p className="mt-6 text-zinc-600">No items available.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <li key={it.id} className="rounded-xl border p-4">
  <div className="text-xs text-zinc-500">{it.category}</div>
  <div className="mt-1 text-lg font-semibold">{it.title}</div>

  {it.description ? (
    <p className="mt-2 text-sm text-zinc-600">{it.description}</p>
  ) : null}

  <button className="mt-4 rounded-md border px-3 py-2 text-sm hover:bg-zinc-50">
    Request to Borrow
  </button>
</li>

          ))}
        </ul>
      )}
    </main>
  );
}


