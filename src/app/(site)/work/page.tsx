import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { JsonLd } from "@/components/ui/JsonLd";
import { CATEGORIES, PROJECTS } from "@/data/projects";
import { pic } from "@/lib/images";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Our Work: Dallas Renovation Projects",
  description:
    "Recent Arden & Stone renovations in Highland Park, University Park, Preston Hollow, Lakewood, Southlake and Fort Worth: whole homes, kitchens, baths, outdoor living and historic restorations.",
  path: "/work",
  eyebrow: "Selected work",
  image: "/images/hero/modern-dusk-2.jpg",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work" },
];

export default function WorkPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(breadcrumbSchema(crumbs), {
          "@type": "CollectionPage",
          name: "Arden & Stone projects",
          url: absoluteUrl("/work"),
          hasPart: PROJECTS.map((p) => ({ "@type": "CreativeWork", name: p.title, url: absoluteUrl(`/work/${p.slug}`) })),
        })}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${PROJECTS.length} projects · 2023 – 2025`}
        title={["Homes we’ve", <span key="2"><em className="italic-accent">drawn</em> and built.</span>]}
        lede="Every project here was designed, built and finished by our own team, from Highland Park to Westover Hills."
      />
      <section className="shell py-16 md:py-20" aria-label="Projects">
        <WorkGallery
          categories={[...CATEGORIES]}
          items={PROJECTS.map((p) => ({
            slug: p.slug,
            title: p.title,
            area: p.area,
            year: p.year,
            categories: p.categories,
            summary: p.summary,
            image: pic(p.hero.key, p.hero.alt),
          }))}
        />
      </section>
      <CtaBand
        title={
          <>
            Your home, <em className="italic-accent">next?</em>
          </>
        }
        text="We take on a limited number of projects each season. Tell us about yours and we'll tell you honestly whether we're the right studio for it."
        image={pic("living/golden-detail", "Warm sunlight across a wooden cabinet")}
      />
    </PageShell>
  );
}
