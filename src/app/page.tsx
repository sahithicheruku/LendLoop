import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8 space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900">
          LendLoop
        </h1>

        <p className="text-zinc-600">
          A community-driven platform to lend and borrow everyday items safely and easily.
        </p>

        <div className="flex gap-4">
          <Link
            href="/items"
            className="px-4 py-2 rounded bg-black text-white hover:bg-zinc-800"
          >
            Browse Items
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded border border-zinc-300 hover:bg-zinc-100"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
