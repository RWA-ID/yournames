"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/*
 * Sponsors keep the lights on — gold donate button (click copies the full
 * ensgiant.eth address) + four sponsor slot cards driven by /sponsors.json,
 * same fill-by-re-pinning-one-file mechanism as before. Filled slots are
 * always labeled "sponsored", never disguised as endorsements.
 */

type Sponsor = { name: string; tagline: string; url: string } | null;

export default function SponsorsDonate() {
  const [slots, setSlots] = useState<Sponsor[]>([null, null, null, null]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/sponsors.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data?.slots)) {
          const s = data.slots.slice(0, 4) as Sponsor[];
          while (s.length < 4) s.push(null);
          setSlots(s);
        }
      })
      .catch(() => {});
  }, []);

  const donate = async () => {
    try {
      await navigator.clipboard.writeText(SITE.donate.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="sponsors" className="border-t border-gold/15 bg-surface px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex flex-col justify-between gap-8 sm:flex-row sm:items-end" data-rise>
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-gold">
              keep it independent
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sponsors keep the lights on
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              $0 platform fees means $0 revenue. if this site is useful to you, a donation or a
              sponsor slot keeps it running.
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <button
              onClick={donate}
              className="rounded-full bg-gold px-7 py-3 text-sm font-bold text-[#0b0b0c] transition hover:brightness-110"
            >
              {copied ? "address copied ✓" : `donate → ${SITE.donate.ensName}`}
            </button>
            <p className="mt-3 text-[11px] text-muted">or 0x2D03…E9A1 — click to copy</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {slots.map((s, i) =>
            s ? (
              <a
                key={`${s.name}-${i}`}
                href={s.url}
                target="_blank"
                rel="noreferrer sponsored"
                className="flex flex-col gap-4 rounded-3xl border border-line bg-background p-5 transition hover:border-gold/45"
                data-rise
              >
                <div className="flex h-24 items-center justify-center rounded-xl border border-line">
                  <p className="px-3 text-center font-display text-base font-bold">{s.name}</p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                  slot {String(i + 1).padStart(2, "0")} — <span className="text-gold">sponsored</span>
                </p>
              </a>
            ) : (
              <div
                key={`empty-${i}`}
                className="flex flex-col gap-4 rounded-3xl border border-line bg-background p-5"
                data-rise
              >
                <div className="slot-stripes flex h-24 items-center justify-center rounded-xl text-[10px] uppercase tracking-[0.2em] text-muted/70">
                  your logo
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                  slot {String(i + 1).padStart(2, "0")} — <span className="text-gold">available</span>
                </p>
              </div>
            ),
          )}
        </div>

        <p className="mt-8 text-xs text-muted" data-rise>
          want a slot? —{" "}
          <a
            href={`mailto:${SITE.sponsorEmail}?subject=yournames.eth%20sponsorship`}
            className="text-gold hover:underline"
          >
            {SITE.sponsorEmail}
          </a>
        </p>
      </div>
    </section>
  );
}
