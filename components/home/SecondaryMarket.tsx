"use client";

import { useEffect, useState } from "react";
import { fetchGrailsResale, grailsNameUrl, type GrailsResale } from "@/lib/grails";
import { fmtEth, fmtUsd, truncateAddress } from "@/lib/format";

/*
 * Secondary-market panel shown under the search box when a name is already
 * taken. Pulls live listing / offer / last-sale data from the Grails
 * marketplace API and offers a deep link to buy or make an offer there.
 * Fails silent: if Grails has nothing (or errors), nothing renders.
 */

type Phase =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "data"; resale: GrailsResale };

function fmtSaleDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function SecondaryMarket({
  name,
  ethUsd,
}: {
  name: string;
  ethUsd: number | null;
}) {
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    setPhase({ kind: "loading" });
    fetchGrailsResale(name, ctrl.signal).then((resale) => {
      if (ctrl.signal.aborted) return;
      // Only surface the panel when there's something tradeable to show.
      const useful =
        resale &&
        (resale.lowestPriceWei !== null ||
          resale.highestOfferWei !== null ||
          resale.lastSale !== null ||
          resale.owner !== null);
      setPhase(useful ? { kind: "data", resale: resale! } : { kind: "empty" });
    });
    return () => ctrl.abort();
  }, [name]);

  if (phase.kind === "empty") return null;

  const href = grailsNameUrl(name);

  // Header chip: "Grails [logo] · Secondary market" — shared across states.
  const brandRow = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted transition hover:text-foreground"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/grails-logo.svg" alt="Grails" className="h-[15px] w-auto dark:brightness-110" />
      <span aria-hidden="true">· Secondary market</span>
    </a>
  );

  if (phase.kind === "loading") {
    return (
      <div className="mt-3 rounded-2xl border border-line bg-surface p-4 shadow-soft">
        {brandRow}
        <p className="mt-2 text-sm text-muted">Checking the secondary market…</p>
      </div>
    );
  }

  const { resale } = phase;
  const listed = resale.lowestPriceWei !== null;
  const cta = listed ? "Buy on Grails" : resale.highestOfferWei !== null ? "Make an offer" : "View on Grails";

  return (
    <div className="mt-3 rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {brandRow}
        {resale.owner && (
          <span className="font-mono text-[11px] text-muted">
            Owner {truncateAddress(resale.owner)}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {listed ? (
            <>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                For sale
              </div>
              <div className="mt-0.5 font-display text-2xl font-bold leading-none text-foreground">
                {fmtEth(resale.lowestPriceWei!)}
                {(() => {
                  const usd = fmtUsd(resale.lowestPriceWei!, ethUsd);
                  return usd ? (
                    <span className="ml-2 align-middle text-sm font-medium text-muted">≈{usd}</span>
                  ) : null;
                })()}
              </div>
              {resale.listingCount > 1 && (
                <div className="mt-1 text-xs text-muted">
                  {resale.listingCount} active listings · lowest shown
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Not listed for sale
              </div>
              <div className="mt-0.5 text-sm text-muted">
                {resale.highestOfferWei !== null
                  ? `Top offer ${fmtEth(resale.highestOfferWei)} — name owners can be moved by an offer.`
                  : "This name is owned. You can still make an offer to its holder."}
              </div>
            </>
          )}

          {resale.lastSale && (
            <div className="mt-1.5 text-xs text-muted">
              Last sold {fmtEth(resale.lastSale.priceWei)}
              {fmtSaleDate(resale.lastSale.date) ? ` · ${fmtSaleDate(resale.lastSale.date)}` : ""}
            </div>
          )}
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-5 py-2.5 text-sm font-semibold shadow-soft transition active:scale-[0.98] ${
            listed
              ? "bg-brand text-white hover:bg-brand-strong"
              : "border border-line bg-surface text-foreground hover:border-brand"
          }`}
        >
          {cta} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
