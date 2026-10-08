import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import GoogleSignInButton from "./GoogleSignInButton";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-lg px-6 py-20">
        <Navigation />
        <Link href="/" className="text-sm font-semibold text-[#2d1810] hover:text-[#8b6f47]">
          ← Back to home
        </Link>

        <div className="mt-6 rounded-xl border border-[#e7e5e4] bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#92400e]">
            LendLoop
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1c1917]">
            Sign in to continue
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#57534e]">
            To browse items, request a borrow, and manage your dashboard, please sign in.
          </p>

          <GoogleSignInButton />

          <p className="mt-6 text-xs text-[#78716c]">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-[#2d1810]">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-[#2d1810]">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
