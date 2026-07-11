"use client";

import { useState } from "react";
import RegisterFlow from "@/components/RegisterFlow";
import Header from "./Header";
import Hero from "./Hero";
import NameTicker from "./NameTicker";
import Replaces from "./Replaces";
import Wallets from "./Wallets";
import Chains from "./Chains";
import ForCompanies from "./ForCompanies";
import StatsBand from "./StatsBand";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import type { Seed } from "./RegistryCheck";

/*
 * yournames.eth homepage — "Dark Ledger" redesign (design handoff:
 * design_handoff_dark_ledger_homepage). Owns the register-modal state (the
 * hero Registry-check card opens the shared commit/reveal RegisterFlow) and
 * the seed the final CTA hands back up to that card.
 */
export default function HomePage() {
  const [registering, setRegistering] = useState<string | null>(null);
  const [seed, setSeed] = useState<Seed | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Header home />
      <main className="flex-1">
        <Hero onRegister={setRegistering} seed={seed} />
        <NameTicker />
        <Replaces />
        <Wallets />
        <Chains />
        <ForCompanies />
        <StatsBand />
        <FinalCTA
          onCheck={(value) => setSeed((s) => ({ value, nonce: (s?.nonce ?? 0) + 1 }))}
        />
      </main>
      <Footer />

      {registering && <RegisterFlow label={registering} onClose={() => setRegistering(null)} />}
    </div>
  );
}
