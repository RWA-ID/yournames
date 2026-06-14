import Reveal from "./Reveal";

/*
 * Safety band — brand-soft background, three plain white cards, and a
 * full-width brand card with a primary CTA.
 */

const CARDS = [
  {
    icon: "🔑",
    title: "Self-custody by default",
    body: "Only your wallet can move or edit your name. We never hold it — and we couldn't seize it if we tried.",
  },
  {
    icon: "🛡️",
    title: "No silent takedowns",
    body: "It can only leave you one way: by letting it expire. Renew it and it stays yours, indefinitely.",
  },
  {
    icon: "✅",
    title: "Phishing-resistant",
    body: "People verify it's really you on-chain, instead of trusting a look-alike handle that anyone can copy.",
  },
];

export default function Safety() {
  return (
    <section id="safety" className="border-y border-line bg-brand-soft">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[13px] font-bold uppercase tracking-wider text-brand">Why it&apos;s safe</p>
          <h2
            className="mt-3 font-display font-bold"
            style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}
          >
            Built so it&apos;s impossible to take from you.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Safety here isn&apos;t a setting you switch on. It comes from how the protocol works — your
            name answers to your wallet and nothing else.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal as="div" key={c.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-line bg-surface p-7 shadow-soft">
                <span className="text-[1.75rem]" aria-hidden="true">
                  {c.icon}
                </span>
                <h3 className="mt-2.5 font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" delay={0.1}>
          <div className="mt-5 flex flex-wrap items-center gap-6 rounded-3xl border border-line bg-surface px-8 py-7 shadow-soft">
            <span className="text-3xl" aria-hidden="true">
              🏛️
            </span>
            <div className="min-w-64 flex-1">
              <h3 className="font-display text-lg font-bold">For brands: claim it before a squatter does</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                A registered brand name stops impersonators from posing as you on-chain, and gives
                your customers one verified address to trust. Owning the name is the cheapest fraud
                prevention you&apos;ll buy this year.
              </p>
            </div>
            <a
              href="#top"
              className="inline-flex items-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-strong active:scale-[0.98]"
            >
              Secure your brand →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
