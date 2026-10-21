import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import NavigationLinks from "./NavigationLinks";

export default async function Navigation() {
  const session = await getAuthSession();
  const unreadCount = session?.user.id ? await (await import("@/lib/prisma")).prisma.notification.count({ where: { userId: session.user.id, readAt: null } }) : 0;
  return (
    <header className="relative flex items-center justify-between gap-4">
      <Link href="/" className="text-xl font-bold tracking-tight text-[#2d1810]">LendLoop</Link>
      <NavigationLinks signedIn={Boolean(session)} unreadCount={unreadCount} />
    </header>
  );
}
