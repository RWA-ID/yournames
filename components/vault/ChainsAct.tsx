/*
 * Act 01 — "One name. Every chain." Gold-mesh full-bleed background with six
 * glassy coin chips that slide in on scroll (GSAP scrub wired in
 * VaultExperience) then bob via CSS. Logos are official coin marks stored
 * locally in /public/logos/coins (see LOGOS_ATTRIBUTION.md) — never hotlinked,
 * so the page stays fully self-contained on IPFS.
 */

const COINS = [
  { src: "/logos/coins/btc.svg", alt: "Bitcoin logo", ticker: "BTC", size: "h-32 w-32 sm:h-44 sm:w-44", pos: { top: "4%", left: "8%" }, dir: -1, dur: "6.5s", delay: "0s" },
  { src: "/logos/coins/eth.svg", alt: "Ethereum logo", ticker: "ETH", size: "h-36 w-36 sm:h-52 sm:w-52", pos: { top: "30%", right: "4%" }, dir: 1, dur: "7.4s", delay: ".6s" },
  { src: "/logos/coins/sol.png", alt: "Solana logo", ticker: "SOL", size: "h-24 w-24 sm:h-32 sm:w-32", pos: { bottom: "8%", left: "16%" }, dir: -1, dur: "5.6s", delay: ".3s" },
  { src: "/logos/coins/doge.svg", alt: "Dogecoin logo", ticker: "DOGE", size: "h-20 w-20 sm:h-28 sm:w-28", pos: { top: "0%", right: "22%" }, dir: 1, dur: "6.1s", delay: "1s" },
  { src: "/logos/coins/op.png", alt: "Optimism logo", ticker: "OPTIMISM", size: "h-20 w-20 sm:h-24 sm:w-24", pos: { bottom: "0%", right: "30%" }, dir: 1, dur: "5.2s", delay: ".8s" },
  { src: "/logos/coins/pol.svg", alt: "Polygon logo", ticker: "POL", size: "h-16 w-16 sm:h-24 sm:w-24", pos: { top: "48%", left: "36%" }, dir: -1, dur: "6.8s", delay: ".2s" },
];

export default function ChainsAct() {
  return (
    <section id="chains" className="relative overflow-hidden border-t border-gold/20">
      {/* gold mesh background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/vault/gold-mesh.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0b0b0c 0%, rgba(11,11,12,0.55) 22%, rgba(11,11,12,0.55) 70%, #0b0b0c 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 py-32 sm:px-8 sm:py-44 lg:grid-cols-2">
        <div>
          <p className="mb-8 text-[11px] uppercase tracking-[0.35em] text-gold" data-rise>
            act 01 — inside the vault
          </p>
          <h2
            className="font-display text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl"
            data-rise
          >
            One name.
            <br />
            <span className="gold-grad">Every chain.</span>
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#cfc8ba] sm:text-base" data-rise>
            your .eth name isn&apos;t only for ethereum. attach addresses for bitcoin, solana,
            dogecoin and 100+ other coins — and any app that speaks ENS routes each one to the
            right place. send bitcoin to <b className="text-foreground">yourname.eth</b>. it just
            works.
          </p>

          <ul className="mt-10 space-y-4 text-[13px] sm:text-sm" data-rise>
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span className="text-[#cfc8ba]">
                <b className="text-foreground">multi-coin records</b> — one name receives BTC, SOL,
                DOGE &amp; more
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span className="text-[#cfc8ba]">
                <b className="text-foreground">works on L2s</b> — your name resolves on Base,
                Arbitrum and Optimism
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span className="text-[#cfc8ba]">
                <b className="text-foreground">one identity everywhere</b> — same avatar and
                profile in every app, on every chain
              </span>
            </li>
          </ul>

          <p className="mt-10 text-[11px] leading-relaxed text-[#8f8878]" data-rise>
            the technical truth ↓ — multi-coin address resolution per ENSIP-9 (SLIP-44 coin types),
            wildcard &amp; offchain resolution per ENSIP-10 + CCIP-read.
          </p>
        </div>

        {/* floating coin chips (slide in on scroll) */}
        <div id="coin-field" className="relative h-[360px] sm:h-[460px]" aria-hidden="true">
          {COINS.map((c) => (
            <div key={c.ticker} className={`coin ${c.size}`} style={c.pos} data-dir={c.dir}>
              <div
                className="coin-inner"
                style={{ "--bob-dur": c.dur, "--bob-delay": c.delay } as React.CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.src}
                  alt={c.alt}
                  className="h-full w-full rounded-full object-contain"
                  style={{ filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.55))" }}
                />
                <span className="absolute left-0 right-0 top-full mt-3 text-center text-[10px] tracking-[0.25em] text-[#cfc8ba]">
                  {c.ticker}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
