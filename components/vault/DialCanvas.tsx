"use client";

import { useEffect, useRef } from "react";

/*
 * Gold-dust "vault dial" behind the scroll story — 2D-canvas port of the
 * handoff's three.js vault-scene.js (concentric particle rings, FogExp2,
 * camera push-in, additive blending). Emulating the perspective projection by
 * hand keeps the exact look without shipping three.js to IPFS.
 * Scroll progress is fed in through the `vaultDial` store by VaultExperience.
 */

export const vaultDial = { progress: 0, visible: false };

const RINGS = 14;
const PER_RING = 160;
const FOG_DENSITY = 0.055;
const FOCAL_TAN = Math.tan((60 * Math.PI) / 180 / 2); // 60° vertical fov
const COLORS: [number, number, number][] = [
  [216, 179, 106], // gold
  [240, 217, 168], // pale gold
  [106, 95, 74], // bronze gray
];

export default function DialCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // particle field — same distribution as the three.js original
    const pts: { x: number; y: number; z: number; c: [number, number, number] }[] = [];
    for (let r = 0; r < RINGS; r++) {
      const radius = 2.2 + r * 0.85 + Math.random() * 0.2;
      for (let p = 0; p < PER_RING; p++) {
        const a = (p / PER_RING) * Math.PI * 2 + r * 0.35;
        const jitter = (Math.random() - 0.5) * 0.35;
        const t = Math.random();
        pts.push({
          x: Math.cos(a) * (radius + jitter),
          y: Math.sin(a) * (radius + jitter),
          z: -r * 1.4 + (Math.random() - 0.5) * 0.8,
          c: COLORS[t < 0.55 ? 2 : t < 0.85 ? 0 : 1],
        });
      }
    }

    let W = 0;
    let H = 0;
    let dpr = 1;
    function resize() {
      if (!canvas) return;
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    let opacity = 0;
    let raf = 0;
    const start = performance.now();

    function frame(now: number) {
      const t = (now - start) / 1000;
      const idle = reduced ? 0 : t * 0.02;
      const rot = idle + vaultDial.progress * Math.PI * 1.5;
      const camZ = 16 - vaultDial.progress * 9;
      const focal = H / 2 / FOCAL_TAN;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);

      opacity += ((vaultDial.visible ? 1 : 0) - opacity) * 0.06;
      canvas!.style.opacity = opacity.toFixed(3);

      ctx!.clearRect(0, 0, W, H);
      if (opacity < 0.01) {
        raf = requestAnimationFrame(frame);
        return;
      }
      ctx!.globalCompositeOperation = "lighter";
      for (const p of pts) {
        const d = camZ - p.z; // distance from camera
        if (d <= 0.1) continue;
        const rx = p.x * cos - p.y * sin;
        const ry = p.x * sin + p.y * cos;
        const s = focal / d;
        const sx = W / 2 + rx * s;
        const sy = H / 2 - ry * s;
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;
        const fog = Math.exp(-((FOG_DENSITY * d) ** 2)); // FogExp2
        const a = 0.55 * fog;
        if (a < 0.01) continue;
        const size = Math.max(0.6, 0.05 * s);
        ctx!.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a.toFixed(3)})`;
        ctx!.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
      ctx!.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="dial-canvas" ref={ref} aria-hidden="true" />;
}
