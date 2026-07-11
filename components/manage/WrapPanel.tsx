"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { namehash } from "viem";
import { BASE_REGISTRAR_ABI, ENS, NAME_WRAPPER_ABI } from "@/lib/ens";
import { FUSES, labelhashOf, type NameState } from "@/lib/nameState";
import { publicClient } from "@/lib/wagmi";

/**
 * Name Wrapper: wrap/unwrap + fuse burning. Deliberately guarded — fuses are
 * PERMANENT. Each fuse requires reading its consequence and typing the fuse
 * name to confirm.
 */
export default function WrapPanel({
  state,
  canAct,
  onChanged,
}: {
  state: NameState;
  canAct: boolean;
  onChanged: () => void;
}) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [fusePick, setFusePick] = useState<(typeof FUSES)[number] | null>(null);

  const node = namehash(state.name);

  const wrap = async () => {
    if (!address) return;
    try {
      // Wrapping a 2LD = 2 txs: approve the wrapper, then wrapETH2LD.
      setBusy("1/2 — approve the Name Wrapper in your wallet");
      const approveHash = await writeContractAsync({
        address: ENS.baseRegistrar,
        abi: BASE_REGISTRAR_ABI,
        functionName: "approve",
        args: [ENS.nameWrapper, BigInt(labelhashOf(state.label))],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      setBusy("2/2 — confirm the wrap");
      const wrapHash = await writeContractAsync({
        address: ENS.nameWrapper,
        abi: NAME_WRAPPER_ABI,
        functionName: "wrapETH2LD",
        args: [state.label, address, 0, ENS.publicResolver],
      });
      await publicClient.waitForTransactionReceipt({ hash: wrapHash });
      setNotice("Wrapped ✓");
      onChanged();
    } catch {
      setNotice("Wrap cancelled or failed — nothing changed.");
    } finally {
      setBusy(null);
    }
  };

  const unwrap = async () => {
    if (!address) return;
    try {
      setBusy("Confirm the unwrap in your wallet");
      const hash = await writeContractAsync({
        address: ENS.nameWrapper,
        abi: NAME_WRAPPER_ABI,
        functionName: "unwrapETH2LD",
        args: [labelhashOf(state.label), address, address],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setNotice("Unwrapped ✓");
      onChanged();
    } catch {
      setNotice("Unwrap cancelled or failed — nothing changed.");
    } finally {
      setBusy(null);
    }
  };

  const burnFuse = async (bit: number) => {
    try {
      setBusy("Confirm in your wallet");
      const hash = await writeContractAsync({
        address: ENS.nameWrapper,
        abi: NAME_WRAPPER_ABI,
        functionName: "setFuses",
        args: [node, bit],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setNotice("Fuse burned — permanently.");
      setFusePick(null);
      onChanged();
    } catch {
      setNotice("Cancelled — no fuse was burned.");
    } finally {
      setBusy(null);
    }
  };

  const cannotUnwrap = state.wrapped && state.fuses !== null && (state.fuses & 1) !== 0;

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
      <h2 className="font-display text-lg font-bold">Advanced: Name Wrapper</h2>
      <p className="mt-1 text-sm text-muted">
        {state.wrapped
          ? "This name is wrapped (ERC-1155). Wrapped names support fuses — permanent, irreversible permission locks."
          : "This name is unwrapped (a regular ERC-721 NFT). Wrapping enables advanced permissions (fuses). Most people never need this."}
      </p>

      {!canAct && (
        <p className="mt-3 rounded-2xl bg-amberx/10 p-3 text-sm text-amberx">
          Connect the wallet that owns this name to use these controls.
        </p>
      )}

      {canAct && state.is2LD && (
        <div className="mt-4">
          {busy ? (
            <p className="text-sm font-medium">{busy}…</p>
          ) : state.wrapped ? (
            <button
              onClick={unwrap}
              disabled={cannotUnwrap}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:bg-brand-soft disabled:opacity-50"
            >
              {cannotUnwrap ? "CANNOT_UNWRAP fuse is burned — permanent" : "Unwrap this name"}
            </button>
          ) : (
            <button
              onClick={wrap}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:bg-brand-soft"
            >
              Wrap this name (2 transactions)
            </button>
          )}
        </div>
      )}

      {state.wrapped && (
        <div className="mt-5 border-t border-line pt-4">
          <h3 className="text-sm font-bold text-rosex">🔥 Fuses — permanent, cannot be undone</h3>
          <p className="mt-1 text-xs text-muted">
            Burning a fuse permanently removes a permission from this name. This is for advanced
            setups (like guaranteeing subname holders you can never revoke them). If you&apos;re
            unsure, do not touch these.
          </p>
          <ul className="mt-3 space-y-2">
            {FUSES.map((f) => {
              const burned = state.fuses !== null && (state.fuses & f.bit) !== 0;
              return (
                <li
                  key={f.bit}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line px-4 py-2.5"
                >
                  <div>
                    <p className="font-mono text-xs font-semibold">{f.name}</p>
                    <p className="text-xs text-muted">{f.danger}</p>
                  </div>
                  {burned ? (
                    <span className="rounded-full bg-rosex/10 px-2.5 py-1 text-xs font-bold text-rosex">
                      Burned
                    </span>
                  ) : canAct ? (
                    <button
                      onClick={() => setFusePick(f)}
                      className="rounded-full border border-rosex/40 px-3 py-1.5 text-xs font-semibold text-rosex transition hover:bg-rosex/10"
                    >
                      Burn…
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {notice && <p className="mt-3 text-sm text-muted">{notice}</p>}

      {fusePick && (
        <FuseConfirm
          fuse={fusePick}
          busy={busy}
          onCancel={() => setFusePick(null)}
          onConfirm={() => burnFuse(fusePick.bit)}
        />
      )}
    </section>
  );
}

function FuseConfirm({
  fuse,
  busy,
  onCancel,
  onConfirm,
}: {
  fuse: (typeof FUSES)[number];
  busy: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,9,12,0.66)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Burn fuse ${fuse.name}`}
    >
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-lift">
        <h3 className="font-display text-lg font-bold text-rosex">Burn {fuse.name}?</h3>
        <p className="mt-2 rounded-2xl bg-rosex/10 p-3 text-sm text-rosex">
          {fuse.danger} This is <strong>permanent</strong> — there is no undo, ever.
        </p>
        <label className="mt-4 block text-sm">
          Type <span className="font-mono font-semibold">{fuse.name}</span> to confirm:
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-line bg-background px-4 py-2.5 font-mono text-xs outline-none focus:border-rosex"
          />
        </label>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            disabled={Boolean(busy)}
            className="flex-1 rounded-full border border-line py-2.5 text-sm font-semibold hover:bg-brand-soft disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== fuse.name || Boolean(busy)}
            className="flex-1 rounded-full bg-rosex py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            {busy ?? "Burn permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
