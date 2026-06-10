"use client";

import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { useAppKit } from "@reown/appkit/react";
import { SITE } from "@/lib/site";

/**
 * Tip jar → ensgiant.eth. Sends on-chain when a wallet is connected;
 * always offers copy-the-address so nobody needs to connect just to tip.
 */
export default function DonateButton() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const { sendTransaction, isPending } = useSendTransaction();
  const [copied, setCopied] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.donate.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpenPanel((v) => !v)}
        className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted shadow-soft transition hover:text-foreground"
        aria-expanded={openPanel}
      >
        ♥ Support this site
      </button>
      {openPanel && (
        <div className="absolute bottom-full right-0 z-30 mb-2 w-72 rounded-2xl border border-line bg-surface p-4 shadow-lift">
          <p className="text-sm font-semibold">Donate to {SITE.donate.ensName}</p>
          <p className="mt-1 break-all font-mono text-xs text-muted">{SITE.donate.address}</p>
          <div className="mt-3 flex gap-2">
            {isConnected ? (
              <button
                disabled={isPending}
                onClick={() =>
                  sendTransaction({
                    to: SITE.donate.address,
                    value: parseEther("0.005"),
                  })
                }
                className="flex-1 rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {isPending ? "Confirm in wallet…" : "Send 0.005 ETH"}
              </button>
            ) : (
              <button
                onClick={() => open()}
                className="flex-1 rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                Connect to send
              </button>
            )}
            <button
              onClick={copy}
              className="flex-1 rounded-full border border-line px-3 py-2 text-xs font-semibold transition hover:bg-brand-soft"
            >
              {copied ? "Copied ✓" : "Copy address"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
