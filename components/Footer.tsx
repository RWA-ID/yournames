"use client";

import { DISCLAIMER, SITE } from "@/lib/site";
import { ENS, etherscanAddress } from "@/lib/ens";
import DonateButton from "@/components/DonateButton";

export default function Footer() {
  return (
    <footer className="cs-band mt-auto border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-line bg-brand-soft/60 p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">Disclaimer</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{DISCLAIMER}</p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold">
              your<span className="text-gradient">names</span>.eth
            </p>
            <p className="mt-2 text-sm text-muted">
              A friendly, independent home for your .eth name. 0% platform fees, forever.
            </p>
            <div className="mt-4">
              <DonateButton />
            </div>
          </div>

          <div>
            <p className="font-semibold">Verify everything</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a className="hover:text-foreground hover:underline" href={SITE.ensApp} target="_blank" rel="noreferrer">
                  Official ENS app
                </a>
              </li>
              <li>
                <a className="hover:text-foreground hover:underline" href={SITE.ensDocs} target="_blank" rel="noreferrer">
                  ENS documentation
                </a>
              </li>
              <li>
                <a
                  className="hover:text-foreground hover:underline"
                  href={etherscanAddress(ENS.ethRegistrarController)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Registrar contract on Etherscan
                </a>
              </li>
              <li>
                <a
                  className="hover:text-foreground hover:underline"
                  href={etherscanAddress(ENS.registry)}
                  target="_blank"
                  rel="noreferrer"
                >
                  ENS registry on Etherscan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">Get in touch</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a className="hover:text-foreground hover:underline" href={`mailto:${SITE.sponsorEmail}`}>
                  Sponsorships: {SITE.sponsorEmail}
                </a>
              </li>
              <li>
                <a className="hover:text-foreground hover:underline" href={SITE.github} target="_blank" rel="noreferrer">
                  GitHub — this site is open source
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          Built by the community, hosted on IPFS, resolved by ENS. © {new Date().getFullYear()}{" "}
          {SITE.name}
        </p>
      </div>
    </footer>
  );
}
