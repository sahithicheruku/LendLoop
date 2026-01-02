"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  owner: {
    name: string;
  };
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Available Items</h1>

      {loading && <p>Loading items...</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-600">No items available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <h2 className="text-xl font-semibold">{item.title}</h2>

            <p className="text-sm text-gray-600 mt-1">
              {item.description}
            </p>

            <div className="text-sm text-gray-500 mt-2">
              Category: <span className="font-medium">{item.category}</span>
            </div>

            <div className="text-sm text-gray-500">
              Condition: <span className="font-medium">{item.condition}</span>
            </div>

            <div className="text-xs text-gray-400 mt-3">
              Owner: {item.owner?.name ?? "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
