"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { tileStyle, cardTintStyle } from "./accents";

/*
 * "It's much more than a username." — three pillar cards (indigo/sky/emerald)
 * with a "Learn more ↓" toggle that reveals the technical truth. Single-open
 * accordion; index 0 open by default.
 */

const PILLARS = [
  {
    icon: "🔑",
    title: "You own it outright",
    benefit:
      "It lives in your wallet like a collectible. No company can rename it, revoke it, or shut it down.",
    truth:
      "Your name is an NFT (ERC-721) on Ethereum, held by your address and enforced by the ENS smart contracts — not any company's database. Keep it renewed and it stays yours.",
  },
  {
    icon: "🧳",
    title: "It goes everywhere",
    benefit:
      "One name resolves across thousands of wallets, apps and websites. It travels with you.",
    truth:
      "ENS is an open standard. MetaMask, Coinbase Wallet, Uniswap, Etherscan, Farcaster and thousands more already resolve it to your address, avatar and profile.",
  },
  {
    icon: "🛠️",
    title: "You decide what it does",
    benefit:
      "Point it at your crypto address, a website, an avatar, your socials — you control what it means.",
    truth:
      "Records live on-chain via a resolver: multichain addresses (ENSIP-9 / ENSIP-11), text records like avatar and twitter (ENSIP-5), and even a decentralized website (contenthash, ENSIP-7).",
  },
];

export default function Pillars() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16">
      <Reveal>
        <h2
          className="text-center font-display font-bold"
          style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}
        >
          It&apos;s much more than a username.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal as="div" key={p.title} delay={i * 0.08}>
            <div
              className="group h-full p-7 transition-all duration-150 hover:-translate-y-0.5"
              style={cardTintStyle(i)}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-lift)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-soft)")}
            >
              <span style={tileStyle(i)} aria-hidden="true">
                {p.icon}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{p.benefit}</p>
              <button
                onClick={() => setOpen((o) => (o === i ? null : i))}
                className="mt-4 text-sm font-semibold text-brand hover:underline"
                aria-expanded={open === i}
              >
                {open === i ? "Hide the technical truth ↑" : "Learn more ↓"}
              </button>
              {open === i && (
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{p.truth}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
