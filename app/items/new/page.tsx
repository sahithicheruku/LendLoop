"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  // Common categories for quick selection
  const commonCategories = [
    "Tools",
    "Sports & Outdoors",
    "Books",
    "Home & Garden",
    "Electronics",
    "Kitchen",
    "Other"
  ];

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/items"
            className="text-sm font-medium text-[#78716c] transition hover:text-[#d97706]"
          >
            ← Back to Available Items
          </Link>
        </div>

        {/* Page Title */}
        <div className="rounded-lg border-2 border-[#d97706] bg-gradient-to-br from-[#fef3c7] to-[#fed7aa] p-8 shadow-md">
          <div className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#92400e] mb-3">
            List an Item
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#78350f]">
            Share Something You Own
          </h1>
          <p className="mt-3 text-base text-[#92400e]">
            Add an item you're willing to lend to your community. It takes less than a minute!
          </p>
        </div>

        {/* Tips Card */}
        <div className="mt-6 rounded-lg border border-[#e7e5e4] bg-white p-6">
          <h2 className="text-sm font-bold text-[#2d1810]">💡 Quick Tips</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#57534e]">
            <li className="flex gap-2">
              <span className="text-[#d97706]">•</span>
              <span>Be specific with titles (e.g., "DeWalt Cordless Drill" vs "Drill")</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#d97706]">•</span>
              <span>Mention condition and any special notes in the description</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#d97706]">•</span>
              <span>Choose the most relevant category to help people find it</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-[#2d1810]">
              Item Title <span className="text-red-500">*</span>
            </label>
            <p className="mt-1 text-xs text-[#78716c]">
              What are you lending?
            </p>
            <input
              id="title"
              type="text"
              className="mt-2 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Bike Pump, Camping Tent, Electric Drill"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-[#2d1810]">
              Description <span className="text-red-500">*</span>
            </label>
            <p className="mt-1 text-xs text-[#78716c]">
              Add details about condition, pickup location, or usage notes
            </p>
            <textarea
              id="description"
              rows={4}
              className="mt-2 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Well-maintained cordless drill with 2 batteries. Great for home projects. Available for pickup in downtown area."
              required
            />
            <p className="mt-1 text-xs text-[#78716c]">
              {description.length}/500 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-[#2d1810]">
              Category <span className="text-red-500">*</span>
            </label>
            <p className="mt-1 text-xs text-[#78716c]">
              Select or type a custom category
            </p>
            
            {/* Quick select buttons */}
            <div className="mt-2 flex flex-wrap gap-2">
              {commonCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === cat
                      ? "bg-[#d97706] text-white"
                      : "border-2 border-[#e7e5e4] bg-white text-[#57534e] hover:border-[#d97706]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <input
              id="category"
              type="text"
              className="mt-3 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Or type your own category"
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md border-2 border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-[#d97706] px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[#b45309] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                "List Item"
              )}
            </button>

            <Link
              href="/items"
              className="rounded-md border-2 border-[#e7e5e4] bg-white px-6 py-3.5 text-base font-semibold text-[#2d1810] transition hover:border-[#78716c]"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Footer note */}
        <p className="mt-6 text-center text-sm text-[#78716c]">
          Your item will be immediately available for others to request
        </p>
      </div>
    </main>
  );
}