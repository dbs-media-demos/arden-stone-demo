import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/layout/Cursor";
import { DemoBadge } from "@/components/layout/DemoBadge";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import { businessSchema, graph, websiteSchema } from "@/lib/schema";
import { ogImageUrl } from "@/lib/seo";
import { noindex, site, siteUrl } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-manrope", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-plex-mono", display: "swap", preload: false });

const defaultTitle = "Arden & Stone | Dallas Design-Build Renovation Studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: "DBS Media",
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
    images: [{ url: ogImageUrl("Drawn by hand. Built by the same hands.", "Dallas design-build studio", "/images/hero/kitchen.jpg"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  robots: noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f8f6f2",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${cormorant.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-ivory">
          Skip to content
        </a>
        <JsonLd data={graph(businessSchema(), websiteSchema())} />
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <DemoBadge />
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
