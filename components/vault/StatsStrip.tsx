/* Stats strip — gold count-up numbers (driven by [data-count] in VaultExperience). */

const STATS = [
  { count: 0, prefix: "$", suffix: null, label: "platform fees, ever" },
  { count: 5, prefix: "$", suffix: "/yr", label: "for 5+ characters" },
  { count: 100, prefix: "", suffix: "%", label: "yours. in your wallet" },
  { count: 0, prefix: "", suffix: null, label: "middlemen holding it" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-gold/15 bg-surface px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 text-center lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} data-rise>
            <p className="text-3xl font-bold text-gold sm:text-4xl">
              <span data-count={s.count} data-prefix={s.prefix || undefined}>
                {s.prefix}
                {s.count}
              </span>
              {s.suffix && <span className="text-lg text-muted">{s.suffix}</span>}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
