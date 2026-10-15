"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(null);
    const response = await fetch(`/api/requests/${requestId}/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: Number(rating), comment }) });
    if (!response.ok) { const data = await response.json().catch(() => ({})); setError(data.error ?? "Could not submit review"); setBusy(false); return; }
    router.refresh();
  }

  return <form onSubmit={submit} className="mt-3 w-full max-w-xl rounded-md bg-[#faf8f5] p-4" aria-label="Leave a review">
    <div className="flex flex-wrap items-end gap-3">
      <div><label htmlFor={`rating-${requestId}`} className="block text-xs font-semibold text-[#57534e]">Rating</label><select id={`rating-${requestId}`} value={rating} onChange={(event) => setRating(event.target.value)} className="mt-1 h-10 rounded-md border border-[#d6d3d1] bg-white px-3 text-sm" required><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></div>
      <div className="min-w-56 flex-1"><label htmlFor={`comment-${requestId}`} className="block text-xs font-semibold text-[#57534e]">Comment <span className="font-normal">(optional)</span></label><input id={`comment-${requestId}`} value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} className="mt-1 h-10 w-full rounded-md border border-[#d6d3d1] bg-white px-3 text-sm" placeholder="How was your borrowing experience?" /></div>
      <button type="submit" disabled={busy} className="h-10 rounded-md bg-[#2d1810] px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Submitting..." : "Submit review"}</button>
    </div>
    <p className="mt-1 text-right text-xs text-[#78716c]">{comment.length}/500</p>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </form>;
}
