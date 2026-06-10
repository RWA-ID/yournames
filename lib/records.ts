import { encodeFunctionData, namehash, type Address, type Hex } from "viem";
import { publicClient } from "@/lib/wagmi";
import { ENS, REGISTRY_ABI, RESOLVER_ABI } from "@/lib/ens";
import { COINS, decodeCoinAddress, encodeCoinAddress } from "@/lib/coins";
import { decodeContenthash, encodeContenthash, parseContentInput } from "@/lib/contenthash";

/**
 * Read + batched-write of resolver records. ALL edits are encoded into a
 * single PublicResolver `multicall` so the user signs exactly once.
 */

export type TextField = { key: string; label: string; placeholder: string };

/** ENSIP-5 profile fields surfaced as friendly inputs. */
export const TEXT_FIELDS: TextField[] = [
  { key: "display", label: "Display name", placeholder: "How apps should show you" },
  { key: "description", label: "Bio", placeholder: "A short description" },
  { key: "url", label: "Website", placeholder: "https://…" },
  { key: "email", label: "Email", placeholder: "you@example.com" },
  { key: "location", label: "Location", placeholder: "City, Country" },
  { key: "com.twitter", label: "X / Twitter", placeholder: "handle (no @)" },
  { key: "com.github", label: "GitHub", placeholder: "username" },
  { key: "com.discord", label: "Discord", placeholder: "username" },
  { key: "org.telegram", label: "Telegram", placeholder: "username" },
  { key: "com.linkedin", label: "LinkedIn", placeholder: "username" },
  { key: "com.reddit", label: "Reddit", placeholder: "username" },
  { key: "farcaster", label: "Farcaster", placeholder: "username" },
  { key: "notice", label: "Notice", placeholder: "A public notice for this name" },
];

export function nodeOf(name: string): Hex {
  return namehash(name);
}

export async function getResolverOf(name: string): Promise<Address> {
  return publicClient.readContract({
    address: ENS.registry,
    abi: REGISTRY_ABI,
    functionName: "resolver",
    args: [namehash(name)],
  });
}

export type NameRecords = {
  texts: Record<string, string>;
  /** coinType → display address */
  addresses: Record<number, string>;
  contenthash: string | null;
  resolver: Address;
};

/** Read everything the editor shows in one multicall round-trip. */
export async function readRecords(name: string, extraTextKeys: string[] = []): Promise<NameRecords> {
  const node = namehash(name);
  const resolver = await getResolverOf(name);
  const zero = resolver === "0x0000000000000000000000000000000000000000";
  if (zero) {
    return { texts: {}, addresses: {}, contenthash: null, resolver };
  }

  const textKeys = [...TEXT_FIELDS.map((f) => f.key), "avatar", ...extraTextKeys];
  const calls = [
    ...textKeys.map((key) => ({
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: "text" as const,
      args: [node, key] as const,
    })),
    ...COINS.map((c) => ({
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: "addr" as const,
      args: [node, BigInt(c.coinType)] as const,
    })),
    {
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: "contenthash" as const,
      args: [node] as const,
    },
  ];

  const results = await publicClient.multicall({ contracts: calls, allowFailure: true });

  const texts: Record<string, string> = {};
  textKeys.forEach((key, i) => {
    const r = results[i];
    if (r.status === "success" && r.result) texts[key] = r.result as string;
  });

  const addresses: Record<number, string> = {};
  COINS.forEach((c, i) => {
    const r = results[textKeys.length + i];
    if (r.status === "success") {
      const decoded = decodeCoinAddress(c.coinType, r.result as Hex);
      if (decoded) addresses[c.coinType] = decoded;
    }
  });

  const chRes = results[results.length - 1];
  const contenthash =
    chRes.status === "success" ? decodeContenthash(chRes.result as Hex) : null;

  return { texts, addresses, contenthash, resolver };
}

// ── Write batching ───────────────────────────────────────────────────────────

export type RecordEdits = {
  /** key → new value ("" clears) */
  texts?: Record<string, string>;
  /** coinType → new display address ("" clears) */
  addresses?: Record<number, string>;
  /** "ipfs://…" | "ipns://…" | bare CID | "" to clear; undefined = untouched */
  contenthash?: string;
};

/**
 * Encode all dirty records into resolver.multicall(bytes[]) inner calls.
 * Throws on invalid addresses/CIDs — validate per-field in the UI first.
 */
export function buildEditCalls(name: string, edits: RecordEdits): Hex[] {
  const node = namehash(name);
  const calls: Hex[] = [];

  for (const [key, value] of Object.entries(edits.texts ?? {})) {
    calls.push(
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: "setText",
        args: [node, key, value.trim()],
      }),
    );
  }

  for (const [coinTypeStr, value] of Object.entries(edits.addresses ?? {})) {
    const coinType = Number(coinTypeStr);
    const trimmed = value.trim();
    const bytes: Hex = trimmed ? encodeCoinAddress(coinType, trimmed) : "0x";
    calls.push(
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: "setAddr",
        args: [node, BigInt(coinType), bytes],
      }),
    );
  }

  if (edits.contenthash !== undefined) {
    const trimmed = edits.contenthash.trim();
    const parsed = trimmed ? parseContentInput(trimmed) : null;
    const bytes: Hex = parsed ? encodeContenthash(parsed) : "0x";
    calls.push(
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: "setContenthash",
        args: [node, bytes],
      }),
    );
  }

  return calls;
}
