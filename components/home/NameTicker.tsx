import { grailsNameUrl } from "@/lib/grails";

/*
 * Premium-name ticker — infinite hairline-bound marquee of real premium names
 * taking offers on the secondary market. Each name deep-links to its Grails
 * page, where offers can be made. (Pause on hover, hidden entirely under
 * prefers-reduced-motion — see .marquee in globals.css; duration scales with
 * the longer list via the inline animationDuration.)
 */
const NAMES = [
  "slop.eth",
  "philosophy.eth",
  "group.eth",
  "files.eth",
  "sent.eth",
  "downtown.eth",
  "supercomputer.eth",
  "ten.eth",
  "size.eth",
  "hour.eth",
  "backend.eth",
  "money.eth",
  "fund.eth",
  "tax.eth",
  "legal.eth",
  "forex.eth",
  "charge.eth",
  "escrow.eth",
  "mba.eth",
  "goldtreasury.eth",
  "cryptotreasury.eth",
  "digitaltreasury.eth",
  "middleeast.eth",
  "muslims.eth",
  "theaters.eth",
  "ethereumagent.eth",
  "diamond.eth",
  "cargo.eth",
  "penthouses.eth",
];

export default function NameTicker() {
  const row = (hidden: boolean) => (
    <div className="flex items-center gap-12" aria-hidden={hidden || undefined}>
      {NAMES.map((name) => (
        <a
          key={name}
          href={grailsNameUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="whitespace-nowrap text-[0.8125rem] font-semibold text-foreground transition hover:text-white"
        >
          {name} <span className="font-normal text-foreground/45">— offers open</span>
        </a>
      ))}
    </div>
  );

  return (
    <div className="border-y border-line">
      <p className="eyebrow pt-3.5 text-center">
        Premium names · taking offers on the secondary market
      </p>
      <div className="marquee overflow-hidden py-[0.85rem]">
        <div className="marquee-track" style={{ animationDuration: "160s" }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}
