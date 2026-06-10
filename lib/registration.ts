import { type Address, type Hex, toHex } from "viem";
import { publicClient } from "@/lib/wagmi";
import { CONTROLLER_ABI, ENS, YEAR_SECONDS } from "@/lib/ens";

/**
 * ENS .eth commit/reveal registration helpers.
 *
 * The current controller's register()/makeCommitment() take ONE `Registration`
 * struct: (label, owner, duration, secret, resolver, data, reverseRecord,
 * referrer). reverseRecord is a uint8 bitfield: bit 1 = addr.reverse (Ethereum),
 * bit 2 = default.reverse. referrer is bytes32 — we always pass zero (no skim).
 */

export const ZERO_REFERRER: Hex =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const REVERSE_RECORD_ETHEREUM = 1;

export type Registration = {
  label: string;
  owner: Address;
  duration: bigint;
  secret: Hex;
  resolver: Address;
  data: readonly Hex[];
  reverseRecord: number;
  referrer: Hex;
};

/** Cryptographically-random 32-byte secret. MUST survive commit → register. */
export function randomSecret(): Hex {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

export function buildRegistration(params: {
  label: string;
  owner: Address;
  secret: Hex;
  years: number;
  primary: boolean;
}): Registration {
  return {
    label: params.label,
    owner: params.owner,
    duration: YEAR_SECONDS * BigInt(params.years),
    secret: params.secret,
    resolver: ENS.publicResolver,
    data: [],
    reverseRecord: params.primary ? REVERSE_RECORD_ETHEREUM : 0,
    referrer: ZERO_REFERRER,
  };
}

export async function isAvailable(label: string): Promise<boolean> {
  return publicClient.readContract({
    address: ENS.ethRegistrarController,
    abi: CONTROLLER_ABI,
    functionName: "available",
    args: [label],
  });
}

export async function rentPrice(
  label: string,
  duration: bigint,
): Promise<{ base: bigint; premium: bigint; total: bigint }> {
  const price = await publicClient.readContract({
    address: ENS.ethRegistrarController,
    abi: CONTROLLER_ABI,
    functionName: "rentPrice",
    args: [label, duration],
  });
  return { base: price.base, premium: price.premium, total: price.base + price.premium };
}

export async function makeCommitment(reg: Registration): Promise<Hex> {
  return publicClient.readContract({
    address: ENS.ethRegistrarController,
    abi: CONTROLLER_ABI,
    functionName: "makeCommitment",
    args: [reg],
  });
}

/** 5% headroom for price drift between commit and register; excess refunded. */
export function withBuffer(total: bigint): bigint {
  return total + (total * 5n) / 100n;
}

// ── Pending-commitment persistence ──────────────────────────────────────────
// A refresh mid-flow must NOT lose the commit (the user would pay gas twice).

const STORE_KEY = "yournames.pendingCommit.v1";

export type PendingCommit = {
  label: string;
  owner: Address;
  secret: Hex;
  years: number;
  primary: boolean;
  commitment: Hex;
  commitTxHash: Hex;
  /** unix ms when the commit tx was confirmed */
  committedAt: number;
};

export function savePendingCommit(c: PendingCommit): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(c));
  } catch {
    /* private mode — flow still works in-memory */
  }
}

export function loadPendingCommit(): PendingCommit | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as PendingCommit;
    // Commitments expire after maxCommitmentAge (24h). Drop stale ones.
    if (Date.now() - c.committedAt > 24 * 60 * 60 * 1000) {
      clearPendingCommit();
      return null;
    }
    return c;
  } catch {
    return null;
  }
}

export function clearPendingCommit(): void {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* noop */
  }
}
