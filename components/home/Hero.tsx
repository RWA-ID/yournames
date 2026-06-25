"use client";

import NameSearch from "./NameSearch";

/*
 * Classic hero — soft radial mesh background, three blurred floating gradient
 * orbs, a centered column: fee badge → gradient h1 → subcopy → the live
 * NameSearch → a trust row of colored-dot claims.
 */
export default function Hero({ onRegister }: { onRegister: (label: string) => void }) {
  return (
    <section id="top" className="relative overflow-hidden" style={{ background: "var(--mesh-hero)" }}>
      {/* floating gradient orbs */}
      <span
        aria-hidden="true"
        className="orb pointer-events-none absolute left-[7%] top-24 size-20 rounded-full"
        style={{
          background: "linear-gradient(135deg,rgba(16,185,129,0.35),rgba(14,165,233,0.2))",
          filter: "blur(2px)",
        }}
      />
      <span
        aria-hidden="true"
        className="orb pointer-events-none absolute right-[9%] top-36 size-12 rounded-full"
        style={{
          background: "linear-gradient(135deg,rgba(132,204,22,0.35),rgba(20,184,166,0.2))",
          filter: "blur(2px)",
          ["--bob-delay" as string]: "2s",
        }}
      />
      <span
        aria-hidden="true"
        className="orb pointer-events-none absolute bottom-12 left-[18%] size-10 rounded-full"
        style={{
          background: "linear-gradient(135deg,rgba(20,184,166,0.3),rgba(16,185,129,0.2))",
          filter: "blur(2px)",
          ["--bob-delay" as string]: "4s",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-12 text-center sm:pb-24 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground shadow-soft">
          <span className="size-1.5 rounded-full bg-mint" aria-hidden="true" />
          0% platform fee — you pay ENS, not us
        </span>

        <h1
          className="mt-6 font-display font-extrabold"
          style={{ fontSize: "clamp(2.5rem,6vw,3.75rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          Your name,
          <br />
          <span className="text-gradient">everywhere online.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted">
          Claim a <strong className="text-foreground">.eth</strong> name — one identity for your
          wallet, website, logins and profile across thousands of apps. It lives in your wallet, and
          no company can take it away. Not even us.
        </p>

        <div className="mt-9">
          <NameSearch onRegister={onRegister} placeholder="Find your name…" />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-mint" aria-hidden="true" />
            You truly own it
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ background: "var(--sky)" }} aria-hidden="true" />
            Works in 1,000+ apps
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            Independent — not affiliated with ENS
          </span>
        </div>
      </div>
    </section>
  );
}
