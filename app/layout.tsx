import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  JetBrains_Mono,
  Schibsted_Grotesk,
  Sora,
  Spline_Sans_Mono,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

// Constellation hero (design: yournames-redesign (1).html)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-splinemono",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "yournames.eth — Unlock Your Onchain Identity";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: SITE.description,
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
    : undefined,
  openGraph: {
    title: TITLE,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
    },
    {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      email: SITE.sponsorEmail,
      description:
        "Independent, community-built ENS registration interface. Not affiliated with ENS, ENS Labs, or the ENS DAO.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${jbmono.variable} ${fraunces.variable} ${schibsted.variable} ${splineMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
