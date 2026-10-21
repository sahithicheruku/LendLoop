"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SignOutButton from "./SignOutButton";

function NavLink({ href, label, currentPath, onNavigate }: { href: string; label: string; currentPath: string; onNavigate: () => void }) {
  const active = currentPath === href || (href !== "/items" && currentPath.startsWith(`${href}/`));
  return <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition ${active ? "bg-[var(--accent-soft)] text-[var(--accent-hover)]" : "text-[#2d1810] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-hover)]"}`}>{label}</Link>;
}

export default function NavigationLinks({ signedIn, unreadCount }: { signedIn: boolean; unreadCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return <>
    <button type="button" className="ll-btn ll-btn-secondary min-h-10 px-3 md:hidden" aria-expanded={open} aria-controls="main-navigation-menu" onClick={() => setOpen((current) => !current)}>
      {open ? "Close" : "Menu"}
    </button>
    <nav id="main-navigation-menu" aria-label="Main navigation" className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full z-20 mt-3 flex-col gap-1 rounded-lg border border-[#e7e5e4] bg-white p-3 shadow-md md:static md:mt-0 md:flex md:flex-row md:flex-nowrap md:items-center md:justify-end md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
      <NavLink href="/items" label="Browse Items" currentPath={pathname} onNavigate={closeMenu} />
      {signedIn ? <>
        <NavLink href="/dashboard" label="Dashboard" currentPath={pathname} onNavigate={closeMenu} />
        <NavLink href="/items/saved" label="Saved Items" currentPath={pathname} onNavigate={closeMenu} />
        <Link href="/notifications" onClick={closeMenu} aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`} aria-current={pathname === "/notifications" ? "page" : undefined} className={`whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition ${pathname === "/notifications" ? "bg-[var(--accent-soft)] text-[var(--accent-hover)]" : "text-[#2d1810] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-hover)]"}`}>
          Notifications{unreadCount > 0 && ` (${unreadCount})`}
        </Link>
        <Link href="/items/new" onClick={closeMenu} className="ll-btn ll-btn-primary mt-2 md:ml-2 md:mt-0">Add Item</Link><SignOutButton />
      </> : <Link href="/signin" onClick={closeMenu} className="ll-btn mt-2 bg-[#2d1810] text-white hover:bg-[#1c1410] md:ml-2 md:mt-0">Sign In</Link>}
    </nav>
  </>;
}
