"use client";

import { useState } from "react";
import Reveal from "./Reveal";

/*
 * "Questions, answered." — a single card of accordion rows divided by
 * hairlines. The "+" rotates 45° to "×" when a row opens.
 */

const FAQS = [
  {
    q: "What is ENS, in plain English?",
    a: "The Ethereum Name Service is an open, public protocol that turns long wallet addresses into readable names like yourname.eth. Think of it as a phone book for the internet that no single company controls.",
  },
  {
    q: "Do I really own it, or are you holding it for me?",
    a: "You own it. The name sits in your own wallet as an NFT and answers only to your wallet's keys. We never take custody — we just give you a friendly way to interact with the official ENS contracts.",
  },
  {
    q: "What does it cost?",
    a: "Most names are about $5 a year, paid directly to the ENS protocol, plus Ethereum network gas (like postage for sending a package). We add $0 in platform fees, ever.",
  },
  {
    q: "Does one name really work on every chain?",
    a: "Yes. ENS stores a separate address record per network (ENSIP-9 / ENSIP-11), so alex.eth can point to your Ethereum, Base, Optimism, Solana and Bitcoin wallets at once. Set each once; share a single name.",
  },
  {
    q: "Is this affiliated with ENS?",
    a: "No. yournames.eth is independent and community-built. It is not affiliated with, endorsed by, or operated by ENS, ENS Labs, or the ENS DAO.",
  },
  {
    q: "Can a brand stop someone squatting its name?",
    a: "The best protection is to register it yourself, early. Once you hold the name, impersonators can't claim it, and customers get one verified address to trust.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="border-y border-line bg-tint">
      <div className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <h2
          className="mb-10 text-center font-display font-bold"
          style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}
        >
          Questions, answered.
        </h2>
      </Reveal>

      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={i === 0 ? "" : "border-t border-line"}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[17px] font-semibold">{f.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl text-brand transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
      </div>
    </section>
  );
}
