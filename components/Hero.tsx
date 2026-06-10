"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SearchBar, { type SearchResult } from "@/components/SearchBar";
import RegisterFlow from "@/components/RegisterFlow";

/*
 * Cosmos motion hero — canvas-rendered silk ribbons with chain logos and .eth
 * names riding the main current. Port of the design handoff's
 * "hero/Cosmos Hero v2.html" with its saved tweaks baked in:
 * Aurora palette, slim bands, 1.5× flow speed, chips on.
 * The dark cosmos theme is scoped to this hero only — the rest of the UI stays light.
 */

const TAU = Math.PI * 2;
const SPEED = 1.5;
const WEIGHT = 0.62; // "Slim" band weight
const PALETTE = ["#0ea5e9", "#2dd4bf", "#34d399", "#38bdf8", "#627eea"]; // Aurora
const STAR_COUNT = 150;
const S = 110; // samples along each ribbon centerline

// Each ribbon: undulating centerline; bands = parallel silky strips, one per palette color.
const RIBBONS = [
  { yBase: 0.335, a1: 0.075, f1: 1.05, sp1: 0.0105, a2: 0.030, f2: 2.4, sp2: 0.0065, p1: 0.15, p2: 0.55,
    bandW: 9, gap: 10.5, alpha: 0.34, twist: 1.7, twSp: 0.05, dim: 0.6 },
  { yBase: 0.565, a1: 0.050, f1: 1.45, sp1: 0.0085, a2: 0.022, f2: 2.9, sp2: 0.0110, p1: 0.62, p2: 0.10,
    bandW: 6, gap: 7, alpha: 0.20, twist: 2.2, twSp: 0.04, dim: 0.45 },
  { yBase: 0.800, a1: 0.062, f1: 0.92, sp1: 0.0130, a2: 0.028, f2: 2.1, sp2: 0.0080, p1: 0.0, p2: 0.35,
    bandW: 21, gap: 21.5, alpha: 0.95, twist: 1.15, twSp: 0.055, dim: 1.0 },
];
type Ribbon = (typeof RIBBONS)[number];
const MAIN = RIBBONS[2];

// Chips riding the main ribbon: official chain logos (stored in /public/logos/chains,
// recorded in LOGOS_ATTRIBUTION.md) interleaved with .eth names.
const CHIPS: { label: string; logo?: string }[] = [
  { label: "yournames.eth" },
  { label: "Ethereum", logo: "/logos/chains/ethereum.png" },
  { label: "vitalik.eth" },
  { label: "Bitcoin", logo: "/logos/chains/bitcoin.png" },
  { label: "alice.eth" },
  { label: "Solana", logo: "/logos/chains/solana.png" },
  { label: "bob.eth" },
  { label: "Polygon", logo: "/logos/chains/polygon.png" },
  { label: "Avalanche", logo: "/logos/chains/avalanche.png" },
  { label: "BNB Chain", logo: "/logos/chains/bnb.png" },
];

function hexToRgb(h: string): [number, number, number] {
  const v = h.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

export default function Hero() {
  const [registering, setRegistering] = useState<SearchResult | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const heroEl = heroRef.current;
    const canvasEl = canvasRef.current;
    const maybeCtx = canvasEl?.getContext("2d");
    if (!heroEl || !canvasEl || !maybeCtx) return;
    // non-null consts so the narrowed types reach the nested function declarations
    const hero = heroEl;
    const canvas = canvasEl;
    const ctx = maybeCtx;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bands = PALETTE.map(hexToRgb);
    let W = 0;
    let H = 0;

    // scratch buffers: centerline points + normals
    const px = new Float64Array(S);
    const py = new Float64Array(S);
    const nx = new Float64Array(S);
    const ny = new Float64Array(S);

    function centerline(r: Ribbon, s: number, t: number): [number, number] {
      const x = (-0.14 + s * 1.28) * W;
      const y = H * (r.yBase
        + r.a1 * Math.sin(TAU * (s * r.f1 + t * r.sp1 * SPEED + r.p1))
        + r.a2 * Math.sin(TAU * (s * r.f2 - t * r.sp2 * SPEED + r.p2)));
      return [x, y];
    }

    function sampleRibbon(r: Ribbon, t: number) {
      for (let i = 0; i < S; i++) {
        const p = centerline(r, i / (S - 1), t);
        px[i] = p[0];
        py[i] = p[1];
      }
      for (let i = 0; i < S; i++) {
        const i0 = Math.max(0, i - 1);
        const i1 = Math.min(S - 1, i + 1);
        const dx = px[i1] - px[i0];
        const dy = py[i1] - py[i0];
        const len = Math.hypot(dx, dy) || 1;
        nx[i] = -dy / len;
        ny[i] = dx / len;
      }
    }

    // closed path between (off - halfW) and (off + halfW), both scaled by the breath envelope
    function edgePath(off: number, halfW: number, r: Ribbon, t: number) {
      for (let i = 0; i < S; i++) {
        const si = i / (S - 1);
        const env = 0.8 + 0.2 * Math.sin(TAU * (si * 0.9 - t * r.twSp * 0.4 * SPEED + r.p1));
        const w = halfW * env;
        const o = off * env;
        const X = px[i] + nx[i] * (o - w);
        const Y = py[i] + ny[i] * (o - w);
        if (i === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      }
      for (let i = S - 1; i >= 0; i--) {
        const si = i / (S - 1);
        const env = 0.8 + 0.2 * Math.sin(TAU * (si * 0.9 - t * r.twSp * 0.4 * SPEED + r.p1));
        const w = halfW * env;
        const o = off * env;
        ctx.lineTo(px[i] + nx[i] * (o + w), py[i] + ny[i] * (o + w));
      }
      ctx.closePath();
    }

    function drawRibbon(r: Ribbon, t: number) {
      sampleRibbon(r, t);
      const nBands = bands.length;
      const mid = (nBands - 1) / 2;
      const bandW = r.bandW * WEIGHT;
      const gap = r.gap * WEIGHT;
      const totalHalf = (gap * (nBands - 1) + bandW) / 2;

      // 1. flat color bands — a continuous silk sheet, no per-band shading
      for (let b = 0; b < nBands; b++) {
        const col = bands[b];
        const d = r.dim;
        ctx.globalAlpha = r.alpha;
        ctx.fillStyle = `rgb(${(col[0] * d) | 0},${(col[1] * d) | 0},${(col[2] * d) | 0})`;
        ctx.beginPath();
        edgePath((b - mid) * gap, bandW / 2 + 0.4, r, t);
        ctx.fill();
      }

      // 2. one shared sheen + shade sweep across the whole ribbon (smooth, seam-free)
      const sheen = ctx.createLinearGradient(px[0], 0, px[S - 1], 0);
      const NST = 24;
      for (let j = 0; j <= NST; j++) {
        const sj = j / NST;
        const twj = Math.sin(TAU * (sj * r.twist - t * r.twSp * SPEED));
        const lit = Math.max(0, twj);
        const dark = Math.max(0, -twj);
        sheen.addColorStop(sj, `rgba(${lit > 0 ? `236,231,255,${(lit * 0.28).toFixed(3)}` : `5,4,14,${(dark * 0.38).toFixed(3)}`})`);
      }
      ctx.globalAlpha = r.alpha;
      ctx.fillStyle = sheen;
      ctx.beginPath();
      edgePath(0, totalHalf, r, t);
      ctx.fill();

      // 3. bright spine highlight on the lit crest (additive)
      ctx.globalCompositeOperation = "lighter";
      for (let j = 0; j < S - 1; j++) {
        const ss = j / (S - 1);
        const twh = Math.sin(TAU * (ss * r.twist - t * r.twSp * SPEED));
        if (twh > 0.55) {
          ctx.globalAlpha = (twh - 0.55) * 0.5 * r.dim;
          ctx.strokeStyle = "#e9e4ff";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(px[j], py[j]);
          ctx.lineTo(px[j + 1], py[j + 1]);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }

    /* ---------------- stars ---------------- */
    let stars: { x: number; y: number; r: number; p: number; s: number; d: number; hue: string }[] = [];
    function makeStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.5 + Math.random() * 1.4,
          p: Math.random() * TAU,
          s: 0.4 + Math.random() * 1.1,
          d: 1.5 + Math.random() * 5,
          hue: Math.random() < 0.25 ? "167,139,250" : Math.random() < 0.4 ? "56,189,248" : "244,244,255",
        });
      }
    }
    function drawStars(t: number) {
      for (const st of stars) {
        const tw = reduce ? 0.7 : 0.45 + 0.45 * Math.sin(t * st.s + st.p);
        ctx.beginPath();
        ctx.arc((st.x + t * st.d) % (W + 12) - 6, st.y, st.r * (0.8 + tw * 0.4), 0, TAU);
        ctx.fillStyle = `rgba(${st.hue},${(0.2 + tw * 0.5).toFixed(3)})`;
        ctx.fill();
      }
    }

    /* ---------------- chips riding the main ribbon ---------------- */
    const chips = CHIPS.map((_, i) => ({
      el: chipRefs.current[i],
      off: i / CHIPS.length,
      x: 0,
      y: 0,
      vis: 0,
    }));

    function updateChips(t: number) {
      const travel = t * 0.011 * SPEED; // full crossing ≈ 90s/speed
      sampleRibbon(MAIN, t);
      for (const c of chips) {
        if (!c.el) continue;
        const s = (c.off + travel) % 1;
        const idx = s * (S - 1);
        const i0 = Math.floor(idx);
        const f = idx - i0;
        const i1 = Math.min(S - 1, i0 + 1);
        const x = px[i0] + (px[i1] - px[i0]) * f;
        const y = py[i0] + (py[i1] - py[i0]) * f;
        const fade = Math.max(0, Math.min(1, (s - 0.045) / 0.05)) * Math.max(0, Math.min(1, (0.955 - s) / 0.05));
        c.x = x;
        c.y = y;
        c.vis = fade;
        c.el.style.opacity = fade.toFixed(3);
        c.el.style.transform = `translate(${x - c.el.offsetWidth / 2}px,${y - c.el.offsetHeight / 2}px)`;
      }
      // glowing connection lines when chips pass near each other
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < chips.length; i++) {
        let linked = false;
        for (let j = i + 1; j < chips.length; j++) {
          const a = chips[i];
          const b = chips[j];
          if (a.vis < 0.5 || b.vis < 0.5) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 190) {
            const al = (1 - d / 190) * 0.55;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(167,139,250,${al})`);
            grad.addColorStop(1, `rgba(56,189,248,${al})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            linked = true;
            b.el?.classList.add("linked");
          }
        }
        chips[i].el?.classList.toggle("linked", linked);
      }
      ctx.globalCompositeOperation = "source-over";
    }

    /* ---------------- main loop ---------------- */
    function frame(t: number) {
      ctx.clearRect(0, 0, W, H);
      drawStars(t);
      drawRibbon(RIBBONS[1], t); // farthest
      drawRibbon(RIBBONS[0], t); // behind headline
      drawRibbon(RIBBONS[2], t); // main, front
      updateChips(t);
    }

    function resize() {
      const r = hero.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
      if (reduce) frame(40);
    }

    let raf = 0;
    const start = performance.now();
    function loop(now: number) {
      frame((now - start) / 1000 + 40); // +40 so phases start mid-flow
      raf = requestAnimationFrame(loop);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    if (reduce) frame(40);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section ref={heroRef} className="cosmos-hero relative overflow-hidden">
      <div aria-hidden className="cosmos-nebula" />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

      {/* chips riding the main ribbon */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
        {CHIPS.map((c, i) => (
          <div
            key={c.label}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className="cchip"
          >
            {c.logo ? (
              <>
                <Image src={c.logo} alt="" width={20} height={20} className="rounded-full" />
                {c.label}
              </>
            ) : (
              <span className="cname">{c.label}</span>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-[6] mx-auto max-w-4xl px-4 pb-40 pt-14 text-center sm:px-6 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(167,139,250,0.3)] bg-[rgba(17,14,38,0.55)] px-4 py-1.5 text-xs font-semibold text-[#a5a3c2] backdrop-blur">
            <span className="size-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf]" /> 0%
            platform fee — you pay ENS, not us
          </span>
          <h1 className="mx-auto mt-6 font-display text-[clamp(44px,7vw,92px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#f4f4ff] [text-shadow:0_0_70px_rgba(167,139,250,0.4)]">
            Own your name
            <br />
            on <span className="cosmos-grad">Ethereum</span>
          </h1>
          <p className="mt-5 text-[clamp(19px,2.2vw,28px)] font-light tracking-[-0.01em] text-[#cfcaf2]">
            A name that&apos;s truly yours.
          </p>
          <p className="mt-3 text-[clamp(14px,1.3vw,17px)] text-[#a5a3c2]">
            A friendly, independent home for your{" "}
            <strong className="font-semibold text-[#f4f4ff]">.eth</strong> name. 0% platform fees,
            forever.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-9"
        >
          <SearchBar onRegister={setRegistering} />
        </motion.div>
      </div>

      {registering && (
        <RegisterFlow label={registering.label} onClose={() => setRegistering(null)} />
      )}
    </section>
  );
}
