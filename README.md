# yournames.eth — ENS Registration Hub

A normie-friendly, fully client-side interface for registering **and managing** ENS
`.eth` names directly against the official ENS mainnet contracts. Static Next.js
export hosted on IPFS, resolved via the ENS name `yournames.eth`.

**Zero platform fees.** Users pay exactly the ENS protocol price + gas, straight to the
ENS contracts. No custody, no backend, no markup. Monetization is via clearly-labeled
sponsor slots (`public/sponsors.json`, contact info@onchain-id.id).

> **Disclaimer:** independent, community-built interface. Not affiliated with, endorsed
> by, or operated by ENS, ENS Labs, or the ENS DAO.

## Stack

- Next.js (App Router, `output: 'export'`) + Tailwind v4 + Framer Motion
- Homepage is the **Vault Experience** (Claude Design handoff, 2026-06-11; hero
  replaced 2026-06-12 with the **constellation hero** from a second handoff): a
  particle "inscription" spells the name you type in the ether above serif display
  copy + the live search, followed by the dark/gold scroll story — GSAP
  ScrollTrigger + Lenis (sliding coin chips, pinned horizontal how-it-works) and a
  gold particle dial. Both particle scenes are 2D-canvas ports of the prototypes'
  three.js scenes (no three dependency). Code in `components/vault/`, assets in
  `public/vault/`; all pages share the vault theme.
- Reown AppKit + wagmi v3 + viem (mainnet only, Alchemy RPC w/ public fallback)
- Registration: commit/reveal against the **current** ETHRegistrarController
  (`0x59E16fcCd424Cc24e280Be16E11Bcd56fb0CE547`, struct-based `register()`),
  pending commits persisted to localStorage so a refresh never loses a commit
- Management: text records / multicoin addresses (ENSIP-9/11) / contenthash
  (ENSIP-7, ipfs+ipns) / avatar incl. NFT picker (ENSIP-12) — all edits batched
  into ONE resolver `multicall` tx
- Ownership: transfer (registrant + manager), resolver change, subname creation,
  renew/extend (any name), primary name (reverse record), wrap/unwrap + fuses
- Data: ENS subgraph (fail-soft) with Alchemy NFT API fallback; live stats from
  `BaseRegistrar.totalSupply()` on-chain

All ENS contract addresses were verified against https://docs.ens.domains/learn/deployments/
on 2026-06-09 — see `lib/ens.ts` (pinned + commented).

## Develop

```bash
npm install
cp .env.example .env.local   # then fill keys
npm run dev
```

Env vars (`.env.local`): `NEXT_PUBLIC_REOWN_PROJECT_ID`, `NEXT_PUBLIC_ALCHEMY_API_KEY`,
`NEXT_PUBLIC_ETHERSCAN_API_KEY`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`,
`NEXT_PUBLIC_ENS_SUBGRAPH_URL` (optional override), `PINATA_JWT` (deploy only).

## Deploy to IPFS

```bash
npm run build          # → out/
bash pin.sh            # pins out/ to Pinata, prints the CID
```

Then set the `yournames.eth` contenthash to `ipfs://<CID>` (done manually by the
name owner in the ENS app).

## Logos

Integration logos must be official brand assets stored in `public/logos/` and
documented in `LOGOS_ATTRIBUTION.md`. Entries without a local file render as text
chips — never hotlink brand assets.
