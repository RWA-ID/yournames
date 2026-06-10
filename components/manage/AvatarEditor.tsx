"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchOwnedNfts, hasAlchemy, type OwnedNft } from "@/lib/alchemy";
import { ipfsToHttp, nftAvatarRecord, parseNftAvatar } from "@/lib/avatar";

/**
 * First-class avatar UX (ENSIP-12): direct URL, ipfs:// URI, or an NFT the
 * wallet owns (eip155 reference) picked from a grid. Live preview included.
 * The chosen value lands in the avatar text record via the shared save batch.
 */
export default function AvatarEditor({
  name,
  value,
  onChange,
  disabled,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOverride, setPreviewOverride] = useState<string | null>(null);

  const preview = previewFor(name, value, previewOverride);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-line bg-brand-soft">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote, unoptimized by design
          <img src={preview} alt={`Avatar preview for ${name}`} className="size-full object-cover" />
        ) : (
          <span className="font-display text-3xl font-bold text-brand">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          Avatar
          <span className="cursor-help text-xs text-muted/70" title="Stored as record: avatar (ENSIP-12)">
            ⓘ
          </span>
        </span>
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreviewOverride(null);
          }}
          placeholder="https://… , ipfs://… , or pick an NFT →"
          disabled={disabled}
          className="mt-1 w-full rounded-2xl border border-line bg-background px-4 py-2.5 font-mono text-xs outline-none transition focus:border-brand disabled:opacity-60"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPickerOpen(true)}
            disabled={disabled}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold transition hover:bg-brand-soft disabled:opacity-50"
          >
            🖼️ Use one of my NFTs
          </button>
          {value && (
            <button
              onClick={() => {
                onChange("");
                setPreviewOverride(null);
              }}
              disabled={disabled}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted hover:text-rosex"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {pickerOpen && (
        <NftPicker
          onPick={(nft) => {
            onChange(
              nftAvatarRecord({ contract: nft.contract, tokenId: nft.tokenId, tokenType: nft.tokenType }),
            );
            setPreviewOverride(nft.imageUrl);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function previewFor(name: string, value: string, override: string | null): string | null {
  const v = value.trim();
  if (!v) return null;
  if (override) return override;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^ipfs:\/\//i.test(v)) return ipfsToHttp(v);
  if (parseNftAvatar(v)) {
    // Saved NFT avatars render via the ENS metadata service.
    return `https://metadata.ens.domains/mainnet/avatar/${name}`;
  }
  return null;
}

function NftPicker({ onPick, onClose }: { onPick: (n: OwnedNft) => void; onClose: () => void }) {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<OwnedNft[] | null>(null);
  const [pageKey, setPageKey] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const load = (key?: string) => {
    if (!address) return;
    fetchOwnedNfts(address, key ?? undefined).then((res) => {
      if (!res) {
        setFailed(true);
        return;
      }
      setNfts((prev) => [...(prev ?? []), ...res.nfts]);
      setPageKey(res.pageKey);
    });
  };

  useEffect(() => {
    if (!hasAlchemy) {
      setFailed(true);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Choose an NFT as avatar"
    >
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-surface p-6 shadow-lift">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Pick an NFT</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted hover:bg-brand-soft">
            ✕
          </button>
        </div>

        {failed ? (
          <p className="py-8 text-center text-sm text-muted">
            {hasAlchemy
              ? "Couldn't load your NFTs right now."
              : "The NFT picker needs an Alchemy API key configured. You can still paste an eip155 NFT reference or image URL manually."}
          </p>
        ) : nfts === null ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-line/60" />
            ))}
          </div>
        ) : nfts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No NFTs with images found in this wallet.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {nfts.map((n) => (
                <button
                  key={`${n.contract}-${n.tokenId}`}
                  onClick={() => onPick(n)}
                  className="group overflow-hidden rounded-2xl border border-line transition hover:border-brand hover:shadow-soft"
                  title={n.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.imageUrl!}
                    alt={n.title}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
            {pageKey && (
              <button
                onClick={() => load(pageKey)}
                className="mt-4 w-full rounded-full border border-line py-2.5 text-sm font-semibold transition hover:bg-brand-soft"
              >
                Load more
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
