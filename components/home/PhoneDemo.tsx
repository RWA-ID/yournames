"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/*
 * "The everyday magic" — a custom orange iPhone frame with an animated
 * typewriter inside the screen, alternating between a hex-address state (amber
 * warning, disabled CTA) and a resolved name state (verified green, active CTA).
 * Copy column sits to the right, phone to the left.
 */

const HEX = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
const NAME = "alex.eth";

type Phone = { mode: "hex" | "name"; text: string; resolved: boolean };

function buildSequence(): { d: number; s: Phone }[] {
  const seq: { d: number; s: Phone }[] = [];
  for (let i = 1; i <= HEX.length; i++) seq.push({ d: 48, s: { mode: "hex", text: HEX.slice(0, i), resolved: false } });
  seq.push({ d: 1300, s: { mode: "hex", text: HEX, resolved: false } });
  for (let i = HEX.length - 1; i >= 0; i--) seq.push({ d: 12, s: { mode: "hex", text: HEX.slice(0, i), resolved: false } });
  seq.push({ d: 450, s: { mode: "name", text: "", resolved: false } });
  for (let i = 1; i <= NAME.length; i++) seq.push({ d: 150, s: { mode: "name", text: NAME.slice(0, i), resolved: false } });
  seq.push({ d: 550, s: { mode: "name", text: NAME, resolved: false } });
  seq.push({ d: 3000, s: { mode: "name", text: NAME, resolved: true } });
  seq.push({ d: 700, s: { mode: "hex", text: "", resolved: false } });
  return seq;
}

export default function PhoneDemo() {
  const [phone, setPhone] = useState<Phone>({ mode: "hex", text: "", resolved: false });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhone({ mode: "name", text: NAME, resolved: true });
      return;
    }
    const seq = buildSequence();
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const cur = seq[idx % seq.length];
      setPhone(cur.s);
      idx++;
      timer = setTimeout(step, cur.d);
    };
    step();
    return () => clearTimeout(timer);
  }, []);

  const isHex = phone.mode === "hex";

  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[auto_1fr] md:gap-14">
        {/* Phone */}
        <div className="order-1 flex justify-center">
          <PhoneFrame phone={phone} isHex={isHex} />
        </div>

        {/* Copy */}
        <div className="order-2">
          <p className="text-[13px] font-bold uppercase tracking-wider text-brand">The everyday magic</p>
          <h2
            className="mt-3.5 font-display font-bold"
            style={{ fontSize: "clamp(1.875rem,3.5vw,2.5rem)", letterSpacing: "-0.02em", lineHeight: 1.08 }}
          >
            Stop copy-pasting wallet addresses.
          </h2>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
            Sending crypto today means leaving your app, copying a 42-character string, switching
            back, pasting, and praying you didn&apos;t drop a character. With a{" "}
            <strong className="text-foreground">.eth</strong> name you just type the name — like
            texting a friend.
          </p>

          <div className="mt-7 flex max-w-md flex-col gap-3">
            <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-background px-4 py-3.5">
              <span className="shrink-0 text-lg" aria-hidden="true">
                😮‍💨
              </span>
              <div>
                <p className="text-[15px] font-semibold">The old way</p>
                <p className="font-mono text-[13px] text-muted">0x71C7…8976F — copy · switch · paste · re-check</p>
              </div>
            </div>
            <div
              className="flex items-center gap-3.5 rounded-2xl border bg-brand-soft px-4 py-3.5"
              style={{ borderColor: "var(--brand)" }}
            >
              <span className="shrink-0 text-lg" aria-hidden="true">
                ✨
              </span>
              <div>
                <p className="text-[15px] font-semibold" style={{ color: "var(--brand-strong)" }}>
                  The yournames way
                </p>
                <p className="text-[13px]" style={{ color: "var(--brand-strong)" }}>
                  <strong>alex.eth</strong> — type the name and send.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ phone, isHex }: { phone: Phone; isHex: boolean }) {
  const captionRef = useRef<HTMLDivElement>(null);
  const caption = phone.resolved
    ? "✓ Verified — funds will reach alex.eth."
    : isHex
      ? "42 hex characters, copied from another app. One wrong digit and it's gone for good."
      : "Just type a name. No copy-paste, no triple-checking.";
  const captionColor = phone.resolved ? "#0a8a4f" : isHex ? "#c2410c" : "#6b7280";

  return (
    <div
      className="relative w-full max-w-[620px]"
      style={{ aspectRatio: "1024 / 1536", filter: "drop-shadow(0 30px 50px rgba(16,24,40,0.22))" }}
    >
      {/* live screen */}
      <div
        className="absolute overflow-hidden"
        style={{ left: "27.05%", top: "13.87%", width: "45.7%", height: "66.08%", borderRadius: 26, background: "#F2F2F7" }}
      >
        <div
          className="flex h-full flex-col gap-2.5 px-3 pb-4 pt-10"
          style={{ fontFamily: "-apple-system,system-ui,sans-serif", background: "#F2F2F7" }}
        >
          <div className="rounded-[18px] bg-white px-4 py-3.5" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div className="text-xs font-semibold text-[#8a8a8e]">Amount</div>
            <div className="mt-0.5 text-[28px] font-bold tracking-tight text-[#111]">0.25 ETH</div>
            <div className="text-xs text-[#8a8a8e]">≈ $812.40</div>
          </div>

          <div className="rounded-[18px] bg-white px-4 py-3.5" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div className="mb-2 text-xs font-semibold text-[#8a8a8e]">
              {isHex ? "Paste recipient address" : "Send to"}
            </div>
            <div className="flex min-h-[42px] flex-wrap items-center">
              <span
                className="font-mono text-[16px] font-semibold leading-[1.5] text-[#1c1c1e]"
                style={{ wordBreak: "break-all", letterSpacing: "-0.01em" }}
              >
                {phone.text}
              </span>
              {!phone.resolved && <span className="yn-caret" />}
            </div>
            {phone.resolved && (
              <div
                className="mt-2.5 flex items-center gap-2.5 rounded-xl px-2.5 py-2"
                style={{ background: "#e8faf0", border: "1px solid #b8eccd" }}
              >
                <span
                  className="size-[30px] shrink-0 rounded-full"
                  style={{ background: "linear-gradient(135deg,#4f46e5,#0ea5e9,#10b981)" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold text-[#111]">alex.eth</div>
                  <div className="font-mono text-[11px] text-[#0a8a4f]">→ 0x71C7…8976F</div>
                </div>
                <span className="whitespace-nowrap text-xs font-bold text-[#0a8a4f]">✓ Verified</span>
              </div>
            )}
          </div>

          <div ref={captionRef} className="px-0.5 pt-0.5 text-xs font-medium leading-[1.45]" style={{ color: captionColor }}>
            {caption}
          </div>
          <div className="flex-1" />
          <div
            className="rounded-[14px] p-3.5 text-center text-[16px] font-bold"
            style={
              phone.resolved
                ? { background: "linear-gradient(135deg,#4f46e5,#0ea5e9)", color: "#fff", boxShadow: "0 6px 16px rgba(79,70,229,0.3)" }
                : { background: "#e9e9ec", color: "#a3a3a8" }
            }
          >
            {phone.resolved ? "Send 0.25 ETH" : "Enter a recipient"}
          </div>
        </div>
      </div>

      {/* frame overlay */}
      <Image
        src="/iphone-frame-orange.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="pointer-events-none object-contain"
        sizes="620px"
      />
    </div>
  );
}
