/* The technical truth — terminal block. */

export default function Terminal() {
  return (
    <section className="border-y border-gold/15 bg-surface px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl" data-rise>
        <div className="overflow-hidden rounded-2xl border border-line bg-background">
          <div className="flex items-center gap-2 border-b border-gold/15 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rosex/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amberx/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
            <span className="ml-3 text-[11px] uppercase tracking-widest text-muted">
              the technical truth
            </span>
          </div>
          <div className="p-6 text-[13px] leading-7 text-muted sm:p-8">
            <p>
              <span className="text-mint">$</span> this site is a static export, pinned to IPFS.
            </p>
            <p>
              <span className="text-mint">$</span> every transaction calls the official ENS mainnet
              contracts directly.
            </p>
            <p>
              <span className="text-mint">$</span> we never hold your funds, your keys, or your
              name.
            </p>
            <p>
              <span className="text-mint">$</span> independent &amp; community-built — not
              affiliated with ENS, ENS Labs, or the ENS DAO.
            </p>
            <p className="mt-3">
              <span className="text-mint">$</span>{" "}
              <span className="text-foreground">trust the contract, not us.</span>
              <span className="text-gold">▌</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
