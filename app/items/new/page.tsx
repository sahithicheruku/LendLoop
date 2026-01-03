"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Failed to create item");
      return;
    }

    router.push("/items");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Add Item</h1>
      <p className="mt-2 text-zinc-600">List something you want to lend.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-md border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Bike Pump"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <input
            className="mt-1 w-full rounded-md border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <input
            className="mt-1 w-full rounded-md border p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Tools / Home / Sports"
            required
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
      </form>
    </div>
  );
}
