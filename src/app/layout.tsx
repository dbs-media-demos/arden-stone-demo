import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/layout/Cursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ogImageUrl } from "@/lib/seo";
import { noindex, site, siteUrl } from "@/lib/site";
import { PHONE_MEDIA } from "@/lib/media";

// Desktop's fonts. Nothing here is preloaded: phones use the two files in public/fonts instead (globals.css).
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});
const manrope = Manrope({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--font-manrope", display: "swap", preload: false });
const plexMono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-plex-mono", display: "swap", preload: false });

/**
 * A phone's first layout also opens every system font it uses, all in one long task. Measuring a word in
 * each, a task at a time while the page downloads, takes that out of it. Keep the stacks in sync with globals.css.
 */
const warmPhoneFonts = `if(matchMedia(${JSON.stringify(PHONE_MEDIA)}).matches){var s='-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',f=["16px "+s,"500 13px "+s,"600 13px "+s,'11px ui-monospace,"SF Mono",Menlo,Consolas,"Roboto Mono","Liberation Mono",monospace','40px "Times New Roman","Liberation Serif","Noto Serif"'],c=document.createElement("canvas").getContext("2d"),i=0;(function n(){if(i<f.length){c.font=f[i++];c.measureText("Home renovation in Dallas");setTimeout(n)}})()}`;

const defaultTitle = "Arden & Stone | Dallas Design-Build Renovation Studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.agency,
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
      <head>
        <link rel="preload" href="/fonts/cormorant-phone.woff2" as="font" type="font/woff2" crossOrigin="anonymous" media={PHONE_MEDIA} />
        <link rel="preload" href="/fonts/cormorant-phone-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" media={PHONE_MEDIA} />
        <script dangerouslySetInnerHTML={{ __html: warmPhoneFonts }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-ivory">
          Skip to content
        </a>
        <SmoothScroll />
        {/* Header, footer and the rest come from (site)/layout or for/[token]/layout (SiteChrome) */}
        {children}
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
