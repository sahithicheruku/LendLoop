
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-5xl font-bold">LendLoop</h1>
      <p className="mt-4 text-zinc-600">
        A community item lending platform. Borrow items, lend what you own, and
        reduce waste.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/items"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Browse Items
        </Link>

        <Link
          href="/items/new"
          className="rounded-md border px-4 py-2"
        >
          Add an Item
        </Link>

        <Link
          href="/items/requests"
          className="rounded-md border px-4 py-2"
        >
          My Requests
        </Link>

        <Link
          href="/items/borrowed"
          className="rounded-md border px-4 py-2"
        >
          Borrowed Items
        </Link>
      </div>
    </main>
  );
}



