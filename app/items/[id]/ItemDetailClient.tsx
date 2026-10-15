"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { distanceInMiles, formatDistance } from "@/lib/distance";

type Image = { id: string; url: string };
type Detail = { id: string; title: string; status: string; ownerId: string; ownerName: string | null; category: string; description: string | null; condition: string | null; city: string | null; region: string | null; isFavorited: boolean; images: Image[]; imageUrl: string | null; requestStatus: string | null; requestId: string | null; canRequest: boolean; availabilityMessage: string | null; reviewCount: number; averageRating: number | null; distance: string | null; approximateLatitude: number | null; approximateLongitude: number | null };

export default function ItemDetailClient({ item, signedIn, currentUserId }: { item: Detail; signedIn: boolean; currentUserId?: string }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [saved, setSaved] = useState(item.isFavorited);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewerLocation, setViewerLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const isOwner = currentUserId === item.ownerId;
  const image = item.images[selectedImage]?.url ?? item.imageUrl;
  const distance = viewerLocation && item.approximateLatitude !== null && item.approximateLongitude !== null ? formatDistance(distanceInMiles(viewerLocation.latitude, viewerLocation.longitude, item.approximateLatitude, item.approximateLongitude)) : item.distance;

  async function action(action: "request" | "cancel" | "return") {
    setBusy(true); setError(null);
    const response = await fetch(`/api/items/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    if (!response.ok) { const data = await response.json().catch(() => ({})); setError(data.error ?? "Action failed"); setBusy(false); return; }
    router.refresh(); setBusy(false);
  }

  async function toggleFavorite() {
    const next = !saved; setSaved(next);
    const response = await fetch(`/api/items/${item.id}/favorite`, { method: next ? "POST" : "DELETE" });
    if (!response.ok) { setSaved(!next); setError("Could not update saved items."); }
  }

  async function deleteItem() {
    setBusy(true);
    const response = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
    if (!response.ok) { setError("Could not delete this item."); setBusy(false); return; }
    router.push("/items");
  }

  return <>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
      <section aria-label="Item images"><div className="flex min-h-96 items-center justify-center rounded-lg border border-[#e7e5e4] bg-white p-4">{image ? <img src={image} alt={`${item.title} image ${selectedImage + 1}`} className="max-h-[30rem] w-full rounded-md object-contain" /> : <div className="text-7xl" aria-label={`${item.title} placeholder image`}>📦</div>}</div>{item.images.length > 1 && <div className="mt-3 flex gap-3" aria-label="Choose item image">{item.images.map((thumbnail, index) => <button key={thumbnail.id} type="button" onClick={() => setSelectedImage(index)} aria-label={`Show image ${index + 1}`} aria-pressed={selectedImage === index} className={`h-20 w-20 rounded-md border-2 p-1 focus:outline-none focus:ring-2 focus:ring-[#d97706] ${selectedImage === index ? "border-[#d97706]" : "border-[#e7e5e4]"}`}><img src={thumbnail.url} alt="" className="h-full w-full rounded object-cover" /></button>)}</div>}</section>
      <section><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#92400e]">{item.status === "AVAILABLE" ? "Available" : item.status === "REQUESTED" ? "Pending request" : "Currently borrowed"}</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1c1917]">{item.title}</h1></div>{signedIn && !isOwner && <button type="button" onClick={toggleFavorite} aria-pressed={saved} className="rounded-md border-2 border-[#e7e5e4] px-3 py-2 text-sm font-semibold text-[#2d1810] focus:outline-none focus:ring-2 focus:ring-[#d97706]">{saved ? "Saved" : "Save"}</button>}</div>
        <div className="mt-5 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-[#f5f5f4] px-3 py-1 font-semibold text-[#57534e]">{item.category}</span><span className="rounded-full bg-[#f5f5f4] px-3 py-1 font-semibold capitalize text-[#57534e]">{item.condition?.toLowerCase().replace("_", " ")}</span></div>
        <div className="mt-5 flex items-center gap-2 text-[#92400e]" aria-label={`${item.averageRating ? item.averageRating.toFixed(1) : "No"} out of 5 stars, ${item.reviewCount} reviews`}>★ {item.averageRating ? item.averageRating.toFixed(1) : "No rating"} <span className="text-sm text-[#78716c]">({item.reviewCount} {item.reviewCount === 1 ? "review" : "reviews"})</span></div>
        <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-[#57534e]">{item.description || "No description provided."}</p><dl className="mt-6 space-y-3 text-sm"><div><dt className="font-semibold text-[#2d1810]">Owner</dt><dd className="text-[#57534e]">{item.ownerName || "Community member"}</dd></div><div><dt className="font-semibold text-[#2d1810]">Location</dt><dd className="text-[#57534e]">{[item.city, item.region].filter(Boolean).join(", ") || "Location not provided"}</dd></div><div><dt className="font-semibold text-[#2d1810]">Availability</dt><dd className="text-[#57534e]">{item.availabilityMessage || "Available now"}</dd></div>{distance && <div><dt className="font-semibold text-[#2d1810]">Approximate distance</dt><dd className="text-[#57534e]">{distance}</dd></div>}</dl>
        {item.approximateLatitude !== null && item.approximateLongitude !== null && <button type="button" onClick={() => navigator.geolocation?.getCurrentPosition(({ coords }) => setViewerLocation({ latitude: coords.latitude, longitude: coords.longitude }), () => setError("Location permission was unavailable."))} className="mt-4 text-sm font-semibold text-[#92400e] underline focus:outline-none focus:ring-2 focus:ring-[#d97706]">Use my location for an approximate distance</button>}
        {error && <p role="alert" className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <div className="mt-7 flex flex-wrap gap-3">{!signedIn ? <Link href={`/signin?callbackUrl=/items/${item.id}`} className="rounded-md bg-[#2d1810] px-5 py-3 text-sm font-semibold text-white">Sign in to request</Link> : isOwner ? <><Link href={`/items/${item.id}/edit`} className="rounded-md bg-[#2d1810] px-5 py-3 text-sm font-semibold text-white">Edit item</Link><button type="button" onClick={() => setConfirmDelete(true)} disabled={busy || item.status === "BORROWED"} className="rounded-md border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-50">{item.status === "BORROWED" ? "Currently borrowed" : "Delete item"}</button></> : item.requestStatus === "PENDING" ? <><span className="rounded-md bg-[#fef3c7] px-5 py-3 text-sm font-semibold text-[#78350f]">Pending</span><button type="button" onClick={() => action("cancel")} disabled={busy} className="rounded-md border-2 border-[#e7e5e4] px-5 py-3 text-sm font-semibold text-[#2d1810] disabled:opacity-50">Cancel</button></> : item.requestStatus === "APPROVED" || item.status === "BORROWED" && item.requestStatus === "APPROVED" ? <button type="button" onClick={() => action("return")} disabled={busy} className="rounded-md bg-[#d97706] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Returning..." : "Return item"}</button> : item.canRequest ? <button type="button" onClick={() => action("request")} disabled={busy} className="rounded-md bg-[#d97706] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Requesting..." : "Request item"}</button> : <p className="rounded-md bg-[#f5f5f4] px-5 py-3 text-sm font-semibold text-[#57534e]">{item.availabilityMessage || "This item is unavailable."}</p>}</div>
        {confirmDelete && <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="mt-4 rounded-md border border-red-200 bg-red-50 p-4"><h2 id="delete-title" className="font-bold text-red-900">Delete this item?</h2><p className="mt-1 text-sm text-red-800">This action cannot be undone.</p><div className="mt-3 flex gap-2"><button type="button" onClick={deleteItem} className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white">Delete permanently</button><button type="button" onClick={() => setConfirmDelete(false)} className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-900">Keep item</button></div></div>}
      </section>
    </div>
  </>;
}
