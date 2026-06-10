"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "What is ENS?",
    a: "The Ethereum Name Service — an open, public protocol that turns long wallet addresses into human names like alice.eth. It's run by smart contracts on Ethereum and governed by a community DAO, not a company.",
  },
  {
    q: "Do I really own my name?",
    a: "Yes. Your name is an NFT in your wallet. Only the wallet holding it can change or transfer it. Nobody — including this site, ENS Labs, or the ENS DAO — can take it from you while it's registered to you.",
  },
  {
    q: "What does it cost?",
    a: "ENS charges a protocol fee of $5/year for most names (3-character names $640/year, 4-character $160/year, paid in ETH), plus the Ethereum network gas fee. We add nothing on top — our platform fee is $0.00, verifiable on-chain.",
  },
  {
    q: "Why two transactions?",
    a: "It's a security feature called commit-reveal. The first transaction secretly reserves your name; after a one-minute wait, the second completes it. This stops bots from watching searches and stealing names before you can register them.",
  },
  {
    q: "What's gas?",
    a: "A small fee paid to the Ethereum network (not to us, not to ENS) for processing your transaction — like postage for sending a package. It varies with network traffic.",
  },
  {
    q: "Can I lose my name?",
    a: "Only by letting it expire. Names are rentals with a guaranteed right to renew: keep renewing (we'll show clear expiry warnings) and it's yours forever. After expiry there's a 90-day grace period to renew before it's released.",
  },
  {
    q: "Are you ENS?",
    a: `No. ${SITE.name} is an independent, community-built interface to the official ENS smart contracts. We're not affiliated with, endorsed by, or operated by ENS, ENS Labs, or the ENS DAO. You can verify every contract we call on Etherscan, or use the official app at app.ens.domains.`,
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Questions, answered</h2>
      <div className="mt-8 divide-y divide-line rounded-3xl border border-line bg-surface shadow-soft">
        {FAQS.map((f) => (
          <Item key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-6 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left font-semibold"
      >
        {q}
        <span
          aria-hidden
          className={`text-brand transition-transform ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>}
    </div>
  );
}
