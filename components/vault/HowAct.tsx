/* Act 03 — how the vault opens. Pinned section; the three commit/reveal step
   cards scroll horizontally (GSAP pin + scrub wired in VaultExperience). */

export default function HowAct() {
  return (
    <section id="how" className="relative overflow-hidden border-t border-gold/15 bg-background/90">
      <div className="flex h-screen flex-col justify-center">
        <p className="mx-auto mb-10 w-full max-w-6xl px-5 text-[11px] uppercase tracking-[0.35em] text-gold sm:px-8">
          act 03 — how the vault opens
        </p>
        <div id="steps-track" className="flex w-max gap-6 px-5 sm:px-[12vw]">
          <article className="w-[82vw] max-w-xl shrink-0 rounded-3xl border border-line bg-surface p-8 sm:w-[44vw] sm:p-12">
            <p className="mb-5 text-sm text-gold">01</p>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">Pick your name</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              type it in the search bar. you&apos;ll see live availability and the real protocol
              price — no markup hidden in it.
            </p>
          </article>

          <article className="w-[82vw] max-w-xl shrink-0 rounded-3xl border border-line bg-surface p-8 sm:w-[44vw] sm:p-12">
            <p className="mb-5 text-sm text-gold">02</p>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">Commit</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              your wallet quietly reserves your spot so nobody can snipe the name while you
              register it. then a short one-minute wait.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted/70">
              the technical truth ↓ — a commit/reveal scheme: you publish a hash first, so
              front-runners can&apos;t see which name you want.
            </p>
          </article>

          <article className="w-[82vw] max-w-xl shrink-0 rounded-3xl border border-line bg-surface p-8 sm:w-[44vw] sm:p-12">
            <p className="mb-5 text-sm text-gold">03</p>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">Reveal &amp; own it</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              confirm the second transaction and the name lands in your wallet. it&apos;s yours
              until you let it expire — and only then.
            </p>
            <p className="mt-4 text-sm">
              <a href="#hero" className="text-gold hover:underline">
                register →
              </a>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
