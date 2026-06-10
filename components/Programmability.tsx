"use client";

import { motion } from "framer-motion";

const USES = [
  {
    icon: "💸",
    title: "Get paid by name",
    text: "Friends send crypto to yourname.eth — no more copying scary 42-character addresses.",
  },
  {
    icon: "🌐",
    title: "Host an unstoppable website",
    text: "Point your name at a decentralized site on IPFS. No hosting bills, no takedowns.",
  },
  {
    icon: "🪪",
    title: "One login for web3",
    text: "Connect a wallet anywhere and apps greet you by name, with your avatar.",
  },
  {
    icon: "🖼️",
    title: "Your face, everywhere",
    text: "Set an avatar once — even an NFT you own — and every ENS-aware app shows it.",
  },
  {
    icon: "🔗",
    title: "Link your socials",
    text: "Attach X, GitHub, Telegram and more, so people know it's really you.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Give out subnames",
    text: "Create pay.yourname.eth for your shop or names for your whole team — free.",
  },
];

export default function Programmability() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
        What can you do with it?
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-muted">
        One name, endless uses. All of this is configurable right here after you register.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {USES.map((u, i) => (
          <motion.div
            key={u.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="flex gap-4 rounded-3xl border border-line bg-surface p-5 shadow-soft"
          >
            <span className="text-2xl" aria-hidden>
              {u.icon}
            </span>
            <div>
              <h3 className="font-semibold">{u.title}</h3>
              <p className="mt-1 text-sm text-muted">{u.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
