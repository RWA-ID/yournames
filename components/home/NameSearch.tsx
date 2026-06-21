"use client";

import { useEffect, useRef, useState } from "react";
import { checkLabel } from "@/lib/normalize";
import { isAvailable, rentPrice } from "@/lib/registration";
import { YEAR_SECONDS } from "@/lib/ens";
import { fmtEth, fmtUsd, fetchEthUsd } from "@/lib/format";
import SecondaryMarket from "./SecondaryMarket";

/*
 * The core interaction: a large `.eth` search input with debounced availability
 * + real protocol price (against the ETHRegistrarController). The 2px border
 * color encodes state — brand on focus, mint when available, rose when taken.
 * Fires onRegister(label) to open the commit/reveal RegisterFlow.
 */

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

export default function NameSearch({
  onRegister,
  placeholder = "Find your name…",
  onGradient = false,
}: {
  onRegister: (label: string) => void;
  placeholder?: string;
  /** Rendered on the gradient final-CTA band — keeps copy legible. */
  onGradient?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    fetchEthUsd().then(setEthUsd);
  }, []);

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

  const onAction = () => {
    if (result?.available) onRegister(result.label);
    else inputRef.current?.focus();
  };

  // 2px border color = state
  let borderColor = "var(--line)";
  if (status.kind === "invalid") borderColor = "var(--amber)";
  else if (result?.available) borderColor = "var(--mint)";
  else if (result && !result.available) borderColor = "var(--rose)";
  else if (focused) borderColor = "var(--brand)";

  return (
    <div className="mx-auto w-full max-w-xl text-left">
      <div
        className="flex items-center gap-2 bg-surface p-1.5 pl-4 transition-shadow"
        style={{
          borderRadius: "var(--radius-input)",
          border: `2px solid ${borderColor}`,
          boxShadow: focused ? "var(--shadow-lift)" : "var(--shadow-soft)",
        }}
      >
        <label htmlFor="name-search" className="sr-only">
          Search for your .eth name
        </label>
        <input
          id="name-search"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAction();
          }}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={placeholder}
          maxLength={32}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-lg text-foreground outline-none placeholder:text-muted"
        />
        <span className="select-none pr-1 font-display text-base font-semibold text-muted">.eth</span>
        <button
          onClick={onAction}
          className="shrink-0 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-strong active:scale-[0.98]"
        >
          {result?.available ? "Register →" : "Check it"}
        </button>
      </div>

      <div
        className={`mt-3 min-h-[1.5rem] pl-1 text-sm ${onGradient ? "text-white/90" : "text-muted"}`}
        aria-live="polite"
      >
        {status.kind === "idle" && (
          <span>Type a name to see if it&apos;s available — and what ENS charges.</span>
        )}
        {status.kind === "invalid" && <span>{status.reason}</span>}
        {status.kind === "checking" && <span>Checking on Ethereum…</span>}
        {status.kind === "error" && <span>Couldn&apos;t reach Ethereum — try again in a moment.</span>}
        {result &&
          (result.available ? (
            <span className={onGradient ? "font-semibold text-white" : "font-semibold text-mint"}>
              {result.name} is available · {fmtEth(result.yearlyWei)}
              {usd ? ` (≈${usd})` : ""}/yr, paid to ENS
            </span>
          ) : (
            <span>
              <strong className={onGradient ? "text-white" : "text-rosex"}>{result.name} is taken.</strong>{" "}
              Try another — or pick it up on the secondary market below.
            </span>
          ))}
      </div>

      {result && !result.available && (
        <SecondaryMarket name={result.name} ethUsd={ethUsd} />
      )}
    </div>
  );
}
