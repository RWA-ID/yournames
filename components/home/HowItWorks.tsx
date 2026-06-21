import Reveal from "./Reveal";
import { accentAt } from "./accents";

/*
 * "How it works." — three step cards (indigo/sky/emerald) with a 4px gradient
 * accent bar pinned across the top and a gradient StepBadge overlapping the
 * top-left corner. Cards must NOT clip overflow or the badge gets cut off.
 */

const STEPS = [
  {
    n: "1",
    title: "Connect a wallet",
    text: "MetaMask, Coinbase Wallet, Rainbow — or scan a QR with your phone. Your wallet is your account; we never hold anything.",
  },
  {
    n: "2",
    title: "Search your name",
    text: "See instantly if it's free and exactly what ENS charges per year. Most names are a few dollars; short ones cost more.",
  },
  {
    n: "3",
    title: "Register in two steps",
    text: "Ethereum asks for two transactions about a minute apart — a safety step that stops bots sniping your name. Then it's yours.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-y border-line bg-tint">
      <div className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <h2
          className="text-center font-display font-bold"
          style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}
        >
          How it works.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => {
          const t = accentAt(i);
          return (
            <Reveal as="div" key={s.n} delay={i * 0.08}>
              <div
                className="relative h-full px-6 pb-6 pt-9"
                style={{
                  borderRadius: "var(--radius-card)",
                  border: `1px solid ${t.ring}`,
                  background: `linear-gradient(180deg,${t.wash},var(--surface) 62%)`,
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{
                    borderRadius: "var(--radius-card) var(--radius-card) 0 0",
                    background: `linear-gradient(90deg,${t.g1},${t.g2})`,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute -top-5 left-6 inline-flex size-10 items-center justify-center font-display text-lg font-bold text-white"
                  style={{
                    borderRadius: 14,
                    background: `linear-gradient(135deg,${t.g1},${t.g2})`,
                    boxShadow: `0 10px 20px -4px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
                  }}
                >
                  {s.n}
                </span>
                <h3 className="mb-1.5 font-display text-lg font-bold">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      </div>
    </section>
  );
}
