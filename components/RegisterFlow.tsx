"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTROLLER_ABI, ENS, YEAR_SECONDS, etherscanAddress } from "@/lib/ens";
import {
  buildRegistration,
  clearPendingCommit,
  loadPendingCommit,
  makeCommitment,
  randomSecret,
  rentPrice,
  savePendingCommit,
  withBuffer,
  type PendingCommit,
} from "@/lib/registration";
import { publicClient } from "@/lib/wagmi";
import { fmtEth, fmtUsd, fetchEthUsd } from "@/lib/format";
import { SITE } from "@/lib/site";

const COMMIT_AGE_SECONDS = 60; // controller minCommitmentAge

type Step =
  | { id: "configure" }
  | { id: "committing"; detail: string }
  | { id: "waiting"; commit: PendingCommit }
  | { id: "registering"; commit: PendingCommit; detail: string }
  | { id: "done"; name: string }
  | { id: "failed"; message: string; commit?: PendingCommit };

/**
 * Guided commit/reveal registration, presented as one friendly flow:
 *   1. Confirm name → 2. Securing your name (countdown) → 3. Complete → 4. 🎉
 * The confirmed commit (name+secret+params) is persisted to localStorage so a
 * refresh never loses it (which would force a second commit tx).
 */
export default function RegisterFlow({
  label,
  onClose,
}: {
  label: string;
  onClose: () => void;
}) {
  const name = `${label}.eth`;
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { writeContractAsync } = useWriteContract();

  const [years, setYears] = useState(1);
  const [primary, setPrimary] = useState(true);
  const [priceWei, setPriceWei] = useState<bigint | null>(null);
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [step, setStep] = useState<Step>({ id: "configure" });
  const [now, setNow] = useState(Date.now());
  const registering = useRef(false);

  // Restore an in-flight commit for THIS name (survives refresh).
  useEffect(() => {
    const pending = loadPendingCommit();
    if (pending && pending.label === label && (!address || pending.owner === address)) {
      setYears(pending.years);
      setPrimary(pending.primary);
      setStep({ id: "waiting", commit: pending });
    }
  }, [label, address]);

  useEffect(() => {
    fetchEthUsd().then(setEthUsd);
  }, []);

  // Live price for the selected duration.
  useEffect(() => {
    let stale = false;
    setPriceWei(null);
    rentPrice(label, YEAR_SECONDS * BigInt(years))
      .then((p) => !stale && setPriceWei(p.total))
      .catch(() => !stale && setPriceWei(null));
    return () => {
      stale = true;
    };
  }, [label, years]);

  // Tick for the countdown.
  useEffect(() => {
    if (step.id !== "waiting") return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [step.id]);

  const startCommit = useCallback(async () => {
    if (!address) {
      open();
      return;
    }
    try {
      setStep({ id: "committing", detail: "Preparing your registration…" });
      const secret = randomSecret();
      const reg = buildRegistration({ label, owner: address, secret, years, primary });
      const commitment = await makeCommitment(reg);

      setStep({ id: "committing", detail: "Confirm the first transaction in your wallet" });
      const hash = await writeContractAsync({
        address: ENS.ethRegistrarController,
        abi: CONTROLLER_ABI,
        functionName: "commit",
        args: [commitment],
      });

      setStep({ id: "committing", detail: "Locking in your name on Ethereum…" });
      await publicClient.waitForTransactionReceipt({ hash });

      const commit: PendingCommit = {
        label,
        owner: address,
        secret,
        years,
        primary,
        commitment,
        commitTxHash: hash,
        committedAt: Date.now(),
      };
      savePendingCommit(commit);
      setStep({ id: "waiting", commit });
    } catch (err) {
      setStep({
        id: "failed",
        message: friendlyError(err, "We couldn't start the registration."),
      });
    }
  }, [address, label, years, primary, open, writeContractAsync]);

  const finishRegister = useCallback(
    async (commit: PendingCommit) => {
      if (registering.current) return;
      registering.current = true;
      try {
        setStep({ id: "registering", commit, detail: "Fetching the final price…" });
        const reg = buildRegistration({
          label: commit.label,
          owner: commit.owner,
          secret: commit.secret,
          years: commit.years,
          primary: commit.primary,
        });
        const price = await rentPrice(commit.label, reg.duration);

        setStep({
          id: "registering",
          commit,
          detail: "Confirm the second transaction in your wallet",
        });
        const hash = await writeContractAsync({
          address: ENS.ethRegistrarController,
          abi: CONTROLLER_ABI,
          functionName: "register",
          args: [reg],
          // 5% headroom for oracle drift — the contract refunds every wei of excess.
          value: withBuffer(price.total),
        });

        setStep({ id: "registering", commit, detail: "Finalizing on Ethereum…" });
        await publicClient.waitForTransactionReceipt({ hash });

        clearPendingCommit();
        setStep({ id: "done", name: `${commit.label}.eth` });
      } catch (err) {
        setStep({
          id: "failed",
          message: friendlyError(err, "The final registration step didn't go through."),
          commit,
        });
      } finally {
        registering.current = false;
      }
    },
    [writeContractAsync],
  );

  const secondsLeft = useMemo(() => {
    if (step.id !== "waiting") return 0;
    const elapsed = (now - step.commit.committedAt) / 1000;
    return Math.max(0, Math.ceil(COMMIT_AGE_SECONDS - elapsed));
  }, [step, now]);

  const idleTooLong =
    step.id === "waiting" && now - step.commit.committedAt > 23 * 60 * 60 * 1000;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(5,4,14,0.62)] p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Register ${name}`}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[rgba(167,139,250,0.3)] bg-[var(--surface-solid)] p-6 shadow-[0_30px_80px_rgba(5,4,14,0.8)] sm:rounded-3xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">{name}</h2>
            <Stepper step={step.id} />
          </div>
          {step.id !== "waiting" && step.id !== "registering" && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-muted transition hover:bg-brand-soft hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step.id === "configure" && (
            <motion.div key="cfg" {...fade}>
              <label className="mb-1 block text-sm font-medium" htmlFor="years">
                How long do you want it?
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="years"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="flex-1 accent-brand"
                />
                <span className="w-16 text-right font-display font-semibold">
                  {years} {years === 1 ? "year" : "years"}
                </span>
              </div>

              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-line p-4">
                <input
                  type="checkbox"
                  checked={primary}
                  onChange={(e) => setPrimary(e.target.checked)}
                  className="mt-0.5 size-4 accent-brand"
                />
                <span className="text-sm">
                  <span className="font-semibold">Make this my primary name</span>
                  <br />
                  <span className="text-muted">
                    Apps will show <strong>{name}</strong> instead of 0x1234… when you connect.
                  </span>
                </span>
              </label>

              <div className="mt-5 space-y-2 rounded-2xl bg-brand-soft p-4 text-sm">
                <Row k="ENS protocol fee" v={priceWei !== null ? fmtEth(priceWei) : "…"} />
                {priceWei !== null && fmtUsd(priceWei, ethUsd) && (
                  <Row k="≈ in dollars" v={fmtUsd(priceWei, ethUsd)!} />
                )}
                <Row k="Platform fee" v="$0.00" highlight />
                <Row k="Network gas" v="paid to Ethereum, not us" />
                <p className="pt-1 text-xs text-muted">
                  Paid directly to the official{" "}
                  <a
                    className="underline"
                    href={etherscanAddress(ENS.ethRegistrarController)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ENS registrar contract
                  </a>
                  . Verify it yourself — we never touch your funds.
                </p>
              </div>

              <p className="mt-4 text-sm text-muted">
                Registration takes <strong>two quick transactions</strong> with a one-minute wait
                between them. That short wait is an ENS safety feature that stops bots from
                stealing the name you just searched.
              </p>

              <button
                onClick={startCommit}
                disabled={priceWei === null}
                className="mt-5 w-full rounded-full bg-brand py-3.5 font-semibold text-white shadow-soft transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60"
              >
                {isConnected ? `Start registration` : `Connect wallet to register`}
              </button>
            </motion.div>
          )}

          {step.id === "committing" && (
            <motion.div key="commit" {...fade} className="py-8 text-center">
              <Pulse />
              <p className="mt-4 font-medium">{step.detail}</p>
              <p className="mt-1 text-sm text-muted">Step 1 of 2 — securing your name</p>
            </motion.div>
          )}

          {step.id === "waiting" && (
            <motion.div key="wait" {...fade} className="py-6 text-center">
              {secondsLeft > 0 ? (
                <>
                  <Countdown total={COMMIT_AGE_SECONDS} left={secondsLeft} />
                  <p className="mt-4 font-medium">Securing {name} just for you…</p>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
                    Ethereum makes everyone wait a minute before finishing — it stops bots from
                    front-running your name. Don&apos;t close this tab, but a refresh won&apos;t
                    lose your spot.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-xl font-bold">Your name is reserved ✓</p>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
                    Finish the second transaction to make {name} yours.
                  </p>
                  {idleTooLong && (
                    <p className="mt-2 text-sm text-amberx">
                      Heads up: reservations expire 24h after the first transaction.
                    </p>
                  )}
                  <button
                    onClick={() => finishRegister(step.commit)}
                    className="mt-5 w-full rounded-full bg-brand py-3.5 font-semibold text-white shadow-soft transition hover:bg-indigo-700"
                  >
                    Complete registration
                  </button>
                </>
              )}
            </motion.div>
          )}

          {step.id === "registering" && (
            <motion.div key="reg" {...fade} className="py-8 text-center">
              <Pulse />
              <p className="mt-4 font-medium">{step.detail}</p>
              <p className="mt-1 text-sm text-muted">Step 2 of 2 — almost there</p>
            </motion.div>
          )}

          {step.id === "done" && (
            <motion.div key="done" {...fade} className="py-6 text-center">
              <Confetti />
              <p className="font-display text-2xl font-bold">You own {step.name} 🎉</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                It&apos;s an NFT in your wallet now. Nobody can take it away — not us, not anyone.
                Next: set an avatar and profile so apps recognize you.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`/manage/name/?name=${encodeURIComponent(step.name)}`}
                  className="flex-1 rounded-full bg-brand py-3 text-center font-semibold text-white shadow-soft transition hover:bg-indigo-700"
                >
                  Set up my profile
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-full border border-line py-3 font-semibold transition hover:bg-brand-soft"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}

          {step.id === "failed" && (
            <motion.div key="fail" {...fade} className="py-6 text-center">
              <p className="text-3xl">😕</p>
              <p className="mt-2 font-medium">{step.message}</p>
              <p className="mt-1 text-sm text-muted">
                Nothing was lost — you can safely try again.
              </p>
              <button
                onClick={() =>
                  step.commit
                    ? setStep({ id: "waiting", commit: step.commit })
                    : setStep({ id: "configure" })
                }
                className="mt-5 w-full rounded-full bg-brand py-3.5 font-semibold text-white shadow-soft transition hover:bg-indigo-700"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 border-t border-line pt-4 text-center text-xs text-muted">
          Independent interface — not affiliated with ENS. 0% platform fee.{" "}
          <a className="underline" href={SITE.ensDocs} target="_blank" rel="noreferrer">
            Verify on ENS docs
          </a>
        </p>
      </motion.div>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function Stepper({ step }: { step: Step["id"] }) {
  const idx =
    step === "configure" ? 0 : step === "committing" ? 1 : step === "waiting" ? 1 : step === "registering" ? 2 : 3;
  const labels = ["Confirm name", "Securing", "Complete", "Yours!"];
  return (
    <ol className="mt-2 flex items-center gap-2 text-[11px] text-muted" aria-label="Progress">
      {labels.map((l, i) => (
        <li key={l} className="flex items-center gap-2">
          <span
            className={`flex size-4 items-center justify-center rounded-full text-[9px] font-bold ${
              i <= idx ? "bg-brand text-white" : "bg-line text-muted"
            }`}
          >
            {i + 1}
          </span>
          <span className={i === idx ? "font-semibold text-foreground" : ""}>{l}</span>
          {i < labels.length - 1 && <span aria-hidden>·</span>}
        </li>
      ))}
    </ol>
  );
}

function Row({ k, v, highlight = false }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted">{k}</span>
      <span className={highlight ? "font-bold text-mint" : "font-medium"}>{v}</span>
    </div>
  );
}

function Pulse() {
  return (
    <div className="mx-auto flex size-16 items-center justify-center">
      <span className="absolute size-16 animate-ping rounded-full bg-brand/20 motion-reduce:animate-none" />
      <span className="size-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#627eea] shadow-[0_0_22px_rgba(124,58,237,0.55)]" />
    </div>
  );
}

function Countdown({ total, left }: { total: number; left: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const progress = (total - left) / total;
  return (
    <div className="relative mx-auto size-24">
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          style={{ transition: "stroke-dashoffset 0.5s linear" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold">
        {left}
      </span>
    </div>
  );
}

/** Lightweight CSS confetti (no extra dep); hidden under reduced motion. */
function Confetti() {
  const pieces = Array.from({ length: 18 });
  const colors = ["#7c3aed", "#627eea", "#38bdf8", "#2dd4bf", "#a78bfa"];
  return (
    <div aria-hidden className="pointer-events-none relative mx-auto h-10 w-40 motion-reduce:hidden">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, opacity: 1, x: 0, rotate: 0 }}
          animate={{
            y: -40 - Math.random() * 50,
            x: (Math.random() - 0.5) * 160,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          transition={{ duration: 1.2 + Math.random(), ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 block size-2 rounded-sm"
          style={{ backgroundColor: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}

function friendlyError(err: unknown, fallback: string): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/user rejected|denied/i.test(msg)) return "You cancelled in your wallet — no problem.";
  if (/insufficient funds/i.test(msg)) return "Your wallet doesn't have enough ETH for this.";
  return fallback;
}
