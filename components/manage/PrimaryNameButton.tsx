"use client";

import { useState } from "react";
import { useAccount, useEnsAddress, useEnsName, useWriteContract } from "wagmi";
import { ENS, REVERSE_REGISTRAR_ABI } from "@/lib/ens";
import { publicClient } from "@/lib/wagmi";

/**
 * "Set as my primary name" → ReverseRegistrar.setName (the reverse record).
 * Warns when the name's forward ETH address doesn't match the wallet (apps
 * would refuse to display it).
 */
export default function PrimaryNameButton({ name }: { name: string }) {
  const { address, isConnected } = useAccount();
  const { data: currentPrimary, refetch } = useEnsName({ address, chainId: 1 });
  const { data: forwardAddr } = useEnsAddress({ name, chainId: 1 });
  const { writeContractAsync } = useWriteContract();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (!isConnected) return null;

  const isPrimary = currentPrimary?.toLowerCase() === name.toLowerCase();
  const forwardMismatch =
    Boolean(address) && Boolean(forwardAddr) && forwardAddr!.toLowerCase() !== address!.toLowerCase();

  const setPrimary = async () => {
    try {
      setBusy(true);
      const hash = await writeContractAsync({
        address: ENS.reverseRegistrar,
        abi: REVERSE_REGISTRAR_ABI,
        functionName: "setName",
        args: [name],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setDone(true);
      refetch();
    } catch {
      /* user cancelled or failed — button stays available */
    } finally {
      setBusy(false);
    }
  };

  if (isPrimary || done) {
    return (
      <span className="rounded-full bg-brand-soft px-5 py-2.5 text-sm font-semibold text-brand">
        ★ Your primary name
      </span>
    );
  }

  return (
    <div className="text-right">
      <button
        onClick={setPrimary}
        disabled={busy}
        title="Apps will show this name instead of 0x1234… when you connect."
        className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {busy ? "Confirm in wallet…" : "Set as my primary name"}
      </button>
      {forwardMismatch && (
        <p className="mt-1 max-w-56 text-xs text-amberx">
          Heads-up: this name points to a different ETH address, so apps won&apos;t display it
          until you update the address record to your wallet.
        </p>
      )}
    </div>
  );
}
