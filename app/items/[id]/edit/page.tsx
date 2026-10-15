import { notFound, redirect } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditItemForm from "./EditItemForm";

export const dynamic = "force-dynamic";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user.id) redirect("/signin");
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id }, select: { id: true, title: true, description: true, category: true, condition: true, city: true, region: true, availableFrom: true, availableUntil: true, status: true, ownerId: true, images: { select: { id: true, url: true }, orderBy: { position: "asc" } } } });
  if (!item) notFound();
  if (item.ownerId !== session.user.id) redirect(`/items/${id}`);
  const date = (value: Date | null) => value ? value.toISOString().slice(0, 10) : "";
  return <main className="min-h-screen bg-[#faf8f5]"><div className="mx-auto max-w-6xl px-6 py-10"><Navigation /><h1 className="mt-8 text-4xl font-extrabold tracking-tight text-[#1c1917]">Edit item</h1><p className="mt-2 text-sm text-[#78716c]">Update your listing details. Active borrow transactions keep their current availability.</p><div className="mt-8"><EditItemForm initial={{ ...item, description: item.description ?? "", condition: item.condition ?? "", city: item.city ?? "", region: item.region ?? "", availableFrom: date(item.availableFrom), availableUntil: date(item.availableUntil) }} /></div></div></main>;
}
