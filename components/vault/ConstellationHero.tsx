"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useAccount, useEnsName } from "wagmi";
import RegisterFlow from "@/components/RegisterFlow";
import { checkLabel } from "@/lib/normalize";
import { isAvailable, rentPrice } from "@/lib/registration";
import { YEAR_SECONDS } from "@/lib/ens";
import { fmtEth, fmtUsd, fetchEthUsd, truncateAddress } from "@/lib/format";

/*
 * Constellation hero (design handoff: yournames-redesign (1).html, hero only).
 * "The inscription": a particle constellation spells the name you type,
 * floating in the ether above bottom-anchored serif copy + the live search.
 * The prototype renders the particles with three.js; this is a 2D-canvas port
 * of the same scene (perspective projection, additive blending, mouse
 * repulsion + parallax rotation) so we don't ship three.js to IPFS.
 * Search behavior stays REAL: debounced availability + protocol price against
 * the ETHRegistrarController, gold button flips Check it → Register → and
 * opens the commit/reveal RegisterFlow.
 */

const FOV = (50 * Math.PI) / 180;
const CAM_Z = 600;
const GOLD: [number, number, number] = [240, 199, 128];
const VIOLET: [number, number, number] = [139, 108, 255];
const BLUE: [number, number, number] = [122, 165, 255];

type Engine = { setName: (text: string) => void; destroy: () => void };

function lerp3(a: [number, number, number], b: [number, number, number], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function createConstellation(
  canvas: HTMLCanvasElement,
  hero: HTMLElement,
  fontFamily: string,
): Engine | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;
  const POOL = isMobile ? 3200 : 7000;
  const PSIZE = isMobile ? 2.4 : 2.1;

  const pos = new Float32Array(POOL * 3);
  const tgt = new Float32Array(POOL * 3);
  const seeds = new Float32Array(POOL);
  const styles: string[] = new Array(POOL).fill("rgb(20,20,40)");

  for (let i = 0; i < POOL; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 1600;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 600;
    seeds[i] = Math.random() * Math.PI * 2;
  }

  let W = 0;
  let H = 0;
  let focal = 1;
  function worldH() {
    return 2 * Math.tan(FOV / 2) * CAM_Z;
  }
  function worldW() {
    return worldH() * (W / H);
  }
  function resize() {
    W = hero.clientWidth || window.innerWidth;
    H = hero.clientHeight || window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    focal = H / 2 / Math.tan(FOV / 2);
  }
  resize();
  window.addEventListener("resize", resize);

  // sample text pixels from an offscreen 2D canvas (Fraunces, like the h1)
  function sampleText(text: string) {
    const c = document.createElement("canvas");
    const cx = c.getContext("2d");
    if (!cx) return [];
    c.width = 1400;
    c.height = 360;
    let size = 220;
    cx.font = `600 ${size}px ${fontFamily}`;
    const w = cx.measureText(text).width;
    if (w > c.width * 0.92) {
      size = (size * (c.width * 0.92)) / w;
      cx.font = `600 ${size}px ${fontFamily}`;
    }
    cx.fillStyle = "#fff";
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.fillText(text, c.width / 2, c.height / 2);
    const data = cx.getImageData(0, 0, c.width, c.height).data;
    const pts: { x: number; y: number }[] = [];
    const gap = isMobile ? 5 : 4;
    for (let y = 0; y < c.height; y += gap) {
      for (let x = 0; x < c.width; x += gap) {
        if (data[(y * c.width + x) * 4 + 3] > 128) {
          pts.push({ x: x - c.width / 2, y: -(y - c.height / 2) });
        }
      }
    }
    return pts;
  }

  function setName(text: string) {
    const pts = sampleText(text);
    if (!pts.length) return;
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const textW = Math.max(maxX - minX, 1);
    const textH = Math.max(maxY - minY, 1);
    const wW = worldW();
    const wH = worldH();
    // span ~74% of the viewport width, capped so the inscription stays in the
    // top band of the hero, clear of the bottom-anchored content
    let s = (wW * 0.74) / textW;
    s = Math.min(s, (wH * 0.18) / textH);
    const yOffset = wH * (0.5 - (isMobile ? 0.21 : 0.24));

    // shuffle for organic assembly
    for (let i = pts.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = pts[i];
      pts[i] = pts[j];
      pts[j] = t;
    }

    const lit = Math.min(POOL, pts.length);
    for (let i = 0; i < POOL; i++) {
      if (i < lit) {
        const p = pts[i % pts.length];
        tgt[i * 3] = p.x * s + (Math.random() - 0.5) * 2;
        tgt[i * 3 + 1] = p.y * s + yOffset + (Math.random() - 0.5) * 2;
        tgt[i * 3 + 2] = (Math.random() - 0.5) * 22;
        // gold→violet→blue sweep across x, with sparkle variance
        const t = (p.x - minX) / textW;
        const col = t < 0.5 ? lerp3(GOLD, VIOLET, t * 2) : lerp3(VIOLET, BLUE, (t - 0.5) * 2);
        const v = 0.75 + Math.random() * 0.45;
        styles[i] = `rgb(${Math.min(255, col[0] * v) | 0},${Math.min(255, col[1] * v) | 0},${Math.min(255, col[2] * v) | 0})`;
      } else {
        // ambient dust
        tgt[i * 3] = (Math.random() - 0.5) * wW * 1.3;
        tgt[i * 3 + 1] = (Math.random() - 0.5) * wW * 0.7;
        tgt[i * 3 + 2] = (Math.random() - 0.5) * 500 - 100;
        const d = 0.05 + Math.random() * 0.1;
        const col = Math.random() < 0.5 ? BLUE : VIOLET;
        styles[i] = `rgb(${(col[0] * d) | 0},${(col[1] * d) | 0},${(col[2] * d) | 0})`;
      }
    }
  }

  // mouse: world-space repulsion + gentle cloud parallax
  let mx = 9999, my = 9999, mnx = 0, mny = 0;
  let rotX = 0, rotY = 0;
  const onPointer = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect();
    mnx = ((e.clientX - r.left) / r.width) * 2 - 1;
    mny = ((e.clientY - r.top) / r.height) * 2 - 1;
    mx = (mnx * worldW()) / 2;
    my = (-mny * worldH()) / 2;
  };
  window.addEventListener("pointermove", onPointer);

  let clock = 0;
  let raf = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    clock += 0.016;
    const ease = reduced ? 1 : 0.055;
    if (!reduced) {
      rotY += (mnx * 0.05 - rotY) * 0.04;
      rotX += (-mny * 0.03 - rotX) * 0.04;
    }
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    ctx!.clearRect(0, 0, W, H);
    ctx!.globalCompositeOperation = "lighter";
    ctx!.globalAlpha = 0.95;
    for (let i = 0; i < POOL; i++) {
      const ix = i * 3, iy = ix + 1, iz = ix + 2;
      let tx = tgt[ix], ty = tgt[iy];
      const tz = tgt[iz];
      if (!reduced) {
        tx += Math.sin(clock * 0.9 + seeds[i]) * 1.4;
        ty += Math.cos(clock * 0.7 + seeds[i] * 1.3) * 1.4;
        const dx = pos[ix] - mx, dy = pos[iy] - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 8100) {
          const d = Math.sqrt(d2) || 1;
          const f = ((90 - d) / 90) * 26;
          tx += (dx / d) * f;
          ty += (dy / d) * f;
        }
      }
      pos[ix] += (tx - pos[ix]) * ease;
      pos[iy] += (ty - pos[iy]) * ease;
      pos[iz] += (tz - pos[iz]) * ease;

      // rotate cloud (Y then X), then perspective-project
      const x1 = pos[ix] * cosY + pos[iz] * sinY;
      const z1 = -pos[ix] * sinY + pos[iz] * cosY;
      const y1 = pos[iy] * cosX - z1 * sinX;
      const z2 = pos[iy] * sinX + z1 * cosX;
      const d = CAM_Z - z2;
      if (d <= 1) continue;
      const sc = focal / d;
      const sx = W / 2 + x1 * sc;
      const sy = H / 2 - y1 * sc;
      if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;
      const size = Math.max(0.7, PSIZE * sc);
      ctx!.fillStyle = styles[i];
      ctx!.fillRect(sx - size / 2, sy - size / 2, size, size);
    }
    ctx!.globalAlpha = 1;
    ctx!.globalCompositeOperation = "source-over";
  }
  raf = requestAnimationFrame(frame);

  return {
    setName,
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    },
  };
}

/* ─────────────────────────── component ─────────────────────────── */

type SearchResult = { label: string; name: string; available: boolean; yearlyWei: bigint };
type Status =
  | { kind: "idle" }
  | { kind: "invalid"; reason: string }
  | { kind: "checking" }
  | { kind: "result"; result: SearchResult }
  | { kind: "error" };

export default function ConstellationHero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const engineRef = useRef<Engine | null>(null);

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

  // constellation engine — boot once fonts are ready so sampling uses Fraunces
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const h1 = h1Ref.current;
    if (!canvas || !hero || !h1) return;
    const fontFamily = getComputedStyle(h1).fontFamily || "serif";
    const engine = createConstellation(canvas, hero, fontFamily);
    engineRef.current = engine;
    if (!engine) return;

    const boot = () => engine.setName((inputRef.current?.value.trim() || "yourname") + ".eth");
    let booted = false;
    const bootOnce = () => {
      if (booted) return;
      booted = true;
      boot();
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setTimeout(bootOnce, 60));
      setTimeout(bootOnce, 1800); // fallback if fonts hang
    } else {
      bootOnce();
    }

    // hero height can settle after fonts/layout — keep the inscription in sync
    let rszT: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(rszT);
      rszT = setTimeout(boot, 250);
    });
    ro.observe(hero);

    return () => {
      clearTimeout(rszT);
      ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // entrance stagger
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const tween = gsap.from(".hero-stagger", {
      opacity: 0,
      y: 42,
      duration: 1.1,
      stagger: 0.1,
      delay: 0.45,
      ease: "power3.out",
    });
    return () => {
      tween.kill();
    };
  }, []);

  // live inscription + real availability (debounced)
  useEffect(() => {
    const id = ++seq.current;
    const t0 = setTimeout(() => {
      engineRef.current?.setName((input.trim().replace(/\.eth$/i, "") || "yourname") + ".eth");
    }, 250);
    if (!input.trim()) {
      setStatus({ kind: "idle" });
      return () => clearTimeout(t0);
    }
    const check = checkLabel(input);
    if (!check.ok) {
      setStatus({ kind: "invalid", reason: check.reason });
      return () => clearTimeout(t0);
    }
    setStatus({ kind: "checking" });
    const t1 = setTimeout(async () => {
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
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [input]);

  const result = status.kind === "result" ? status.result : null;
  const usd = result ? fmtUsd(result.yearlyWei, ethUsd) : null;

  const onAction = () => {
    if (result?.available) setRegistering(result);
    else inputRef.current?.focus();
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="chero-body relative flex min-h-screen flex-col justify-end overflow-hidden"
    >
      <div className="chero-aurora" aria-hidden="true" />
      <canvas
        id="constellation"
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(180deg,black 0%,black 52%,rgba(0,0,0,.35) 100%)",
          WebkitMaskImage: "linear-gradient(180deg,black 0%,black 52%,rgba(0,0,0,.35) 100%)",
        }}
      />
      <div className="chero-grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-[46vh] sm:px-8 sm:pt-[44vh]">
        <p className="chero-eyebrow hero-stagger mb-5">An independent home for .eth names</p>

        <h1
          ref={h1Ref}
          className="chero-display max-w-4xl text-[clamp(2.2rem,5.5vw,4.4rem)] font-medium leading-[0.98] tracking-tight"
        >
          <span className="hero-stagger block">
            Own your <span className="chero-gradword italic">name</span>
          </span>
          <span className="hero-stagger block">on Ethereum.</span>
        </h1>

        <p className="hero-stagger mt-6 max-w-xl text-lg leading-relaxed text-[#9C97B8]">
          A name that&apos;s truly yours — it lives in your wallet, works across thousands of apps,
          and no company can take it away. You pay ENS, not us.
        </p>

        {/* Search */}
        <div className="hero-stagger mt-10 max-w-2xl">
          <div className="chero-search flex items-center gap-2 rounded-2xl p-2">
            <span className="chero-mono select-none pl-4 text-lg text-[#5E5980]" aria-hidden="true">
              /
            </span>
            <label htmlFor="name-input" className="sr-only">
              Search for your .eth name
            </label>
            <input
              id="name-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onAction();
              }}
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="yourname"
              maxLength={32}
              className="chero-display min-w-0 flex-1 bg-transparent py-4 text-xl tracking-tight text-[#F4F2FF] outline-none sm:text-2xl"
            />
            <span className="chero-mono select-none pr-1 text-lg text-[#F0C780]">.eth</span>
            <button
              onClick={onAction}
              className="chero-btngold shrink-0 rounded-xl px-5 py-4 text-sm sm:px-7 sm:text-base"
            >
              {result?.available ? "Register →" : "Check it"}
            </button>
          </div>

          <div
            className="chero-status chero-mono mt-3 min-h-[1.5rem] pl-2 text-sm"
            aria-live="polite"
          >
            {status.kind === "idle" && (
              <span className="meh">Type a name — watch it written in the ether above.</span>
            )}
            {status.kind === "invalid" && <span className="meh">{status.reason}</span>}
            {status.kind === "checking" && (
              <span className="meh">Checking on Ethereum…</span>
            )}
            {status.kind === "error" && (
              <span className="meh">Couldn&apos;t reach Ethereum — try again in a moment.</span>
            )}
            {result &&
              (result.available ? (
                <span className="ok">
                  {result.name} is available · {fmtEth(result.yearlyWei)}
                  {usd ? ` (≈${usd})` : ""}/yr, paid to ENS
                </span>
              ) : (
                <>
                  <span className="bad">{result.name} is taken.</span>{" "}
                  <span className="meh">Try another — every name above is one keystroke away.</span>
                </>
              ))}
          </div>

          {isConnected && address && (
            <p className="chero-mono mt-3 pl-2 text-xs text-[#9C97B8]">
              connected as{" "}
              <b className="text-[#F4F2FF]">{heroEnsName ?? truncateAddress(address)}</b> —{" "}
              <Link href="/manage/" className="text-[#F0C780] hover:underline">
                manage your names →
              </Link>
            </p>
          )}
        </div>

        {/* Hero stats */}
        <div className="hero-stagger mt-12 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl bg-[#F4F2FF]/10">
          <div className="bg-[#0b0b0c]/80 px-4 py-5 sm:px-6">
            <p className="chero-display text-2xl text-[#F0C780] sm:text-3xl">$0</p>
            <p className="mt-1 text-xs text-[#9C97B8]">platform fees, ever</p>
          </div>
          <div className="bg-[#0b0b0c]/80 px-4 py-5 sm:px-6">
            <p className="chero-display text-2xl sm:text-3xl">
              ~$5<span className="text-base text-[#9C97B8]">/yr</span>
            </p>
            <p className="mt-1 text-xs text-[#9C97B8]">most names, paid to ENS</p>
          </div>
          <div className="bg-[#0b0b0c]/80 px-4 py-5 sm:px-6">
            <p className="chero-display text-2xl sm:text-3xl">
              2<span className="text-base text-[#9C97B8]"> tx</span>
            </p>
            <p className="mt-1 text-xs text-[#9C97B8]">about a minute apart</p>
          </div>
        </div>
      </div>

      <div className="chero-mono hero-stagger absolute bottom-6 right-8 z-10 hidden items-center gap-2 text-xs text-[#5E5980] lg:flex">
        <span className="h-px w-8 bg-[#5E5980]" /> scroll
      </div>

      {registering && (
        <RegisterFlow label={registering.label} onClose={() => setRegistering(null)} />
      )}
    </section>
  );
}
