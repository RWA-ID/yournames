import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — yournames.eth",
  description:
    "yournames.eth has no accounts, no tracking, and no server. What little data exists stays in your browser or on public blockchains.",
};

const strong = "font-semibold text-foreground";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy:"
      twist="we don't want your data."
      updated="July 10, 2026"
      sections={[
        {
          title: "No accounts, no tracking",
          body: (
            <p>
              There is <span className={strong}>no sign-up, no analytics, no advertising pixels,
              and no tracking cookies</span> on this site. We do not collect, store, share, or sell
              personal data. There is no server behind the interface — it is a static site served
              from IPFS, so there is nowhere for your data to go even if we wanted it.
            </p>
          ),
        },
        {
          title: "What stays in your browser",
          body: (
            <p>
              While a registration is in progress, the site saves the in-flight commit (the name,
              your wallet address, and the registration secret) to your browser&apos;s{" "}
              <span className={strong}>localStorage</span>{" "}
              so a refresh doesn&apos;t lose your spot
              or cost you a second transaction. It never leaves your device and is cleared when the
              registration completes. You can wipe it anytime by clearing site data.
            </p>
          ),
        },
        {
          title: "What the blockchain sees",
          body: (
            <p>
              Registrations, renewals, and records are{" "}
              <span className={strong}>public, permanent entries on Ethereum</span>: your wallet
              address, the names it holds, and any profile records you attach are visible to
              everyone by design of the protocol. Think before publishing personal details (email,
              location) as ENS records — that is an on-chain, public act, not something this site
              controls.
            </p>
          ),
        },
        {
          title: "Third parties your browser talks to",
          body: (
            <>
              <p>
                To show live data, the app makes requests{" "}
                <span className={strong}>directly from your browser</span> to: Ethereum RPC
                providers (PublicNode, Alchemy), the ENS subgraph (The Graph), Coinbase (ETH/USD
                price), Grails (secondary-market listings), IPFS gateways and the ENS metadata
                service (avatars), and your own wallet via Reown/WalletConnect when you connect.
              </p>
              <p>
                Like any web request, these services can see your IP address and what was
                requested, under their own privacy policies. We receive none of it.
              </p>
            </>
          ),
        },
        {
          title: "Email",
          body: (
            <p>
              If you email us (for example about sponsoring), we see what you send and use it only
              to reply. No mailing lists, no sharing.
            </p>
          ),
        },
        {
          title: "Changes & contact",
          body: (
            <p>
              If this policy changes, the &ldquo;last updated&rdquo; date above changes with it.
              Questions:{" "}
              <a className="underline" href={`mailto:${SITE.sponsorEmail}`}>
                {SITE.sponsorEmail}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
