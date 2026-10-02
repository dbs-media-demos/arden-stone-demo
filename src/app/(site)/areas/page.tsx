import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { AreaMap } from "@/components/sections/AreaMap";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Arrow } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { AREAS } from "@/data/areas";
import { pic } from "@/lib/images";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Service Areas: Dallas, Park Cities & Fort Worth",
  description:
    "Arden & Stone renovates homes in Highland Park, University Park, Preston Hollow, Lakewood and East Dallas, Southlake and Westlake, and Fort Worth's Westover Hills and Rivercrest.",
  path: "/areas",
  eyebrow: "Service areas",
  image: "/images/area/dallas-dusk.jpg",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Service areas", path: "/areas" },
];

export default function AreasPage() {
  return (
    <PageShell>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Where we work"
        title={["Dallas, the Park", <span key="2">Cities <em className="italic-accent">&amp; beyond.</em></span>]}
        lede="A dedicated site lead on every job and never more than forty minutes from our Design District workshop."
        image={pic("area/dallas-dusk", "Dallas skyline at dusk reflected in the Trinity River")}
      />
      <section className="shell grid gap-14 py-24 md:py-32 lg:grid-cols-12" aria-label="Map">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">The map</p>
          <p className="display-m">Five areas we know street by street.</p>
          <p className="mt-6 text-muted leading-relaxed">
            We know the review boards, the inspectors, the soil and which streets flood in a spring storm. We take on a few projects elsewhere in DFW each year; call to ask.
          </p>
        </div>
        <div className="lg:col-span-8">
          <AreaMap pins={AREAS.map((a) => ({ slug: a.slug, short: a.short, name: a.name, x: a.map.x, y: a.map.y, drive: a.drive }))} />
        </div>
      </section>
      <section className="shell pb-16" aria-label="Areas">
        <Reveal as="ul" stagger={0.08} className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {AREAS.map((a) => (
            <li key={a.slug}>
              <Link href={`/areas/${a.slug}`} data-cursor="Explore" className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-paper">
                  <Img pic={pic(a.hero.key, a.hero.alt)} sizes="(min-width: 768px) 48vw, 100vw" className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="display-m group-hover:text-accent">{a.name}</h2>
                  <Arrow className="shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-3 text-muted">{a.lede}</p>
                <p className="label mt-3 text-faint">{a.neighborhoods.join(" · ")}</p>
              </Link>
            </li>
          ))}
        </Reveal>
      </section>
      <CtaBand
        title={
          <>
            Is your street <em className="italic-accent">on our map?</em>
          </>
        }
        text="If you're within forty minutes of the Design District, almost certainly. Call and we'll tell you in a minute."
        image={pic("area/trees-skyline", "Dallas skyline above a sea of trees at sunset")}
      />
    </PageShell>
  );
}
