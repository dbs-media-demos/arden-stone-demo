import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { WorkshopFilm } from "@/components/sections/WorkshopFilm";
import { Counter } from "@/components/ui/Counter";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { HISTORY, STATS, TEAM, TRUST, VALUES } from "@/data/studio";
import { pic } from "@/lib/images";
import { breadcrumbSchema, businessId, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About the Studio",
  description:
    "Arden & Stone is a Dallas design-build studio founded in 2007: 42 architects, designers and craftspeople with their own joinery workshop in the Design District.",
  path: "/about",
  eyebrow: "The studio",
  image: "/images/craft/pencil-mark.jpg",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(
          breadcrumbSchema(crumbs),
          { "@type": "AboutPage", url: absoluteUrl("/about"), about: { "@id": businessId } },
          ...TEAM.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role, worksFor: { "@id": businessId } })),
        )}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Est. 2007 · Dallas Design District"
        title={["We renovate homes", <span key="2">the way tailors <em className="italic-accent">cut cloth.</em></span>]}
        lede="By hand, to fit, to last. Forty-two architects, designers and makers, and every project still passes through our own workshop benches."
        image={pic("craft/pencil-mark", "Craftsman marking a line on an oak board with a pencil")}
      />

      <section className="shell py-24 md:py-36" aria-label="Our story">
        <div className="grid gap-12 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">Our story</p>
          <div className="lg:col-span-9">
            <ScrubWords
              className="display-m text-pretty"
              text="Thomas Arden opened a two-person joinery workshop in a Deep Ellum warehouse in 2007. Clients kept asking the people who built their cabinets to design the rooms around them, then the rest of the house. *Eighteen *years later, that is still the whole idea."
            />
            <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-10 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none tabular">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="label mt-3 text-faint">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="shell pb-24 md:pb-36" aria-label="Workshop">
        <div className="grid gap-4 md:grid-cols-12">
          <Parallax className="aspect-[4/5] rounded-sm md:col-span-4">
            <div className="absolute inset-0">
              <Img pic={pic("craft/chisels", "Chisels laid out on a workbench")} sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          </Parallax>
          <Parallax className="aspect-[4/5] rounded-sm md:col-span-4 md:mt-24">
            <div className="absolute inset-0">
              <Img pic={pic("craft/sanding", "Craftsman sanding a timber panel")} sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          </Parallax>
          <Parallax className="aspect-[4/5] rounded-sm md:col-span-4 md:mt-48">
            <div className="absolute inset-0">
              <Img pic={pic("craft/tool-wall", "Wall of hand tools in the workshop")} sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          </Parallax>
        </div>
      </section>

      <section className="theme-stone py-24 md:py-32" aria-labelledby="values-title">
        <div className="shell">
          <p className="eyebrow mb-6">What we believe</p>
          <SplitReveal id="values-title" className="display-l max-w-3xl">
            Four rules we <em className="italic-accent">don&rsquo;t bend.</em>
          </SplitReveal>
          <Reveal stagger={0.08} className="mt-14 grid gap-px overflow-hidden rounded-sm bg-line md:grid-cols-2 xl:grid-cols-4">
            {VALUES.map((v, i) => (
              <div key={v.title} className="bg-bg p-8">
                <p className="label text-faint tabular">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display-s mt-10">{v.title}</h3>
                <p className="mt-4 text-muted leading-relaxed">{v.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="shell py-24 md:py-32" aria-labelledby="team-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-6">The people</p>
            <SplitReveal id="team-title" className="display-l">
              Who you&rsquo;ll <em className="italic-accent">work with.</em>
            </SplitReveal>
          </div>
          <p className="max-w-sm text-muted">Plus thirty-eight architects, designers, joiners, stonemasons and site leads.</p>
        </div>
        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => {
            const p = pic(m.image.key, m.image.alt);
            return (
              <li key={m.name} className={i % 2 ? "lg:mt-16" : undefined}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-paper">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                    quality={75}
                    placeholder="blur"
                    blurDataURL={p.blurDataURL}
                    className="duotone object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                </div>
                <h3 className="display-s mt-5">{m.name}</h3>
                <p className="label mt-1 text-accent">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{m.bio}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <WorkshopFilm>
        <p className="eyebrow mb-6">The workshop</p>
        <p className="display-l max-w-4xl">
          Nine thousand square feet of benches, <em className="italic-accent">and a kettle that&rsquo;s always on.</em>
        </p>
      </WorkshopFilm>

      <section className="shell grid gap-14 py-24 md:py-32 lg:grid-cols-12" aria-labelledby="history-title">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">Timeline</p>
          <SplitReveal id="history-title" className="display-l">
            Eighteen years <em className="italic-accent">in Dallas.</em>
          </SplitReveal>
        </div>
        <Reveal as="ol" stagger={0.08} className="border-t border-line lg:col-span-8">
          {HISTORY.map((h) => (
            <li key={h.year} className="grid grid-cols-[5rem_1fr] gap-6 border-b border-line py-6 md:grid-cols-[8rem_1fr]">
              <span className="font-display text-3xl text-accent tabular">{h.year}</span>
              <p className="pt-1.5 text-lg leading-relaxed">{h.text}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section className="shell pb-8" aria-label="Credentials">
        <ul className="flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-8">
          {TRUST.map((t) => (
            <li key={t} className="label text-muted">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title={
          <>
            Come and see the <em className="italic-accent">workshop.</em>
          </>
        }
        text="Studio visits are on weekday mornings. Touch the stone, open the drawers, meet the people who would build your home."
        image={pic("craft/plane", "Craftsman planing a board in the workshop")}
      />
    </PageShell>
  );
}
