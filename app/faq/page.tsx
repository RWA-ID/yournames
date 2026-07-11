import type { Metadata } from "next";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — ENS & .eth names, explained | yournames.eth",
  description:
    "Everything about ENS names: what a .eth name is, registration and pricing, renewals, multi-chain payments, wallets and PayPal support, websites, subnames, and the secondary market.",
};

/*
 * FAQ — grouped, extensive ENS explainer in the Dark Ledger ledger style.
 * Answers are plain strings (arrays = paragraphs) so the exact same data
 * renders the page AND the schema.org FAQPage JSON-LD. Native <details>
 * accordions: no client JS, works on every IPFS gateway.
 */
type Qa = { q: string; a: string[] };
type Group = { title: string; items: Qa[] };

const GROUPS: Group[] = [
  {
    title: "The basics",
    items: [
      {
        q: "What is ENS?",
        a: [
          "The Ethereum Name Service (ENS) is an open, public naming protocol built on Ethereum. It maps human-readable names like maria.eth to the machine-readable identifiers behind them — wallet addresses, websites, avatars, and profile records.",
          "It works like DNS does for the internet, with one key difference: an ENS name is an asset held in your own wallet. No company sits between you and your name.",
        ],
      },
      {
        q: "What exactly is a .eth name?",
        a: [
          "A .eth name is a token (an NFT, ERC-721) recorded on the Ethereum blockchain. Owning it gives you the exclusive right to point that name at your addresses and records for as long as you keep the registration current.",
          "Because it lives in your wallet, it can be held, transferred, or sold like any other on-chain asset — and no platform can confiscate it.",
        ],
      },
      {
        q: "How is a .eth name different from a normal domain name?",
        a: [
          "A DNS domain is rented from a registrar that can seize, censor, or lose it, and it only points to websites. A .eth name is self-custodied on Ethereum and does more: it receives payments on many chains, signs you into apps, hosts a website, and carries your public profile.",
          "There is no renewal middleman either — renewals are payments straight to the ENS protocol's smart contracts.",
        ],
      },
      {
        q: "Who is behind yournames.eth?",
        a: [
          "yournames.eth is an independent, open-source, community-built interface to the ENS protocol — not affiliated with ENS Labs or the ENS DAO. Every registration happens directly between your wallet and the official ENS smart contracts.",
          "We add a 0% platform fee: you pay exactly what the protocol charges, plus network gas. The full source code is public on GitHub.",
        ],
      },
      {
        q: "Who governs ENS?",
        a: [
          "ENS is governed by the ENS DAO, a decentralized organization of $ENS token holders, with core contracts that have been running publicly on Ethereum since 2017. It is not a company that can shut your name off.",
        ],
      },
    ],
  },
  {
    title: "Registering a name",
    items: [
      {
        q: "How do I register a .eth name?",
        a: [
          "Search for the name on our homepage. If it's available, connect your wallet and confirm two transactions: a commit, then — after a short ~60-second wait — the registration itself. The name lands in your wallet immediately.",
        ],
      },
      {
        q: "Why does registration take two transactions?",
        a: [
          "It's a security feature of the ENS protocol called commit–reveal. The first transaction publishes a hidden commitment to your name; the second reveals and completes it. The gap makes it impossible for bots watching the network to see your name and register it before you (front-running).",
        ],
      },
      {
        q: "What do I need before I start?",
        a: [
          "An Ethereum wallet (MetaMask, Rainbow, Coinbase Wallet, Trust Wallet, and others all work) with enough ETH to cover the registration price and gas. No account, email, or sign-up is needed here.",
        ],
      },
      {
        q: "What names are allowed?",
        a: [
          "Names must be at least 3 characters and are normalized to lowercase under the ENS name standard (ENSIP-15). Letters, numbers, hyphens, many scripts, and emoji are supported — but avoid characters that look like others (homoglyphs), since wallets may flag confusable names.",
        ],
      },
      {
        q: "Can I register a name for someone else, or many years at once?",
        a: [
          "Yes and yes. You can register with any recipient wallet in mind and transfer it later, and you can pay for multiple years upfront — one transaction, one gas fee, and no risk of forgetting a renewal.",
        ],
      },
    ],
  },
  {
    title: "Pricing & renewals",
    items: [
      {
        q: "What does a .eth name cost?",
        a: [
          "The ENS protocol prices names by length, denominated in USD and paid in ETH: names of 5+ characters cost $5/year, 4-character names $160/year, and 3-character names $640/year. Ethereum network gas is added on top.",
          "On yournames.eth you pay exactly those protocol prices — our platform fee is 0%, always.",
        ],
      },
      {
        q: "Are there any hidden fees on this site?",
        a: [
          "No. We never add a markup, service fee, or commission. Your wallet pays the ENS smart contracts directly; we never touch or hold your funds.",
        ],
      },
      {
        q: "What happens when my name expires?",
        a: [
          "You get a 90-day grace period after expiry during which only you can renew at the normal price. After that, the name enters a temporary premium auction (starting high and decaying over 21 days), and then anyone can register it at the normal price.",
          "Renew early — set a calendar reminder or register for multiple years. Losing a name to expiry is the most common (and most avoidable) way names are lost.",
        ],
      },
      {
        q: "Is a .eth name a good investment?",
        a: [
          "Register a name because it's useful to you — as your payment identity, login, and website. Names do trade on a secondary market and some sell for significant amounts, but values can go to zero. Nothing on this site is financial advice.",
        ],
      },
    ],
  },
  {
    title: "Using your name",
    items: [
      {
        q: "How do people pay me with my name?",
        a: [
          "They type your name — maria.eth — into the send screen of their wallet instead of a 42-character address. The wallet resolves the name on-chain to your current address and sends. Right wallet, right network, every time.",
          "This also works in PayPal and Venmo for crypto transfers: enter a .eth name as the recipient.",
        ],
      },
      {
        q: "Can I log into apps with my name?",
        a: [
          "Yes. \"Sign-in with Ethereum\" lets you authenticate to a growing set of apps with your wallet, and apps that support ENS greet you by name and show your avatar — one identity, no passwords, carried everywhere.",
        ],
      },
      {
        q: "What is a primary name (reverse record)?",
        a: [
          "It's the setting that makes apps display your name instead of your address. Your name points to your address (forward resolution); the primary name points your address back at the name (reverse resolution). Set it once in the manager — most apps won't show your name until you do.",
        ],
      },
      {
        q: "Can I change where my name points later?",
        a: [
          "Anytime. Addresses, avatar, website, and text records are all editable in the manager with a wallet signature. The name itself stays put — only its records change.",
        ],
      },
      {
        q: "Can I host a website on my name?",
        a: [
          "Yes. Point your name's contenthash record at content on IPFS and your site is reachable at yourname.eth in ENS-aware browsers (and at yourname.eth.link or yourname.eth.limo in any browser) — no hosting company, no server.",
        ],
      },
      {
        q: "What are text records?",
        a: [
          "Free-form public profile fields attached to your name: avatar, email, URL, X/Twitter, GitHub, description, and more. Apps read them to build your portable profile — set them once, they follow you everywhere.",
        ],
      },
    ],
  },
  {
    title: "Wallets & multi-chain",
    items: [
      {
        q: "Which wallets support ENS?",
        a: [
          "Effectively all major ones. MetaMask, Trust Wallet, Coinbase Wallet, Phantom, Uniswap Wallet, Rainbow, Ledger, Brave, and over a thousand other wallets and apps resolve .eth names today — and PayPal and Venmo accept them for crypto transfers.",
        ],
      },
      {
        q: "Can one name receive Bitcoin, Solana, or Dogecoin?",
        a: [
          "Yes — this is one of ENS's most underrated features. A single .eth name stores a separate address for each chain (multi-coin address records): BTC, SOL, ETH, DOGE, and 100+ more. A sender's wallet automatically picks the right address for the asset they're sending.",
          "So \"send USDC to maria.eth\" and \"send BTC to maria.eth\" both land correctly, with no chain confusion.",
        ],
      },
      {
        q: "Does my name work on layer-2 networks?",
        a: [
          "Yes. Your name resolves in apps across the EVM ecosystem — Base, Arbitrum, Optimism, and other L2s — wherever the app supports ENS lookups. USDC and other tokens on those networks arrive at the address your name specifies.",
        ],
      },
    ],
  },
  {
    title: "Companies & subnames",
    items: [
      {
        q: "Why should a company register its name?",
        a: [
          "Two reasons: verified payments (customers pay acme.eth, a name provably owned by you, instead of an address pasted into an invoice) and impersonation defense (on-chain ownership is public, so scammers can't claim your name). Registration costs protocol price and takes minutes.",
        ],
      },
      {
        q: "What are subnames?",
        a: [
          "Names you issue under your own: pay.acme.eth, support.acme.eth, alice.acme.eth. The parent name controls them — grant them to teams and products, structure your on-chain presence, and revoke them when needed. Subnames of a name you hold are free to create (gas only).",
        ],
      },
    ],
  },
  {
    title: "Secondary market",
    items: [
      {
        q: "The name I want is taken. What can I do?",
        a: [
          "Check the secondary market. When you search a taken name here, we show live listing and offer data from the Grails marketplace — many held names are for sale or accept offers. You can also pick a strong variant (add your industry, country, or first name) and register that instead.",
        ],
      },
      {
        q: "What are the premium names in the banner?",
        a: [
          "The ticker on our homepage shows real premium names — short, generic, brandable words — that are taking offers on the secondary market. Click any of them to view the name and make an offer on Grails.",
        ],
      },
      {
        q: "How does buying a name from someone work?",
        a: [
          "Secondary sales happen on marketplaces like Grails through audited escrow contracts: your payment and the seller's name swap atomically in one transaction — no trust required between buyer and seller. The name arrives in your wallet the moment you pay.",
        ],
      },
    ],
  },
  {
    title: "Security & self-custody",
    items: [
      {
        q: "Can yournames.eth freeze my name or funds?",
        a: [
          "No — and that's by design. This site is a client-side interface: transactions go from your wallet straight to the ENS contracts. We never custody names or funds, so we couldn't move, freeze, or recover them even if asked.",
        ],
      },
      {
        q: "What if I lose access to my wallet?",
        a: [
          "Your name is controlled by whatever wallet holds it, so protect your seed phrase like the asset it guards. There is no password reset in self-custody. Consider a hardware wallet for valuable names, and transfer names you rely on to your most secure wallet.",
        ],
      },
      {
        q: "How do I avoid ENS scams?",
        a: [
          "Verify before you sign: check the contract address your wallet shows against the official ENS contracts, be suspicious of names using lookalike characters, and never share your seed phrase — no legitimate service will ask for it. When paying a name, confirm the spelling character by character.",
        ],
      },
    ],
  },
];

/* schema.org FAQPage — one entry per question, straight from GROUPS. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROUPS.flatMap((g) =>
    g.items.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a.join(" ") },
    })),
  ),
};

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="mx-auto w-full max-w-[46rem] flex-1 px-6 pb-20 pt-14 sm:px-8">
        <p className="eyebrow">Help</p>
        <h1 className="mt-4 font-display text-[2.1rem] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2.6rem]">
          ENS, <span className="editorial">explained.</span>
        </h1>
        <p className="mt-4 max-w-[36rem] text-[0.9375rem] leading-[1.7] text-foreground/65">
          Everything visitors ask about .eth names — what they are, what they cost, and what one
          name can do. Still stuck? Email{" "}
          <a className="underline" href={`mailto:${SITE.sponsorEmail}`}>
            {SITE.sponsorEmail}
          </a>
          .
        </p>

        {GROUPS.map((group, gi) => (
          <section key={group.title} className="mt-12">
            <div className="flex items-baseline gap-4 border-t border-line-strong pt-5">
              <span className="font-display text-[0.8125rem] font-bold text-faint">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-[1.35rem] font-bold tracking-[-0.01em] text-foreground">
                {group.title}
              </h2>
            </div>
            <div className="mt-2">
              {group.items.map((qa, i) => (
                <details
                  key={qa.q}
                  className={`group py-1 ${
                    i < group.items.length - 1 ? "border-b border-line-faint" : ""
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-3.5 text-[0.9875rem] font-semibold text-foreground transition hover:text-white [&::-webkit-details-marker]:hidden">
                    {qa.q}
                    <span
                      aria-hidden="true"
                      className="select-none text-foreground/40 transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="space-y-3 pb-5 pr-8 text-[0.9375rem] leading-[1.7] text-foreground/65">
                    {qa.a.map((p) => (
                      <p key={p.slice(0, 32)}>{p}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
