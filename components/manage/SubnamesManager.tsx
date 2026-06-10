"use client";

import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { isAddress, namehash, type Address } from "viem";
import { normalize } from "viem/ens";
import { ENS, NAME_WRAPPER_ABI, REGISTRY_ABI } from "@/lib/ens";
import { labelhashOf, type NameState } from "@/lib/nameState";
import { fetchSubnames, type Subname } from "@/lib/subgraph";
import { publicClient } from "@/lib/wagmi";
import { truncateAddress } from "@/lib/format";

/**
 * List + create subnames (pay.yourname.eth). Creation is free (gas only).
 * Unwrapped parents use registry.setSubnodeRecord; wrapped parents go through
 * the NameWrapper so the child is wrapped too.
 */
export default function SubnamesManager({
  state,
  canEdit,
}: {
  state: NameState;
  canEdit: boolean;
}) {
  const { writeContractAsync } = useWriteContract();
  const [subnames, setSubnames] = useState<Subname[] | null | "error">(null);
  const [label, setLabel] = useState("");
  const [owner, setOwner] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [created, setCreated] = useState<Subname[]>([]);

  useEffect(() => {
    let alive = true;
    fetchSubnames(state.name, namehash(state.name)).then(
      (s) => alive && setSubnames(s ?? "error"),
    );
    return () => {
      alive = false;
    };
  }, [state.name]);

  const create = async () => {
    setNotice(null);
    let sub: string;
    try {
      sub = normalize(label.trim());
    } catch {
      setNotice("That label contains characters ENS doesn't allow.");
      return;
    }
    if (!sub || sub.includes(".")) {
      setNotice("Just the label — e.g. “pay” to create pay." + state.name);
      return;
    }
    const to = (owner.trim() || state.manager) as Address;
    if (!isAddress(to)) {
      setNotice("Owner must be a valid Ethereum address (leave blank for yourself).");
      return;
    }
    try {
      setBusy(true);
      const parentNode = namehash(state.name);
      const hash = state.wrapped
        ? await writeContractAsync({
            address: ENS.nameWrapper,
            abi: NAME_WRAPPER_ABI,
            functionName: "setSubnodeRecord",
            args: [parentNode, sub, to, ENS.publicResolver, 0n, 0, 0n],
          })
        : await writeContractAsync({
            address: ENS.registry,
            abi: REGISTRY_ABI,
            functionName: "setSubnodeRecord",
            args: [parentNode, labelhashOf(sub), to, ENS.publicResolver, 0n],
          });
      await publicClient.waitForTransactionReceipt({ hash });
      setCreated((c) => [...c, { name: `${sub}.${state.name}`, owner: to }]);
      setLabel("");
      setOwner("");
      setNotice(`Created ${sub}.${state.name} ✓`);
    } catch {
      setNotice("That didn't go through — nothing was created.");
    } finally {
      setBusy(false);
    }
  };

  const list: Subname[] =
    subnames && subnames !== "error"
      ? [...subnames, ...created.filter((c) => !subnames.some((s) => s.name === c.name))]
      : created;

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
      <h2 className="font-display text-lg font-bold">Subnames</h2>
      <p className="mt-1 text-sm text-muted">
        Create names under {state.name} — like <strong>pay.{state.name}</strong> — and give each
        its own owner. Free, just gas.
      </p>

      {canEdit && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-line bg-background px-4">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="label"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
            />
            <span className="whitespace-nowrap text-sm text-muted">.{state.name}</span>
          </div>
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="owner 0x… (blank = you)"
            className="min-w-0 flex-1 rounded-2xl border border-line bg-background px-4 py-2.5 font-mono text-xs outline-none focus:border-brand"
          />
          <button
            onClick={create}
            disabled={busy || !label.trim()}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      )}
      {notice && <p className="mt-2 text-sm text-muted">{notice}</p>}

      <div className="mt-4">
        {subnames === null ? (
          <div className="h-12 animate-pulse rounded-2xl bg-line/60" />
        ) : list.length === 0 ? (
          <p className="text-sm text-muted">
            {subnames === "error" ? "Couldn't load existing subnames (index offline)." : "No subnames yet."}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((s) => (
              <li key={s.name} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <a
                  href={`/manage/name/?name=${encodeURIComponent(s.name)}`}
                  className="font-medium hover:underline"
                >
                  {s.name}
                </a>
                <span className="font-mono text-xs text-muted">{truncateAddress(s.owner)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
