"use client";

import { useRouter } from "next/navigation";

export default function BackLink({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return <button type="button" onClick={goBack} className="mt-6 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-[#92400e] transition hover:bg-[var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[#d97706]" aria-label={`${label} to the previous page`}><span aria-hidden="true">←</span>{label}</button>;
}
