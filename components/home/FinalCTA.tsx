"use client";

import { useState } from "react";
import Reveal from "./Reveal";

/*
 * Final CTA — centered editorial headline and an attached search bar.
 * "Check now" seeds the hero Registry-check card (the single live lookup)
 * and scrolls back up to it.
 */
export default function FinalCTA({ onCheck }: { onCheck: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <section className="border-t border-line bg-tint">
      <div className="mx-auto w-full max-w-[44rem] px-6 py-14 text-center sm:py-20">
        <Reveal>
          <h2 className="font-display text-[1.9rem] font-bold tracking-[-0.02em] text-foreground sm:text-[2.5rem]">
            The name you want is <span className="editorial">still free — for now.</span>
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onCheck(value.trim());
            }}
            className="mx-auto mt-8 flex max-w-[30rem] items-stretch overflow-hidden rounded-[6px] border border-white/30 text-left transition focus-within:border-white/60"
          >
            <label htmlFor="cta-search" className="sr-only">
              Search for your .eth name
            </label>
            <input
              id="cta-search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="yourname"
              maxLength={32}
              className="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-foreground outline-none focus-visible:outline-none placeholder:text-foreground/50"
            />
            <span className="flex select-none items-center pr-5 text-base text-foreground/50">
              .eth
            </span>
            <button
              type="submit"
              className="shrink-0 bg-foreground px-6 text-sm font-semibold text-background transition hover:bg-white"
            >
              Check now
            </button>
          </form>
          <p className="mt-5 text-[0.8125rem] text-foreground/50">
            You pay ENS, not us. No account needed to search.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
