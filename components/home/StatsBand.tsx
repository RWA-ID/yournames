import Reveal from "./Reveal";

/*
 * Stats band — three ledger figures on a hairline-topped band. Doubles as the
 * "Pricing" section: the whole pricing story is protocol price + $0 from us.
 */
const STATS: Array<{ figure: React.ReactNode; caption: string }> = [
  {
    figure: (
      <>
        $5<span className="text-[1.4rem] text-foreground/50">/yr</span>
      </>
    ),
    caption: "typical protocol price, paid to ENS",
  },
  { figure: "0%", caption: "platform fee — we add nothing, ever" },
  { figure: "1,000+", caption: "apps resolve your name today" },
];

export default function StatsBand() {
  return (
    <section id="pricing" className="border-t border-line">
      <div className="mx-auto grid w-full max-w-[70rem] gap-8 px-6 py-14 sm:grid-cols-3 sm:px-8 sm:py-[4.5rem]">
        {STATS.map((s, i) => (
          <Reveal key={s.caption} delay={i * 0.1}>
            <p className="font-display text-[2.6rem] font-extrabold tracking-[-0.03em] text-foreground sm:text-[3.25rem]">
              {s.figure}
            </p>
            <p className="mt-1 text-sm text-faint">{s.caption}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
