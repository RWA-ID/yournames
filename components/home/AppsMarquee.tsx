/*
 * "Works everywhere" — an infinite logo marquee of apps that already resolve
 * ENS names. Brand marks load from the Brandfetch CDN; the name is always
 * rendered beside it, so a failed/blocked logo degrades to a clean text chip.
 */

const APPS = [
  { name: "PayPal", domain: "paypal.com" },
  { name: "MetaMask", domain: "metamask.io" },
  { name: "Coinbase", domain: "coinbase.com" },
  { name: "Uniswap", domain: "uniswap.org" },
  { name: "OpenSea", domain: "opensea.io" },
  { name: "Farcaster", domain: "farcaster.xyz" },
  { name: "Rainbow", domain: "rainbow.me" },
  { name: "Etherscan", domain: "etherscan.io" },
  { name: "Ledger", domain: "ledger.com" },
];

const BRANDFETCH = "?c=1idCGSZnaFL2hkG7DtD";

export default function AppsMarquee() {
  const loop = [...APPS, ...APPS];
  return (
    <section className="bg-background py-13">
      <p className="mb-7 px-6 text-center text-sm text-muted">
        Already understood by the apps you use every day —{" "}
        <strong className="text-foreground">including PayPal.</strong>
      </p>
      <div
        className="marquee overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
          maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
        }}
      >
        <div className="marquee-track" aria-hidden="false">
          {loop.map((app, i) => (
            <span
              key={`${app.name}-${i}`}
              className="inline-flex flex-none items-center gap-2 rounded-full border border-line bg-surface py-2 pl-2.5 pr-[1.1rem] shadow-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.brandfetch.io/${app.domain}${BRANDFETCH}`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="size-6 rounded-md object-contain"
              />
              <span className="font-display text-[15px] font-semibold text-foreground">{app.name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
