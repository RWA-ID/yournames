/*
 * Typographic logo: `your` + gradient `names` + `.eth` in Sora bold. No image.
 * The brand gradient appears here and nowhere else (Dark Ledger handoff).
 */
export default function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`font-display font-bold tracking-tight ${small ? "text-[1.05rem]" : "text-xl"}`}
      style={{ letterSpacing: "-0.02em" }}
    >
      <span className="text-foreground">your</span>
      <span className="text-gradient">names</span>
      <span className="text-foreground/50">.eth</span>
    </span>
  );
}
