import { redirect } from "next/navigation";
import ItemsClient from "../ItemsClient";
import Navigation from "@/app/components/Navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { approximateCoordinate } from "@/lib/distance";
import type { Item } from "@/lib/types";
import BackLink from "@/app/components/BackLink";

export const dynamic = "force-dynamic";

export default async function SavedItemsPage() {
  const session = await getAuthSession();
  if (!session?.user.id) redirect("/signin");
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { item: { include: { images: { orderBy: { position: "asc" } }, owner: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  const items: Item[] = favorites.map(({ item }) => ({ ...item, ownerName: item.owner.name, latitude: approximateCoordinate(item.latitude), longitude: approximateCoordinate(item.longitude), isFavorited: true }));

  return <main className="min-h-screen bg-[#faf8f5]"><div className="mx-auto max-w-6xl px-6 py-10"><Navigation /><BackLink label="Back home" /><div className="mb-8 mt-2"><div className="text-xs font-semibold uppercase tracking-wide text-[#92400e]">Your list</div><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1c1917]">Saved Items</h1><p className="mt-2 text-[#78716c]">Keep track of items you may want to borrow later.</p></div>{items.length === 0 ? <div className="rounded-lg border-2 border-dashed border-[#e7e5e4] bg-white p-16 text-center text-sm text-[#78716c]">You have not saved any items yet.</div> : <ItemsClient items={items} currentUserId={session.user.id} enableLocation savedView />}</div></main>;
}
