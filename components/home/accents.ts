/*
 * Six-hue accent palette for the feature / use-case / step card icon tiles and
 * washes (from the homepage handoff). Cards cycle through these in order.
 */
export type Accent = {
  g1: string;
  g2: string;
  wash: string;
  ring: string;
  glow: string;
};

export const PALETTE: Accent[] = [
  { g1: "#6366f1", g2: "#8b5cf6", wash: "#f4f4ff", ring: "rgba(99,102,241,0.28)", glow: "rgba(99,102,241,0.30)" }, // indigo
  { g1: "#0ea5e9", g2: "#22d3ee", wash: "#f0fbff", ring: "rgba(14,165,233,0.28)", glow: "rgba(14,165,233,0.30)" }, // sky
  { g1: "#10b981", g2: "#34d399", wash: "#eefdf6", ring: "rgba(16,185,129,0.28)", glow: "rgba(16,185,129,0.30)" }, // emerald
  { g1: "#f59e0b", g2: "#fb923c", wash: "#fff8ef", ring: "rgba(245,158,11,0.30)", glow: "rgba(245,158,11,0.32)" }, // amber
  { g1: "#f43f5e", g2: "#fb7185", wash: "#fff4f5", ring: "rgba(244,63,94,0.28)", glow: "rgba(244,63,94,0.30)" }, // rose
  { g1: "#8b5cf6", g2: "#a78bfa", wash: "#f8f5ff", ring: "rgba(139,92,246,0.28)", glow: "rgba(139,92,246,0.30)" }, // violet
];

export const accentAt = (i: number) => PALETTE[i % PALETTE.length];

/** Gradient icon-tile style for a card at index `i`. */
export function tileStyle(i: number, size = "3.25rem"): React.CSSProperties {
  const t = accentAt(i);
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: 16,
    fontSize: "1.55rem",
    background: `linear-gradient(135deg,${t.g1},${t.g2})`,
    boxShadow: `0 10px 20px -4px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.5)`,
  };
}

/** Tinted-wash card style for a card at index `i`. */
export function cardTintStyle(i: number): React.CSSProperties {
  const t = accentAt(i);
  return {
    borderRadius: "var(--radius-card)",
    border: `1px solid ${t.ring}`,
    background: `linear-gradient(180deg,${t.wash},var(--surface) 60%)`,
    boxShadow: "var(--shadow-soft)",
  };
}
