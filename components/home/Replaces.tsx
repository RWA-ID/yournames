import Reveal from "./Reveal";

/*
 * "What one name replaces" — an editorial ledger: strong top rule, numbered
 * rows (index / task / before→after description) separated by faint hairlines.
 */
const ROWS: Array<{ task: string; desc: React.ReactNode }> = [
  {
    task: "Getting paid",
    desc: (
      <>
        <span className="font-mono text-[0.85em] line-through decoration-rosex">
          0x71C7656EC7ab88b0…976F
        </span>{" "}
        → they type <strong className="font-semibold text-foreground">your name.</strong> Right
        wallet, right network, every time — in PayPal, Venmo, and 1,000+ apps.
      </>
    ),
  },
  {
    task: "Signing in",
    desc: (
      <>
        A password per platform →{" "}
        <strong className="font-semibold text-foreground">&ldquo;Continue as you.eth.&rdquo;</strong>{" "}
        One identity, one profile, carried into every app that supports it.
      </>
    ),
  },
  {
    task: "Being found",
    desc: (
      <>
        A website at a host&apos;s mercy →{" "}
        <strong className="font-semibold text-foreground">yourname.eth.link</strong>, served from
        open networks, answering only to your wallet.
      </>
    ),
  },
  {
    task: "Being trusted",
    desc: (
      <>
        Spoofable emails and handles → an on-chain name that is{" "}
        <strong className="font-semibold text-foreground">provably yours.</strong> Customers pay
        acme.eth, not an address in an invoice.
      </>
    ),
  },
];

export default function Replaces() {
  return (
    <section id="why" className="mx-auto w-full max-w-[70rem] px-6 py-14 sm:px-8 sm:py-20">
      <Reveal>
        <p className="eyebrow">What one name replaces</p>
      </Reveal>
      <div className="mt-8 border-t border-line-strong">
        {ROWS.map((row, i) => (
          <Reveal
            key={row.task}
            delay={i * 0.05}
            className={`grid gap-2 py-6 md:grid-cols-[3.5rem_1.1fr_1.5fr] md:items-baseline ${
              i < ROWS.length - 1 ? "border-b border-line-faint" : ""
            }`}
          >
            <span className="font-display text-[0.8125rem] font-bold text-faint">
              0{i + 1}
            </span>
            <span className="font-display text-[1.35rem] font-bold tracking-[-0.01em] text-foreground">
              {row.task}
            </span>
            <span className="text-[0.9375rem] leading-[1.7] text-foreground/65">{row.desc}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
