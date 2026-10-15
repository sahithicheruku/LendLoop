import { BorrowRequestStatus, ItemStatus } from "@prisma/client";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ItemsClient from "@/app/items/ItemsClient";
import Navigation from "@/app/components/Navigation";

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
  const [owned, incoming, borrowed] = await Promise.all([
    prisma.item.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } }),
    prisma.borrowRequest.findMany({ where: { status: BorrowRequestStatus.PENDING, item: { ownerId: userId } }, include: { item: true }, orderBy: { createdAt: "desc" } }),
    prisma.borrowRequest.findMany({ where: { requesterId: userId, status: BorrowRequestStatus.APPROVED, item: { status: ItemStatus.BORROWED } }, include: { item: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const hideCoordinates = <T extends { latitude: number | null; longitude: number | null }>(item: T) => ({ ...item, latitude: null, longitude: null });
  return { owned: owned.map(hideCoordinates), incoming: incoming.map(({ item }) => hideCoordinates(item)), borrowed: borrowed.map(({ item }) => hideCoordinates(item)) };
}

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm"><h2 className="mb-5 text-2xl font-bold text-[#1c1917]">{title}</h2>{children || <p className="text-sm text-[#78716c]">{empty}</p>}</section>;
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user.id) return null;
  const data = await getDashboardData(session.user.id);
  return (
    <main className="min-h-screen bg-[#faf8f5]"><div className="mx-auto max-w-6xl px-6 py-10">
      <Navigation /><div className="mb-8 mt-8"><div className="text-xs font-semibold uppercase tracking-wide text-[#92400e]">Overview</div><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1c1917]">Dashboard</h1><p className="mt-2 text-[#78716c]">Manage your items, requests, and active borrows.</p></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="My Items" empty="You have not listed any items yet.">{data.owned.length > 0 && <ItemsClient items={data.owned} ownerView currentUserId={session.user.id} />}</Section>
        <Section title="Incoming Requests" empty="No incoming requests yet.">{data.incoming.length > 0 && <ItemsClient items={data.incoming} ownerView currentUserId={session.user.id} />}</Section>
        <Section title="Currently Borrowing" empty="You are not currently borrowing anything.">{data.borrowed.length > 0 && <ItemsClient items={data.borrowed} currentUserId={session.user.id} />}</Section>
        <section className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm lg:col-span-2"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-[#1c1917]">Borrowing activity</h2><p className="mt-1 text-sm text-[#78716c]">Track requests, returns, and reviews in one place.</p></div><Link href="/items/requests" className="rounded-md border-2 border-[#e7e5e4] px-4 py-2 text-sm font-semibold text-[#2d1810] transition hover:border-[#d97706] hover:text-[#92400e]">View my requests</Link></div></section>
      </div>
    </div></main>
  );
}
