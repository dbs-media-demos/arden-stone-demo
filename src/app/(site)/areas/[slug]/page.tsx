import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { TextLink } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { AREAS, areaBySlug } from "@/data/areas";
import { PROJECTS } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { pic } from "@/lib/images";
import { breadcrumbSchema, businessId, faqSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => AREAS.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: PageProps<"/areas/[slug]">) {
  const a = areaBySlug((await params).slug);
  if (!a) return {};
  return buildMetadata({
    title: `Home Renovation in ${a.name}, TX`,
    description: `${a.lede} Kitchens, baths, additions and whole-home renovations in ${a.neighborhoods.slice(0, 3).join(", ")}.`.slice(0, 158),
    path: `/areas/${a.slug}`,
    eyebrow: `Service area · ${a.short}`,
    image: `/images/${a.hero.key}.jpg`,
  });
}

export default async function AreaPage({ params }: PageProps<"/areas/[slug]">) {
  const a = areaBySlug((await params).slug);
  if (!a) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service areas", path: "/areas" },
    { name: a.name, path: `/areas/${a.slug}` },
  ];
  const local = PROJECTS.filter((p) => p.areaSlug === a.slug);
  const projects = local.length ? local : PROJECTS.slice(0, 2);
  const faqs = [
    { q: `Do you handle permits in ${a.short}?`, a: `Yes. We prepare drawings and engineering and manage every permit and review for ${a.name}, including HOA and any conservation-district approvals.` },
    { q: `How quickly can you visit a home in ${a.short}?`, a: `Usually within ten days. ${a.short} is ${a.drive}, and a site lead lives nearby for the duration of every project.` },
    { q: `What kinds of homes do you renovate in ${a.short}?`, a: `Mostly ${a.homes.charAt(0).toLowerCase()}${a.homes.slice(1)}. We tailor the approach to the age and construction of each house.` },
  ];

  return (
    <PageShell>
      <JsonLd
        data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), {
          "@type": "Service",
          name: `Home renovation in ${a.name}`,
          provider: { "@id": businessId },
          areaServed: { "@type": "Place", name: `${a.name}, TX`, address: { "@type": "PostalAddress", addressRegion: "TX", postalCode: a.zips[0] } },
          url: absoluteUrl(`/areas/${a.slug}`),
        })}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`Service area · ${a.drive}`}
        title={["Renovating in", <em key="2" className="italic-accent">{a.short}.</em>]}
        lede={a.lede}
        image={pic(a.hero.key, a.hero.alt)}
      />

      <section className="shell grid gap-14 py-24 md:py-32 lg:grid-cols-12" aria-labelledby="local-title">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">Local knowledge</p>
          <SplitReveal id="local-title" className="display-l">
            We know the <em className="italic-accent">houses here.</em>
          </SplitReveal>
        </div>
        <Reveal className="grid gap-6 text-lg leading-relaxed text-muted lg:col-span-6 lg:col-start-7">
          {a.body.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <dl className="mt-4 grid gap-6 border-t border-line pt-6 text-base sm:grid-cols-2">
            <div>
              <dt className="label text-faint">Neighborhoods</dt>
              <dd className="mt-2 text-fg">{a.neighborhoods.join(", ")}</dd>
            </div>
            <div>
              <dt className="label text-faint">ZIP codes</dt>
              <dd className="mt-2 text-fg tabular">{a.zips.join(", ")}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="label text-faint">Typical homes</dt>
              <dd className="mt-2 text-fg">{a.homes}</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className="theme-stone py-24 md:py-32" aria-labelledby="near-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SplitReveal id="near-title" className="display-l">
              {local.length ? (
                <>
                  Recent work in <em className="italic-accent">{a.short}</em>
                </>
              ) : (
                <>
                  Recent <em className="italic-accent">work</em>
                </>
              )}
            </SplitReveal>
            <TextLink href="/work">All projects</TextLink>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {projects.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} data-cursor="View" className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-paper">
                  <Img pic={pic(p.hero.key, p.hero.alt)} sizes="(min-width: 768px) 48vw, 100vw" className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="display-s group-hover:text-accent">{p.title}</h3>
                  <span className="label text-faint">
                    {p.area} · {p.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell grid gap-14 py-24 lg:grid-cols-12" aria-labelledby="svc-title">
        <div className="lg:col-span-4">
          <h2 id="svc-title" className="display-l">
            Services in <em className="italic-accent">{a.short}</em>
          </h2>
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {SERVICES.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/services/${s.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                <span className="display-s group-hover:text-accent">{s.title}</span>
                <span className="label text-faint">{s.price}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell grid gap-14 pb-12 lg:grid-cols-12" aria-labelledby="afaq-title">
        <h2 id="afaq-title" className="display-l lg:col-span-4">
          {a.short} <em className="italic-accent">questions</em>
        </h2>
        <div className="lg:col-span-8">
          <FaqList items={faqs} />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Let&rsquo;s visit your <em className="italic-accent">{a.short}</em> home.
          </>
        }
        text={`Free, ninety minutes, usually within ten days. ${a.short} is ${a.drive}.`}
        image={pic(projects[0].gallery[0].key, projects[0].gallery[0].alt)}
      />
    </PageShell>
  );
}
