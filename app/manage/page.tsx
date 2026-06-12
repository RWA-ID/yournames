import type { Metadata } from "next";
import VaultHeader from "@/components/vault/VaultHeader";
import VaultFooter from "@/components/vault/VaultFooter";
import NamesList from "@/components/manage/NamesList";

export const metadata: Metadata = {
  title: "My names — yournames.eth",
  description: "Manage your ENS names: records, avatar, addresses, website, renewals.",
};

export default function ManagePage() {
  return (
    <div className="vault flex min-h-screen flex-col antialiased">
      <VaultHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-28 sm:px-6">
        <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-gold">inside the vault</p>
        <h1 className="font-display text-3xl font-bold">My names</h1>
        <p className="mt-1 text-muted">
          everything your wallet controls — update profiles, renew, and more.
        </p>
        <NamesList />
      </main>
      <VaultFooter />
    </div>
  );
}
