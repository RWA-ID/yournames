import Reveal from "./Reveal";

/*
 * "One protocol, two clear paths." — two large cards with distinct color
 * identities: For people (indigo) and For brands (amber).
 */
export default function TwoPaths() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-4 pt-20">
      <Reveal>
        <h2
          className="text-center font-display font-bold"
          style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}
        >
          One protocol, two clear paths.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-[17px] leading-snug text-muted">
          The same name works for an individual or a global brand. Pick the path that sounds like you.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {/* For people — indigo */}
        <Reveal as="div">
          <div
            id="people"
            className="h-full scroll-mt-20 p-8"
            style={{
              borderRadius: "var(--radius-card)",
              border: "1px solid rgba(99,102,241,0.28)",
              background: "linear-gradient(180deg,#f4f4ff,var(--surface) 60%)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <span
              className="inline-flex size-14 items-center justify-center text-[1.85rem]"
              style={{
                borderRadius: 18,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow: "0 10px 22px -4px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
              aria-hidden="true"
            >
              🪪
            </span>
            <h3 className="mt-3.5 font-display text-2xl font-bold tracking-tight">For people</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Your wallet address is a 42-character string nobody can remember. Your{" "}
              <strong className="text-foreground">.eth</strong> name replaces it with something human —
              to receive crypto, log into apps, and carry one profile across the internet.
            </p>
            <div className="my-5 flex flex-wrap gap-2">
              {["Receive crypto by name", "One login", "Portable profile"].map((t) => (
                <span
                  key={t}
                  className="rounded-full px-3 py-1 text-[13px] font-medium"
                  style={{ border: "1px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.08)", color: "#4f46e5" }}
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href="#top"
              className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition hover:bg-brand-soft"
            >
              Find your name →
            </a>
          </div>
        </Reveal>

        {/* For brands — amber */}
        <Reveal as="div" delay={0.1}>
          <div
            id="brands"
            className="h-full scroll-mt-20 p-8"
            style={{
              borderRadius: "var(--radius-card)",
              border: "1px solid rgba(245,158,11,0.3)",
              background: "linear-gradient(180deg,#fff8ef,var(--surface) 60%)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <span
              className="inline-flex size-14 items-center justify-center text-[1.85rem]"
              style={{
                borderRadius: 18,
                background: "linear-gradient(135deg,#f59e0b,#fb923c)",
                boxShadow: "0 10px 22px -4px rgba(245,158,11,0.42), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
              aria-hidden="true"
            >
              🏛️
            </span>
            <h3 className="mt-3.5 font-display text-2xl font-bold tracking-tight">For brands</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Secure your brand&apos;s name as verified, on-chain identity. Route payments, host a site
              nobody can take down, and give customers one address they can trust — while keeping
              impersonators off your name.
            </p>
            <div className="my-5 flex flex-wrap gap-2">
              {["Verified identity", "Anti-impersonation", "Subnames for your team"].map((t) => (
                <span
                  key={t}
                  className="rounded-full px-3 py-1 text-[13px] font-medium"
                  style={{ border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.1)", color: "#b45309" }}
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href="#top"
              className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition hover:bg-brand-soft"
            >
              Protect your brand →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
