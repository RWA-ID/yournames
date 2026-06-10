"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * "Works everywhere" marquee. Logos must be OFFICIAL brand assets stored in
 * /public/logos/ (see LOGOS_ATTRIBUTION.md). Until a logo file is added, the
 * entry renders as a tasteful text chip — never hotlink brand assets.
 */
type Integration = { name: string; logo: string };

const INTEGRATIONS: Integration[] = [
  { name: "MetaMask", logo: "/logos/metamask.svg" },
  { name: "Coinbase Wallet", logo: "/logos/coinbase-wallet.svg" },
  { name: "Ledger", logo: "/logos/ledger.svg" },
  { name: "Uniswap", logo: "/logos/uniswap.svg" },
  { name: "OpenSea", logo: "/logos/opensea.svg" },
  { name: "Etherscan", logo: "/logos/etherscan.svg" },
  { name: "Brave", logo: "/logos/brave.svg" },
  { name: "Farcaster", logo: "/logos/farcaster.svg" },
  { name: "Base", logo: "/logos/base.svg" },
  { name: "Rainbow", logo: "/logos/rainbow.svg" },
  { name: "Trust Wallet", logo: "/logos/trust-wallet.svg" },
  { name: "GoDaddy", logo: "/logos/godaddy.svg" },
];

export default function Integrations() {
  return (
    <section className="border-y border-line bg-surface py-14">
      <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Works everywhere</h2>
      <p className="mx-auto mt-3 max-w-md px-4 text-center text-sm text-muted">
        These platforms recognize ENS names. We are not affiliated with them.
      </p>
      <div className="marquee mt-8 overflow-hidden" aria-label="Platforms that support ENS">
        <div className="marquee-track flex w-max items-center gap-10 px-5">
          {[...INTEGRATIONS, ...INTEGRATIONS].map((it, i) => (
            <Logo key={`${it.name}-${i}`} integration={it} ariaHidden={i >= INTEGRATIONS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Logo({ integration, ariaHidden }: { integration: Integration; ariaHidden: boolean }) {
  const [hasFile, setHasFile] = useState(false);

  useEffect(() => {
    // Probe once whether the official logo file has been added to /public/logos.
    fetch(integration.logo, { method: "HEAD" })
      .then((r) => setHasFile(r.ok))
      .catch(() => setHasFile(false));
  }, [integration.logo]);

  if (hasFile) {
    return (
      <Image
        src={integration.logo}
        alt={ariaHidden ? "" : `${integration.name} logo`}
        aria-hidden={ariaHidden}
        width={120}
        height={36}
        className="h-9 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
      />
    );
  }
  return (
    <span
      aria-hidden={ariaHidden}
      className="rounded-full border border-line px-5 py-2 font-display text-sm font-semibold text-muted transition hover:border-brand hover:text-foreground"
    >
      {integration.name}
    </span>
  );
}
