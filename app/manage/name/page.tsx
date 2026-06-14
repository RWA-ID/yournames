"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import RecordsEditor from "@/components/manage/RecordsEditor";
import { getNameState, type NameState } from "@/lib/nameState";
import { safeNormalize } from "@/lib/normalize";

/**
 * Name detail/editor. Static export forbids dynamic routes, so the name comes
 * via ?name=alice.eth (works on any IPFS gateway).
 */
export default function NameDetailPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-12 sm:px-6">
        <Suspense fallback={<Skeleton />}>
          <NameLoader />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function NameLoader() {
  const params = useSearchParams();
  const raw = params.get("name") ?? "";
  const name = safeNormalize(raw.trim().toLowerCase());
  const [state, setState] = useState<NameState | null | "error">(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!name) return;
    let alive = true;
    setState(null);
    getNameState(name)
      .then((s) => alive && setState(s))
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [name, reloadKey]);

  if (!raw || !name) {
    return (
      <Empty title="Which name?" body="Open a name from your dashboard.">
        <Link
          href="/manage/"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-semibold"
        >
          Go to my names
        </Link>
      </Empty>
    );
  }
  if (state === null) return <Skeleton />;
  if (state === "error") {
    return (
      <Empty title="Couldn't load that name" body="Ethereum read failed — try again in a moment." />
    );
  }
  return <RecordsEditor state={state} onChanged={() => setReloadKey((k) => k + 1)} />;
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-64 animate-pulse rounded-2xl bg-line/60" />
      <div className="h-40 animate-pulse rounded-3xl bg-line/60" />
      <div className="h-72 animate-pulse rounded-3xl bg-line/60" />
    </div>
  );
}

function Empty({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-10 text-center shadow-soft">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      {children}
    </div>
  );
}
