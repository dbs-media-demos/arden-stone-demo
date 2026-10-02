import { HomeContent, homeFaqs } from "@/components/sections/HomeContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Arden & Stone | Dallas Design-Build Renovation Studio",
  absoluteTitle: true,
  description:
    "Design-build home renovation in Dallas: whole homes, kitchens, primary baths, additions and historic restorations in Highland Park, Preston Hollow and across DFW. One team from first sketch to handover.",
  path: "/",
  eyebrow: "Dallas design-build studio",
  image: "/images/hero/kitchen.jpg",
});

export default function HomePage() {
  return (
    <HomeContent>
      <JsonLd data={graph(faqSchema(homeFaqs))} />
    </HomeContent>
  );
}
