"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

/*
 * Footer — link columns, the not-affiliated disclaimer card, a donate card with
 * a one-tap copy of the ensgiant.eth address, and the @ensgianteth maintainer
 * credit. Shared across the homepage and /manage.
 */
export default function Footer({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const [copied, setCopied] = useState(false);
  const [mailCopied, setMailCopied] = useState(false);
  const addr = SITE.donate.address;
  const short = `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  /* Copy `text` to the clipboard, flashing `flash(true)` then `flash(false)`. */
  const copyText = (text: string, flash: (v: boolean) => void) => {
    const done = () => {
      flash(true);
      setTimeout(() => flash(false), 1800);
    };
    try {
      const p = navigator.clipboard?.writeText(text);
      if (p?.then) p.then(done).catch(() => fallbackCopy(text, done));
      else done();
    } catch {
      fallbackCopy(text, done);
    }
  };
  const copy = () => copyText(addr, setCopied);

  const col = "text-sm text-foreground transition hover:text-brand";

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 pb-10 pt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A friendlier front door to ENS. Register and manage{" "}
            <strong className="text-foreground">.eth</strong> names directly against the official
            contracts — fully self-custodial.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Product</p>
          <div className="flex flex-col gap-2.5">
            <a href={`${prefix}#top`} className={col}>
              Search names
            </a>
            <Link href="/manage/" className={col}>
              My names
            </Link>
            <a href={`${prefix}#brands`} className={col}>
              For brands
            </a>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Learn</p>
          <div className="flex flex-col gap-2.5">
            <a href={`${prefix}#safety`} className={col}>
              Why it&apos;s safe
            </a>
            <a href={SITE.ensDocs} target="_blank" rel="noreferrer" className={col}>
              What is ENS?
            </a>
            <a href={`${prefix}#faq`} className={col}>
              Pricing
            </a>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">More</p>
          <div className="flex flex-col gap-2.5">
            <a href={SITE.github} target="_blank" rel="noreferrer" className={col}>
              GitHub
            </a>
            {/*
             * Sponsor contact. `mailto:` still opens a mail app where one is
             * registered (typical on phones), but on a desktop with no mail
             * client a bare mailto silently does nothing — so we also copy the
             * address to the clipboard on click and show it inline, so the link
             * does something visible everywhere.
             */}
            <a
              href={`mailto:${SITE.sponsorEmail}`}
              onClick={() => copyText(SITE.sponsorEmail, setMailCopied)}
              className={col}
            >
              Become a sponsor →
            </a>
            <button
              type="button"
              onClick={() => copyText(SITE.sponsorEmail, setMailCopied)}
              className="text-left font-mono text-[12px] text-muted transition hover:text-brand"
              title="Click to copy"
            >
              {mailCopied ? "Copied ✓" : SITE.sponsorEmail}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10">
        {/* Disclaimer */}
        <div className="rounded-3xl bg-brand-soft p-5 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand">Disclaimer</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            yournames.eth is an independent, community-built interface. It is{" "}
            <strong className="text-foreground">not affiliated with, endorsed by, or operated by</strong>{" "}
            ENS, ENS Labs, or the ENS DAO. We charge $0 in platform fees — you pay only the ENS
            protocol&apos;s registration and renewal costs, plus Ethereum network gas. Sponsored slots
            are clearly labeled ads. Brand logos are property of their respective owners and shown for
            compatibility reference only.
          </p>
        </div>

        {/* Donate */}
        <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-3xl border border-line bg-surface shadow-soft md:grid-cols-[1.3fr_1fr]">
          <div className="p-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand">
              Support the project
            </p>
            <h3 className="mt-2 font-display text-xl font-bold tracking-tight">Built free, kept free.</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              yournames.eth charges $0 in platform fees. If it saved you from pasting a 42-character
              address, a tip keeps it running — and ad-free.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 border-t border-line bg-brand-soft p-6 md:border-l md:border-t-0">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none" aria-hidden="true">
                💜
              </span>
              <span className="text-gradient font-display text-base font-bold">
                {SITE.donate.ensName}
              </span>
            </div>
            <button
              onClick={copy}
              className="flex w-full items-center justify-between gap-3 rounded-full border border-line bg-surface py-2 pl-4 pr-2 font-mono shadow-soft transition hover:shadow-lift"
            >
              <span className="text-[13px] text-foreground">{short}</span>
              <span className="shrink-0 rounded-full bg-brand px-3 py-1.5 font-sans text-xs font-semibold text-white">
                {copied ? "Copied ✓" : "Copy"}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-muted">
            © 2026 yournames.eth · Built on open ENS contracts.
          </p>
          <a
            href={SITE.twitter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] text-muted transition hover:text-foreground"
          >
            <span>Built by</span>
            <span className="inline-flex size-5 items-center justify-center rounded-md bg-foreground">
              <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#fff"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </span>
            <span className="font-semibold text-foreground">{SITE.twitter.handle}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function fallbackCopy(text: string, done: () => void) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    done();
  } catch {
    /* ignore */
  }
}
