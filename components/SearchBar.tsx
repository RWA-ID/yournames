"use client";

import { useEffect, useRef, useState } from "react";
import { checkLabel } from "@/lib/normalize";
import { isAvailable, rentPrice } from "@/lib/registration";
import { YEAR_SECONDS } from "@/lib/ens";
import { fmtEth, fmtUsd, fetchEthUsd } from "@/lib/format";

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

/**
 * The hero hook: type a name → instant availability + real protocol price.
 * Debounced reads against ETHRegistrarController.available/rentPrice.
 */
export default function SearchBar({
  onRegister,
}: {
  onRegister: (r: SearchResult) => void;
}) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    fetchEthUsd().then(setEthUsd);
  }, []);

  useEffect(() => {
    const id = ++seq.current;
    const raw = input;
    if (!raw.trim()) {
      setStatus({ kind: "idle" });
      return;
    }
    const check = checkLabel(raw);
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
          result: {
            label: check.label,
            name: check.name,
            available: avail,
            yearlyWei: price.total,
          },
        });
      } catch {
        if (seq.current === id) setStatus({ kind: "error" });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  const result = status.kind === "result" ? status.result : null;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        className={`flex items-center gap-2 rounded-[20px] border-2 bg-[rgba(13,11,30,0.78)] p-2 shadow-[0_10px_40px_rgba(10,9,24,0.6),0_0_30px_rgba(124,58,237,0.18)] backdrop-blur-md transition ${
          result?.available
            ? "border-[rgba(45,212,191,0.7)]"
            : result && !result.available
              ? "border-[rgba(251,113,133,0.65)]"
              : "border-[rgba(167,139,250,0.32)] focus-within:border-[#627eea] focus-within:shadow-[0_10px_40px_rgba(10,9,24,0.6),0_0_36px_rgba(98,126,234,0.35)]"
        }`}
      >
        <label htmlFor="name-search" className="sr-only">
          Search for your .eth name
        </label>
        <input
          id="name-search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Find your name…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-lg outline-none placeholder:text-muted/70"
        />
        <span className="pr-1 font-display text-lg font-semibold text-muted/80">.eth</span>
      </div>

      <div className="mt-3 min-h-16" aria-live="polite">
        {status.kind === "invalid" && (
          <p className="px-2 text-sm text-amberx">{status.reason}</p>
        )}
        {status.kind === "checking" && (
          <div className="flex items-center gap-2 px-2 text-sm text-muted">
            <span className="inline-block size-2 animate-pulse rounded-full bg-brand" />
            Checking availability…
          </div>
        )}
        {status.kind === "error" && (
          <p className="px-2 text-sm text-rosex">Couldn&apos;t reach Ethereum — try again in a moment.</p>
        )}
        {result && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-[rgba(17,14,38,0.92)] px-4 py-3 shadow-[0_14px_44px_rgba(10,9,24,0.7)] backdrop-blur">
            <div>
              <p className="font-display text-lg font-semibold">{result.name}</p>
              {result.available ? (
                <p className="text-sm text-mint">
                  Available · {fmtEth(result.yearlyWei)}
                  {fmtUsd(result.yearlyWei, ethUsd) ? ` (≈${fmtUsd(result.yearlyWei, ethUsd)})` : ""} / year
                </p>
              ) : (
                <p className="text-sm text-rosex">Already registered — try another</p>
              )}
            </div>
            {result.available && (
              <button
                onClick={() => onRegister(result)}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                Register →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
