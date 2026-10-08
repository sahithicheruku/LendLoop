import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { BorrowRequestStatus } from "@prisma/client";
import Navigation from "@/app/components/Navigation";
import RequestCards from "./RequestCards";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getRequestedItems() {
  const session = await getAuthSession();
  if (!session?.user.id) return [];
  try {
    const requests = await prisma.borrowRequest.findMany({
      where: { requesterId: session.user.id, status: BorrowRequestStatus.PENDING },
      include: { item: { include: { owner: { select: { name: true, email: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return requests;
  } catch (err) {
    console.error("getRequestedItems prisma error:", err);
    return [];
  }
}

export default async function RequestsPage() {
  const requests = await getRequestedItems();
  const session = await getAuthSession();
  const history = session?.user.id ? await prisma.borrowRequest.findMany({
    where: { requesterId: session.user.id, status: { in: [BorrowRequestStatus.DECLINED, BorrowRequestStatus.CANCELLED, BorrowRequestStatus.RETURNED] } },
    include: { item: true },
    orderBy: { updatedAt: "desc" },
  }) : [];

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Navigation />
        <div className="mb-8 mt-8">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#92400e]">Requests</div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1c1917]">My Requests</h1>
          <p className="mt-2 text-[#78716c]">Track the items you&apos;ve requested and their current status.</p>
        </div>

        {/* Items List */}
        <div className="mt-10">
          {requests.length === 0 ? (
            <div className="rounded-lg border border-[#e7e5e4] bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7] text-xl text-[#92400e]">?</div>
              <h3 className="mt-4 text-lg font-bold text-[#2d1810]">No pending requests</h3>
              <p className="mt-2 text-sm text-[#78716c]">Browse the catalog to find something useful to borrow.</p>
              <Link href="/items" className="mt-5 inline-flex rounded-md bg-[#d97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#b45309]">Browse Items</Link>
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-2xl font-bold text-[#1c1917]">Pending Requests ({requests.length})</h2>
              <RequestCards requests={requests} />
            </>
          )}
        </div>
        {history.length > 0 && <section className="mt-8 rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm"><h2 className="mb-4 text-2xl font-bold text-[#1c1917]">Request History</h2><ul className="divide-y divide-[#e7e5e4]">{history.map((request) => <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><span className="font-medium text-[#2d1810]">{request.item.title}</span><span className="rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-semibold capitalize text-[#57534e]">{request.status.toLowerCase()}</span></li>)}</ul></section>}
      </div>
    </main>
  );
}

