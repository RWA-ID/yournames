import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions — yournames.eth",
  description:
    "Terms for using yournames.eth, an independent, client-side interface to the ENS protocol. 0% platform fee, no custody, no accounts.",
};

const strong = "font-semibold text-foreground";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms, in"
      twist="plain English."
      updated="July 10, 2026"
      sections={[
        {
          title: "Who we are",
          body: (
            <>
              <p>
                yournames.eth is an <span className={strong}>independent, community-built
                interface</span>{" "}
                to the Ethereum Name Service (ENS) protocol. It is not
                affiliated with, endorsed by, or operated by ENS, ENS Labs, or the ENS DAO.
                &ldquo;ENS&rdquo; and third-party logos are property of their respective owners.
              </p>
              <p>
                The interface is open source — you can read every line at{" "}
                <a className="underline" href={SITE.github} target="_blank" rel="noreferrer">
                  {SITE.github.replace("https://", "")}
                </a>
                . By using the site you agree to these terms.
              </p>
            </>
          ),
        },
        {
          title: "What the service is",
          body: (
            <>
              <p>
                This site is a <span className={strong}>client-side interface only</span>. When you
                register, renew, or manage a name, your wallet signs transactions that go{" "}
                <span className={strong}>directly to the public ENS smart contracts</span> on
                Ethereum. We never take custody of your funds or your names, and we cannot move,
                freeze, or recover them.
              </p>
              <p>
                We charge a <span className={strong}>0% platform fee — nothing, ever</span>. You pay
                only the ENS protocol&apos;s registration and renewal price plus Ethereum network
                gas, both of which go to the protocol and the network, not to us.
              </p>
            </>
          ),
        },
        {
          title: "Your responsibility",
          body: (
            <>
              <p>
                You control your wallet and its keys; we never see them.{" "}
                <span className={strong}>Verify every transaction in your wallet before
                signing</span> — on-chain actions are generally irreversible, and a name
                registration cannot be undone or refunded by us.
              </p>
              <p>
                Names expire. Keeping a name renewed is{" "}
                <span className={strong}>your responsibility</span>: after expiry and the
                protocol&apos;s grace period, anyone may register it. Make sure names you register
                comply with the laws that apply to you and don&apos;t infringe others&apos; rights.
              </p>
            </>
          ),
        },
        {
          title: "No warranties",
          body: (
            <p>
              The interface is provided <span className={strong}>&ldquo;as is&rdquo;, without
              warranties of any kind</span>. Availability, prices, and on-chain data are read from
              third-party providers and may be delayed, incomplete, or unavailable. The ENS
              protocol and Ethereum are outside our control. We may change or discontinue the
              interface at any time — your names are unaffected, because they live in your wallet,
              not with us.
            </p>
          ),
        },
        {
          title: "Not financial or legal advice",
          body: (
            <p>
              Nothing on this site is financial, investment, or legal advice. ENS names may have a
              market value that can change or <span className={strong}>go to zero</span>. Register
              a name because it&apos;s useful to you, not as an investment.
            </p>
          ),
        },
        {
          title: "Third-party services",
          body: (
            <p>
              The site links to and reads data from third parties — Ethereum RPC providers, the
              ENS apps and docs, Etherscan, IPFS gateways, and the Grails secondary marketplace.
              Their terms and policies apply on their sites. Sponsored placements, where present,
              are <span className={strong}>clearly labeled ads</span> and are not endorsements.
            </p>
          ),
        },
        {
          title: "Limitation of liability",
          body: (
            <p>
              To the maximum extent permitted by law, the maintainers and contributors of
              yournames.eth are <span className={strong}>not liable for any loss</span> — of funds,
              names, data, or otherwise — arising from your use of the interface, the ENS smart
              contracts, your wallet, network conditions, or third-party services, whether direct,
              indirect, or consequential.
            </p>
          ),
        },
        {
          title: "Changes & contact",
          body: (
            <p>
              We may update these terms; the &ldquo;last updated&rdquo; date above changes when we
              do, and continued use means you accept the update. Questions:{" "}
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
