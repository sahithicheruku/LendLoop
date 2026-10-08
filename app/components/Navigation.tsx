import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Navigation() {
  const session = await getAuthSession();
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/" className="text-xl font-bold tracking-tight text-[#2d1810]">LendLoop</Link>
      <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
        <Link href="/items" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">Browse Items</Link>
        {session ? (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-[#2d1810] hover:text-[#d97706]">Dashboard</Link>
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
