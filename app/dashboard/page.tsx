type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  status: string;
  isAvailable: boolean;
  createdAt: string;
};

async function getRequestedItems(): Promise<Item[]> {
  const res = await fetch("http://localhost:3000/api/items?status=REQUESTED", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  const requested = await getRequestedItems();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-2 text-zinc-600">Borrow requests and approvals</p>

      {requested.length === 0 ? (
        <p className="mt-8 text-zinc-600">No borrow requests yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {requested.map((it) => (
            <div key={it.id} className="rounded-xl border p-4">
              <div className="text-xs text-zinc-500">{it.category}</div>
              <div className="mt-1 text-lg font-semibold">{it.title}</div>
              {it.description ? (
                <p className="mt-2 text-sm text-zinc-600">{it.description}</p>
              ) : null}
              <div className="mt-3 text-sm">
                Status: <b>{it.status}</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
