import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Navigation() {
  const session = await getAuthSession();
  const unreadCount = session?.user.id ? await (await import("@/lib/prisma")).prisma.notification.count({ where: { userId: session.user.id, readAt: null } }) : 0;
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/" className="text-xl font-bold tracking-tight text-[#2d1810]">LendLoop</Link>
      <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
        <Link href="/items" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">Browse Items</Link>
        {session ? (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">Dashboard</Link>
            <Link href="/items/saved" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">Saved Items</Link>
            <Link href="/notifications" aria-label="Notifications" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">🔔{unreadCount > 0 && <span className="ml-1 rounded-full bg-[#d97706] px-1.5 py-0.5 text-xs text-white">{unreadCount}</span>}</Link>
            <Link href="/items/new" className="rounded-md bg-[#d97706] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b45309]">Add Item</Link>
            <SignOutButton />
          </>
        ) : (
          <Link href="/signin" className="rounded-md bg-[#2d1810] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c1410]">Sign In</Link>
        )}
      </nav>
    </header>
  );
}
