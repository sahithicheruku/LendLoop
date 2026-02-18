export default function TechBadges() {
  const stack = ["Next.js", "React", "Prisma", "PostgreSQL (Neon)", "Tailwind v4", "Vercel"];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <div className="rounded-2xl border bg-white/60 p-6">
        <h2 className="text-lg font-semibold">Built with</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className="rounded-full border bg-white px-3 py-1 text-xs text-stone-700">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
