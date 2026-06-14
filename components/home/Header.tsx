"use client";

import Link from "next/link";
import { useAccount, useEnsName } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { truncateAddress } from "@/lib/format";
import Wordmark from "./Wordmark";

/*
 * Sticky site header — translucent blur over the page, hairline bottom border.
 * Left: wordmark (→ #top on home, → / elsewhere). Right: section nav, a "My
 * names" pill, and a primary Connect-wallet button that swaps to a connected
 * pill (mint dot + name + gradient avatar) via the real Reown/wagmi connector.
 * `home` switches in-page anchors (#people) to cross-page (/#people).
 */
export default function Header({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });

  const navLink =
    "rounded-full px-3.5 py-2 text-sm font-medium text-muted transition hover:bg-brand-soft hover:text-foreground";

  return (
    <header
      className="sticky top-0 z-40 border-b border-line"
      style={{ background: "rgba(251,253,251,0.82)", backdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href={home ? "#top" : "/"} className="inline-flex items-center" aria-label="yournames.eth home">
          <Wordmark />
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main">
          <a href={`${prefix}#people`} className={`hidden sm:inline-flex ${navLink}`}>
            For people
          </a>
          <a href={`${prefix}#brands`} className={`hidden sm:inline-flex ${navLink}`}>
            For brands
          </a>
          <a href={`${prefix}#safety`} className={`hidden md:inline-flex ${navLink}`}>
            Why it&apos;s safe
          </a>
          <span className="mx-1.5 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
          <Link
            href="/manage/"
            className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition hover:border-brand hover:bg-brand-soft"
          >
            My names
          </Link>

          {isConnected && address ? (
            <button
              onClick={() => open()}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-foreground shadow-soft transition hover:border-brand"
            >
              <span className="size-2 rounded-full bg-mint" aria-hidden="true" />
              {ensName ?? truncateAddress(address)}
              <span
                className="size-6 rounded-full"
                style={{ background: "var(--gradient-brand)" }}
                aria-hidden="true"
              />
            </button>
          ) : (
            <button
              onClick={() => open()}
              className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-strong active:scale-[0.98]"
            >
              Connect wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
