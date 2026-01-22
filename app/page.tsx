
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Top Nav / Brand */}
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight text-zinc-900">
            LendLoop
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/items"
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            >
              Browse
            </Link>
            <Link
              href="/items/new"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            >
              Add Item
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Borrow more.
              <br />
              Waste less.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
              A community item lending platform to borrow what you need, lend what
              you own, and reduce waste — all in one simple place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/items"
                className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                Browse Items →
              </Link>

              <Link
                href="/items/requests"
                className="inline-flex items-center justify-center rounded-xl border bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                My Requests
              </Link>

              <Link
                href="/items/borrowed"
                className="inline-flex items-center justify-center rounded-xl border bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                Borrowed Items
              </Link>
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              Tip: Start by browsing items, or add one you can lend.
            </p>
          </div>

          {/* Right side card */}
          <aside className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Quick actions</h2>

            <div className="mt-4 grid gap-3">
              <Link
                href="/items/new"
                className="rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                <div className="text-sm font-semibold text-zinc-900">
                  ➕ List an item
                </div>
                <div className="mt-1 text-sm text-zinc-600">
                  Add something you own that others can borrow.
                </div>
              </Link>

              <Link
                href="/items"
                className="rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                <div className="text-sm font-semibold text-zinc-900">
                  🔎 Browse items
                </div>
                <div className="mt-1 text-sm text-zinc-600">
                  Find things available in your community.
                </div>
              </Link>

              <Link
                href="/items/requests"
                className="rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                <div className="text-sm font-semibold text-zinc-900">
                  📌 Track requests
                </div>
                <div className="mt-1 text-sm text-zinc-600">
                  See what you requested and what’s pending.
                </div>
              </Link>
            </div>
          </aside>
        </section>

        {/* Features */}
        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              How LendLoop helps
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Simple workflows designed to make lending and borrowing easy for everyone.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-sm font-semibold text-zinc-900">Easy lending</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                List items in seconds and let others request to borrow.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-sm font-semibold text-zinc-900">Clear status</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Track whether an item is available, requested, or borrowed.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-sm font-semibold text-zinc-900">Community first</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Reduce waste by sharing what you already have.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Built with Next.js + Prisma • LendLoop
            </p>

            <div className="flex gap-4 text-sm text-zinc-500">
              <Link className="hover:text-zinc-900" href="/items">
                Browse
              </Link>
              <Link className="hover:text-zinc-900" href="/items/new">
                Add Item
              </Link>
              <Link className="hover:text-zinc-900" href="/items/requests">
                Requests
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
