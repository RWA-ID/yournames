"use client";

import { useState } from "react";

/**
 * "Works everywhere" marquee. Brand logos are served by the Brandfetch Logo
 * Link CDN (see LOGOS_ATTRIBUTION.md) — if a logo fails to load, the chip
 * gracefully degrades to the brand name alone.
 */
const BRANDFETCH_CLIENT = "1idCGSZnaFL2hkG7DtD";
const logoUrl = (domain: string) =>
  `https://cdn.brandfetch.io/domain/${domain}?c=${BRANDFETCH_CLIENT}`;

type Integration = { name: string; domain: string };

const INTEGRATIONS: Integration[] = [
  { name: "MetaMask", domain: "metamask.io" },
  { name: "Coinbase Wallet", domain: "coinbase.com" },
  { name: "Ledger", domain: "ledger.com" },
  { name: "Uniswap", domain: "uniswap.org" },
  { name: "OpenSea", domain: "opensea.io" },
  { name: "Etherscan", domain: "etherscan.io" },
  { name: "Brave", domain: "brave.com" },
  { name: "Farcaster", domain: "farcaster.xyz" },
  { name: "Base", domain: "base.org" },
  { name: "Rainbow", domain: "rainbow.me" },
  { name: "Trust Wallet", domain: "trustwallet.com" },
  { name: "GoDaddy", domain: "godaddy.com" },
];

export default function Integrations() {
  return (
    <section className="cs-band border-y border-line py-14">
      <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Works everywhere</h2>
      <p className="mx-auto mt-3 max-w-md px-4 text-center text-sm text-muted">
        These platforms recognize ENS names. We are not affiliated with them.
      </p>
      <div className="marquee mt-8 overflow-hidden" aria-label="Platforms that support ENS">
        <div className="marquee-track flex w-max items-center gap-6 px-3">
          {[...INTEGRATIONS, ...INTEGRATIONS].map((it, i) => (
            <Chip key={`${it.name}-${i}`} integration={it} ariaHidden={i >= INTEGRATIONS.length} />
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-[11px] text-muted/70">
        Logos by{" "}
        <a className="hover:underline" href="https://brandfetch.com" target="_blank" rel="noreferrer">
          Brandfetch
        </a>
      </p>
    </section>
  );
}

function Chip({ integration, ariaHidden }: { integration: Integration; ariaHidden: boolean }) {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <span
      aria-hidden={ariaHidden}
      className="inline-flex items-center gap-2.5 rounded-full border border-line bg-[rgba(13,11,30,0.55)] py-2 pl-3 pr-5 font-display text-sm font-semibold text-muted transition hover:border-[rgba(167,139,250,0.5)] hover:text-foreground"
    >
      {logoOk && (
        // eslint-disable-next-line @next/next/no-img-element -- remote CDN logo, no optimization needed on a static export
        <img
          src={logoUrl(integration.domain)}
          alt={ariaHidden ? "" : `${integration.name} logo`}
          loading="lazy"
          className="h-6 w-6 rounded-md object-contain"
          onError={() => setLogoOk(false)}
        />
      )}
      {integration.name}
    </span>
  );
}
