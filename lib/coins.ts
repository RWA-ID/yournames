import { getCoderByCoinType } from "@ensdomains/address-encoder";
import { type Hex, bytesToHex, hexToBytes } from "viem";

/**
 * Multicoin address records (ENSIP-9 + ENSIP-11).
 * Non-EVM chains use SLIP-44 coin types; EVM chains use 0x80000000 | chainId.
 * Encoding/validation via @ensdomains/address-encoder (official).
 */

const EVM_BIT = 0x80000000;

export type CoinDef = {
  coinType: number;
  symbol: string;
  label: string;
  placeholder: string;
  evm: boolean;
};

export const COINS: CoinDef[] = [
  { coinType: 60, symbol: "ETH", label: "Ethereum", placeholder: "0x…", evm: true },
  { coinType: 0, symbol: "BTC", label: "Bitcoin", placeholder: "bc1… / 1… / 3…", evm: false },
  { coinType: 501, symbol: "SOL", label: "Solana", placeholder: "Base58 address", evm: false },
  { coinType: 2, symbol: "LTC", label: "Litecoin", placeholder: "ltc1… / L… / M…", evm: false },
  { coinType: 3, symbol: "DOGE", label: "Dogecoin", placeholder: "D…", evm: false },
  { coinType: EVM_BIT | 8453, symbol: "BASE", label: "Base", placeholder: "0x…", evm: true },
  { coinType: EVM_BIT | 42161, symbol: "ARB", label: "Arbitrum", placeholder: "0x…", evm: true },
  { coinType: EVM_BIT | 10, symbol: "OP", label: "Optimism", placeholder: "0x…", evm: true },
  { coinType: EVM_BIT | 137, symbol: "POL", label: "Polygon", placeholder: "0x…", evm: true },
];

/** Encode a user-typed address to resolver bytes. Throws on invalid input. */
export function encodeCoinAddress(coinType: number, address: string): Hex {
  // EVM chains all use the ETH coder (checksummed hex bytes).
  const coder = getCoderByCoinType(coinType & EVM_BIT ? 60 : coinType);
  return bytesToHex(coder.decode(address.trim()));
}

/** Decode resolver bytes back to a display address, or null when unset. */
export function decodeCoinAddress(coinType: number, value: Hex | null | undefined): string | null {
  if (!value || value === "0x") return null;
  try {
    const coder = getCoderByCoinType(coinType & EVM_BIT ? 60 : coinType);
    return coder.encode(hexToBytes(value));
  } catch {
    return null;
  }
}

/** Returns an error message, or null when the address is valid (or empty). */
export function validateCoinAddress(coinType: number, address: string): string | null {
  if (!address.trim()) return null;
  try {
    encodeCoinAddress(coinType, address);
    return null;
  } catch {
    const coin = COINS.find((c) => c.coinType === coinType);
    return `That doesn't look like a valid ${coin?.label ?? ""} address`;
  }
}
