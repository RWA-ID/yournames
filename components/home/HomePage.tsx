"use client";

import { useState } from "react";
import RegisterFlow from "@/components/RegisterFlow";
import Header from "./Header";
import Hero from "./Hero";
import PhoneDemo from "./PhoneDemo";
import AppsMarquee from "./AppsMarquee";
import EveryChain from "./EveryChain";
import TwoPaths from "./TwoPaths";
import Pillars from "./Pillars";
import Safety from "./Safety";
import HowItWorks from "./HowItWorks";
import UseCases from "./UseCases";
import FAQ from "./FAQ";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";

/*
 * yournames.eth homepage (light Forest theme — design handoff:
 * design_handoff_yournames_homepage, Classic hero + Forest theme). Owns the
 * single register-modal state so every NameSearch (hero + final CTA) opens the
 * shared commit/reveal RegisterFlow.
 */
export default function HomePage() {
  const [registering, setRegistering] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Header home />
      <main className="flex-1">
        <Hero onRegister={setRegistering} />
        <PhoneDemo />
        <AppsMarquee />
        <EveryChain />
        <TwoPaths />
        <Pillars />
        <Safety />
        <HowItWorks />
        <UseCases />
        <FAQ />
        <FinalCTA onRegister={setRegistering} />
      </main>
      <Footer home />

      {registering && <RegisterFlow label={registering} onClose={() => setRegistering(null)} />}
    </div>
  );
}
