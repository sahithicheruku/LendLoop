"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="mt-8 flex w-full items-center justify-center gap-3 rounded-md bg-[#2d1810] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c1410]"
    >
      Continue with Google
    </button>
  );
}
