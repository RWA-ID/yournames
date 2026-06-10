/**
 * ENSIP-12 avatar helpers: turn an avatar text-record value into a previewable
 * image URL. Supports https URLs, ipfs:// URIs, and NFT references
 * (eip155:1/erc721:<contract>/<tokenId> or erc1155).
 */
import type { Address } from "viem";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

export function ipfsToHttp(uri: string): string {
  return uri.replace(/^ipfs:\/\/(ipfs\/)?/i, IPFS_GATEWAY);
}

export function nftAvatarRecord(params: {
  contract: Address;
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
}): string {
  const std = params.tokenType === "ERC1155" ? "erc1155" : "erc721";
  return `eip155:1/${std}:${params.contract}/${params.tokenId}`;
}

export function parseNftAvatar(record: string): {
  contract: string;
  tokenId: string;
} | null {
  const m = record.match(/^eip155:1\/erc(?:721|1155):(0x[0-9a-fA-F]{40})\/(\d+)$/);
  return m ? { contract: m[1], tokenId: m[2] } : null;
}

/**
 * Best-effort preview URL for an avatar record value.
 * NFT references resolve via the ENS metadata service (no API key needed).
 */
export function avatarPreviewUrl(name: string, record: string): string | null {
  const v = record.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^ipfs:\/\//i.test(v)) return ipfsToHttp(v);
  if (parseNftAvatar(v)) {
    // ENS metadata service renders NFT avatars for any name with the record set;
    // for unsaved previews the caller should use the NFT image URL directly.
    return `https://metadata.ens.domains/mainnet/avatar/${name}`;
  }
  return null;
}
