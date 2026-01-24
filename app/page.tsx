import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Top Nav */}
        <header className="flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-[#2d1810]">
            LendLoop
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/items"
              className="px-5 py-2.5 text-sm font-medium text-[#2d1810] transition hover:text-[#8b6f47]"
            >
              Browse
            </Link>
            <Link
              href="/items/new"
              className="rounded-md bg-[#d97706] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b45309]"
            >
              Add Item
            </Link>
          </div>
        </header>

        {/* Hero - Asymmetric Layout */}
        <section className="mt-20 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <div className="inline-block rounded-full bg-[#fef3c7] px-4 py-1.5 text-xs font-semibold text-[#92400e] mb-6">
              Community Sharing Platform
            </div>
            
            <h1 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-[#1c1917] sm:text-[4.5rem]">
              Share what you have.{" "}
              <span className="text-[#d97706]">Borrow what you need.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#57534e]">
              Why buy when you can borrow? Connect with neighbors, reduce waste, 
              and get access to tools, books, camping gear—without the clutter.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/items"
                className="inline-flex items-center gap-2 rounded-md bg-[#2d1810] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#1c1410]"
              >
                Browse Items
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/items/requests"
                className="inline-flex items-center gap-2 rounded-md border-2 border-[#e7e5e4] bg-white px-7 py-3.5 text-base font-semibold text-[#2d1810] transition hover:border-[#d97706] hover:bg-[#fffbeb]"
              >
                My Requests
              </Link>

              <Link
                href="/items/borrowed"
                className="inline-flex items-center gap-2 rounded-md border-2 border-[#e7e5e4] bg-white px-7 py-3.5 text-base font-semibold text-[#2d1810] transition hover:border-[#d97706] hover:bg-[#fffbeb]"
              >
                Borrowed Items
              </Link>
            </div>
          </div>

          {/* Right side - Stacked Cards with Different Styles */}
          <aside className="space-y-4">
            <div className="rounded-lg border-2 border-[#d97706] bg-gradient-to-br from-[#fef3c7] to-[#fed7aa] p-6 shadow-md">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#92400e]">
                Quick Start
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#78350f]">
                List an item you own in under a minute. Share your drill, ladder, 
                or bike with people nearby.
              </p>
              <Link
                href="/items/new"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[#92400e] hover:text-[#78350f]"
              >
                List an item →
              </Link>
            </div>

            <div className="rounded-lg border border-[#e7e5e4] bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2d1810]">
                Find what you need
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#78716c]">
                Browse items people are lending in your area. From power tools 
                to camping equipment.
              </p>
              <Link
                href="/items"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[#d97706] hover:text-[#b45309]"
              >
                Browse catalog →
              </Link>
            </div>

            <div className="rounded-lg bg-[#292524] p-6 shadow-md">
              <h3 className="text-base font-bold text-white">
                Track everything
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#d6d3d1]">
                See what you've borrowed, what you've lent out, and manage 
                all your requests in one place.
              </p>
              <Link
                href="/items/borrowed"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[#fbbf24] hover:text-[#fde047]"
              >
                View dashboard →
              </Link>
            </div>
          </aside>
        </section>

        {/* How it Works */}
        <section className="mt-24">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1c1917]">
              How it works
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#57534e]">
              Three simple steps to start sharing and saving money.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="group rounded-lg border border-[#e7e5e4] bg-white p-8 transition hover:border-[#d97706] hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef3c7] text-xl font-bold text-[#92400e]">
                1
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#2d1810]">List your stuff</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#78716c]">
                Add items you're willing to lend. Takes less than 60 seconds. 
                No fees, no hassle.
              </p>
            </div>

            <div className="group rounded-lg border border-[#e7e5e4] bg-white p-8 transition hover:border-[#d97706] hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef3c7] text-xl font-bold text-[#92400e]">
                2
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#2d1810]">Browse & request</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#78716c]">
                Find what you need nearby. Send a request and coordinate 
                pickup directly with the owner.
              </p>
            </div>

            <div className="group rounded-lg border border-[#e7e5e4] bg-white p-8 transition hover:border-[#d97706] hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef3c7] text-xl font-bold text-[#92400e]">
                3
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#2d1810]">Return & repeat</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#78716c]">
                Use the item, return it on time, and keep the cycle going. 
                Everyone wins.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24 rounded-xl bg-[#d97706] p-12 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to start sharing?
          </h2>
          <p className="mt-4 text-lg text-[#fef3c7]">
            Join your neighbors in reducing waste and building community.
          </p>
          <Link
            href="/items/new"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-8 py-4 text-base font-bold text-[#d97706] shadow-lg transition hover:bg-[#fffbeb]"
          >
            List Your First Item
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#e7e5e4] pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-bold text-[#2d1810]">LendLoop</div>
              <p className="mt-1 text-sm text-[#78716c]">
                Share more. Waste less. Save money.
              </p>
            </div>

            <div className="flex gap-8 text-sm font-medium text-[#57534e]">
              <Link className="transition hover:text-[#d97706]" href="/items">
                Browse
              </Link>
              <Link className="transition hover:text-[#d97706]" href="/items/new">
                Add Item
              </Link>
              <Link className="transition hover:text-[#d97706]" href="/items/requests">
                Requests
              </Link>
              <Link className="transition hover:text-[#d97706]" href="/items/borrowed">
                Borrowed
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}