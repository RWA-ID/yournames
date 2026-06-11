/** Site-wide constants. */
export const SITE = {
  name: "yournames.eth",
  url: "https://yournames.eth.link",
  description:
    "Register and manage your .eth name — a portable, programmable identity you truly own. Independent community interface, zero platform fees. Not affiliated with ENS.",
  github: "https://github.com/RWA-ID/yournames",
  sponsorEmail: "info@onchain-id.id",
  builder: "ENS Giant",
  twitter: { handle: "@ensgianteth", url: "https://x.com/ensgianteth" },
  donate: {
    ensName: "ensgiant.eth",
    address: "0x2D037f66b9e0EDE90c2080558a7d3FF7BE36E9A1" as const,
  },
  ensApp: "https://app.ens.domains",
  ensDocs: "https://docs.ens.domains",
} as const;

export const DISCLAIMER =
  "yournames.eth is an independent, community-built interface. We are not affiliated with, endorsed by, or operated by ENS, ENS Labs, or the ENS DAO. “ENS” and the ENS logo are property of their respective owners. We charge no platform fee — you pay only the standard ENS protocol registration cost plus Ethereum network (gas) fees, directly to the ENS smart contracts. Always verify contract addresses independently. This is not financial or legal advice.";
