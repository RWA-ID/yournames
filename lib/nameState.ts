import { keccak256, namehash, stringToBytes, type Address } from "viem";
import { publicClient } from "@/lib/wagmi";
import {
  BASE_REGISTRAR_ABI,
  ENS,
  NAME_WRAPPER_ABI,
  REGISTRY_ABI,
  ZERO_ADDRESS,
} from "@/lib/ens";

/**
 * Ownership/roles/expiry for a single name, with plain-English role mapping:
 *   registrant = owner of the .eth NFT (base registrar ERC-721, 2LDs only)
 *   manager    = ENS registry owner of the node (can edit records)
 *   wrapped    = registry owner is the NameWrapper; real owner is ERC-1155
 */

export function labelhashOf(label: string): `0x${string}` {
  return keccak256(stringToBytes(label));
}

export type NameState = {
  name: string;
  label: string;
  is2LD: boolean;
  wrapped: boolean;
  registrant: Address | null;
  manager: Address;
  resolver: Address;
  /** unix seconds; 2LDs only */
  expiry: bigint | null;
  fuses: number | null;
};

export async function getNameState(name: string): Promise<NameState> {
  const node = namehash(name);
  const parts = name.split(".");
  const is2LD = parts.length === 2 && parts[1] === "eth";
  const label = parts[0];

  const [manager, resolver] = await Promise.all([
    publicClient.readContract({
      address: ENS.registry,
      abi: REGISTRY_ABI,
      functionName: "owner",
      args: [node],
    }),
    publicClient.readContract({
      address: ENS.registry,
      abi: REGISTRY_ABI,
      functionName: "resolver",
      args: [node],
    }),
  ]);

  const wrapped = manager.toLowerCase() === ENS.nameWrapper.toLowerCase();

  let registrant: Address | null = null;
  let expiry: bigint | null = null;
  let fuses: number | null = null;
  let effectiveManager: Address = manager;

  if (is2LD) {
    const tokenId = BigInt(labelhashOf(label));
    const [ownerRes, expiryRes] = await Promise.allSettled([
      publicClient.readContract({
        address: ENS.baseRegistrar,
        abi: BASE_REGISTRAR_ABI,
        functionName: "ownerOf",
        args: [tokenId],
      }),
      publicClient.readContract({
        address: ENS.baseRegistrar,
        abi: BASE_REGISTRAR_ABI,
        functionName: "nameExpires",
        args: [tokenId],
      }),
    ]);
    if (ownerRes.status === "fulfilled") registrant = ownerRes.value;
    if (expiryRes.status === "fulfilled" && expiryRes.value > 0n) expiry = expiryRes.value;
  }

  if (wrapped) {
    try {
      const [owner, f] = await publicClient.readContract({
        address: ENS.nameWrapper,
        abi: NAME_WRAPPER_ABI,
        functionName: "getData",
        args: [BigInt(node)],
      });
      if (owner !== ZERO_ADDRESS) {
        effectiveManager = owner;
        if (is2LD) registrant = owner; // wrapped 2LD: wrapper holds the NFT
      }
      fuses = Number(f);
    } catch {
      /* keep registry data */
    }
  }

  return {
    name,
    label,
    is2LD,
    wrapped,
    registrant,
    manager: effectiveManager,
    resolver,
    expiry,
    fuses,
  };
}

/** Can `addr` edit this name's records (registry manager or wrapped owner)? */
export function canManage(state: NameState, addr: Address | undefined): boolean {
  if (!addr) return false;
  return state.manager.toLowerCase() === addr.toLowerCase();
}

export function isRegistrant(state: NameState, addr: Address | undefined): boolean {
  if (!addr || !state.registrant) return false;
  return state.registrant.toLowerCase() === addr.toLowerCase();
}

// ── Name Wrapper fuses (owner-controlled, ENSIP) ────────────────────────────
export const FUSES = [
  { bit: 1, name: "CANNOT_UNWRAP", danger: "The name can never be unwrapped back to a regular NFT." },
  { bit: 2, name: "CANNOT_BURN_FUSES", danger: "No further fuses can ever be burned." },
  { bit: 4, name: "CANNOT_TRANSFER", danger: "The name can never be transferred to another wallet." },
  { bit: 8, name: "CANNOT_SET_RESOLVER", danger: "The resolver contract can never be changed." },
  { bit: 16, name: "CANNOT_SET_TTL", danger: "The TTL can never be changed." },
  { bit: 32, name: "CANNOT_CREATE_SUBDOMAIN", danger: "No new subnames can ever be created." },
  { bit: 64, name: "CANNOT_APPROVE", danger: "Renewal managers can never be approved." },
] as const;

export const PARENT_CANNOT_CONTROL = 0x10000;
