"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Request = {
  id: string;
  createdAt: Date;
  item: { id: string; title: string; owner: { name: string | null; email: string | null } | null };
};

export default function RequestCards({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function cancel(itemId: string, requestId: string) {
    setBusyId(requestId);
    const response = await fetch(`/api/items/${itemId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel" }) });
    setBusyId(null);
    if (response.ok) router.refresh();
  }

  return <ul className="divide-y divide-[#e7e5e4] rounded-lg border border-[#e7e5e4] bg-white shadow-sm">{requests.map((request) => <li key={request.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="font-semibold text-[#2d1810]">{request.item.title}</h3>
      <p className="mt-1 text-sm text-[#78716c]">Owner: {request.item.owner?.name || request.item.owner?.email || "Community member"}</p>
      <p className="mt-1 text-xs text-[#a8a29e]">Requested {request.createdAt.toLocaleDateString()}</p>
    </div>
    <div className="flex items-center gap-3">
      <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold text-[#92400e]">Pending</span>
      <button type="button" onClick={() => cancel(request.item.id, request.id)} disabled={busyId === request.id} className="rounded-md border border-[#e7e5e4] px-3 py-1.5 text-sm font-semibold text-[#57534e] transition hover:border-[#d97706] hover:text-[#92400e] disabled:opacity-50">{busyId === request.id ? "Canceling..." : "Cancel"}</button>
    </div>
  </li>)}</ul>;
}
