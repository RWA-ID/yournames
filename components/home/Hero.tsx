"use client";

import Reveal from "./Reveal";
import RegistryCheck, { type Seed } from "./RegistryCheck";
import { focusNameSearch } from "./focusSearch";

/*
 * Hero — asymmetric editorial grid: headline column (Sora display + the
 * Newsreader-italic twist line) beside the live "Registry check" ledger card.
 */
export default function Hero({
  onRegister,
  seed,
}: {
  onRegister: (label: string) => void;
  seed: Seed | null;
}) {
  return (
    <section
      id="top"
      className="mx-auto grid w-full max-w-[76rem] items-center gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-[4.5rem] lg:pb-20 lg:pt-[5.5rem]"
    >
      <Reveal>
        <p className="eyebrow flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-mint" aria-hidden="true" />
          For people and companies
        </p>
        <h1 className="mt-7 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-[3.25rem] lg:text-[3.9rem]">
          A name anyone can type.
          <br />
          <span className="editorial">An asset no one can take.</span>
        </h1>
        <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.7] text-foreground/65">
          One <strong className="font-semibold text-foreground">.eth</strong>{" "}
          name replaces the
          42-character address — for payments, logins, and your website. It lives in your wallet,
          not on anyone&apos;s platform.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <button
            onClick={focusNameSearch}
            className="rounded-[4px] bg-foreground px-7 py-3.5 text-[0.9375rem] font-semibold text-background transition hover:bg-white"
          >
            Find your name
          </button>
          <a
            href="#companies"
            className="border-b border-foreground/35 pb-0.5 text-[0.9375rem] font-medium text-foreground/75 transition hover:text-foreground"
          >
            For companies →
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <RegistryCheck onRegister={onRegister} seed={seed} />
      </Reveal>
    </section>
  );
}
