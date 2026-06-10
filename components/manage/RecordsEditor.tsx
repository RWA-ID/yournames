"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { ENS, RESOLVER_ABI, etherscanAddress } from "@/lib/ens";
import { canManage, isRegistrant, type NameState } from "@/lib/nameState";
import {
  buildEditCalls,
  readRecords,
  TEXT_FIELDS,
  type NameRecords,
  type RecordEdits,
} from "@/lib/records";
import { COINS, validateCoinAddress } from "@/lib/coins";
import { validateContentInput } from "@/lib/contenthash";
import { publicClient } from "@/lib/wagmi";
import { daysUntil, fmtDate, truncateAddress } from "@/lib/format";
import AvatarEditor from "@/components/manage/AvatarEditor";
import PrimaryNameButton from "@/components/manage/PrimaryNameButton";
import OwnershipPanel from "@/components/manage/OwnershipPanel";
import SubnamesManager from "@/components/manage/SubnamesManager";
import RenewModal from "@/components/manage/RenewModal";
import WrapPanel from "@/components/manage/WrapPanel";

type Tab = "profile" | "addresses" | "website" | "ownership" | "advanced";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "addresses", label: "Addresses" },
  { id: "website", label: "Website" },
  { id: "ownership", label: "Ownership" },
  { id: "advanced", label: "Advanced" },
];

/**
 * Tabbed records editor. Every dirty field is batched into ONE resolver
 * multicall transaction — the user signs once, no matter how many edits.
 */
export default function RecordsEditor({
  state,
  onChanged,
}: {
  state: NameState;
  onChanged: () => void;
}) {
  const { name } = state;
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [records, setRecords] = useState<NameRecords | null>(null);
  const [customKeys, setCustomKeys] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("profile");
  const [edits, setEdits] = useState<RecordEdits>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manager = canManage(state, address);
  const registrant = isRegistrant(state, address);
  const days = state.expiry ? daysUntil(Number(state.expiry)) : null;

  const loadRecords = useCallback(() => {
    setRecords(null);
    readRecords(name)
      .then((r) => {
        setRecords(r);
        // Surface pre-existing non-standard keys? (only known + session customs)
      })
      .catch(() => setRecords({ texts: {}, addresses: {}, contenthash: null, resolver: state.resolver }));
  }, [name, state.resolver]);

  useEffect(loadRecords, [loadRecords]);

  // ── dirty tracking ────────────────────────────────────────────────────────
  const setText = (key: string, value: string) =>
    setEdits((e) => {
      const current = records?.texts[key] ?? "";
      const next = { ...(e.texts ?? {}) };
      if (value === current) delete next[key];
      else next[key] = value;
      return { ...e, texts: next };
    });

  const setAddr = (coinType: number, value: string) =>
    setEdits((e) => {
      const current = records?.addresses[coinType] ?? "";
      const next = { ...(e.addresses ?? {}) };
      if (value === current) delete next[coinType];
      else next[coinType] = value;
      return { ...e, addresses: next };
    });

  const setContenthash = (value: string) =>
    setEdits((e) => {
      const current = records?.contenthash ?? "";
      if (value === current) {
        const { contenthash: _drop, ...rest } = e;
        return rest;
      }
      return { ...e, contenthash: value };
    });

  const dirtyCount =
    Object.keys(edits.texts ?? {}).length +
    Object.keys(edits.addresses ?? {}).length +
    (edits.contenthash !== undefined ? 1 : 0);

  const validationError = useMemo(() => {
    for (const [ct, v] of Object.entries(edits.addresses ?? {})) {
      const err = validateCoinAddress(Number(ct), v);
      if (err) return err;
    }
    if (edits.contenthash) {
      const err = validateContentInput(edits.contenthash);
      if (err) return err;
    }
    return null;
  }, [edits]);

  const save = async () => {
    if (!records || dirtyCount === 0 || validationError) return;
    setError(null);
    try {
      const calls = buildEditCalls(name, edits);
      setSaving("Confirm in your wallet — one signature for all changes");
      const hash = await writeContractAsync({
        address: records.resolver,
        abi: RESOLVER_ABI,
        functionName: "multicall",
        args: [calls],
      });
      setSaving("Saving to Ethereum…");
      await publicClient.waitForTransactionReceipt({ hash });
      setEdits({});
      setSaving(null);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
      loadRecords(); // re-read truth from chain
    } catch (err) {
      setSaving(null);
      const msg = err instanceof Error ? err.message : "";
      setError(/user rejected|denied/i.test(msg) ? "Cancelled in wallet." : "Save failed — nothing was changed.");
    }
  };

  const value = (key: string) => edits.texts?.[key] ?? records?.texts[key] ?? "";
  const addrValue = (ct: number) => edits.addresses?.[ct] ?? records?.addresses[ct] ?? "";
  const chValue = edits.contenthash ?? records?.contenthash ?? "";

  return (
    <div>
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="break-all font-display text-3xl font-bold">{name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {state.expiry && days !== null && (
              <span className={days < 90 ? "font-semibold text-rosex" : "text-muted"}>
                Expires {fmtDate(Number(state.expiry))}
                {days >= 0 ? ` · in ${days} days` : " · in grace period"}
              </span>
            )}
            {state.wrapped && (
              <span className="rounded-full bg-line/60 px-2.5 py-0.5 text-xs font-semibold text-muted">
                Wrapped
              </span>
            )}
            {!manager && (
              <span className="rounded-full bg-amberx/10 px-2.5 py-0.5 text-xs font-semibold text-amberx">
                View only — connect the managing wallet to edit
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {state.is2LD && (
            <button
              onClick={() => setRenewOpen(true)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold shadow-soft transition ${
                days !== null && days < 90
                  ? "bg-rosex text-white hover:bg-rose-600"
                  : "border border-line bg-surface hover:bg-brand-soft"
              }`}
            >
              Extend / renew
            </button>
          )}
          <PrimaryNameButton name={name} />
        </div>
      </div>

      {/* tabs */}
      <div role="tablist" aria-label="Record categories" className="mt-7 flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 shadow-soft">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? "bg-brand text-white" : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* body */}
      <div className="mt-6">
        {records === null ? (
          <div className="h-72 animate-pulse rounded-3xl bg-line/60" />
        ) : (
          <>
            {tab === "profile" && (
              <section className="space-y-5 rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <AvatarEditor
                  name={name}
                  value={value("avatar")}
                  onChange={(v) => setText("avatar", v)}
                  disabled={!manager}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {TEXT_FIELDS.map((f) => (
                    <Field
                      key={f.key}
                      label={f.label}
                      recordKey={f.key}
                      placeholder={f.placeholder}
                      value={value(f.key)}
                      onChange={(v) => setText(f.key, v)}
                      disabled={!manager}
                    />
                  ))}
                </div>
                <CustomRecords
                  customKeys={customKeys}
                  addKey={(k) => setCustomKeys((ks) => (ks.includes(k) ? ks : [...ks, k]))}
                  value={value}
                  setText={setText}
                  disabled={!manager}
                />
              </section>
            )}

            {tab === "addresses" && (
              <section className="space-y-4 rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <p className="text-sm text-muted">
                  People can send crypto to <strong className="text-foreground">{name}</strong> on
                  any of these networks. Each address is checked before saving.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {COINS.map((c) => {
                    const v = addrValue(c.coinType);
                    const err = edits.addresses?.[c.coinType] !== undefined
                      ? validateCoinAddress(c.coinType, v)
                      : null;
                    return (
                      <div key={c.coinType}>
                        <Field
                          label={`${c.label} (${c.symbol})`}
                          recordKey={`coinType ${c.coinType}`}
                          placeholder={c.placeholder}
                          value={v}
                          onChange={(val) => setAddr(c.coinType, val)}
                          disabled={!manager}
                          mono
                        />
                        {err && <p className="mt-1 text-xs text-rosex">{err}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {tab === "website" && (
              <section className="space-y-4 rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <p className="text-sm text-muted">
                  Point <strong className="text-foreground">{name}</strong> at a decentralized
                  website. Paste an IPFS or IPNS link (or a bare CID) — browsers and gateways like{" "}
                  <span className="font-mono text-xs">{name}.link</span> will load it.
                </p>
                <Field
                  label="Content hash"
                  recordKey="contenthash (ENSIP-7)"
                  placeholder="ipfs://bafy… or ipns://k51…"
                  value={chValue}
                  onChange={setContenthash}
                  disabled={!manager}
                  mono
                />
                {edits.contenthash !== undefined && validateContentInput(edits.contenthash) && (
                  <p className="text-xs text-rosex">{validateContentInput(edits.contenthash)}</p>
                )}
                {records.contenthash && (
                  <p className="text-xs text-muted">
                    Currently:{" "}
                    <a
                      className="underline"
                      href={`https://${name}.link`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {records.contenthash}
                    </a>
                  </p>
                )}
              </section>
            )}

            {tab === "ownership" && (
              <div className="space-y-5">
                <OwnershipPanel state={state} onChanged={onChanged} />
                <SubnamesManager state={state} canEdit={manager} />
              </div>
            )}

            {tab === "advanced" && (
              <WrapPanel state={state} canAct={registrant || manager} onChanged={onChanged} />
            )}
          </>
        )}
      </div>

      {/* save bar */}
      {(dirtyCount > 0 || saving || savedFlash || error) && (
        <div className="sticky bottom-4 z-30 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-surface p-4 shadow-lift">
            {saving ? (
              <p className="text-sm font-medium">{saving}</p>
            ) : savedFlash ? (
              <p className="text-sm font-semibold text-mint">Saved on-chain ✓</p>
            ) : error ? (
              <p className="text-sm font-medium text-rosex">{error}</p>
            ) : (
              <div>
                <p className="text-sm font-semibold">
                  {dirtyCount} unsaved {dirtyCount === 1 ? "change" : "changes"}
                </p>
                <p className="text-xs text-muted">
                  Saved in one transaction via{" "}
                  <a
                    className="underline"
                    href={etherscanAddress(records?.resolver ?? ENS.publicResolver)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    resolver multicall
                  </a>
                </p>
              </div>
            )}
            {!saving && dirtyCount > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEdits({})}
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:bg-brand-soft"
                >
                  Discard
                </button>
                <button
                  onClick={save}
                  disabled={Boolean(validationError) || !manager}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {validationError ? "Fix errors to save" : "Save changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {renewOpen && <RenewModal name={name} onClose={() => setRenewOpen(false)} onRenewed={onChanged} />}
    </div>
  );
}

function Field({
  label,
  recordKey,
  placeholder,
  value,
  onChange,
  disabled,
  mono = false,
}: {
  label: string;
  recordKey: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-sm font-medium">
        {label}
        <span
          className="cursor-help text-xs text-muted/70"
          title={`Stored as record: ${recordKey}`}
          aria-label={`Stored as record ${recordKey}`}
        >
          ⓘ
        </span>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-1 w-full rounded-2xl border border-line bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand disabled:opacity-60 ${
          mono ? "font-mono text-xs" : ""
        }`}
      />
    </label>
  );
}

function CustomRecords({
  customKeys,
  addKey,
  value,
  setText,
  disabled,
}: {
  customKeys: string[];
  addKey: (k: string) => void;
  value: (k: string) => string;
  setText: (k: string, v: string) => void;
  disabled: boolean;
}) {
  const [newKey, setNewKey] = useState("");
  return (
    <div className="border-t border-line pt-4">
      <p className="text-sm font-semibold">Custom records</p>
      <p className="text-xs text-muted">Any key/value text record (for power users).</p>
      {customKeys.map((k) => (
        <div key={k} className="mt-3">
          <Field
            label={k}
            recordKey={k}
            placeholder="value"
            value={value(k)}
            onChange={(v) => setText(k, v)}
            disabled={disabled}
          />
        </div>
      ))}
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const k = newKey.trim();
          if (k) {
            addKey(k);
            setNewKey("");
          }
        }}
      >
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="record key, e.g. com.example"
          disabled={disabled}
          className="min-w-0 flex-1 rounded-2xl border border-line bg-background px-4 py-2 text-sm outline-none focus:border-brand disabled:opacity-60"
        />
        <button
          disabled={disabled || !newKey.trim()}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:bg-brand-soft disabled:opacity-50"
        >
          + Add
        </button>
      </form>
    </div>
  );
}
