"use client";

import Link from "next/link";
import { useAccount, useEnsName } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { truncateAddress } from "@/lib/format";

export function ConnectButton({ className = "" }: { className?: string }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });

  return (
    <button
      onClick={() => open()}
      className={`rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700 active:scale-[0.98] ${className}`}
    >
      {isConnected && address ? ensName ?? truncateAddress(address) : "Connect wallet"}
    </button>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          your<span className="text-gradient">names</span>.eth
        </Link>
        <nav className="flex items-center gap-2 sm:gap-5" aria-label="Main">
          <Link
            href="/manage/"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground"
          >
            My names
          </Link>
          <a
            href="#faq"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground sm:block"
          >
            FAQ
          </a>
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}
