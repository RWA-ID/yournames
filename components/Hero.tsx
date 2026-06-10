"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar, { type SearchResult } from "@/components/SearchBar";
import RegisterFlow from "@/components/RegisterFlow";

export default function Hero() {
  const [registering, setRegistering] = useState<SearchResult | null>(null);

  return (
    <section className="hero-mesh relative overflow-hidden">
      {/* floating orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="orb absolute left-[8%] top-24 size-20 rounded-full bg-gradient-to-br from-brand/30 to-skyx/20 blur-sm" />
        <span className="orb absolute right-[10%] top-40 size-12 rounded-full bg-gradient-to-br from-mint/30 to-skyx/20 blur-sm [animation-delay:2s]" />
        <span className="orb absolute bottom-16 left-[20%] size-9 rounded-full bg-gradient-to-br from-amberx/30 to-rosex/20 blur-sm [animation-delay:4s]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-muted shadow-soft">
            <span className="size-1.5 rounded-full bg-mint" /> 0% platform fee — you pay ENS, not us
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            A name that&apos;s <span className="text-gradient">truly yours.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Claim your <strong className="text-foreground">.eth</strong> name — a username for the
            whole internet that lives in your wallet. No company can take it away. Not even us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-9"
        >
          <SearchBar onRegister={setRegistering} />
        </motion.div>
      </div>

      {registering && (
        <RegisterFlow label={registering.label} onClose={() => setRegistering(null)} />
      )}
    </section>
  );
}
