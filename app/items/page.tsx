import ItemsClient from "./ItemsClient";
import Link from "next/link";
import type { Item } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";
import { getAuthSession } from "@/lib/auth";
import Navigation from "@/app/components/Navigation";
import BackLink from "@/app/components/BackLink";
import { approximateCoordinate } from "@/lib/distance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getItems(search: string, category: string, userId?: string): Promise<Item[]> {
  try {
    const items = await prisma.item.findMany({
      where: {
        status: ItemStatus.AVAILABLE,
        ...(userId ? { ownerId: { not: userId } } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { region: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
        ...(category ? { category } : {}),
      },
      include: { owner: { select: { name: true } }, images: { orderBy: { position: "asc" } }, reviews: { select: { rating: true } } },
      orderBy: { createdAt: "desc" },
    });

    const favoriteIds = userId ? new Set((await prisma.favorite.findMany({ where: { userId, itemId: { in: items.map((item) => item.id) } }, select: { itemId: true } })).map(({ itemId }) => itemId)) : new Set<string>();
    return items.map(({ owner, reviews, ...item }) => ({ ...item, ownerName: owner.name, latitude: approximateCoordinate(item.latitude), longitude: approximateCoordinate(item.longitude), isFavorited: favoriteIds.has(item.id), reviewCount: reviews.length, averageRating: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null }));
  } catch (err) {
    console.error("getItems prisma error:", err);
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const categories = await prisma.item.findMany({
      where: { status: ItemStatus.AVAILABLE },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return categories.map(({ category }) => category).filter(Boolean);
  } catch (err) {
    console.error("getCategories prisma error:", err);
    return [];
  }
}

export default async function ItemsPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string }> }) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const session = await getAuthSession();
  const [items, categories] = await Promise.all([
    getItems(search, category, session?.user.id),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Navigation />
        <BackLink label="Back home" />

        <form className={`mt-8 grid items-end gap-3 rounded-lg border border-[#e7e5e4] bg-white p-4 shadow-sm ${search || category ? "md:grid-cols-[minmax(0,1fr)_14rem_auto_auto]" : "md:grid-cols-[minmax(0,1fr)_14rem_auto]"}`} method="get">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#78716c]" htmlFor="search">Search items</label>
            <input id="search" name="search" defaultValue={search} placeholder="Search by item or details" className="h-11 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#78716c]" htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={category} className="h-11 w-full rounded-md border-2 border-[#e7e5e4] bg-white px-4 text-sm text-stone-900 focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/20">
              <option value="">All categories</option>
              {categories.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <button type="submit" className="h-11 rounded-md bg-[#2d1810] px-5 text-sm font-semibold text-white transition hover:bg-[#1c1410]">Search</button>
          {(search || category) && <Link href="/items" className="inline-flex h-11 items-center justify-center rounded-md border-2 border-[#e7e5e4] px-4 text-sm font-semibold text-[#57534e] transition hover:border-[#d97706] hover:text-[#92400e]">Clear filters</Link>}
        </form>

        <div className="mt-10 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1917]">Available Items</h1>
          <p className="mt-3 text-base leading-7 text-[#57534e]">Browse useful items shared by people in your community.</p>
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-[#1c1917]">
              Browse Items {items.length > 0 && `(${items.length})`}
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-[#e7e5e4] bg-white p-10 text-center sm:p-12">
              <div className="mx-auto max-w-sm">
                <h3 className="text-xl font-bold text-[#2d1810]">
                  {search || category ? "No matching items" : "Nothing to browse just yet"}
                </h3>
                <p className="mt-3 text-sm text-[#78716c]">
                  {search || category ? "Try a different search or category." : "Have something useful? Share it with your community."}
                </p>
                <Link
                  href="/items/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#d97706] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#b45309]"
                >
                  <span>Add an Item</span>
                </Link>
              </div>
            </div>
          ) : (
            <ItemsClient items={items} currentUserId={session?.user.id} enableLocation />
          )}
        </div>
      </div>
    </main>
  );
}
