"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = { id: string; title: string; message: string; readAt: string | null; createdAt: string; itemId: string | null };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => { fetch("/api/notifications").then((response) => response.ok ? response.json() : []).then(setNotifications); }, []);
  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, readAt: new Date().toISOString() } : notification));
  }
  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    setNotifications((current) => current.map((notification) => ({ ...notification, readAt: new Date().toISOString() })));
  }
  return <main className="min-h-screen bg-[#faf8f5]"><div className="mx-auto max-w-4xl px-6 py-10"><header className="flex flex-wrap items-center justify-between gap-4"><Link href="/" className="text-xl font-bold tracking-tight text-[#2d1810]">LendLoop</Link><Link href="/items" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">Browse Items</Link></header><div className="mb-8 mt-8 flex items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold tracking-tight text-[#1c1917]">Notifications</h1><p className="mt-2 text-[#78716c]">Updates about your lending activity.</p></div><button type="button" onClick={markAllRead} className="rounded-md border-2 border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#2d1810]">Mark all read</button></div><ul className="space-y-3">{notifications.length ? notifications.map((notification) => <li key={notification.id} className={`rounded-lg border bg-white p-5 shadow-sm ${notification.readAt ? "border-[#e7e5e4]" : "border-[#d97706]"}`}><div className="flex items-start justify-between gap-4"><div><h2 className="font-bold text-[#2d1810]">{notification.title}</h2><p className="mt-1 text-sm text-[#57534e]">{notification.message}</p><time className="mt-2 block text-xs text-[#78716c]">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</time></div>{!notification.readAt && <button type="button" onClick={() => markRead(notification.id)} className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-[#92400e] underline focus:outline-none focus:ring-2 focus:ring-[#d97706]">Mark read</button>}{notification.itemId && <Link href={`/items?item=${notification.itemId}`} className="sr-only">View item</Link>}</div></li>) : <li className="rounded-lg border border-dashed border-[#e7e5e4] bg-white p-12 text-center text-sm text-[#78716c]">You&apos;re all caught up.</li>}</ul></div></main>;
}
