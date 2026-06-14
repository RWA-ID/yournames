import type { Metadata } from "next";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import NamesList from "@/components/manage/NamesList";

export const metadata: Metadata = {
  title: "My names — yournames.eth",
  description: "Manage your ENS names: records, avatar, addresses, website, renewals.",
};

export default function ManagePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-12 sm:px-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand">Your names</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">My names</h1>
        <p className="mt-1 text-muted">
          Everything your wallet controls — update profiles, renew, and more.
        </p>
        <NamesList />
      </main>
      <Footer />
    </div>
  );
}
