/*
 * Name ticker — infinite hairline-bound marquee of example registrations
 * (32s loop, pause on hover, hidden entirely under prefers-reduced-motion —
 * see .marquee in globals.css).
 */
const ITEMS: Array<[name: string, note: string]> = [
  ["nordbank.eth", "brand protected"],
  ["maria.eth", "registered today"],
  ["meridian.eth", "subnames issued to 40 staff"],
  ["kenji.eth", "paid by name via PayPal"],
  ["atelier.eth", "site live at atelier.eth.link"],
];

export default function NameTicker() {
  const row = (hidden: boolean) => (
    <div className="flex items-center gap-12" aria-hidden={hidden || undefined}>
      {ITEMS.map(([name, note]) => (
        <span key={name} className="whitespace-nowrap text-[0.8125rem] font-semibold text-foreground">
          {name} <span className="font-normal text-foreground/45">— {note}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line py-[0.85rem]">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
