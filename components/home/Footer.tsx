"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import Wordmark from "./Wordmark";

/*
 * Footer — hairline-topped, two quiet rows: wordmark + site/legal links, then
 * the independence disclaimer beside the tip jar and the @ensgianteth
 * maintainer credit. Shared across the homepage, /manage, and legal pages.
 */
export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [mailCopied, setMailCopied] = useState(false);

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

  const link =
    "text-[0.8125rem] font-medium text-foreground/65 transition hover:text-foreground";

  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[76rem] px-6 py-9 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <Wordmark small />
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
            <Link href="/manage/" className={link}>
              My names
            </Link>
            <Link href="/faq/" className={link}>
              FAQ
            </Link>
            <a href={SITE.github} target="_blank" rel="noreferrer" className={link}>
              GitHub
            </a>
            <Link href="/terms/" className={link}>
              Terms
            </Link>
            <Link href="/privacy/" className={link}>
              Privacy
            </Link>
            {/*
             * Sponsor contact. `mailto:` still opens a mail app where one is
             * registered (typical on phones), but on a desktop with no mail
             * client a bare mailto silently does nothing — so we also copy the
             * address to the clipboard on click and confirm it inline.
             */}
            <a
              href={`mailto:${SITE.sponsorEmail}`}
              onClick={() => copyText(SITE.sponsorEmail, setMailCopied)}
              className={link}
            >
              {mailCopied ? `Copied ${SITE.sponsorEmail} ✓` : "Become a sponsor"}
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line-faint pt-6">
          <p className="max-w-[38rem] text-xs leading-relaxed tracking-[0.04em] text-foreground/50">
            © 2026 yournames.eth — independent, not affiliated with ENS, ENS Labs, or the ENS DAO.
            0% platform fee: you pay only ENS protocol costs and network gas, on open contracts.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => copyText(SITE.donate.address, setCopied)}
              className="text-xs text-foreground/50 transition hover:text-foreground"
              title={`Copy ${SITE.donate.address}`}
            >
              {copied ? "Address copied ✓" : `Tips: ${SITE.donate.ensName}`}
            </button>
            <a
              href={SITE.twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-foreground/65 transition hover:text-foreground"
            >
              <span>Built by</span>
              <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-foreground">
                <svg width="9" height="9" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#131318"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </span>
              <span className="font-semibold text-foreground">{SITE.twitter.handle}</span>
            </a>
          </div>
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
