/* Act 02 — 2×2 grid of hovering feature cards (gold-glow lift on hover). */

const CARDS = [
  {
    img: "/vault/card-one-name.jpg",
    alt: "colorful 3D cubes",
    title: "One name for everything",
    body: (
      <>
        send and receive crypto with <b className="text-foreground">yourname.eth</b> instead of
        0x1f…9aB3. like an email address, but for money.
      </>
    ),
  },
  {
    img: "/vault/card-website.jpg",
    alt: "3D app logos",
    title: "A website no one can take down",
    body: (
      <>
        point your name at a decentralized site on IPFS. no hosting company, no takedowns — this
        very site works that way.
      </>
    ),
  },
  {
    img: "/vault/card-identity.jpg",
    alt: "fingerprint mural",
    title: "Your portable identity",
    body: (
      <>
        one profile — avatar, links, addresses — that follows you into every app that speaks ENS.
        set it once, use it everywhere.
      </>
    ),
  },
  {
    img: "/vault/card-ens.jpg",
    alt: "ENS logo",
    title: "You pay ENS, not us",
    body: (
      <>
        registration goes straight to the official ENS contracts. our fee is $0 — and it stays $0.
      </>
    ),
  },
];

export default function FeatureCards() {
  return (
    <section className="relative bg-background/90 px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-10 text-[11px] uppercase tracking-[0.35em] text-gold" data-rise>
          act 02 — much more than a username
        </p>

        <div className="grid gap-6 md:grid-cols-2 sm:gap-8">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="feature-card overflow-hidden rounded-3xl border border-line bg-surface"
              data-rise
            >
              <div className="h-52 overflow-hidden bg-[#0e0d0b] p-4 sm:h-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.alt} className="h-full w-full object-contain" />
              </div>
              <div className="p-7 sm:p-9">
                <h3 className="font-display text-xl font-bold sm:text-2xl">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
