"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Data-driven sponsor slots from /sponsors.json — fill or clear slots by
 * re-pinning only that file's content, no logic redeploy. Every filled slot is
 * visually labeled "Sponsored" and never disguised as an ENS endorsement.
 */
type Sponsor = {
  name: string;
  tagline: string;
  url: string;
  logo?: string;
} | null;

export default function Sponsors() {
  const [slots, setSlots] = useState<Sponsor[]>([null, null, null]);

  useEffect(() => {
    fetch("/sponsors.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data?.slots)) setSlots(data.slots.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl font-bold text-muted">Sponsored</h2>
        <a
          href={`mailto:${SITE.sponsorEmail}?subject=yournames.eth%20sponsorship`}
          className="text-sm font-medium text-brand hover:underline"
        >
          Become a sponsor →
        </a>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {slots.map((s, i) =>
          s ? (
            <a
              key={`${s.name}-${i}`}
              href={s.url}
              target="_blank"
              rel="noreferrer sponsored"
              className="group relative rounded-3xl border border-line bg-surface p-5 shadow-soft transition hover:shadow-lift"
            >
              <span className="absolute right-4 top-4 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                Sponsored
              </span>
              <p className="font-display text-lg font-bold">{s.name}</p>
              <p className="mt-1 text-sm text-muted">{s.tagline}</p>
            </a>
          ) : (
            <div
              key={`empty-${i}`}
              className="flex min-h-28 flex-col items-center justify-center rounded-3xl border border-dashed border-line p-5 text-center"
            >
              <p className="text-sm font-medium text-muted">Sponsor slot available</p>
              <a
                href={`mailto:${SITE.sponsorEmail}`}
                className="mt-1 text-xs text-brand hover:underline"
              >
                {SITE.sponsorEmail}
              </a>
            </div>
          ),
        )}
      </div>
      <p className="mt-3 text-xs text-muted">
        Sponsors are clearly labeled ads. They are not ENS integrations or endorsements.
      </p>
    </section>
  );
}
