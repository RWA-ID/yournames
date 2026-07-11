import Reveal from "./Reveal";

/*
 * "For companies" — tinted full-bleed band: eyebrow + editorial H2 beside an
 * intro paragraph, then three numbered columns under strong paper top rules.
 */
const COLUMNS = [
  {
    title: "Verified payments",
    body: "Invoices carry acme.eth instead of a raw address. Customers verify the recipient is the real you before funds move.",
  },
  {
    title: "Impersonation defense",
    body: "Hold your name and its close variants. On-chain ownership is public — impersonators can't claim to be you.",
  },
  {
    title: "Team subnames",
    body: "Issue pay.acme.eth, support.acme.eth, alice.acme.eth — structured identity you grant and revoke.",
  },
];

export default function ForCompanies() {
  return (
    <section id="companies" className="border-t border-line bg-tint">
      <div className="mx-auto w-full max-w-[70rem] px-6 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-8">
          <Reveal>
            <p className="eyebrow">For companies</p>
            <h2 className="mt-4 font-display text-[1.9rem] font-bold tracking-[-0.02em] text-foreground sm:text-[2.4rem]">
              Claim it before <span className="editorial">someone else does.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[24rem]">
            <p className="text-[0.9375rem] leading-[1.7] text-foreground/65">
              Your brand&apos;s name on-chain is either held by you or available to anyone.
              Registration takes minutes and costs protocol price.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {COLUMNS.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.1} className="border-t border-line-paper pt-5">
              <p className="font-display text-[0.8125rem] font-bold text-faint">0{i + 1}</p>
              <h3 className="mt-2.5 font-display text-[1.2rem] font-bold text-foreground">
                {col.title}
              </h3>
              <p className="mt-2.5 text-[0.9rem] leading-[1.65] text-foreground/65">{col.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
