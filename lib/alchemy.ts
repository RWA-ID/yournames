import type { Address } from "viem";
import { ENS } from "@/lib/ens";

/**
 * Alchemy NFT API helpers — used for (a) the avatar NFT picker and (b) an
 * owned-names fallback when the ENS subgraph is down. Both degrade gracefully
 * when no NEXT_PUBLIC_ALCHEMY_API_KEY is configured.
 */

const KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const hasAlchemy = Boolean(KEY);

const NFT_BASE = KEY ? `https://eth-mainnet.g.alchemy.com/nft/v3/${KEY}` : null;

export type OwnedNft = {
  contract: Address;
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
  title: string;
  imageUrl: string | null;
};

/** NFTs owned by `owner`, for the avatar picker (excludes spam). */
export async function fetchOwnedNfts(owner: Address, pageKey?: string): Promise<{
  nfts: OwnedNft[];
  pageKey: string | null;
} | null> {
  if (!NFT_BASE) return null;
  try {
    const url = new URL(`${NFT_BASE}/getNFTsForOwner`);
    url.searchParams.set("owner", owner);
    url.searchParams.set("withMetadata", "true");
    url.searchParams.set("pageSize", "24");
    url.searchParams.set("excludeFilters[]", "SPAM");
    if (pageKey) url.searchParams.set("pageKey", pageKey);
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const nfts: OwnedNft[] = (json.ownedNfts ?? [])
      .map((n: Record<string, any>) => ({
        contract: n.contract?.address as Address,
        tokenId: String(n.tokenId),
        tokenType: n.tokenType === "ERC1155" ? "ERC1155" : "ERC721",
        title: n.name || n.contract?.name || "Untitled",
        imageUrl: n.image?.cachedUrl || n.image?.thumbnailUrl || n.image?.originalUrl || null,
      }))
      .filter((n: OwnedNft) => n.contract && n.imageUrl);
    return { nfts, pageKey: json.pageKey ?? null };
  } catch {
    return null;
  }
}

/**
 * Owned-names fallback via NFT ownership: .eth NFTs (base registrar) +
 * wrapped names (NameWrapper ERC-1155). Misses manager-only names — fine
 * as a fallback when the subgraph is unavailable.
 */
export async function fetchOwnedNamesViaNfts(owner: Address): Promise<
  { name: string; wrapped: boolean }[] | null
> {
  if (!NFT_BASE) return null;
  try {
    const url = new URL(`${NFT_BASE}/getNFTsForOwner`);
    url.searchParams.set("owner", owner);
    url.searchParams.set("withMetadata", "true");
    url.searchParams.set("pageSize", "100");
    url.searchParams.append("contractAddresses[]", ENS.baseRegistrar);
    url.searchParams.append("contractAddresses[]", ENS.nameWrapper);
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const out: { name: string; wrapped: boolean }[] = [];
    for (const n of json.ownedNfts ?? []) {
      const title: string | undefined = n.name || n.title;
      if (!title || !title.endsWith(".eth")) continue;
      const wrapped = n.contract?.address?.toLowerCase() === ENS.nameWrapper.toLowerCase();
      out.push({ name: title.toLowerCase(), wrapped });
    }
    return out;
  } catch {
    return null;
  }
}
