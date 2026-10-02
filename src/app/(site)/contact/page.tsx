import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AreaMap } from "@/components/sections/AreaMap";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { RatingPill } from "@/components/ui/Bits";
import { JsonLd } from "@/components/ui/JsonLd";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { AREAS } from "@/data/areas";
import { breadcrumbSchema, businessId, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Book a Consultation",
  description: `Book a free 90-minute home consultation with Arden & Stone, Dallas design-build renovation studio. Call ${site.phone} or send us a few details about your project.`,
  path: "/contact",
  eyebrow: "Contact",
  image: "/images/living/traditional.jpg",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd data={graph(breadcrumbSchema(crumbs), { "@type": "ContactPage", url: absoluteUrl("/contact"), about: { "@id": businessId } })} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Free home consultation"
        title={["Let’s talk about", <em key="2" className="italic-accent">your home.</em>]}
        lede="Ninety minutes in your home, no charge and no obligation. You'll leave with an honest budget range and a clear next step."
      />

      <section className="shell grid gap-14 py-16 md:py-24 lg:grid-cols-12" aria-label="Contact">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="min-h-[520px] rounded-sm bg-paper" />}>
            <ContactForm />
          </Suspense>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="grid gap-10">
            <div>
              <p className="label text-faint">Call the studio</p>
              <a href={site.phoneHref} className="mt-2 block font-display text-5xl tabular link-draw w-fit">
                {site.phone}
              </a>
              <OpenBadge className="mt-3 text-muted" />
            </div>
            <div>
              <p className="label text-faint">Email</p>
              <a href={`mailto:${site.email}`} className="link-draw mt-2 block w-fit text-lg">
                {site.email}
              </a>
            </div>
            <address className="not-italic">
              <p className="label text-faint">Studio &amp; workshop</p>
              <p className="mt-2 font-display text-2xl leading-snug">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </p>
              <p className="mt-1 text-sm text-muted">{site.address.district}. Visits by appointment.</p>
            </address>
            <div>
              <p className="label text-faint">Hours</p>
              <dl className="mt-3 grid gap-2 text-sm">
                {site.hoursLabel.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 border-b border-line pb-2">
                    <dt>{h.days}</dt>
                    <dd className="text-muted">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <RatingPill />
          </div>
        </aside>
      </section>

      <section className="theme-stone py-20 md:py-28" aria-labelledby="map-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6">Where we are</p>
            <h2 id="map-title" className="display-l">
              In the Design District, <em className="italic-accent">at the centre of it all.</em>
            </h2>
          </div>
          <div className="lg:col-span-8">
            <AreaMap pins={AREAS.map((a) => ({ slug: a.slug, short: a.short, name: a.name, x: a.map.x, y: a.map.y, drive: a.drive }))} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
