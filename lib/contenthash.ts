import { CID } from "multiformats/cid";
import { type Hex, bytesToHex, hexToBytes } from "viem";

/**
 * ENSIP-7 contenthash encode/decode for IPFS + IPNS.
 *
 * Wire format: uvarint(namespace) ++ CIDv1 bytes
 *   ipfs-ns = 0xe3 (varint bytes e3 01), ipns-ns = 0xe5 (varint bytes e5 01)
 * e.g. ipfs://Qm… → 0xe30101701220…  (e301 = ipfs-ns, 01 = cidv1, 70 = dag-pb)
 * Arweave/Swarm are intentionally unsupported here (rare; set via ENS app).
 */

const IPFS_PREFIX = new Uint8Array([0xe3, 0x01]);
const IPNS_PREFIX = new Uint8Array([0xe5, 0x01]);

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

export type ContentInput =
  | { protocol: "ipfs"; value: string }
  | { protocol: "ipns"; value: string };

/** Parse user input like "ipfs://bafy…", "ipns://k51…", or a bare CID. */
export function parseContentInput(raw: string): ContentInput | null {
  const v = raw.trim();
  if (!v) return null;
  const m = v.match(/^(ipfs|ipns):\/\/(.+)$/i);
  if (m) {
    const protocol = m[1].toLowerCase() as "ipfs" | "ipns";
    return { protocol, value: m[2].replace(/\/+$/, "") };
  }
  // Bare CID → assume IPFS
  return { protocol: "ipfs", value: v };
}

/** Encode to the bytes accepted by PublicResolver.setContenthash. */
export function encodeContenthash(input: ContentInput): Hex {
  // contenthash = varint(namespace) ++ FULL CIDv1 bytes (version ++ codec ++
  // multihash) — e.g. 0x e301 01 70 1220… for a dag-pb CIDv0 upgraded to v1.
  const cid = CID.parse(input.value);
  const prefix = input.protocol === "ipfs" ? IPFS_PREFIX : IPNS_PREFIX;
  return bytesToHex(concat(prefix, cid.toV1().bytes));
}

/** Decode on-chain contenthash bytes to a display string, or null. */
export function decodeContenthash(hex: Hex | undefined | null): string | null {
  if (!hex || hex === "0x") return null;
  try {
    const bytes = hexToBytes(hex);
    let protocol: "ipfs" | "ipns" | null = null;
    if (bytes[0] === 0xe3 && bytes[1] === 0x01) protocol = "ipfs";
    if (bytes[0] === 0xe5 && bytes[1] === 0x01) protocol = "ipns";
    if (!protocol) return null;
    const cid = CID.decode(bytes.slice(2));
    return `${protocol}://${cid.toString()}`;
  } catch {
    return null;
  }
}

/** Validate without throwing; returns an error message or null when valid. */
export function validateContentInput(raw: string): string | null {
  const parsed = parseContentInput(raw);
  if (!parsed) return null; // empty clears the record
  try {
    CID.parse(parsed.value);
    return null;
  } catch {
    return "That doesn't look like a valid IPFS/IPNS CID";
  }
}
