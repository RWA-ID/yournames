"use client";

import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";
import { config, networks, projectId, wagmiAdapter } from "@/lib/wagmi";
import { SITE } from "@/lib/site";

/**
 * wagmi (via Reown AppKit adapter) + react-query. createAppKit mounts the
 * connect modal once at module load; open it with useAppKit().open().
 */
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: mainnet,
  projectId,
  metadata: {
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    icons: [`${SITE.url}/og.png`],
  },
  themeMode: "dark", // matches the Dark Ledger theme (site is always dark)
  themeVariables: {
    "--w3m-accent": "#f4f3ef", // paper — primary action color of the theme
    "--w3m-color-mix": "#131318", // pull the modal toward our ink background
    "--w3m-color-mix-strength": 15,
    "--w3m-border-radius-master": "2px", // crisp corners, not pills
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
