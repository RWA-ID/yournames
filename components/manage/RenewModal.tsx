"use client";

import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTROLLER_ABI, ENS, YEAR_SECONDS, etherscanAddress } from "@/lib/ens";
import { rentPrice, withBuffer, ZERO_REFERRER } from "@/lib/registration";
import { publicClient } from "@/lib/wagmi";
import { fmtEth, fmtUsd, fetchEthUsd } from "@/lib/format";

/**
 * Renew/extend any .eth name — ENS allows renewing names you don't own.
 * Live protocol price, zero platform fee, single renew() transaction.
 */
export default function RenewModal({
  name,
  onClose,
  onRenewed,
}: {
  name: string;
  onClose: () => void;
  onRenewed: () => void;
}) {
  const label = name.replace(/\.eth$/, "");
  const { writeContractAsync } = useWriteContract();
  const [years, setYears] = useState(1);
  const [priceWei, setPriceWei] = useState<bigint | null>(null);
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [phase, setPhase] = useState<"configure" | "pending" | "done" | "failed">("configure");

  useEffect(() => {
    fetchEthUsd().then(setEthUsd);
  }, []);

  useEffect(() => {
    let stale = false;
    setPriceWei(null);
    rentPrice(label, YEAR_SECONDS * BigInt(years))
      .then((p) => !stale && setPriceWei(p.total))
      .catch(() => {});
    return () => {
      stale = true;
    };
  }, [label, years]);

  const renew = async () => {
    if (priceWei === null) return;
    try {
      setPhase("pending");
      const hash = await writeContractAsync({
        address: ENS.ethRegistrarController,
        abi: CONTROLLER_ABI,
        functionName: "renew",
        args: [label, YEAR_SECONDS * BigInt(years), ZERO_REFERRER],
        value: withBuffer(priceWei), // excess refunded by the contract
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setPhase("done");
      onRenewed();
    } catch {
      setPhase("failed");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,9,12,0.66)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Renew ${name}`}
    >
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-lift sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Extend {name}</h3>
          {phase !== "pending" && (
            <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted hover:bg-brand-soft">
              ✕
            </button>
          )}
        </div>

        {phase === "configure" && (
          <>
            <label className="mb-1 block text-sm font-medium" htmlFor="renew-years">
              Extend by
            </label>
            <div className="flex items-center gap-4">
              <input
                id="renew-years"
                type="range"
                min={1}
                max={5}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="flex-1 accent-brand"
              />
              <span className="w-16 text-right font-display font-semibold">
                {years} {years === 1 ? "year" : "years"}
              </span>
            </div>
            <div className="mt-4 space-y-1.5 rounded-2xl bg-brand-soft p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">ENS protocol fee</span>
                <span className="font-medium">
                  {priceWei !== null ? fmtEth(priceWei) : "…"}
                  {priceWei !== null && fmtUsd(priceWei, ethUsd) ? ` (≈${fmtUsd(priceWei, ethUsd)})` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Platform fee</span>
                <span className="font-bold text-mint">$0.00</span>
              </div>
              <p className="pt-1 text-xs text-muted">
                Paid directly to the{" "}
                <a className="underline" href={etherscanAddress(ENS.ethRegistrarController)} target="_blank" rel="noreferrer">
                  ENS registrar contract
                </a>
                .
              </p>
            </div>
            <button
              onClick={renew}
              disabled={priceWei === null}
              className="mt-5 w-full rounded-full bg-brand py-3 font-semibold text-white shadow-soft transition hover:bg-indigo-700 disabled:opacity-60"
            >
              Extend now
            </button>
          </>
        )}

        {phase === "pending" && (
          <p className="py-8 text-center font-medium">Confirm in your wallet, then we&apos;ll wait for Ethereum…</p>
        )}
        {phase === "done" && (
          <div className="py-6 text-center">
            <p className="font-display text-xl font-bold">
              Extended <span className="text-mint">✓</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {name} is yours for {years} more {years === 1 ? "year" : "years"}.
            </p>
            <button onClick={onClose} className="mt-5 w-full rounded-full border border-line py-3 font-semibold hover:bg-brand-soft">
              Done
            </button>
          </div>
        )}
        {phase === "failed" && (
          <div className="py-6 text-center">
            <p className="font-medium">That didn&apos;t go through — nothing was charged.</p>
            <button
              onClick={() => setPhase("configure")}
              className="mt-5 w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
