import Reveal from "./Reveal";
import { tileStyle, cardTintStyle } from "./accents";

/*
 * "What you can do with it." — six use-case cards cycling the accent palette
 * (indigo, sky, emerald, amber, rose, violet) with gradient icon tiles.
 */

const USES = [
  { icon: "💸", title: "Get paid by name", text: "Share alex.eth instead of a 42-character address. Friends just type your name." },
  { icon: "🔐", title: "Log in anywhere", text: "Sign into thousands of apps with your name — no password to forget." },
  { icon: "🌐", title: "Host a website", text: "Point your name at a site that no host or registrar can take down." },
  { icon: "🖼️", title: "One profile", text: "An avatar, bio and socials that travel with you between apps." },
  { icon: "🪪", title: "Verified identity", text: "Prove it's really you across the web, on-chain — not a look-alike." },
  { icon: "🔗", title: "Subnames for your team", text: "Hand out alice.brand.eth, support.brand.eth — all under your name." },
];

export default function UseCases() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <Reveal>
          <h2
            className="text-center font-display font-bold"
            style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em" }}
          >
            What you can do with it.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {USES.map((u, i) => (
            <Reveal as="div" key={u.title} delay={(i % 3) * 0.08}>
              <div
                className="h-full p-6 transition-all duration-150 hover:-translate-y-0.5"
                style={cardTintStyle(i)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-lift)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-soft)")}
              >
                <span style={tileStyle(i)} aria-hidden="true">
                  {u.icon}
                </span>
                <h3 className="mt-2.5 font-display text-[17px] font-bold">{u.title}</h3>
                <p className="mt-1 text-[14px] leading-snug text-muted">{u.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
