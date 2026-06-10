import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NamesList from "@/components/manage/NamesList";

export const metadata: Metadata = {
  title: "My names — yournames.eth",
  description: "Manage your ENS names: records, avatar, addresses, website, renewals.",
};

export default function ManagePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold">My names</h1>
        <p className="mt-1 text-muted">
          Everything your wallet controls — update profiles, renew, and more.
        </p>
        <NamesList />
      </main>
      <Footer />
    </>
  );
}
