"use client";

import { useEffect, useRef, useState } from "react";
import { checkLabel } from "@/lib/normalize";
import { isAvailable, rentPrice } from "@/lib/registration";
import { YEAR_SECONDS } from "@/lib/ens";
import { fmtEth, fmtUsd, fetchEthUsd } from "@/lib/format";
import { SITE } from "@/lib/site";
import SecondaryMarket from "./SecondaryMarket";

/*
 * The hero "Registry check" card — the app's core interaction. A ledger-style
 * card: name input, hairline-separated rows (live status + real protocol
 * price from the ETHRegistrarController), and a CTA that opens the
 * commit/reveal RegisterFlow when the name is available, or points to the
 * current owner (plus the Grails secondary-market panel) when it's taken.
 */

/** FinalCTA seeds the hero input through this ({nonce} distinguishes repeats). */
export type Seed = { value: string; nonce: number };

export type SearchResult = {
  label: string;
  name: string;
  available: boolean;
  yearlyWei: bigint;
};

type Status =
  | { kind: "idle" }
  | { kind: "invalid"; reason: string }
  | { kind: "checking" }
  | { kind: "result"; result: SearchResult }
  | { kind: "error" };

export default function RegistryCheck({
  onRegister,
  seed,
}: {
  onRegister: (label: string) => void;
  seed: Seed | null;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    fetchEthUsd().then(setEthUsd);
  }, []);

  // FinalCTA "Check now" hands its query up to the hero card.
  useEffect(() => {
    if (!seed) return;
    setInput(seed.value);
    const el = inputRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  }, [seed]);

  // Debounced availability + real protocol price as the user types.
  useEffect(() => {
    const id = ++seq.current;
    if (!input.trim()) {
      setStatus({ kind: "idle" });
      return;
    }
    const check = checkLabel(input);
    if (!check.ok) {
      setStatus({ kind: "invalid", reason: check.reason });
      return;
    }
    setStatus({ kind: "checking" });
    const t = setTimeout(async () => {
      try {
        const [avail, price] = await Promise.all([
          isAvailable(check.label),
          rentPrice(check.label, YEAR_SECONDS),
        ]);
        if (seq.current !== id) return;
        setStatus({
          kind: "result",
          result: { label: check.label, name: check.name, available: avail, yearlyWei: price.total },
        });
      } catch {
        if (seq.current === id) setStatus({ kind: "error" });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  const result = status.kind === "result" ? status.result : null;
  const usd = result ? fmtUsd(result.yearlyWei, ethUsd) : null;

  return (
    <div>
      <div className="rounded-[8px] border border-line-card bg-surface">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-[0.9rem]">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-faint">
            Registry check
          </span>
          <span className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-mint">
            <span className="size-[5px] rounded-full bg-mint" aria-hidden="true" />
            Live
          </span>
        </div>

        <div className="p-6">
          {/* Name input */}
          <div className="flex items-stretch overflow-hidden rounded-[6px] border border-line-strong transition focus-within:border-foreground/60">
            <label htmlFor="name-search" className="sr-only">
              Search for your .eth name
            </label>
            <input
              id="name-search"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && result?.available) onRegister(result.label);
              }}
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="yourname"
              maxLength={32}
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 font-display text-[1.1rem] font-bold text-foreground outline-none focus-visible:outline-none placeholder:font-normal placeholder:text-foreground/40"
            />
            <span className="flex select-none items-center pr-4 font-display text-[1.1rem] font-bold text-foreground/45">
              .eth
            </span>
          </div>

          {/* Ledger rows */}
          <div className="mt-5 flex flex-col" aria-live="polite">
            <Row k="Status">
              {status.kind === "idle" && (
                <span className="font-normal text-faint">type a name to check</span>
              )}
              {status.kind === "checking" && (
                <span className="font-normal text-faint">checking on Ethereum…</span>
              )}
              {status.kind === "invalid" && <span className="text-amberx">{status.reason}</span>}
              {status.kind === "error" && (
                <span className="text-amberx">Couldn&apos;t reach Ethereum — try again</span>
              )}
              {result && (result.available ? (
                <span className="text-mint">Available</span>
              ) : (
                <span className="text-rosex">Taken</span>
              ))}
            </Row>
            <Row k="Protocol price">
              {result
                ? `${fmtEth(result.yearlyWei)}${usd ? ` (≈${usd})` : ""} / year, paid to ENS`
                : "$5 / year, paid to ENS"}
            </Row>
            <Row k="Platform fee">$0 — ever</Row>
            <Row k="Ownership" last>
              your wallet, only
            </Row>
          </div>

          {/* CTA */}
          {result && !result.available ? (
            <a
              href={`${SITE.ensApp}/${result.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-[4px] border border-foreground/40 py-[0.85rem] text-center text-sm font-semibold text-foreground transition hover:border-foreground"
            >
              See who owns {result.name} →
            </a>
          ) : (
            <button
              onClick={() => result?.available && onRegister(result.label)}
              disabled={!result?.available}
              className="mt-5 block w-full rounded-[4px] bg-foreground py-[0.85rem] text-center text-sm font-semibold text-background transition hover:bg-white disabled:cursor-default disabled:opacity-50"
            >
              {result?.available ? `Register ${result.name} →` : "Register your name →"}
            </button>
          )}
        </div>
      </div>

      {/* Taken? Offer the live secondary market (Grails) under the card. */}
      {result && !result.available && <SecondaryMarket name={result.name} ethUsd={ethUsd} />}
    </div>
  );
}

function Row({
  k,
  children,
  last = false,
}: {
  k: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-[0.7rem] text-sm ${
        last ? "" : "border-b border-line-faint"
      }`}
    >
      <span className="shrink-0 text-faint">{k}</span>
      <span className="text-right font-semibold text-foreground">{children}</span>
    </div>
  );
}
