import { SITE } from "@/lib/site";

/* Footer — wordmark, ENS Giant disclaimer, X link. */

export default function VaultFooter() {
  return (
    <footer className="border-t border-gold/15 bg-background px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="font-extrabold">
          <span className="select-none text-gold">&gt;_</span> your
          <span className="gold-grad">names</span>
          <span className="text-[#8f8878]">.eth</span>
        </p>
        <div className="flex flex-col gap-3 sm:items-end">
          <p className="max-w-md text-[11px] leading-relaxed text-muted sm:text-right">
            <span className="uppercase tracking-[0.25em]">disclaimer</span> — independent interface
            built by {SITE.builder}. not affiliated with ENS, ENS Labs, or the ENS DAO. you pay
            ENS, not us.
          </p>
          <a
            href={SITE.twitter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] text-muted transition-colors hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Z" />
            </svg>
            {SITE.twitter.handle}
          </a>
        </div>
      </div>
    </footer>
  );
}
