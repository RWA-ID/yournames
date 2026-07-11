"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { isAddress, namehash, type Address } from "viem";
import {
  BASE_REGISTRAR_ABI,
  ENS,
  NAME_WRAPPER_ABI,
  REGISTRY_ABI,
  etherscanAddress,
} from "@/lib/ens";
import { canManage, isRegistrant, labelhashOf, type NameState } from "@/lib/nameState";
import { publicClient } from "@/lib/wagmi";
import { truncateAddress } from "@/lib/format";

/**
 * The ENS roles model, in plain English:
 *  - Owner (registrant): holds the .eth NFT, can transfer the name itself.
 *  - Manager (controller): can edit records and create subnames.
 *  - Resolver: the contract that answers lookups for this name.
 * Transfers are irreversible — every action needs an explicit confirmation
 * with the destination address spelled out.
 */
export default function OwnershipPanel({
  state,
  onChanged,
}: {
  state: NameState;
  onChanged: () => void;
}) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const youAreRegistrant = isRegistrant(state, address);
  const youAreManager = canManage(state, address);
  const [confirm, setConfirm] = useState<null | {
    title: string;
    warning: string;
    action: (to: Address) => Promise<`0x${string}`>;
  }>(null);
  const [busyMsg, setBusyMsg] = useState<string | null>(null);
  const [resolverInput, setResolverInput] = useState("");

  const run = async (to: Address) => {
    if (!confirm) return;
    try {
      setBusyMsg("Confirm in your wallet…");
      const hash = await confirm.action(to);
      setBusyMsg("Waiting for Ethereum…");
      await publicClient.waitForTransactionReceipt({ hash });
      setBusyMsg(null);
      setConfirm(null);
      onChanged();
    } catch {
      setBusyMsg(null);
    }
  };

  const node = namehash(state.name);

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
      <h2 className="font-display text-lg font-bold">Ownership &amp; permissions</h2>

      <dl className="mt-4 space-y-3 text-sm">
        <Role
          label="Owner"
          tooltip="Holds the .eth NFT (the 'registrant'). Can transfer the name itself."
          value={state.registrant}
          you={youAreRegistrant}
        />
        <Role
          label="Manager"
          tooltip="The registry controller. Can edit records and create subnames."
          value={state.manager}
          you={youAreManager}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="flex items-center gap-1.5 font-medium">
            Resolver
            <Info text="The contract that answers lookups (address, avatar, website) for this name." />
          </dt>
          <dd className="font-mono text-xs">
            <a className="underline" href={etherscanAddress(state.resolver)} target="_blank" rel="noreferrer">
              {truncateAddress(state.resolver)}
            </a>
            {state.resolver.toLowerCase() === ENS.publicResolver.toLowerCase() && (
              <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand">
                ENS Public Resolver
              </span>
            )}
          </dd>
        </div>
      </dl>

      {/* actions */}
      <div className="mt-5 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
        {youAreRegistrant && state.is2LD && !state.wrapped && (
          <ActionButton
            label="Transfer name (the NFT)"
            danger
            onClick={() =>
              setConfirm({
                title: `Transfer ${state.name}`,
                warning:
                  "This sends the .eth NFT — full ownership of the name — to another wallet. It cannot be undone.",
                action: (to) =>
                  writeContractAsync({
                    address: ENS.baseRegistrar,
                    abi: BASE_REGISTRAR_ABI,
                    functionName: "safeTransferFrom",
                    args: [address!, to, BigInt(labelhashOf(state.label))],
                  }),
              })
            }
          />
        )}
        {youAreRegistrant && state.wrapped && (
          <ActionButton
            label="Transfer wrapped name"
            danger
            onClick={() =>
              setConfirm({
                title: `Transfer ${state.name}`,
                warning:
                  "This sends the wrapped name (ERC-1155) — full ownership — to another wallet. It cannot be undone.",
                action: (to) =>
                  writeContractAsync({
                    address: ENS.nameWrapper,
                    abi: NAME_WRAPPER_ABI,
                    functionName: "safeTransferFrom",
                    args: [address!, to, BigInt(node), 1n, "0x"],
                  }),
              })
            }
          />
        )}
        {youAreRegistrant && state.is2LD && !state.wrapped && (
          <ActionButton
            label="Change manager"
            onClick={() =>
              setConfirm({
                title: `Set a new manager for ${state.name}`,
                warning:
                  "The new manager can change records and subnames (but not transfer the name). You keep ownership and can reclaim management anytime.",
                action: (to) =>
                  writeContractAsync({
                    address: ENS.baseRegistrar,
                    abi: BASE_REGISTRAR_ABI,
                    functionName: "reclaim",
                    args: [BigInt(labelhashOf(state.label)), to],
                  }),
              })
            }
          />
        )}
        {youAreManager && !state.wrapped && !state.is2LD && (
          <ActionButton
            label="Transfer management"
            danger
            onClick={() =>
              setConfirm({
                title: `Hand over ${state.name}`,
                warning:
                  "For this subname, the manager IS the owner. Handing it over is irreversible unless the new owner gives it back.",
                action: (to) =>
                  writeContractAsync({
                    address: ENS.registry,
                    abi: REGISTRY_ABI,
                    functionName: "setOwner",
                    args: [node, to],
                  }),
              })
            }
          />
        )}
      </div>

      {/* resolver change */}
      {youAreManager && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-sm font-semibold">Change resolver (advanced)</p>
          <p className="text-xs text-muted">
            Only do this if you know exactly why. A wrong resolver silently breaks your name.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={resolverInput}
              onChange={(e) => setResolverInput(e.target.value)}
              placeholder={`Default: ${ENS.publicResolver}`}
              className="min-w-0 flex-1 rounded-2xl border border-line bg-background px-4 py-2 font-mono text-xs outline-none focus:border-brand"
            />
            <button
              disabled={!isAddress(resolverInput)}
              onClick={() =>
                setConfirm({
                  title: `Change resolver of ${state.name}`,
                  warning:
                    resolverInput.toLowerCase() === ENS.publicResolver.toLowerCase()
                      ? "Setting the official ENS Public Resolver."
                      : "⚠️ This is NOT the standard ENS Public Resolver. A non-standard resolver can misdirect payments sent to your name. Continue only if you fully trust this contract.",
                  action: () =>
                    writeContractAsync({
                      address: ENS.registry,
                      abi: REGISTRY_ABI,
                      functionName: "setResolver",
                      args: [node, resolverInput as Address],
                    }),
                })
              }
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:bg-brand-soft disabled:opacity-50"
            >
              Set resolver
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          warning={confirm.warning}
          busy={busyMsg}
          needsAddress={!confirm.title.startsWith("Change resolver")}
          presetAddress={confirm.title.startsWith("Change resolver") ? (resolverInput as Address) : undefined}
          onCancel={() => setConfirm(null)}
          onConfirm={run}
        />
      )}
    </section>
  );
}

function Role({
  label,
  tooltip,
  value,
  you,
}: {
  label: string;
  tooltip: string;
  value: Address | null;
  you: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <dt className="flex items-center gap-1.5 font-medium">
        {label}
        <Info text={tooltip} />
      </dt>
      <dd className="font-mono text-xs">
        {value ? (
          <>
            <a className="underline" href={etherscanAddress(value)} target="_blank" rel="noreferrer">
              {truncateAddress(value)}
            </a>
            {you && (
              <span className="ml-2 rounded-full bg-mint/10 px-2 py-0.5 text-[10px] font-bold text-mint">
                You
              </span>
            )}
          </>
        ) : (
          <span className="text-muted">—</span>
        )}
      </dd>
    </div>
  );
}

function Info({ text }: { text: string }) {
  return (
    <span className="cursor-help text-xs text-muted/70" title={text} aria-label={text}>
      ⓘ
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        danger
          ? "border-rosex/40 text-rosex hover:bg-rosex/10"
          : "border-line hover:bg-brand-soft"
      }`}
    >
      {label}
    </button>
  );
}

function ConfirmModal({
  title,
  warning,
  busy,
  needsAddress,
  presetAddress,
  onCancel,
  onConfirm,
}: {
  title: string;
  warning: string;
  busy: string | null;
  needsAddress: boolean;
  presetAddress?: Address;
  onCancel: () => void;
  onConfirm: (to: Address) => void;
}) {
  const [to, setTo] = useState("");
  const [ack, setAck] = useState(false);
  const target = presetAddress ?? (to as Address);
  const valid = presetAddress ? true : isAddress(to);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,9,12,0.66)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-lift">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="mt-2 rounded-2xl bg-rosex/10 p-3 text-sm text-rosex">{warning}</p>

        {needsAddress && !presetAddress && (
          <>
            <label className="mt-4 block text-sm font-medium" htmlFor="dest">
              Destination address
            </label>
            <input
              id="dest"
              value={to}
              onChange={(e) => setTo(e.target.value.trim())}
              placeholder="0x…"
              className="mt-1 w-full rounded-2xl border border-line bg-background px-4 py-2.5 font-mono text-xs outline-none focus:border-brand"
            />
            {to && !isAddress(to) && <p className="mt-1 text-xs text-rosex">Not a valid Ethereum address</p>}
          </>
        )}
        {valid && needsAddress && (
          <p className="mt-3 break-all rounded-2xl bg-brand-soft p-3 font-mono text-xs">
            → {presetAddress ?? to}
          </p>
        )}

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 accent-brand" />
          I understand this cannot be undone.
        </label>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            disabled={Boolean(busy)}
            className="flex-1 rounded-full border border-line py-2.5 text-sm font-semibold transition hover:bg-brand-soft disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => valid && onConfirm(target)}
            disabled={!valid || !ack || Boolean(busy)}
            className="flex-1 rounded-full bg-rosex py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            {busy ?? "Yes, do it"}
          </button>
        </div>
      </div>
    </div>
  );
}
