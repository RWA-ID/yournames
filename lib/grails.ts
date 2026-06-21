/*
 * Grails marketplace API (https://docs.grails.app) — read-only, public endpoints
 * only, so no auth/JWT is needed. We use the single `/names/:name` call, which
 * returns owner + active listings + highest offer + last sale in one round-trip,
 * to enrich a "taken" search result with live secondary-market data.
 *
 * Standard envelope: { success, data, meta }. All calls fail soft to null so the
 * registration flow never blocks on a marketplace hiccup.
 */

const GRAILS_API = "https://api.grails.app/api/v1";

/** ENS names treated as ETH-priced for display (native ETH + WETH). */
const ZERO_ADDR = "0x0000000000000000000000000000000000000000";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const isEthCurrency = (addr?: string | null) =>
  !addr || addr.toLowerCase() === ZERO_ADDR || addr.toLowerCase() === WETH_ADDR;

/** Canonical Grails name page (buy / make-offer / view) — opens in a new tab. */
export function grailsNameUrl(name: string): string {
  return `https://grails.app/${encodeURIComponent(name)}`;
}

export type GrailsResale = {
  name: string;
  owner: string | null;
  /** Cheapest active ETH/WETH listing, if any. */
  lowestPriceWei: bigint | null;
  listingCount: number;
  highestOfferWei: bigint | null;
  lastSale: { priceWei: bigint; date: string } | null;
};

type RawListing = {
  status?: string;
  price?: string;
  price_wei?: string;
  currency_address?: string;
};

type RawNameData = {
  owner?: string | null;
  listings?: RawListing[];
  highest_offer_wei?: string | null;
  highest_offer_currency?: string | null;
  last_sale_price?: string | null;
  last_sale_date?: string | null;
};

function toBigIntOrNull(v?: string | null): bigint | null {
  if (!v) return null;
  try {
    const n = BigInt(v);
    return n > 0n ? n : null;
  } catch {
    return null;
  }
}

/**
 * Fetch live secondary-market data for an already-registered name. Returns null
 * on any error/404/not-listed-not-owned so callers can simply skip rendering.
 */
export async function fetchGrailsResale(
  name: string,
  signal?: AbortSignal,
): Promise<GrailsResale | null> {
  let json: { success?: boolean; data?: RawNameData };
  try {
    const res = await fetch(`${GRAILS_API}/names/${encodeURIComponent(name)}`, { signal });
    if (!res.ok) return null;
    json = await res.json();
  } catch {
    return null; // network error or aborted
  }

  if (!json?.success || !json.data) return null;
  const d = json.data;

  const ethPrices = (d.listings ?? [])
    .filter((l) => l.status === "active" && isEthCurrency(l.currency_address))
    .map((l) => toBigIntOrNull(l.price ?? l.price_wei))
    .filter((p): p is bigint => p !== null);

  const lowestPriceWei = ethPrices.length ? ethPrices.reduce((a, b) => (a < b ? a : b)) : null;

  const lastSalePrice = toBigIntOrNull(d.last_sale_price);
  const lastSale =
    lastSalePrice && d.last_sale_date
      ? { priceWei: lastSalePrice, date: d.last_sale_date }
      : null;

  return {
    name,
    owner: d.owner ?? null,
    lowestPriceWei,
    listingCount: (d.listings ?? []).filter((l) => l.status === "active").length,
    highestOfferWei: isEthCurrency(d.highest_offer_currency)
      ? toBigIntOrNull(d.highest_offer_wei)
      : null,
    lastSale,
  };
}
