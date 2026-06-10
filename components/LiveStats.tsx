"use client";

import { useEffect, useRef, useState } from "react";
import { publicClient } from "@/lib/wagmi";
import { BASE_REGISTRAR_ABI, ENS } from "@/lib/ens";
import {
  fetchRecentRegistrations,
  fetchRegistrationsSince,
  type RecentRegistration,
} from "@/lib/subgraph";

/**
 * Live ENS stats strip.
 * - Total names: BaseRegistrar.totalSupply() straight from chain (always works).
 * - Today's registrations + live ticker: ENS subgraph, fail-soft (hidden if down).
 * Polls every 30s.
 */
export default function LiveStats() {
  const [total, setTotal] = useState<number | null>(null);
  const [today, setToday] = useState<number | null>(null);
  const [recent, setRecent] = useState<RecentRegistration[] | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      publicClient
        .readContract({
          address: ENS.baseRegistrar,
          abi: BASE_REGISTRAR_ABI,
          functionName: "totalSupply",
        })
        .then((v) => alive && setTotal(Number(v)))
        .catch(() => {});
      const dayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
      fetchRegistrationsSince(dayStart).then((n) => alive && setToday(n));
      fetchRecentRegistrations(24).then((r) => alive && setRecent(r));
    };
    load();
    const t = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <section aria-label="Live ENS registration stats" className="cs-band border-y border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-center sm:gap-16 sm:px-6">
        <Stat
          label=".eth names registered"
          value={total}
          format={(n) => n.toLocaleString("en-US")}
        />
        <Stat
          label="registered today"
          value={today}
          format={(n) => (n >= 1000 ? "1,000+" : n.toLocaleString("en-US"))}
        />
        <div className="text-center sm:text-left">
          <p className="font-display text-3xl font-bold text-mint">$0</p>
          <p className="mt-1 text-sm text-muted">platform fees, ever</p>
        </div>
      </div>

      {recent && recent.length > 0 && (
        <div className="marquee overflow-hidden border-t border-line py-2.5" aria-hidden>
          <div className="ticker-track flex w-max gap-8 whitespace-nowrap px-4 text-sm text-muted">
            {[...recent, ...recent].map((r, i) => (
              <span key={`${r.name}-${i}`}>
                <span className="font-medium text-foreground">{r.name}</span> just registered ·
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  format,
}: {
  label: string;
  value: number | null;
  format: (n: number) => string;
}) {
  const display = useCountUp(value);
  return (
    <div className="text-center sm:text-left">
      {value === null ? (
        <div className="mx-auto h-9 w-28 animate-pulse rounded-lg bg-line sm:mx-0" />
      ) : (
        <p className="font-display text-3xl font-bold text-gradient">{format(display)}</p>
      )}
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

/** Animate 0 → value once on first load; jump directly on later refreshes. */
function useCountUp(target: number | null): number {
  const [val, setVal] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (target === null) return;
    if (animated.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      animated.current = true;
      return;
    }
    animated.current = true;
    const start = performance.now();
    const dur = 1200;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return val;
}
