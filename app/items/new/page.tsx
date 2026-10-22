"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackLink from "@/app/components/BackLink";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function NewItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [condition, setCondition] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function useApproximateLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Approximate location is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationMessage("Approximate location added. Only city-level details are shown publicly.");
      },
      () => setLocationMessage("Location permission was unavailable. You can still list the item using city and region."),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    );
  }

  function selectImages(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files);
    if (selected.length > 3) return setError("Choose up to 3 images.");
    if (selected.some((file) => !ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE)) return setError("Images must be JPG, PNG, or WEBP files smaller than 5 MB.");
    setError(null);
    setImages(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
    setPreviews((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (availableFrom && availableUntil && availableUntil <= availableFrom) {
      setError("Available until must be after available from.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, city, region, latitude: coordinates?.latitude ?? null, longitude: coordinates?.longitude ?? null, availableFrom: availableFrom || null, availableUntil: availableUntil || null, condition: condition || null }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Failed to create item");
      return;
    }

    const created = await res.json();
    const itemId = created.item.id as string;
    if (images.length > 0) {
      try {
        const imageForm = new FormData();
        images.forEach((file) => imageForm.append("images", file));
        const imageResponse = await fetch(`/api/items/${itemId}/images/upload`, { method: "POST", body: imageForm });
        if (!imageResponse.ok) throw new Error("Images could not be saved.");
      } catch (uploadError) {
        await fetch(`/api/items/${itemId}`, { method: "DELETE" });
        setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
        setLoading(false);
        return;
      }
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
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#2d1810]">LendLoop</Link>
          <Link href="/items" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">Browse Items</Link>
        </header>
        <BackLink label="Back home" />
        <div className="mb-8 mt-2"><div className="text-xs font-semibold uppercase tracking-wide text-[#92400e]">List an item</div><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1c1917]">Share Something You Own</h1><p className="mt-2 text-[#78716c]">Add an item you&apos;re willing to lend to your community.</p></div>

        {/* Tips Card */}
        <div className="mt-6 rounded-lg border border-[#e7e5e4] bg-white p-6">
          <h2 className="text-sm font-bold text-[#2d1810]">Quick Tips</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#57534e]">
            <li className="flex gap-2">
              <span className="text-[#d97706]">•</span>
              <span>Be specific with titles (e.g., &quot;DeWalt Cordless Drill&quot; vs &quot;Drill&quot;)</span>
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

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="available-from" className="block text-sm font-bold text-[#2d1810]">Available from <span className="font-normal text-[#78716c]">(optional)</span></label>
              <input id="available-from" type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="mt-2 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20" />
            </div>
            <div>
              <label htmlFor="available-until" className="block text-sm font-bold text-[#2d1810]">Available until <span className="font-normal text-[#78716c]">(optional)</span></label>
              <input id="available-until" type="date" min={availableFrom || undefined} value={availableUntil} onChange={(e) => setAvailableUntil(e.target.value)} className="mt-2 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2d1810]" htmlFor="location">Approximate location</label>
            <p id="location-help" className="mt-1 text-xs text-[#78716c]">City and region are shown publicly. Exact coordinates are never displayed.</p>
            <button type="button" onClick={useApproximateLocation} aria-describedby="location-help" className="mt-3 rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-2.5 text-sm font-semibold text-[#2d1810] transition hover:border-[#d97706]">
              Use my approximate location
            </button>
            {locationMessage && <p id="location" role="status" className="mt-2 text-sm text-[#57534e]">{locationMessage}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-sm font-bold text-[#2d1810]">City <span className="font-normal text-[#78716c]">(optional)</span></label>
              <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Plano" className="mt-2 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20" />
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-bold text-[#2d1810]">State / Region <span className="font-normal text-[#78716c]">(optional)</span></label>
              <input id="region" type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g., TX" className="mt-2 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20" />
            </div>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-bold text-[#2d1810]">Condition <span className="font-normal text-[#78716c]">(optional)</span></label>
            <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-2 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-[#1c1917] focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20">
              <option value="">Select condition</option>
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like new</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
            </select>
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

          <div>
            <label htmlFor="images" className="block text-sm font-bold text-[#2d1810]">Item photos <span className="font-normal text-[#78716c]">(optional, up to 3)</span></label>
            <p className="mt-1 text-xs text-[#78716c]">JPG, PNG, or WEBP. Maximum 5 MB per image.</p>
            <input id="images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => selectImages(e.target.files)} className="mt-2 block w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-3 text-sm text-[#1c1917] file:mr-4 file:rounded-md file:border-0 file:bg-[#fef3c7] file:px-3 file:py-2 file:font-semibold file:text-[#92400e]" />
            {previews.length > 0 && <div className="mt-3 grid grid-cols-3 gap-3">{previews.map((preview, index) => <div key={preview} className="relative"><img src={preview} alt={`Selected item photo ${index + 1}`} className="h-24 w-full rounded-md object-cover" /><button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-[#2d1810] shadow">Remove</button></div>)}</div>}
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
