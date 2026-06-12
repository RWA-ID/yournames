"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useEnsName } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { truncateAddress } from "@/lib/format";

/*
 * Vault header — floats transparent over the hero video, gains a dark blurred
 * backdrop + gold hairline once scrolled (so "your" stays legible over the
 * bright gold-mesh act). Wordmark: >_ your·names·.eth in mono extrabold.
 * `home` switches the section anchors between in-page (#how, smooth via Lenis)
 * and cross-page (/#how) for the /manage surfaces.
 */
export default function VaultHeader({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const [scrolled, setScrolled] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 text-[13px] transition-colors duration-300 sm:px-8 ${
        scrolled
          ? "border-b border-gold/15 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Link href="/" className="text-base font-extrabold tracking-tight sm:text-lg">
        <span className="select-none text-gold">&gt;_</span>{" "}
        <span className="text-white">your</span>
        <span className="gold-grad">names</span>
        <span className="text-[#8f8878]">.eth</span>
      </Link>
      <nav className="flex items-center gap-3 sm:gap-5" aria-label="Main">
        <a href={`${prefix}#how`} className="hidden text-muted transition-colors hover:text-foreground sm:inline">
          how it works
        </a>
        <a href={`${prefix}#faq`} className="hidden text-muted transition-colors hover:text-foreground sm:inline">
          questions
        </a>
        <a href={`${prefix}#sponsors`} className="hidden text-gold transition-colors hover:text-foreground sm:inline">
          donate
        </a>
        <Link
          href="/manage/"
          className={`transition-colors hover:text-foreground ${
            isConnected ? "font-bold text-gold" : "text-muted"
          }`}
        >
          my names
        </Link>
        <button
          onClick={() => open()}
          className="rounded-full border border-line px-4 py-1.5 transition-colors hover:border-gold hover:text-white"
        >
          {isConnected && address ? ensName ?? truncateAddress(address) : "connect wallet"}
        </button>
      </nav>
    </header>
  );
}
