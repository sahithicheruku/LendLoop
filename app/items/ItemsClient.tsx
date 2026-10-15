"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Item } from "@/lib/types";
import { distanceInMiles, formatDistance } from "@/lib/distance";
import { formatAvailability } from "@/lib/availability";

type Action = "request" | "approve" | "decline" | "return" | "cancel";

export default function ItemsClient({
  items,
  ownerView = false,
  currentUserId,
  enableLocation = false,
  savedView = false,
}: {
  items: Item[];
  ownerView?: boolean;
  currentUserId?: string;
  enableLocation?: boolean;
  savedView?: boolean;
}) {
  const router = useRouter();

  const [list, setList] = useState<Item[]>(() => items ?? []);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewerLocation, setViewerLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setViewerLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationMessage(null);
      },
      () => setLocationMessage("Location permission was unavailable. You can still browse items without distance estimates."),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    );
  }

  useEffect(() => {
    if (items && items.length > 0) {
      setList(items);
    }
  }, [items]);

  async function patchItem(id: string, action: Action) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      setError(data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : `Update failed (${res.status})`);
      console.error("PATCH failed:", { status: res.status, data });
      return null;
    }

    return data;
  }

  function updateLocal(id: string, nextStatus: Item["status"]) {
    setList((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status: nextStatus } : it
      )
    );
  }

  async function requestItem(id: string) {
    try {
      setError(null);
      setBusyId(id);
      const data = await patchItem(id, "request");
      if (!data) return;
      updateLocal(id, "REQUESTED");
      setList((prev) => prev.filter((it) => it.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function approveBorrow(id: string) {
    try {
      setError(null);
      setBusyId(id);
      const data = await patchItem(id, "approve");
      if (!data) return;
      updateLocal(id, "BORROWED");
      setList((prev) => prev.filter((it) => it.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function cancelRequest(id: string) {
    try {
      setError(null);
      setBusyId(id);
      const data = await patchItem(id, "cancel");
      if (!data) return;
      updateLocal(id, "AVAILABLE");
      setList((prev) => prev.filter((it) => it.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function declineRequest(id: string) {
    try {
      setError(null);
      setBusyId(id);
      const data = await patchItem(id, "decline");
      if (!data) return;
      updateLocal(id, "AVAILABLE");
      setList((prev) => prev.filter((it) => it.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function returnItem(id: string) {
    try {
      setError(null);
      setBusyId(id);
      const data = await patchItem(id, "return");
      if (!data) return;
      updateLocal(id, "AVAILABLE");
      setList((prev) => prev.filter((it) => it.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteItem(id: string) {
    const ok = confirm("Delete this item? This action cannot be undone.");
    if (!ok) return;

    const toRestore = list.find((x) => x.id === id);
    setList((prev) => prev.filter((it) => it.id !== id));

    try {
      setBusyId(id);
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      const text = await res.text();
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        if (toRestore) setList((prev) => [toRestore, ...prev]);
        console.error("DELETE failed:", { status: res.status, data });
        setError(data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : `Delete failed (${res.status})`);
        return;
      }

      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFavorite(item: Item) {
    if (!currentUserId) return;
    const nextSaved = !item.isFavorited;
    setError(null);
    setList((prev) => savedView && !nextSaved ? prev.filter((current) => current.id !== item.id) : prev.map((current) => current.id === item.id ? { ...current, isFavorited: nextSaved } : current));
    const res = await fetch(`/api/items/${item.id}/favorite`, { method: nextSaved ? "POST" : "DELETE" });
    if (!res.ok) {
      setList((prev) => savedView && !item.isFavorited ? [...prev, item] : prev.map((current) => current.id === item.id ? { ...current, isFavorited: item.isFavorited } : current));
      setError("Could not update saved items.");
    }
  }

  function getStatusBadge(status: Item["status"]) {
    const statusMap: Record<
      string,
      { label: string; bg: string; text: string; icon: string }
    > = {
      AVAILABLE: {
        label: "Available",
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "✓",
      },
      REQUESTED: {
        label: "Requested",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: "⏳",
      },
      BORROWED: {
        label: "Borrowed",
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: "📦",
      },
    };

    const currentStatus = status || "AVAILABLE";
    const config = statusMap[currentStatus] || statusMap["AVAILABLE"];

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
      >
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-[#e7e5e4] bg-white p-10 text-center text-sm text-[#78716c]">
        No available items to show.
      </div>
    );
  }

  return (
    <>
      {enableLocation && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={useMyLocation} className="rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#2d1810] transition hover:border-[#d97706]" aria-describedby="location-status">
            Use my location
          </button>
          {locationMessage && <p id="location-status" role="status" className="text-sm text-[#78716c]">{locationMessage}</p>}
        </div>
      )}
      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((it) => {
          const status = it.status;
          const isBusy = busyId === it.id;

          return (
            <li
              key={it.id}
              className="group rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm transition hover:border-[#d97706] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#78716c]">
                  {it.category || "Uncategorized"}
                </span>
                {getStatusBadge(status)}
              </div>

              <h3 className="mt-3 text-xl font-bold text-[#1c1917] group-hover:text-[#d97706] transition">
                <Link href={`/items/${it.id}`} className="focus:outline-none focus:ring-2 focus:ring-[#d97706]">{it.title}</Link>
              </h3>

              {currentUserId && it.ownerId !== currentUserId && <button type="button" onClick={() => toggleFavorite(it)} aria-label={it.isFavorited ? "Remove from saved" : "Save item"} aria-pressed={it.isFavorited} className="mt-3 rounded-md border border-[#e7e5e4] px-3 py-1.5 text-sm text-[#2d1810] transition hover:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]">
                <span aria-hidden="true">{it.isFavorited ? "♥" : "♡"}</span> {it.isFavorited ? "Saved" : "Save"}
              </button>}

              {(it.images?.[0]?.url || it.imageUrl) ? (
                <Link href={`/items/${it.id}`} aria-label={`View details for ${it.title}`} className="mt-4 block rounded-md focus:outline-none focus:ring-2 focus:ring-[#d97706]"><div role="img" aria-label={it.title} className="h-40 w-full rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${it.images?.[0]?.url || it.imageUrl})` }} /></Link>
              ) : (
                <div aria-label={`${it.title} placeholder image`} className="mt-4 flex h-40 w-full items-center justify-center rounded-md bg-[#fef3c7] text-4xl text-[#92400e]">📦</div>
              )}

              {it.ownerName && <p className="mt-3 text-xs text-[#78716c]">Listed by {it.ownerName}</p>}
              {it.reviewCount ? <p className="mt-2 text-sm text-[#92400e]" aria-label={`${it.averageRating?.toFixed(1)} out of 5 stars from ${it.reviewCount} reviews`}>★ {it.averageRating?.toFixed(1)} ({it.reviewCount} {it.reviewCount === 1 ? "review" : "reviews"})</p> : <p className="mt-2 text-xs text-[#78716c]">No reviews yet</p>}

              {(it.city || it.region) && <p className="mt-2 text-xs text-[#78716c]">{[it.city, it.region].filter(Boolean).join(", ")}</p>}
              {formatAvailability(it.availableFrom, it.availableUntil) && <p className="mt-1 text-xs text-[#78716c]">{formatAvailability(it.availableFrom, it.availableUntil)}</p>}
              {viewerLocation && it.latitude !== null && it.latitude !== undefined && it.longitude !== null && it.longitude !== undefined && <p className="mt-1 text-xs text-[#78716c]">{formatDistance(distanceInMiles(viewerLocation.latitude, viewerLocation.longitude, it.latitude, it.longitude))}</p>}
              {it.condition && <span className="mt-2 inline-flex rounded-full bg-[#f5f5f4] px-2.5 py-1 text-xs font-semibold capitalize text-[#57534e]">{it.condition.toLowerCase().replace("_", " ")}</span>}

              {it.description && (
                <p className="mt-2 text-sm leading-relaxed text-[#57534e] line-clamp-2">
                  {it.description}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-2">
                {ownerView && <div className="flex gap-2"><Link href={`/items/${it.id}`} className="flex-1 rounded-md border-2 border-[#e7e5e4] px-4 py-2 text-center text-sm font-semibold text-[#2d1810]">View</Link><Link href={`/items/${it.id}/edit`} className="flex-1 rounded-md border-2 border-[#e7e5e4] px-4 py-2 text-center text-sm font-semibold text-[#2d1810]">Edit</Link></div>}
                {status === "AVAILABLE" && it.ownerId !== currentUserId && (
                  <button
                    onClick={() => requestItem(it.id)}
                    disabled={isBusy}
                    className="rounded-md bg-[#d97706] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b45309] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBusy ? "Requesting..." : "Request to Borrow"}
                  </button>
                )}

                {status === "REQUESTED" && (
                  <div className="flex gap-2">
                    {ownerView && <button onClick={() => approveBorrow(it.id)} disabled={isBusy} className="flex-1 rounded-md bg-[#2d1810] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c1410] disabled:opacity-50">{isBusy ? "Approving..." : "Approve"}</button>}

                    <button
                      onClick={() =>
                        ownerView ? declineRequest(it.id) : cancelRequest(it.id)
                      }
                      disabled={isBusy}
                      className="flex-1 rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-2.5 text-sm font-semibold text-[#2d1810] transition hover:border-[#78716c] disabled:opacity-50"
                    >
                      {isBusy
                        ? ownerView
                          ? "Declining..."
                          : "Canceling..."
                        : ownerView
                          ? "Decline"
                          : "Cancel"}
                    </button>
                  </div>
                )}

                {status === "BORROWED" && (
                  <button
                    onClick={() => returnItem(it.id)}
                    disabled={isBusy}
                    className="rounded-md bg-[#d97706] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b45309] disabled:opacity-50"
                  >
                    {isBusy ? "Processing..." : "Mark as Returned"}
                  </button>
                )}

                {it.ownerId === currentUserId && (
                  <button
                    onClick={() => deleteItem(it.id)}
                    disabled={isBusy || status === "BORROWED"}
                    className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                  >
                    {status === "BORROWED" ? "Currently Borrowed" : isBusy ? "Deleting..." : "Delete Item"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
