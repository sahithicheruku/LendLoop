import { BorrowRequestStatus, ItemStatus } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ItemsClient from "@/app/items/ItemsClient";
import Navigation from "@/app/components/Navigation";

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
  const [owned, incoming, requested, borrowed, history] = await Promise.all([
    prisma.item.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } }),
    prisma.borrowRequest.findMany({ where: { status: BorrowRequestStatus.PENDING, item: { ownerId: userId } }, include: { item: true }, orderBy: { createdAt: "desc" } }),
    prisma.borrowRequest.findMany({ where: { requesterId: userId, status: BorrowRequestStatus.PENDING }, include: { item: true }, orderBy: { createdAt: "desc" } }),
    prisma.borrowRequest.findMany({ where: { requesterId: userId, status: BorrowRequestStatus.APPROVED, item: { status: ItemStatus.BORROWED } }, include: { item: true }, orderBy: { createdAt: "desc" } }),
    prisma.borrowRequest.findMany({ where: { OR: [{ requesterId: userId }, { item: { ownerId: userId } }], status: { in: [BorrowRequestStatus.DECLINED, BorrowRequestStatus.CANCELLED, BorrowRequestStatus.RETURNED] } }, include: { item: true }, orderBy: { updatedAt: "desc" } }),
  ]);
  return { owned, incoming: incoming.map(({ item }) => item), requested: requested.map(({ item }) => item), borrowed: borrowed.map(({ item }) => item), history };
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
        <Section title="My Requests" empty="You have not requested any items.">{data.requested.length > 0 && <ItemsClient items={data.requested} currentUserId={session.user.id} />}</Section>
        <Section title="Currently Borrowing" empty="You are not currently borrowing anything.">{data.borrowed.length > 0 && <ItemsClient items={data.borrowed} currentUserId={session.user.id} />}</Section>
        <section className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm lg:col-span-2"><h2 className="mb-5 text-2xl font-bold text-[#1c1917]">Request History</h2>{data.history.length === 0 ? <p className="text-sm text-[#78716c]">No completed request history yet.</p> : <ul className="divide-y divide-[#e7e5e4]">{data.history.map((request) => <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><span className="font-medium text-[#2d1810]">{request.item.title}</span><span className="rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-semibold capitalize text-[#57534e]">{request.status.toLowerCase()}</span></li>)}</ul>}</section>
      </div>
    </div></main>
  );
}
