import { formatEther } from "viem";

export function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/** "0.0031 ETH" — trims to 4 significant decimals. */
export function fmtEth(wei: bigint): string {
  const eth = Number(formatEther(wei));
  if (eth === 0) return "0 ETH";
  if (eth < 0.0001) return "<0.0001 ETH";
  return `${eth.toLocaleString("en-US", { maximumSignificantDigits: 4 })} ETH`;
}

export function fmtUsd(wei: bigint, ethUsd: number | null): string | null {
  if (!ethUsd) return null;
  const usd = Number(formatEther(wei)) * ethUsd;
  return usd.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function daysUntil(unixSeconds: number): number {
  return Math.floor((unixSeconds * 1000 - Date.now()) / 86_400_000);
}

export function fmtDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Spot ETH/USD via Coinbase (no key, CORS-open). Fails soft to null. */
export async function fetchEthUsd(): Promise<number | null> {
  try {
    const res = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");
    if (!res.ok) return null;
    const json = await res.json();
    const v = Number(json?.data?.amount);
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}
