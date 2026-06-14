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
  themeMode: "light", // matches the light Forest homepage + /manage
  themeVariables: {
    "--w3m-accent": "#0e9f6e",
    "--w3m-border-radius-master": "3px",
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
