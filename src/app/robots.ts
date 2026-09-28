import type { MetadataRoute } from "next";
import { noindex, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Concept site: keep it out of search engines unless NEXT_PUBLIC_NOINDEX="false".
  if (noindex) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
