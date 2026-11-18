import type { Metadata } from "next";
import { HomeContent, homeFaqs } from "@/components/sections/HomeContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema, graph } from "@/lib/schema";
import { metadata as home } from "../page";

/**
 * The homepage without 3D, for a slow laptop or a lead who'd rather not have it: the same sections,
 * words, photos and order, a canvas-2D hero, and no three.js at any width. Google is pointed at /.
 */
export const metadata: Metadata = {
  ...home,
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function HomeV2Page() {
  return (
    <HomeContent hero="2d">
      <JsonLd data={graph(faqSchema(homeFaqs))} />
    </HomeContent>
  );
}
