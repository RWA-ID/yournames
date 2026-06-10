"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "1",
    title: "Connect a wallet",
    text: "MetaMask, Coinbase Wallet, Rainbow — or scan a QR with your phone. Your wallet is your account; we never hold anything.",
  },
  {
    n: "2",
    title: "Search your name",
    text: "See instantly if it's free and exactly what ENS charges per year. Short, popular names cost more; most names are a few dollars a year.",
  },
  {
    n: "3",
    title: "Register in two quick steps",
    text: "Ethereum asks for two transactions about a minute apart — a safety feature that stops bots from sniping the name you just searched. Then it's yours: renew it whenever you like to keep it forever.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">How it works</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative rounded-3xl border border-line bg-surface p-6 pt-9 shadow-soft"
          >
            <span className="absolute -top-5 left-6 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#627eea] font-display text-lg font-bold text-white shadow-[0_0_22px_rgba(124,58,237,0.5)]">
              {s.n}
            </span>
            <h3 className="font-display text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
