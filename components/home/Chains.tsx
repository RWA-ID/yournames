import Reveal from "./Reveal";

/*
 * "One name. Every chain." — plain band pairing the editorial pitch with a
 * ledger card: an ENS-marked yourname.eth chip up top, then a hairline grid
 * of the coins a single name can receive (multi-coin address records).
 * Coin marks are local files (/public/logos/coins) — IPFS self-contained.
 */
const COINS: Array<{ name: string; symbol: string; src: string }> = [
  { name: "Bitcoin", symbol: "BTC", src: "/logos/coins/btc.svg" },
  { name: "Ethereum", symbol: "ETH", src: "/logos/coins/eth.svg" },
  { name: "Solana", symbol: "SOL", src: "/logos/coins/sol.png" },
  { name: "USDC", symbol: "USDC", src: "/logos/coins/usdc.svg" },
  { name: "Dogecoin", symbol: "DOGE", src: "/logos/coins/doge.svg" },
];

export default function Chains() {
  return (
    <section id="chains" className="border-t border-line">
      <div className="mx-auto grid w-full max-w-[70rem] items-center gap-12 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Multi-chain</p>
          <h2 className="mt-4 font-display text-[1.9rem] font-bold tracking-[-0.02em] text-foreground sm:text-[2.4rem]">
            One name. <span className="editorial">Every chain.</span>
          </h2>
          <p className="mt-5 max-w-[28rem] text-[0.9375rem] leading-[1.7] text-foreground/65">
            A .eth name isn&apos;t only an Ethereum address. It holds a payment address for{" "}
            <strong className="font-semibold text-foreground">
              Bitcoin, Solana, Ethereum, USDC, Dogecoin
            </strong>{" "}
            and dozens more — set each once, then anyone, on any of those networks, just types
            your name.
          </p>
          <p className="mt-4 max-w-[28rem] text-[0.9375rem] leading-[1.7] text-foreground/65">
            No more &ldquo;which address do I use?&rdquo; — the sender&apos;s wallet picks the
            right one automatically.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[8px] border border-line-card bg-surface p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-line pb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/wallets/ens.png"
                alt="ENS logo"
                className="size-9 rounded-[8px]"
                loading="lazy"
              />
              <div>
                <p className="font-display text-[1.05rem] font-bold text-foreground">
                  yourname.eth
                </p>
                <p className="text-xs text-foreground/50">one ENS name · every address below</p>
              </div>
            </div>

            <ul className="mt-2">
              {COINS.map((c, i) => (
                <li
                  key={c.symbol}
                  className={`flex items-center gap-4 py-3.5 ${
                    i < COINS.length - 1 ? "border-b border-line-faint" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={`${c.name} logo`} className="size-9 shrink-0" loading="lazy" />
                  <span className="flex-1 text-[0.9375rem] font-semibold text-foreground">
                    {c.name}
                  </span>
                  <span className="font-mono text-xs text-foreground/45">{c.symbol}</span>
                  <span className="text-xs font-medium text-mint">→ yourname.eth</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-foreground/40">
              …and 100+ more chains via ENS multi-coin address records.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
