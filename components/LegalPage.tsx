import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

/*
 * Shared shell for /terms and /privacy — the Dark Ledger editorial ledger:
 * eyebrow, Sora headline with a Newsreader-italic twist, then numbered
 * hairline-separated sections.
 */
export type LegalSection = { title: string; body: React.ReactNode };

export default function LegalPage({
  eyebrow,
  title,
  twist,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  twist: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[46rem] flex-1 px-6 pb-20 pt-14 sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-display text-[2.1rem] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2.6rem]">
          {title} <span className="editorial">{twist}</span>
        </h1>
        <p className="mt-3 text-[0.8125rem] text-foreground/50">Last updated {updated}</p>

        <div className="mt-10 border-t border-line-strong">
          {sections.map((s, i) => (
            <section
              key={s.title}
              className={`grid gap-2 py-7 md:grid-cols-[3.5rem_1fr] ${
                i < sections.length - 1 ? "border-b border-line-faint" : ""
              }`}
            >
              <span className="font-display text-[0.8125rem] font-bold text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-[1.15rem] font-bold text-foreground">{s.title}</h2>
                <div className="mt-2.5 space-y-3 text-[0.9375rem] leading-[1.7] text-foreground/65">
                  {s.body}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
