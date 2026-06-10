import { http, fallback } from "wagmi";
import { mainnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { createPublicClient } from "viem";
import { mainnet as viemMainnet } from "viem/chains";

/**
 * Reown AppKit + wagmi config — mainnet only.
 * Alchemy RPC when a key is configured, always backed by a public fallback.
 */
const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const PUBLIC_RPC = "https://ethereum-rpc.publicnode.com";
export const RPC_URL = ALCHEMY_KEY
  ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
  : PUBLIC_RPC;

export const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "43bdd1b8c477ac4d4a4264a14a8472f8";

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet];

const transport = ALCHEMY_KEY
  ? fallback([http(RPC_URL), http(PUBLIC_RPC)])
  : http(PUBLIC_RPC);

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  transports: { [mainnet.id]: transport },
  ssr: false,
});

export const config = wagmiAdapter.wagmiConfig;

/** Standalone mainnet client for reads that don't depend on the wallet. */
export const publicClient = createPublicClient({
  chain: viemMainnet,
  transport: http(RPC_URL),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
