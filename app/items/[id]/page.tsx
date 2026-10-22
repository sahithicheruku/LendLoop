import { notFound } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatAvailability } from "@/lib/availability";
import { approximateCoordinate } from "@/lib/distance";
import ItemDetailClient from "./ItemDetailClient";
import BackLink from "@/app/components/BackLink";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  const item = await prisma.item.findUnique({ where: { id }, select: { id: true, title: true, description: true, category: true, imageUrl: true, city: true, region: true, latitude: true, longitude: true, availableFrom: true, availableUntil: true, condition: true, status: true, ownerId: true, owner: { select: { name: true } }, images: { select: { id: true, url: true, position: true }, orderBy: { position: "asc" }, take: 3 }, reviews: { select: { rating: true, comment: true, createdAt: true, reviewer: { select: { name: true } } }, orderBy: { createdAt: "desc" } }, requests: session?.user.id ? { where: { requesterId: session.user.id }, select: { id: true, status: true } } : undefined } });
  if (!item) notFound();
  const now = new Date();
  const canRequest = item.status === "AVAILABLE" && (!item.availableFrom || item.availableFrom <= now) && (!item.availableUntil || item.availableUntil >= now);
  const availabilityMessage = item.availableFrom && item.availableFrom > now ? `Available from ${formatAvailability(item.availableFrom, null)?.replace("Available from ", "")}` : item.availableUntil && item.availableUntil < now ? "This availability window has ended." : formatAvailability(item.availableFrom, item.availableUntil);
  const request = item.requests?.[0];
  const averageRating = item.reviews.length ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length : null;
  const detail = { id: item.id, title: item.title, description: item.description, category: item.category, imageUrl: item.imageUrl, city: item.city, region: item.region, condition: item.condition, status: item.status, ownerId: item.ownerId, ownerName: item.owner.name, images: item.images, isFavorited: session ? Boolean(await prisma.favorite.findUnique({ where: { userId_itemId: { userId: session.user.id, itemId: id } }, select: { id: true } })) : false, requestStatus: request?.status ?? null, requestId: request?.id ?? null, canRequest, availabilityMessage, reviewCount: item.reviews.length, averageRating, distance: null as string | null, approximateLatitude: approximateCoordinate(item.latitude), approximateLongitude: approximateCoordinate(item.longitude) };
  return <main className="min-h-screen bg-[#faf8f5]"><div className="mx-auto max-w-6xl px-6 py-10"><Navigation /><BackLink label="Back to items" /><div className="mt-6"><ItemDetailClient item={detail} signedIn={Boolean(session)} currentUserId={session?.user.id} /></div><section className="mt-12"><h2 className="text-2xl font-bold text-[#1c1917]">Reviews</h2>{item.reviews.length ? <ul className="mt-4 space-y-3">{item.reviews.map((review, index) => <li key={`${review.createdAt.toISOString()}-${index}`} className="rounded-lg border border-[#e7e5e4] bg-white p-5"><div className="flex flex-wrap justify-between gap-2"><span className="font-semibold text-[#2d1810]">{review.reviewer.name || "Community member"}</span><time className="text-sm text-[#78716c]">{review.createdAt.toLocaleDateString()}</time></div><p className="mt-1 text-sm text-[#92400e]" aria-label={`${review.rating} out of 5 stars`}>★ {review.rating}/5</p>{review.comment && <p className="mt-2 text-sm leading-relaxed text-[#57534e]">{review.comment}</p>}</li>)}</ul> : <p className="mt-4 rounded-lg border border-dashed border-[#e7e5e4] bg-white p-5 text-sm text-[#78716c]">No reviews yet.</p>}</section></div></main>;
}
