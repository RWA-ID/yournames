import NameSearch from "./NameSearch";
import Reveal from "./Reveal";

/*
 * Final CTA — a full-width gradient card with white headline + subcopy and one
 * more NameSearch.
 */
export default function FinalCTA({ onRegister }: { onRegister: (label: string) => void }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
      <Reveal>
        <div
          className="relative overflow-hidden px-6 py-12 text-center sm:py-16"
          style={{ borderRadius: "var(--radius-card)", background: "var(--gradient-brand)", boxShadow: "var(--shadow-lift)" }}
        >
          <h2
            className="mx-auto max-w-md font-display font-extrabold text-white"
            style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Find the name that&apos;s yours.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-snug text-white/90">
            Most names cost about $5 a year, paid straight to the ENS protocol. We add nothing.
          </p>
          <div className="mt-8">
            <NameSearch onRegister={onRegister} placeholder="Search a name…" onGradient />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
