"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-medium text-[#78716c] hover:text-[#d97706]">
      Sign Out
    </button>
  );
}
