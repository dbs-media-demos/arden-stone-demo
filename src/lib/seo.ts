import type { Metadata } from "next";
import { noindex, site } from "./site";

type Input = {
  /** Page title without the brand suffix (the root template adds "| Arden & Stone"). */
  title: string;
  description: string;
  path: string;
  /** Small label above the title on the generated share image. */
  eyebrow?: string;
  /** Background photo for the share image (public path). */
  image?: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
};

export const ogImageUrl = (title: string, eyebrow?: string, image?: string) => {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  if (image) params.set("image", image);
  return `/api/og?${params.toString()}`;
};

export function buildMetadata({ title, description, path, eyebrow, image, absoluteTitle, type = "website" }: Input): Metadata {
  const og = ogImageUrl(title, eyebrow, image);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: "en_US",
      title: fullTitle,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [og] },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
