"use client";

import { useState } from "react";

/* FAQ accordion — "+" rotates to "×", answers expand via the grid-rows trick. */

const ITEMS = [
  {
    q: "Can yournames.eth take my name away?",
    a: "no. the name sits in your wallet, registered with the ENS contracts. no company can take it away — not even us. only by letting it expire.",
  },
  {
    q: "What does it really cost?",
    a: "$5/year for names with 5+ characters (shorter names cost more), paid to the ENS protocol — plus gas, which is like postage for sending a package. our platform fee is $0, ever.",
  },
  {
    q: "Are you affiliated with ENS?",
    a: "no — independent and community-built. we're just a friendly interface to the official contracts. nothing routes through our servers, because there aren't any.",
  },
  {
    q: "What if this website disappears?",
    a: "your name is unaffected. it lives on ethereum, and you can manage it from any ENS-compatible app. the site itself is on IPFS, so anyone can re-pin it.",
  },
];

export default function VaultFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-background/90 px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-10 font-display text-3xl font-extrabold tracking-tight sm:text-4xl" data-rise>
          Questions, answered
        </h2>

        {ITEMS.map((item, i) => (
          <div
            key={item.q}
            className={`faq-item border-b border-gold/15 ${open === i ? "open" : ""}`}
            data-rise
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm sm:text-base"
            >
              <span>{item.q}</span>
              <span className="faq-plus text-xl leading-none text-gold" aria-hidden="true">
                +
              </span>
            </button>
            <div className="faq-a">
              <div>
                <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
