# Logo attribution & sourcing

## Wallet / app marks (`/public/logos/wallets/`) — "Works everywhere" section

Brand symbols shown in the homepage Wallets section and the ENS mark used in the
multi-chain card. Downloaded 2026-07-11 and stored locally so the IPFS build stays
self-contained — never hotlinked. Most come from the **Brandfetch Logo Link CDN**
(`https://cdn.brandfetch.io/<domain>/symbol?c=<client id>`), which sources and
licenses official brand assets; each logo remains the property of its brand.

| Brand | File | Source | Status |
|---|---|---|---|
| MetaMask | `wallets/metamask.webp` | Brandfetch `metamask.io/symbol` | Added |
| Trust Wallet | `wallets/trust.png` | Official gradient shield supplied by Hector 2026-07-11; white JPEG bg keyed to transparent (scratchpad `dewhite.mjs`) | Added |
| Coinbase Wallet | `wallets/coinbase.png` | Official blue-tile "C" mark supplied by Hector 2026-07-11; shown with CSS-rounded corners | Added |
| Phantom | `wallets/phantom.webp` | Brandfetch `phantom.com/symbol` (shown on brand-lavender chip — the ink ghost vanishes on our dark bg) | Added |
| Uniswap | `wallets/uniswap.webp` | Brandfetch `uniswap.org/symbol` | Added |
| Rainbow | `wallets/rainbow.webp` | Brandfetch `rainbow.me/symbol` (own baked bg, rounded in CSS) | Added |
| PayPal | `wallets/paypal.webp` | Brandfetch `paypal.com/symbol` | Added |
| ENS | `wallets/ens.png` | Official blue-tile mark supplied by Hector 2026-07-11 (JPEG → PNG); shown with CSS-rounded corners | Added |

Brandfetch fallback gotcha (for future additions): unknown domain/variant combos
return a Brandfetch "B" placeholder with HTTP 200 — verify by md5 (identical bytes
across domains = fallback) and visually before shipping. `theme/dark` means a
dark-*colored* logo (for light pages), `theme/light` a white one; several brands
have no `symbol` asset at all.

Caption shown in the UI: logos identify third-party products that resolve ENS names;
trademarks belong to their owners, no affiliation or endorsement implied.

Integration logos shown in the "Works everywhere" marquee are served via the
**Brandfetch Logo Link CDN** (https://brandfetch.com/developers/logo-api) —
`https://cdn.brandfetch.io/domain/<domain>?c=<client id>`. Brandfetch sources and
licenses official brand assets; each logo remains the property of its brand. If a
logo fails to load, the UI gracefully falls back to a text chip with the brand name.

| Brand | Brandfetch domain |
|---|---|
| MetaMask | `metamask.io` |
| Coinbase Wallet | `coinbase.com` |
| Ledger | `ledger.com` |
| Uniswap | `uniswap.org` |
| OpenSea | `opensea.io` |
| Etherscan | `etherscan.io` |
| Brave | `brave.com` |
| Farcaster | `farcaster.xyz` |
| Base | `base.org` |
| Rainbow | `rainbow.me` |
| Trust Wallet | `trustwallet.com` |
| GoDaddy | `godaddy.com` |

Caption shown in the UI: "These platforms recognize ENS names. We are not affiliated
with them." plus a "Logos by Brandfetch" credit per the Logo Link attribution terms.

## Hero ribbon chain logos (`/public/logos/chains/`)

Official chain/token marks shown on the capsules riding the Cosmos hero ribbon.
Polygon/Avalanche/BNB come from the Trust Wallet Assets repository
(https://github.com/trustwallet/assets, community-maintained aggregate of official
brand logos, MIT-licensed repo). Ethereum/Bitcoin/Solana were swapped 2026-06-10 to
the spothq `cryptocurrency-icons` set (https://github.com/spothq/cryptocurrency-icons,
CC0) — the Trust Wallet variants were dark/black-backed and invisible on the dark
hero chips; the spothq badges are bright solid-color circles that read at 20 px.

| Chain | File | Asset source | Downloaded | Status |
|---|---|---|---|---|
| Ethereum | `chains/ethereum.png` | spothq `128/color/eth.png` | 2026-06-10 | Added |
| Bitcoin | `chains/bitcoin.png` | spothq `128/color/btc.png` | 2026-06-10 | Added |
| Solana | `chains/solana.png` | spothq `128/color/sol.png` | 2026-06-10 | Added |
| Polygon | `chains/polygon.png` | trustwallet `polygon/info/logo.png` | 2026-06-09 | Added |
| Avalanche | `chains/avalanche.png` | trustwallet `avalanchec/info/logo.png` | 2026-06-09 | Added |
| BNB Chain | `chains/bnb.png` | trustwallet `smartchain/info/logo.png` | 2026-06-09 | Added |

Usage is nominative (identifying the chains ENS names interoperate with); logos are shown
unmodified at small capsule size. We are not affiliated with or endorsed by these brands.

## Vault homepage coin chips (`/public/logos/coins/`)

Round coin marks shown inside the glassy chips of the homepage's "One name. Every
chain." act (design handoff: vault/Vault Experience.html). All files are stored
locally so the IPFS build is fully self-contained — never hotlinked.

| Coin | File | Asset source | Downloaded | Status |
|---|---|---|---|---|
| Bitcoin | `coins/btc.svg` | spothq `svg/color/btc.svg` (cryptocurrency-icons@0.18.1, CC0) | 2026-06-11 | Added |
| Ethereum | `coins/eth.svg` | spothq `svg/color/eth.svg` (CC0) | 2026-06-11 | Added |
| Solana | `coins/sol.png` | solana-labs/token-list wrapped-SOL `logo.png` | 2026-06-11 | Added |
| Dogecoin | `coins/doge.svg` | spothq `svg/color/doge.svg` (CC0) | 2026-06-11 | Added |
| Optimism | `coins/op.png` | trustwallet `optimism/info/logo.png` | 2026-06-11 | Added |
| Polygon (POL) | `coins/pol.svg` | spothq `svg/color/matic.svg` (CC0) | 2026-06-11 | Added |
| USDC | `coins/usdc.svg` | spothq `svg/color/usdc.svg` (cryptocurrency-icons@0.18.1, CC0) | 2026-07-11 | Added |

Usage is nominative (chains a .eth name can hold addresses for); logos are shown
unmodified inside decorative chips. We are not affiliated with or endorsed by these brands.
