import Reveal from "./Reveal";

/*
 * "Works in the wallets you already use" — tinted full-bleed band: eyebrow +
 * editorial H2 beside an intro paragraph, then a hairline grid of wallet
 * tiles (brand mark + name + one-line role). Logos live in
 * /public/logos/wallets so the IPFS build stays self-contained — see
 * LOGOS_ATTRIBUTION.md for sourcing. Marks with a dark-on-dark problem
 * (Phantom's ink ghost) sit on their brand tile color instead.
 */
const WALLETS: Array<{
  name: string;
  src: string;
  note: string;
  /** Optional tile treatment behind marks that need it. */
  chip?: string;
  rounded?: boolean;
}> = [
  { name: "MetaMask", src: "/logos/wallets/metamask.webp", note: "resolves .eth everywhere" },
  { name: "Trust Wallet", src: "/logos/wallets/trust.png", note: "send to names, not addresses" },
  {
    name: "Coinbase Wallet",
    src: "/logos/wallets/coinbase.png",
    note: "names in send & receive",
    rounded: true,
  },
  {
    name: "Phantom",
    src: "/logos/wallets/phantom.webp",
    note: "multi-chain, ENS built in",
    chip: "#ab9ff2",
  },
  { name: "Uniswap Wallet", src: "/logos/wallets/uniswap.webp", note: "swap & send by name" },
  { name: "Rainbow", src: "/logos/wallets/rainbow.webp", note: "ENS-native from day one", rounded: true },
  {
    name: "PayPal",
    src: "/logos/wallets/paypal.webp",
    note: "crypto transfers to .eth names",
  },
];

export default function Wallets() {
  return (
    <section id="wallets" className="border-t border-line bg-tint">
      <div className="mx-auto w-full max-w-[70rem] px-6 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-8">
          <Reveal>
            <p className="eyebrow">Works everywhere</p>
            <h2 className="mt-4 font-display text-[1.9rem] font-bold tracking-[-0.02em] text-foreground sm:text-[2.4rem]">
              The wallets you use <span className="editorial">already speak ENS.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[24rem]">
            <p className="text-[0.9375rem] leading-[1.7] text-foreground/65">
              Type a .eth name where an address goes and the world&apos;s most-used wallets
              resolve it — even PayPal sends crypto to your name. No setup, no plugin.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {WALLETS.map((w, i) => (
            <Reveal key={w.name} delay={i * 0.05} className="border-t border-line-paper pt-5">
              <span
                className={`flex size-11 items-center justify-center overflow-hidden ${
                  w.rounded || w.chip ? "rounded-[10px]" : ""
                }`}
                style={w.chip ? { background: w.chip, padding: "0.45rem" } : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.src} alt={`${w.name} logo`} className="max-h-full max-w-full" loading="lazy" />
              </span>
              <h3 className="mt-3 font-display text-[1.05rem] font-bold text-foreground">
                {w.name}
              </h3>
              <p className="mt-1 text-[0.85rem] leading-[1.55] text-foreground/60">{w.note}</p>
            </Reveal>
          ))}

          <Reveal delay={WALLETS.length * 0.05} className="border-t border-line-paper pt-5">
            <span className="flex size-11 items-center justify-center rounded-[10px] border border-line text-[1.05rem] font-bold text-foreground/70">
              +
            </span>
            <h3 className="mt-3 font-display text-[1.05rem] font-bold text-foreground">
              1,000+ more apps
            </h3>
            <p className="mt-1 text-[0.85rem] leading-[1.55] text-foreground/60">
              Ledger, Brave, Venmo, browsers, exchanges — the list keeps growing.
            </p>
          </Reveal>
        </div>

        <p className="mt-10 text-xs leading-relaxed text-foreground/40">
          Logos identify third-party products that resolve ENS names (via Brandfetch and official
          brand assets). Trademarks belong to their owners — no affiliation or endorsement implied.
        </p>
      </div>
    </section>
  );
}
