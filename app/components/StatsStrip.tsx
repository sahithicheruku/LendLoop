export default function StatsStrip() {
  const stats = [
    { label: "Items listed", value: "120+" },
    { label: "Successful borrows", value: "35+" },
    { label: "Active requests", value: "10+" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-4 rounded-2xl border bg-white/60 p-6 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-5">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-stone-600">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
