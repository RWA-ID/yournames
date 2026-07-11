"use client";

import Link from "next/link";
import { useAccount, useEnsName } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { truncateAddress } from "@/lib/format";
import Wordmark from "./Wordmark";
import { focusNameSearch } from "./focusSearch";

/*
 * Sticky site header — translucent ink over the page, hairline bottom border.
 * Left: wordmark (→ #top on home, → / elsewhere). Right: section nav (home
 * only), "My names", a hairline Connect button that swaps to a connected
 * chip (mint dot + name) via the real Reown/wagmi connector, and the primary
 * paper "Find your name" CTA (focuses the hero registry-check input).
 */
export default function Header({ home = false }: { home?: boolean }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });

  const navLink =
    "text-[0.8125rem] font-medium tracking-[0.02em] text-foreground/65 transition hover:text-foreground";

  return (
    <header
      className="sticky top-0 z-40 border-b border-line"
      style={{ background: "var(--header-bg)", backdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[76rem] items-center justify-between gap-3 px-4 sm:px-8">
        <Link href={home ? "#top" : "/"} className="inline-flex items-center" aria-label="yournames.eth home">
          <Wordmark />
        </Link>

        <nav className="flex items-center gap-4 lg:gap-7" aria-label="Main">
          {home && (
            <>
              <a href="#why" className={`hidden md:inline ${navLink}`}>
                Why a name
              </a>
              <a href="#companies" className={`hidden md:inline ${navLink}`}>
                For companies
              </a>
              <a href="#pricing" className={`hidden md:inline ${navLink}`}>
                Pricing
              </a>
            </>
          )}
          <Link href="/faq/" className={`hidden sm:inline ${navLink}`}>
            FAQ
          </Link>
          <Link href="/manage/" className={`hidden sm:inline ${navLink}`}>
            My names
          </Link>

          {isConnected && address ? (
            <button
              onClick={() => open()}
              className="inline-flex items-center gap-2 rounded-[4px] border border-foreground/40 px-3.5 py-2 text-[0.8125rem] font-semibold text-foreground transition hover:border-foreground"
            >
              <span className="size-1.5 rounded-full bg-mint" aria-hidden="true" />
              {ensName ?? truncateAddress(address)}
            </button>
          ) : (
            <button
              onClick={() => open()}
              className="inline-flex items-center rounded-[4px] border border-foreground/40 px-3.5 py-2 text-[0.8125rem] font-semibold text-foreground transition hover:border-foreground"
            >
              Connect
            </button>
          )}

          {home ? (
            <button
              onClick={focusNameSearch}
              className="hidden rounded-[4px] bg-foreground px-5 py-2.5 text-[0.8125rem] font-semibold tracking-[0.02em] text-background transition hover:bg-white sm:inline-block"
            >
              Find your name
            </button>
          ) : (
            <Link
              href="/"
              className="hidden rounded-[4px] bg-foreground px-5 py-2.5 text-[0.8125rem] font-semibold tracking-[0.02em] text-background transition hover:bg-white sm:inline-block"
            >
              Find your name
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
