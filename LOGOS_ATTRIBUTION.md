# Logo attribution & sourcing

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

Usage is nominative (chains a .eth name can hold addresses for); logos are shown
unmodified inside decorative chips. We are not affiliated with or endorsed by these brands.
