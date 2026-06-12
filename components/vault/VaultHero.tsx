"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useAccount, useEnsName } from "wagmi";
import RegisterFlow from "@/components/RegisterFlow";
import { truncateAddress } from "@/lib/format";
import { checkLabel } from "@/lib/normalize";
import { isAvailable, rentPrice } from "@/lib/registration";
import { YEAR_SECONDS } from "@/lib/ens";
import { fmtEth, fmtUsd, fetchEthUsd } from "@/lib/format";

/*
 * Hero — the vault opens. Full-bleed vault video → gold abstract backdrop and
 * left-weighted scrim fade in → "Unlock Your Onchain Identity" types out →
 * sub copy + the real search bar rise up. Skip intro / early scroll / video
 * failure all fast-forward the sequence. Sticky inside the 180vh #hero-wrap so
 * act 01 slides over it, then it scrolls away for good.
 *
 * The reveal is capped at INTRO_MAX_MS regardless of the 10s clip (the video
 * keeps turning behind the scrim) — the search must never be more than a few
 * seconds away, especially on slow gateway loads where the clip buffers.
 */

const HEADLINE = "Unlock Your Onchain Identity";
const INTRO_MAX_MS = 1800;

type SearchResult = { label: string; name: string; available: boolean; yearlyWei: bigint };
type Status =
  | { kind: "idle" }
  | { kind: "invalid"; reason: string }
  | { kind: "checking" }
  | { kind: "result"; result: SearchResult }
  | { kind: "error" };

function searchState(status: Status): string {
  switch (status.kind) {
    case "invalid":
      return "invalid";
    case "checking":
      return "checking";
    case "error":
      return "error";
    case "result":
      return status.result.available ? "available" : "taken";
    default:
      return "";
  }
}

export default function VaultHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const abstractRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const typeRef = useRef<HTMLSpanElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useRef<() => void>(() => {});
  const [live, setLive] = useState(false); // intro finished → UI interactive

  // ---- search (real availability + protocol price) ----
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [registering, setRegistering] = useState<SearchResult | null>(null);
  const seq = useRef(0);
  const { address, isConnected } = useAccount();
  const { data: heroEnsName } = useEnsName({ address, chainId: 1 });

  useEffect(() => {
    fetchEthUsd().then(setEthUsd);
  }, []);

  useEffect(() => {
    const id = ++seq.current;
    if (!input.trim()) {
      setStatus({ kind: "idle" });
      return;
    }
    const check = checkLabel(input);
    if (!check.ok) {
      setStatus({ kind: "invalid", reason: check.reason });
      return;
    }
    setStatus({ kind: "checking" });
    const t = setTimeout(async () => {
      try {
        const [avail, price] = await Promise.all([
          isAvailable(check.label),
          rentPrice(check.label, YEAR_SECONDS),
        ]);
        if (seq.current !== id) return;
        setStatus({
          kind: "result",
          result: { label: check.label, name: check.name, available: avail, yearlyWei: price.total },
        });
      } catch {
        if (seq.current === id) setStatus({ kind: "error" });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  // ---- intro sequence ----
  useEffect(() => {
    const video = videoRef.current;
    const typeEl = typeRef.current;
    const caret = caretRef.current;
    if (!typeEl || !caret) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let revealed = false;
    let disposed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let tl: gsap.core.Timeline | null = null;

    function typewriter(el: HTMLElement, text: string, done: () => void) {
      let i = 0;
      const tick = () => {
        if (disposed) return;
        el.textContent = text.slice(0, ++i);
        if (i < text.length) {
          timers.push(setTimeout(tick, text[i - 1] === " " ? 16 : 22 + Math.random() * 24));
        } else {
          done();
        }
      };
      tick();
    }

    const reveal = () => {
      if (revealed || disposed) return;
      revealed = true;
      setLive(true);

      const scrim = scrimRef.current;
      const abstract = abstractRef.current;
      const sub = subRef.current;
      const searchWrap = searchWrapRef.current;
      const cue = cueRef.current;

      if (reduced) {
        if (scrim) scrim.style.opacity = "1";
        if (abstract) abstract.style.opacity = "0.85";
        typeEl.textContent = HEADLINE;
        caret.style.display = "none";
        gsap.set([sub, searchWrap, cue], { opacity: 1, y: 0 });
        return;
      }

      // scrim, gold backdrop and typewriter overlap — the search bar is the
      // point of the page, it must not hide behind a long cinematic chain
      tl = gsap.timeline();
      tl.to(scrim, { opacity: 1, duration: 1.1, ease: "power2.inOut" }, 0);
      tl.to(abstract, { opacity: 0.9, duration: 2.4, ease: "power2.inOut" }, 0.3);
      tl.add(() => {
        typewriter(typeEl, HEADLINE, () => {
          if (disposed) return;
          gsap.to(sub, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
          gsap.to(searchWrap, { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: "power3.out" });
          gsap.to(cue, { opacity: 1, duration: 0.8, delay: 0.7 });
          caret.classList.add("caret-blink");
        });
      }, 0.6);
    };
    revealRef.current = reveal;

    const onScroll = () => {
      if (window.scrollY > 40) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onTime = () => {
      if (video?.duration && video.currentTime > video.duration - 0.6) reveal();
    };

    if (video) {
      if (reduced) {
        video.removeAttribute("autoplay");
        video.pause();
        reveal();
      } else if (video.ended) {
        reveal();
      } else {
        video.addEventListener("ended", reveal);
        // start the reveal slightly before the clip ends so it overlaps
        video.addEventListener("timeupdate", onTime);
        video.addEventListener("error", reveal);
        timers.push(setTimeout(() => reveal(), INTRO_MAX_MS));
        video.play().catch(reveal);
      }
    } else {
      reveal();
    }

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      tl?.kill();
      window.removeEventListener("scroll", onScroll);
      video?.removeEventListener("ended", reveal);
      video?.removeEventListener("timeupdate", onTime);
      video?.removeEventListener("error", reveal);
    };
  }, []);

  const state = searchState(status);
  const result = status.kind === "result" ? status.result : null;
  const usd = result ? fmtUsd(result.yearlyWei, ethUsd) : null;

  return (
    <div id="hero-wrap" className="relative z-10" style={{ height: "180vh" }}>
      <section id="hero" className="hero-grid sticky top-0 h-screen w-full overflow-hidden">
        {/* layer 1: the vault video, full bleed */}
        <video
          id="vault-video"
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/vault/vault-turn.mp4"
          poster="/vault/vault.jpg"
          muted
          autoPlay
          playsInline
          preload="auto"
        />

        {/* layer 1b: gold abstract backdrop — blooms in once the vault has opened */}
        <div
          id="hero-abstract"
          ref={abstractRef}
          className="h-full w-full opacity-0"
          style={{
            background: "url('/vault/hero-abstract.jpg') center / cover no-repeat",
            filter: "sepia(0.85) hue-rotate(-10deg) saturate(1.45) brightness(0.78)",
          }}
        />

        {/* layer 2: left-weighted scrim — copy sits on the dark side */}
        <div
          ref={scrimRef}
          className="h-full w-full opacity-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,11,12,0.94) 0%, rgba(11,11,12,0.82) 42%, rgba(11,11,12,0.40) 75%, rgba(11,11,12,0.55) 100%)",
          }}
        />

        {/* layer 3: content */}
        <div
          id="hero-ui"
          className="relative flex h-full w-full flex-col items-start justify-center px-6 text-left sm:px-12 lg:px-20"
          style={{ pointerEvents: live ? "auto" : "none" }}
        >
          <p className="mb-7 text-[11px] uppercase tracking-[0.35em] text-[#d6d6d0] sm:text-xs">
            yournames.eth · est. on ethereum
          </p>

          <h1 className="min-h-[1.2em] max-w-5xl text-[40px] font-extrabold leading-[1.06] tracking-tight sm:text-7xl lg:text-8xl">
            <span ref={typeRef} />
            <span ref={caretRef} className="text-gold">
              ▌
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-7 max-w-xl translate-y-4 text-base text-[#e6e6e1] opacity-0 sm:text-lg"
          >
            a friendly, independent home for your .eth name. $0 platform fees, ever — you pay ENS,
            not us.
          </p>

          <div ref={searchWrapRef} className="mt-10 w-full max-w-xl translate-y-6 opacity-0">
            <div
              className="vsearch flex items-center gap-1 rounded-2xl bg-surface/80 px-4 py-3.5 text-left backdrop-blur sm:px-5 sm:py-4"
              data-state={state}
            >
              <span className="select-none text-gold">&gt;</span>
              <label htmlFor="name-input" className="sr-only">
                Search for your .eth name
              </label>
              <input
                id="name-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                placeholder="find your name"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#9a9a98] sm:text-base"
              />
              <span className="select-none text-sm text-[#d6d6d0] sm:text-base">.eth</span>
            </div>

            <div
              className="mt-3 flex min-h-[2em] flex-wrap items-center justify-between gap-x-4 gap-y-2"
              aria-live="polite"
            >
              <p className="vresult text-xs text-[#b5b5b2] sm:text-[13px]" data-state={state}>
                {status.kind === "idle" && " "}
                {status.kind === "invalid" && status.reason.toLowerCase()}
                {status.kind === "checking" && "checking the registry…"}
                {status.kind === "error" && "couldn’t reach ethereum — try again in a moment"}
                {result &&
                  (result.available ? (
                    <>
                      <b className="text-foreground">{result.name}</b> is available —{" "}
                      {fmtEth(result.yearlyWei)}
                      {usd ? ` (≈${usd})` : ""}/year. you pay ENS, not us.
                    </>
                  ) : (
                    <>
                      <b>{result.name}</b> is taken — try another
                    </>
                  ))}
              </p>
              {result?.available && (
                <button
                  onClick={() => setRegistering(result)}
                  className="rounded-full bg-gold px-5 py-2 text-xs font-bold text-[#0b0b0c] transition hover:brightness-110 active:scale-[0.98]"
                >
                  register →
                </button>
              )}
            </div>

            {isConnected && address && (
              <p className="mt-4 text-xs text-[#b5b5b2]">
                connected as{" "}
                <b className="text-foreground">{heroEnsName ?? truncateAddress(address)}</b> —{" "}
                <Link href="/manage/" className="text-gold hover:underline">
                  manage your names →
                </Link>
              </p>
            )}
          </div>

          <div
            ref={cueRef}
            className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-2 opacity-0"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#b5b5b2]">scroll</span>
            <span className="cue-dot block h-1 w-1 rounded-full bg-foreground" />
          </div>
        </div>

        {/* skip intro — outside the pointer-events-locked UI layer */}
        {!live && (
          <div className="pointer-events-none relative h-full w-full">
            <button
              onClick={() => revealRef.current()}
              className="pointer-events-auto absolute bottom-6 right-6 text-[11px] text-[#b5b5b2] transition-colors hover:text-foreground"
            >
              skip intro →
            </button>
          </div>
        )}

        {registering && (
          <RegisterFlow label={registering.label} onClose={() => setRegistering(null)} />
        )}
      </section>
    </div>
  );
}
