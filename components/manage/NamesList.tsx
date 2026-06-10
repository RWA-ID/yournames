"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useEnsName } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { fetchOwnedNames, type OwnedName } from "@/lib/subgraph";
import { fetchOwnedNamesViaNfts } from "@/lib/alchemy";
import { daysUntil, fmtDate } from "@/lib/format";

const PAGE_SIZE = 12;

/**
 * Dashboard list of every name the connected wallet controls.
 * Source: ENS subgraph (registrant/manager/wrapped owner) with an Alchemy
 * NFT-ownership fallback when the subgraph is unavailable.
 */
export default function NamesList() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { data: primaryName } = useEnsName({ address, chainId: 1 });
  const [names, setNames] = useState<OwnedName[] | null | "error">(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!address) return;
    let alive = true;
    setNames(null);
    setPage(0);
    (async () => {
      let result = await fetchOwnedNames(address);
      if (!result) {
        const viaNfts = await fetchOwnedNamesViaNfts(address);
        if (viaNfts) result = viaNfts.map((n) => ({ ...n, expiry: null }));
      }
      if (alive) setNames(result ?? "error");
    })();
    return () => {
      alive = false;
    };
  }, [address]);

  if (!isConnected) {
    return (
      <div className="mt-10 rounded-3xl border border-line bg-surface p-10 text-center shadow-soft">
        <p className="text-4xl" aria-hidden>👋</p>
        <p className="mt-3 font-display text-xl font-bold">Connect to see your names</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          We&apos;ll list every ENS name your wallet owns or manages.
        </p>
        <button
          onClick={() => open()}
          className="mt-5 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-indigo-700"
        >
          Connect wallet
        </button>
      </div>
    );
  }

  if (names === null) {
    return (
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-3xl bg-line/60" />
        ))}
      </div>
    );
  }

  if (names === "error") {
    return (
      <div className="mt-10 rounded-3xl border border-line bg-surface p-8 text-center shadow-soft">
        <p className="font-medium">We couldn&apos;t load your names right now.</p>
        <p className="mt-1 text-sm text-muted">
          The ENS index is unreachable. You can still open a name directly:
        </p>
        <DirectOpen />
      </div>
    );
  }

  if (names.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-line bg-surface p-10 text-center shadow-soft">
        <p className="text-4xl" aria-hidden>✨</p>
        <p className="mt-3 font-display text-xl font-bold">No names yet — let&apos;s fix that</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          Your perfect .eth name might still be available.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-indigo-700"
        >
          Find your name
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(names.length / PAGE_SIZE);
  const visible = names.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="mt-8">
      <ul className="space-y-3">
        {visible.map((n) => {
          const days = n.expiry ? daysUntil(n.expiry) : null;
          const isPrimary = primaryName?.toLowerCase() === n.name.toLowerCase();
          return (
            <li key={n.name}>
              <Link
                href={`/manage/name/?name=${encodeURIComponent(n.name)}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-surface px-5 py-4 shadow-soft transition hover:shadow-lift"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold">{n.name}</p>
                  {n.expiry && days !== null && (
                    <p className={`text-sm ${days < 90 ? "font-semibold text-rosex" : "text-muted"}`}>
                      {days < 0
                        ? `Expired ${fmtDate(n.expiry)} — grace period`
                        : `Expires ${fmtDate(n.expiry)} · in ${days} days`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isPrimary && <Chip tone="brand">★ Primary</Chip>}
                  {n.wrapped && <Chip tone="muted">Wrapped</Chip>}
                  {days !== null && days < 90 && <Chip tone="rose">Renew soon</Chip>}
                  <span aria-hidden className="text-muted">→</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm text-muted">
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone: "brand" | "muted" | "rose" }) {
  const cls =
    tone === "brand"
      ? "bg-brand-soft text-brand"
      : tone === "rose"
        ? "bg-rosex/10 text-rosex"
        : "bg-line/60 text-muted";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{children}</span>
  );
}

/** Manual fallback: open any name you type (ownership verified on-chain). */
function DirectOpen() {
  const [value, setValue] = useState("");
  return (
    <form
      className="mx-auto mt-4 flex max-w-sm gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          window.location.href = `/manage/name/?name=${encodeURIComponent(value.trim().toLowerCase())}`;
        }
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="yourname.eth"
        className="min-w-0 flex-1 rounded-full border border-line bg-background px-4 py-2 text-sm outline-none focus:border-brand"
      />
      <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
        Open
      </button>
    </form>
  );
}
