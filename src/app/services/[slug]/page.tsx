import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Button, TextLink } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { projectBySlug } from "@/data/projects";
import { SERVICES, serviceBySlug } from "@/data/services";
import { pic } from "@/lib/images";
import { breadcrumbSchema, faqSchema, graph, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.title} in Dallas`,
    description: `${s.lede} ${s.price}, ${s.duration}.`.slice(0, 158),
    path: `/services/${s.slug}`,
    eyebrow: s.title,
    image: `/images/${s.hero.key}.jpg`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.title, path: `/services/${s.slug}` },
  ];
  const idx = SERVICES.indexOf(s);
  const next = SERVICES[(idx + 1) % SERVICES.length];
  const projects = s.projects.map(projectBySlug).filter((p) => !!p);
  const [first, ...restWords] = s.title.split(" ");

  return (
    <PageShell>
      <JsonLd data={graph(breadcrumbSchema(crumbs), serviceSchema(s), faqSchema(s.faqs))} />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${s.sheet} · Service`}
        title={restWords.length ? [first, <em key="r" className="italic-accent">{restWords.join(" ")}</em>] : [<em key="r" className="italic-accent">{s.title}</em>]}
        lede={s.lede}
        aside={
          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5">
            <div>
              <dt className="label text-faint">Investment</dt>
              <dd className="mt-1 font-display text-2xl">{s.price}</dd>
            </div>
            <div>
              <dt className="label text-faint">Timeline</dt>
              <dd className="mt-1 font-display text-2xl">{s.duration}</dd>
            </div>
          </dl>
        }
        image={pic(s.hero.key, s.hero.alt)}
      />

      <section className="shell grid gap-14 py-24 md:py-32 lg:grid-cols-12" aria-labelledby="approach-title">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">Our approach</p>
          <SplitReveal id="approach-title" className="display-l">
            Drawn first, <em className="italic-accent">built once.</em>
          </SplitReveal>
        </div>
        <Reveal className="grid gap-6 text-lg leading-relaxed text-muted lg:col-span-6 lg:col-start-7">
          {s.body.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </Reveal>
      </section>

      <section className="shell pb-24 md:pb-32" aria-label="Gallery">
        <div className="grid gap-4 md:grid-cols-12">
          {s.gallery.map((g, i) => (
            <Parallax
              key={g.key}
              className={
                i === 0
                  ? "aspect-[4/5] rounded-sm md:col-span-5"
                  : i === 1
                    ? "aspect-[4/5] rounded-sm md:col-span-4 md:mt-24"
                    : "aspect-[4/5] rounded-sm md:col-span-3 md:mt-48"
              }
            >
              <div className="absolute inset-0">
                <Img pic={pic(g.key, g.alt)} sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
            </Parallax>
          ))}
        </div>
      </section>

      <section className="theme-stone py-24 md:py-32" aria-labelledby="includes-title">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">What&rsquo;s included</p>
            <SplitReveal id="includes-title" className="display-l">
              One contract covers <em className="italic-accent">all of it.</em>
            </SplitReveal>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/estimate">Estimate the cost</Button>
            </div>
          </div>
          <Reveal as="ul" stagger={0.07} className="border-t border-line lg:col-span-6 lg:col-start-7">
            {s.includes.map((it, i) => (
              <li key={it} className="flex gap-6 border-b border-line py-5">
                <span className="label pt-1.5 text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className="display-s">{it}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="shell py-24 md:py-32" aria-labelledby="projects-title">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SplitReveal id="projects-title" className="display-l">
              Recent <em className="italic-accent">{s.short.toLowerCase()}</em> projects
            </SplitReveal>
            <TextLink href="/work">All work</TextLink>
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
                <p className="mt-2 text-muted">{p.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="shell grid gap-14 pb-12 lg:grid-cols-12" aria-labelledby="sfaq-title">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">Questions</p>
          <SplitReveal id="sfaq-title" className="display-l">
            About {s.short.toLowerCase()}
          </SplitReveal>
        </div>
        <div className="lg:col-span-8">
          <FaqList items={s.faqs} />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Next: <em className="italic-accent">{next.title}</em>
          </>
        }
        text={`${next.lede} Or book a consultation and we'll talk through your ${s.short.toLowerCase()} project in person.`}
        image={pic(next.hero.key, next.hero.alt)}
      />
    </PageShell>
  );
}
