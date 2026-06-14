/*
 * Typographic logo: `your` + gradient `names` + `.eth` in Sora bold. No image.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-xl font-extrabold tracking-tight ${className}`}
      style={{ letterSpacing: "-0.02em" }}
    >
      <span className="text-foreground">your</span>
      <span className="text-gradient">names</span>
      <span className="text-muted">.eth</span>
    </span>
  );
}
