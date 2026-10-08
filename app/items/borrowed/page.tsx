import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { BorrowRequestStatus, ItemStatus } from "@prisma/client";
import Navigation from "@/app/components/Navigation";
import BorrowedCards from "./BorrowedCards";

async function getBorrowedItems() {
  const session = await getAuthSession();
  if (!session?.user.id) return [];
  return prisma.borrowRequest.findMany({ where: { requesterId: session.user.id, status: BorrowRequestStatus.APPROVED, item: { status: ItemStatus.BORROWED } }, include: { item: { include: { owner: { select: { name: true, email: true } } } } }, orderBy: { createdAt: "desc" } });
}

export default async function BorrowedPage() {
  const requests = await getBorrowedItems();
  return <main className="min-h-screen bg-[#faf8f5]"><div className="mx-auto max-w-6xl px-6 py-10"><Navigation /><div className="mb-8 mt-8"><div className="text-xs font-semibold uppercase tracking-wide text-[#92400e]">Borrowing</div><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1c1917]">Currently Borrowing</h1><p className="mt-2 text-[#78716c]">Keep track of the items you&apos;re borrowing and return them on time.</p></div><div className="mt-8">{requests.length === 0 ? <div className="rounded-lg border border-[#e7e5e4] bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7] text-xl text-[#92400e]">+</div><h2 className="mt-4 text-lg font-bold text-[#2d1810]">No borrowed items</h2><p className="mt-2 text-sm text-[#78716c]">Browse available items to find something useful to borrow.</p><Link href="/items" className="mt-5 inline-flex rounded-md bg-[#d97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#b45309]">Browse Items</Link></div> : <><h2 className="mb-4 text-2xl font-bold text-[#1c1917]">Your Borrowed Items ({requests.length})</h2><BorrowedCards requests={requests} /></>}</div></div></main>;
}
