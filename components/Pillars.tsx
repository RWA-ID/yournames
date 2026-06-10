"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: "🔑",
    title: "You own it",
    benefit: "It lives in your wallet like a collectible. No company can revoke it, rename it, or shut it down.",
    truth:
      "Technically: your name is an NFT (ERC-721) on Ethereum, held by your address. Ownership is enforced by the ENS smart contracts — not by any company's database. As long as you keep it renewed, it's yours.",
  },
  {
    icon: "🧳",
    title: "It's portable",
    benefit: "One name works across thousands of wallets, apps, and websites. It travels with you.",
    truth:
      "Technically: ENS is an open standard. Any app can resolve your name to your address, avatar, and profile — MetaMask, Coinbase Wallet, Uniswap, Etherscan, Farcaster and thousands more already do.",
  },
  {
    icon: "🛠️",
    title: "It's programmable",
    benefit: "Point it at your crypto address, a website, an avatar, your socials — you control what it means.",
    truth:
      "Technically: your name stores records on-chain via a resolver contract — multichain addresses (ENSIP-9), text records like avatar and twitter (ENSIP-5), and even a decentralized website (contenthash, ENSIP-7).",
  },
];

export default function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
        It&apos;s much more than a username
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {PILLARS.map((p, i) => (
          <PillarCard key={p.title} pillar={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  const [openTruth, setOpenTruth] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="rounded-3xl border border-line bg-surface p-6 shadow-soft transition hover:shadow-lift"
    >
      <span className="text-3xl" aria-hidden>
        {pillar.icon}
      </span>
      <h3 className="mt-3 font-display text-xl font-bold">{pillar.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.benefit}</p>
      <button
        onClick={() => setOpenTruth((v) => !v)}
        aria-expanded={openTruth}
        className="mt-4 text-sm font-semibold text-brand transition hover:underline"
      >
        {openTruth ? "Hide the technical truth ↑" : "Learn more ↓"}
      </button>
      {openTruth && <p className="mt-2 text-xs leading-relaxed text-muted">{pillar.truth}</p>}
    </motion.div>
  );
}
