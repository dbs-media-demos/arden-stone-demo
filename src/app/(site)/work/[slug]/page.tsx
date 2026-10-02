import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Stars } from "@/components/ui/Bits";
import { Arrow } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { CATEGORIES, PROJECTS, projectBySlug } from "@/data/projects";
import { pic } from "@/lib/images";
import { breadcrumbSchema, businessId, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => PROJECTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const p = projectBySlug((await params).slug);
  if (!p) return {};
  return buildMetadata({
    title: `${p.title}, ${p.area}`,
    description: `${p.summary} ${p.duration}, ${p.size}.`.slice(0, 158),
    path: `/work/${p.slug}`,
    eyebrow: `${p.area} · ${p.year}`,
    image: `/images/${p.hero.key}.jpg`,
    type: "article",
  });
}

/** Layout rhythm for the gallery: [grid classes, aspect]. */
const RHYTHM = [
  "md:col-span-7 aspect-[4/3]",
  "md:col-span-5 aspect-[4/5] md:mt-24",
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-7 aspect-[4/3] md:mt-16",
  "md:col-span-6 aspect-square",
  "md:col-span-6 aspect-square md:mt-24",
];

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const p = projectBySlug((await params).slug);
  if (!p) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: p.title, path: `/work/${p.slug}` },
  ];
  const idx = PROJECTS.indexOf(p);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const words = p.title.split(" ");
  const cats = p.categories.map((c) => CATEGORIES.find((x) => x.id === c)?.label).join(" · ");

  return (
    <PageShell>
      <JsonLd
        data={graph(breadcrumbSchema(crumbs), {
          "@type": "CreativeWork",
          name: p.title,
          about: p.summary,
          url: absoluteUrl(`/work/${p.slug}`),
          image: absoluteUrl(`/images/${p.hero.key}.jpg`),
          dateCreated: String(p.year),
          locationCreated: { "@type": "Place", name: `${p.area}, TX` },
          creator: { "@id": businessId },
        })}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${p.area} · ${p.year} · ${cats}`}
        title={[words.slice(0, -1).join(" ") || words[0], <em key="l" className="italic-accent">{words.length > 1 ? words.at(-1) : ""}</em>]}
        lede={p.summary}
        image={pic(p.hero.key, p.hero.alt)}
        morph={`work-${p.slug}`}
      />

      <section className="shell py-16 md:py-24" aria-label="Project facts">
        <dl className="grid grid-cols-2 gap-8 border-y border-line py-8 md:grid-cols-4">
          {[
            ["Location", p.area],
            ["Duration", p.duration],
            ["Size", p.size],
            ["Investment", p.budget],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label text-faint">{k}</dt>
              <dd className="mt-2 font-display text-3xl">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell grid gap-12 pb-24 md:pb-32 lg:grid-cols-12" aria-label="The story">
        {[
          ["01", "The brief", p.brief],
          ["02", "Our approach", p.approach],
          ["03", "The result", p.result],
        ].map(([n, h, t]) => (
          <Reveal key={n} className="lg:col-span-4">
            <p className="label text-faint">{n}</p>
            <h2 className="display-m mt-3">{h}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{t}</p>
          </Reveal>
        ))}
      </section>

      {p.beforeAfter && (
        <section className="theme-stone py-24 md:py-32" aria-labelledby="ba-title">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SplitReveal id="ba-title" className="display-l">
                Before <em className="italic-accent">&amp;</em> after
              </SplitReveal>
              <p className="max-w-sm text-muted">{p.beforeAfter.caption}</p>
            </div>
            <BeforeAfter
              before={pic(p.beforeAfter.before.key, p.beforeAfter.before.alt)}
              after={pic(p.beforeAfter.after.key, p.beforeAfter.after.alt)}
              className="mt-12 aspect-[4/5] w-full rounded-sm sm:aspect-[16/10]"
            />
          </div>
        </section>
      )}

      <section className="shell py-24 md:py-32" aria-label="Gallery">
        <div className="grid gap-4 md:grid-cols-12 md:gap-6">
          {p.gallery.map((g, i) => (
            <Parallax key={g.key} className={`${RHYTHM[i % RHYTHM.length]} rounded-sm bg-paper`}>
              <div className="absolute inset-0">
                <Img pic={pic(g.key, g.alt)} sizes="(min-width: 768px) 58vw, 100vw" />
              </div>
            </Parallax>
          ))}
        </div>
      </section>

      <section className="shell grid gap-12 pb-24 lg:grid-cols-12" aria-label="Materials and client words">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">Material palette</p>
          <ul className="flex flex-wrap gap-2">
            {p.materials.map((m) => (
              <li key={m} className="rounded-full border border-line-strong px-4 py-2 text-sm">
                {m}
              </li>
            ))}
          </ul>
        </div>
        {p.quote && (
          <figure className="lg:col-span-7 lg:col-start-6">
            <Stars />
            <ScrubWords as="blockquote" className="display-m mt-6 text-pretty" text={`“${p.quote.text}”`} />
            <figcaption className="label mt-6 text-faint">
              {p.quote.name} · {p.area}
            </figcaption>
          </figure>
        )}
      </section>

      <section className="theme-ink" aria-label="Next project">
        <Link href={`/work/${next.slug}`} data-cursor="Next" className="group relative block overflow-hidden">
          <div className="absolute inset-0 opacity-50 transition-opacity duration-700 group-hover:opacity-70">
            <Img pic={pic(next.hero.key, next.hero.alt)} sizes="100vw" className="transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
          </div>
          <div className="shell relative flex min-h-[60svh] flex-col justify-end py-16">
            <p className="label text-ivory/70">Next project</p>
            <p className="display-xl mt-4">{next.title}</p>
            <p className="mt-4 inline-flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.14em] uppercase">
              {next.area} <Arrow />
            </p>
          </div>
        </Link>
      </section>

      <CtaBand
        title={
          <>
            Planning something <em className="italic-accent">similar?</em>
          </>
        }
        text={`We'd love to hear about it. Every project starts with a free ninety-minute visit to your home.`}
        image={pic(p.gallery[0].key, p.gallery[0].alt)}
      />
    </PageShell>
  );
}
