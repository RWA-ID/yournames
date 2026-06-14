import Reveal from "./Reveal";

/*
 * "One name, every chain" — one .eth name resolving to a wallet on many
 * networks, shown as a stacked card of chain rows (ENSIP-9 / ENSIP-11).
 */

const CHAINS = [
  { name: "Ethereum", domain: "ethereum.org", addr: "0x71C7…8976F" },
  { name: "Base", domain: "base.org", addr: "0x71C7…8976F" },
  { name: "Optimism", domain: "optimism.io", addr: "0x71C7…8976F" },
  { name: "Arbitrum", domain: "arbitrum.io", addr: "0x71C7…8976F" },
  { name: "Polygon", domain: "polygon.technology", addr: "0x71C7…8976F" },
  { name: "Solana", domain: "solana.com", addr: "7Ut9…k3Qd" },
  { name: "Bitcoin", domain: "bitcoin.org", addr: "bc1q…px8r" },
];

const BRANDFETCH = "?c=1idCGSZnaFL2hkG7DtD";

export default function EveryChain() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[13px] font-bold uppercase tracking-wider text-brand">One name, every chain</p>
          <h2
            className="mt-3 font-display font-bold"
            style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}
          >
            Set it once. Get paid on any chain.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Your <strong className="text-foreground">.eth</strong> name points to your wallet on
            Ethereum, Base, Solana, Bitcoin and dozens more. Share one name — senders reach the right
            address on the right network, automatically.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-11 max-w-lg">
          <div
            className="bg-surface px-7 pb-4 pt-6"
            style={{ borderRadius: "var(--radius-card)", border: "1px solid var(--line)", boxShadow: "var(--shadow-lift)" }}
          >
            <div className="flex items-center gap-3.5 pb-4">
              <span className="size-11 shrink-0 rounded-full" style={{ background: "var(--gradient-brand)" }} />
              <div className="flex-1">
                <p className="font-display text-[22px] font-bold tracking-tight">alex.eth</p>
                <p className="mt-px text-[13px] text-muted">resolves to your wallet on…</p>
              </div>
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
                1 name
              </span>
            </div>
            {CHAINS.map((c) => (
              <div key={c.name} className="flex items-center gap-3.5 border-t border-line py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.brandfetch.io/${c.domain}${BRANDFETCH}`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="size-7 shrink-0 rounded-md object-contain"
                />
                <span className="flex-1 font-display text-[15px] font-semibold">{c.name}</span>
                <span className="font-mono text-[13px] text-muted">{c.addr}</span>
              </div>
            ))}
            <div className="border-t border-line pb-2 pt-3.5 text-center">
              <span className="text-[13px] text-muted">
                + dozens more networks — set each address once, share one name.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
