import type { Address } from "viem";

/**
 * Official ENS mainnet deployments.
 *
 * VERIFIED 2026-06-09 against https://docs.ens.domains/learn/deployments/
 * (source of truth: github.com/ensdomains/ens-contracts deployments).
 * Do NOT swap these from memory — ENS has migrated controllers before.
 * The current ETHRegistrarController is the 2025 struct-based one (register()
 * takes a single `Registration` tuple with a uint8 reverseRecord bitfield and
 * a bytes32 referrer). The matching latest PublicResolver is 0xF291…AC15.
 */
export const ENS = {
  registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" as Address,
  ethRegistrarController: "0x59E16fcCd424Cc24e280Be16E11Bcd56fb0CE547" as Address,
  baseRegistrar: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85" as Address,
  publicResolver: "0xF29100983E058B709F3D539b0c765937B804AC15" as Address,
  reverseRegistrar: "0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb" as Address,
  nameWrapper: "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401" as Address,
  universalResolver: "0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe" as Address,
} as const;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;
export const YEAR_SECONDS = 31_536_000n;

export function etherscanAddress(addr: string): string {
  return `https://etherscan.io/address/${addr}`;
}
export function etherscanTx(hash: string): string {
  return `https://etherscan.io/tx/${hash}`;
}

/** Registration tuple — field order is authoritative, do not reorder. */
const REGISTRATION_TUPLE = {
  name: "registration",
  type: "tuple",
  components: [
    { name: "label", type: "string" },
    { name: "owner", type: "address" },
    { name: "duration", type: "uint256" },
    { name: "secret", type: "bytes32" },
    { name: "resolver", type: "address" },
    { name: "data", type: "bytes[]" },
    { name: "reverseRecord", type: "uint8" },
    { name: "referrer", type: "bytes32" },
  ],
} as const;

export const CONTROLLER_ABI = [
  {
    type: "function",
    name: "register",
    stateMutability: "payable",
    inputs: [REGISTRATION_TUPLE],
    outputs: [],
  },
  {
    type: "function",
    name: "makeCommitment",
    stateMutability: "pure",
    inputs: [REGISTRATION_TUPLE],
    outputs: [{ name: "commitment", type: "bytes32" }],
  },
  {
    type: "function",
    name: "commit",
    stateMutability: "nonpayable",
    inputs: [{ name: "commitment", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "available",
    stateMutability: "view",
    inputs: [{ name: "label", type: "string" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "rentPrice",
    stateMutability: "view",
    inputs: [
      { name: "label", type: "string" },
      { name: "duration", type: "uint256" },
    ],
    outputs: [
      {
        name: "price",
        type: "tuple",
        components: [
          { name: "base", type: "uint256" },
          { name: "premium", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "renew",
    stateMutability: "payable",
    inputs: [
      { name: "label", type: "string" },
      { name: "duration", type: "uint256" },
      { name: "referrer", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "minCommitmentAge",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "maxCommitmentAge",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const REGISTRY_ABI = [
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [{ name: "node", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "resolver",
    stateMutability: "view",
    inputs: [{ name: "node", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "setResolver",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "resolver", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setOwner",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "owner", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setSubnodeRecord",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "label", type: "bytes32" },
      { name: "owner", type: "address" },
      { name: "resolver", type: "address" },
      { name: "ttl", type: "uint64" },
    ],
    outputs: [],
  },
] as const;

export const BASE_REGISTRAR_ABI = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "nameExpires",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "reclaim",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "owner", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "safeTransferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

/** PublicResolver — text / addr (legacy + multicoin) / contenthash / multicall. */
export const RESOLVER_ABI = [
  {
    type: "function",
    name: "setText",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "key", type: "string" },
      { name: "value", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "text",
    stateMutability: "view",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "key", type: "string" },
    ],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "setAddr",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "a", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setAddr",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "coinType", type: "uint256" },
      { name: "a", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "addr",
    stateMutability: "view",
    inputs: [{ name: "node", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "addr",
    stateMutability: "view",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "coinType", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes" }],
  },
  {
    type: "function",
    name: "setContenthash",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "hash", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "contenthash",
    stateMutability: "view",
    inputs: [{ name: "node", type: "bytes32" }],
    outputs: [{ name: "", type: "bytes" }],
  },
  {
    type: "function",
    name: "multicall",
    stateMutability: "nonpayable",
    inputs: [{ name: "data", type: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]" }],
  },
] as const;

export const REVERSE_REGISTRAR_ABI = [
  {
    type: "function",
    name: "setName",
    stateMutability: "nonpayable",
    inputs: [{ name: "name", type: "string" }],
    outputs: [{ name: "", type: "bytes32" }],
  },
] as const;

export const NAME_WRAPPER_ABI = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "owner", type: "address" }],
  },
  {
    type: "function",
    name: "getData",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "fuses", type: "uint32" },
      { name: "expiry", type: "uint64" },
    ],
  },
  {
    type: "function",
    name: "wrapETH2LD",
    stateMutability: "nonpayable",
    inputs: [
      { name: "label", type: "string" },
      { name: "wrappedOwner", type: "address" },
      { name: "ownerControlledFuses", type: "uint16" },
      { name: "resolver", type: "address" },
    ],
    outputs: [{ name: "expiry", type: "uint64" }],
  },
  {
    type: "function",
    name: "unwrapETH2LD",
    stateMutability: "nonpayable",
    inputs: [
      { name: "labelhash", type: "bytes32" },
      { name: "registrant", type: "address" },
      { name: "controller", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setFuses",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "ownerControlledFuses", type: "uint16" },
    ],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "setSubnodeRecord",
    stateMutability: "nonpayable",
    inputs: [
      { name: "parentNode", type: "bytes32" },
      { name: "label", type: "string" },
      { name: "owner", type: "address" },
      { name: "resolver", type: "address" },
      { name: "ttl", type: "uint64" },
      { name: "fuses", type: "uint32" },
      { name: "expiry", type: "uint64" },
    ],
    outputs: [{ name: "node", type: "bytes32" }],
  },
  {
    type: "function",
    name: "safeTransferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
  },
] as const;
