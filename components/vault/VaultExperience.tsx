"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import DialCanvas, { vaultDial } from "./DialCanvas";
import VaultHeader from "./VaultHeader";
import VaultHero from "./VaultHero";
import ChainsAct from "./ChainsAct";
import StatsStrip from "./StatsStrip";
import FeatureCards from "./FeatureCards";
import HowAct from "./HowAct";
import Terminal from "./Terminal";
import VaultFAQ from "./VaultFAQ";
import SponsorsDonate from "./SponsorsDonate";
import VaultFooter from "./VaultFooter";

/*
 * Vault Experience homepage (design handoff: vault/Vault Experience.html).
 * This orchestrator owns everything that spans sections: Lenis smooth scroll,
 * the GSAP ScrollTrigger story (sticky hero exit, coin slide-ins, fade-up
 * entrances, count-up stats, the pinned horizontal act 03) and the gold
 * particle dial's scroll progress. Per-section behavior (hero intro, FAQ,
 * donate) lives in the section components.
 */
export default function VaultExperience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Lenis smooth scroll, feeding ScrollTrigger ----
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.11 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // route in-page anchors through Lenis so they don't fight smooth scroll
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href") || "");
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0 });
      else window.scrollTo(0, (target as HTMLElement).getBoundingClientRect().top + window.scrollY);
    };
    document.addEventListener("click", onAnchorClick);

    const ctx = gsap.context(() => {
      const video = document.getElementById("vault-video") as HTMLVideoElement | null;

      // particle dial: visible after the hero, progress across the whole story
      ScrollTrigger.create({
        trigger: "#story",
        start: "top 80%",
        end: "bottom bottom",
        onUpdate(self) {
          vaultDial.progress = self.progress;
          vaultDial.visible = self.isActive;
        },
        onToggle(self) {
          vaultDial.visible = self.isActive;
        },
      });

      // hero slow zoom + UI fade while act 01 slides over the sticky hero
      if (!reduced) {
        gsap.to("#vault-video", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: "#chains", start: "top bottom", end: "top top", scrub: true },
        });
        gsap.to("#hero-ui", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: "#chains", start: "top 90%", end: "top 35%", scrub: true },
        });
      }

      // generic fade-up entrances
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });

        // coin chips slide into act 01, then bob via CSS on the inner el
        gsap.utils.toArray<HTMLElement>("#coin-field .coin").forEach((coin, i) => {
          const dir = parseFloat(coin.dataset.dir || "1");
          gsap.from(coin, {
            x: dir * (200 + i * 60),
            y: 160 + i * 20,
            rotation: dir * 16,
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: "#chains", start: "top 85%", end: "top 10%", scrub: 0.5 },
          });
        });
      }

      // pause the vault video once the story covers it
      if (video) {
        ScrollTrigger.create({
          trigger: "#chains",
          start: "top 30%",
          onEnter: () => video.pause(),
        });
      }

      // count-up stats
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count || "0");
        const fmt = (v: number) =>
          el.dataset.prefix ? el.dataset.prefix + Math.round(v) : String(Math.round(v));
        if (reduced) {
          el.textContent = fmt(end);
          return;
        }
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: end,
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = fmt(obj.v);
              },
            }),
        });
      });

      // pinned horizontal "how it works"
      const track = document.getElementById("steps-track");
      if (track && !reduced) {
        const dist = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: "#how",
            start: "top top",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      document.removeEventListener("click", onAnchorClick);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      vaultDial.visible = false;
    };
  }, []);

  return (
    <div className="vault flex min-h-screen flex-col antialiased">
      <DialCanvas />
      <VaultHeader home />
      <VaultHero />

      {/* scroll story — slides over the sticky hero */}
      <main id="story" className="relative z-20" style={{ marginTop: "-80vh" }}>
        <ChainsAct />
        <StatsStrip />
        <FeatureCards />
        <HowAct />
        <Terminal />
        <VaultFAQ />
        <SponsorsDonate />
        <VaultFooter />
      </main>
    </div>
  );
}
