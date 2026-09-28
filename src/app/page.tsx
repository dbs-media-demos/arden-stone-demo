import { PageShell } from "@/components/layout/PageShell";
import { AreaMap } from "@/components/sections/AreaMap";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Estimator } from "@/components/sections/Estimator";
import { HeroSketch, type HeroSlide } from "@/components/sections/HeroSketch";
import { Journey } from "@/components/sections/Journey";
import { MaterialMarquee } from "@/components/sections/MaterialMarquee";
import { ProjectReel } from "@/components/sections/ProjectReel";
import { ReviewsRow } from "@/components/sections/Reviews";
import { ServiceStack } from "@/components/sections/ServiceStack";
import { WorkshopFilm } from "@/components/sections/WorkshopFilm";
import { RatingPill, ScaleBar, SectionHead } from "@/components/ui/Bits";
import { Button, TextLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Lines, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { AREAS } from "@/data/areas";
import { CATEGORIES, PROJECTS, projectBySlug } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { FAQS, MATERIALS, STAGES, STATS, TRUST } from "@/data/studio";
import { pic } from "@/lib/images";
import { faqSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Arden & Stone | Dallas Design-Build Renovation Studio",
  absoluteTitle: true,
  description:
    "Design-build home renovation in Dallas: whole homes, kitchens, primary baths, additions and historic restorations in Highland Park, Preston Hollow and across DFW. One team from first sketch to handover.",
  path: "/",
  eyebrow: "Dallas design-build studio",
  image: "/images/hero/kitchen.jpg",
});

const SLIDES: HeroSlide[] = [
  {
    photo: pic("hero/kitchen", "Renovated kitchen with a white stone island, bronze stools and a cedar ceiling"),
    sketch: pic("hero/kitchen-sketch", ""),
    sheet: "A-210",
    room: "Kitchen elevation",
    place: "Bluffview, Dallas",
    position: "50% 62%",
  },
  {
    photo: pic("hero/traditional", "Sunlit sitting room with a curved bouclé sofa, stone table and white fireplace"),
    sketch: pic("hero/traditional-sketch", ""),
    sheet: "A-120",
    room: "Sitting room",
    place: "Highland Park",
  },
  {
    photo: pic("hero/living", "Symmetrical living room with twin sofas facing a linear fireplace"),
    sketch: pic("hero/living-sketch", ""),
    sheet: "A-110",
    room: "Living room",
    place: "Preston Hollow",
  },
];

export default function HomePage() {
  const linen = projectBySlug("the-linen-kitchen")!;
  const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <PageShell>
      <JsonLd data={graph(faqSchema(FAQS.slice(0, 5)))} />

      {/* ───────── Hero ───────── */}
      <HeroSketch
        slides={SLIDES}
        footer={
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line py-5 lg:border-0 lg:py-6">
            <RatingPill />
            <OpenBadge className="text-muted" />
            <a href={site.phoneHref} className="label link-draw tabular">
              {site.phone}
            </a>
          </div>
        }
      >
        <h1>
          <span className="eyebrow anim-fade mb-7" style={{ "--d": "0.1s" } as React.CSSProperties}>
            Dallas design-build renovation studio
          </span>
          <Lines
            className="mt-6 font-display text-[clamp(3.1rem,6.1vw,7.4rem)] leading-[0.92] tracking-[-0.03em]"
            delay={0.15}
            lines={[
              "Drawn by hand.",
              "Built by the",
              <span key="l3">
                same <em className="italic-accent">hands.</em>
              </span>,
            ]}
          />
        </h1>
        <p className="lede anim-fade mt-8 max-w-md" style={{ "--d": "0.5s" } as React.CSSProperties}>
          Architects, designers and makers under one roof. We renovate homes across Highland Park, Preston Hollow and DFW, from the first pencil line to the final
          coat of wax.
        </p>
        <div className="anim-fade mt-9 flex flex-wrap items-center gap-6" style={{ "--d": "0.65s" } as React.CSSProperties}>
          <Button href="/contact">Book a consultation</Button>
          <TextLink href="/work">See the work</TextLink>
        </div>
      </HeroSketch>

      {/* ───────── Statement + numbers ───────── */}
      <section className="shell py-28 md:py-44" aria-labelledby="studio-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p id="studio-title" className="eyebrow">
              The studio
            </p>
            <ScaleBar className="mt-6" />
          </div>
          <div className="lg:col-span-9">
            <ScrubWords
              className="display-m text-pretty"
              text="We draw your home, build it in our own Design District workshop, and hand you the keys to a house that feels as if it had *always *been *this *way. One team, one contract, one number to call."
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

      {/* ───────── Before / after ───────── */}
      <section className="theme-stone py-24 md:py-36" aria-labelledby="ba-title">
        <div className="shell">
          <SectionHead
            align="split"
            eyebrow="Before & after · University Park"
            title={
              <SplitReveal id="ba-title" className="display-l">
                A 1984 galley, <em className="italic-accent">set free.</em>
              </SplitReveal>
            }
          >
            {linen.beforeAfter!.caption} Drag the line to compare.
          </SectionHead>
          <Reveal className="mt-14">
            <BeforeAfter
              before={pic(linen.beforeAfter!.before.key, linen.beforeAfter!.before.alt)}
              after={pic(linen.beforeAfter!.after.key, linen.beforeAfter!.after.alt)}
              beforeLabel="1984"
              afterLabel="2024"
              className="aspect-[4/5] w-full rounded-sm sm:aspect-[16/10] lg:aspect-[16/8]"
              sizes="(min-width: 1680px) 1580px, 94vw"
            />
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="label text-faint">
              {linen.title} · {linen.duration} · {linen.budget}
            </p>
            <TextLink href={`/work/${linen.slug}`}>Read the project</TextLink>
          </div>
        </div>
      </section>

      {/* ───────── Services stack ───────── */}
      <section className="shell py-24 md:py-36" aria-labelledby="services-title">
        <SectionHead
          align="split"
          eyebrow="What we do"
          title={
            <SplitReveal id="services-title" className="display-xl">
              Six disciplines, <em className="italic-accent">one studio.</em>
            </SplitReveal>
          }
        >
          Nothing gets lost between the drawing and the build, because the same people do both.
        </SectionHead>
        <div className="mt-16">
          <ServiceStack
            items={SERVICES.map((s) => ({
              href: `/services/${s.slug}`,
              sheet: s.sheet,
              title: s.title,
              lede: s.lede,
              price: s.price,
              duration: s.duration,
              image: pic(s.hero.key, s.hero.alt),
            }))}
          />
        </div>
      </section>

      {/* ───────── Selected work (horizontal) ───────── */}
      <ProjectReel
        items={PROJECTS.map((p) => ({
          slug: p.slug,
          title: p.title,
          area: p.area,
          year: p.year,
          tag: catLabel(p.categories[0]),
          image: pic(p.hero.key, p.hero.alt),
        }))}
        intro={
          <>
            <p className="eyebrow mb-6">Selected work · 2023 – 2025</p>
            <h2 id="reel-title" className="display-xl">
              Homes we&rsquo;ve <em className="italic-accent">drawn</em> and built.
            </h2>
            <p className="lede mt-6 max-w-sm">Nine recent projects across Dallas and Fort Worth. Scroll sideways through the sheets.</p>
            <div className="mt-8">
              <TextLink href="/work">All projects</TextLink>
            </div>
          </>
        }
      />

      {/* ───────── Journey (pinned) ───────── */}
      <Journey
        stages={STAGES.map((s) => ({ ...s, image: pic(s.image.key, s.image.alt) }))}
        heading={
          <div>
            <p className="eyebrow mb-6">The renovation journey</p>
            <h2 id="journey-title" className="display-l">
              From a first visit to a finished home, <em className="italic-accent">in five stages.</em>
            </h2>
            <div className="mt-8">
              <TextLink href="/process" className="text-ivory">
                How we work
              </TextLink>
            </div>
          </div>
        }
      />

      {/* ───────── Workshop film ───────── */}
      <WorkshopFilm>
        <p className="eyebrow mb-6">The workshop · Design District</p>
        <p className="display-l max-w-4xl">
          Every cabinet, door and stair is made <em className="italic-accent">twelve minutes</em> from your house.
        </p>
      </WorkshopFilm>

      {/* ───────── Materials ───────── */}
      <section className="py-24 md:py-32" aria-labelledby="materials-title">
        <div className="shell mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitReveal id="materials-title" className="display-l max-w-3xl">
            Materials chosen to <em className="italic-accent">age,</em> not just to photograph.
          </SplitReveal>
          <p className="max-w-sm text-muted">Every palette is sampled in the light of your own rooms before anything is ordered.</p>
        </div>
        <MaterialMarquee items={MATERIALS.map((m) => ({ pic: pic(m.key, m.name), name: m.name }))} />
      </section>

      {/* ───────── Estimator ───────── */}
      <section className="theme-stone py-24 md:py-36" aria-labelledby="estimate-title">
        <div className="shell">
          <SectionHead
            align="split"
            eyebrow="Cost estimator"
            title={
              <SplitReveal id="estimate-title" className="display-xl">
                What will it <em className="italic-accent">cost?</em>
              </SplitReveal>
            }
          >
            An honest range in ten seconds, based on what Dallas renovations really cost in 2026.{" "}
            <TextLink href="/estimate" className="mt-4 text-fg">
              Full estimator
            </TextLink>
          </SectionHead>
          <div className="mt-16">
            <Estimator compact />
          </div>
        </div>
      </section>

      {/* ───────── Reviews ───────── */}
      <section className="py-24 md:py-36" aria-labelledby="reviews-title">
        <div className="shell mb-12">
          <p className="eyebrow mb-6">Reviews</p>
          <SplitReveal id="reviews-title" className="display-l max-w-3xl">
            Judged at twelve months, <em className="italic-accent">not at handover.</em>
          </SplitReveal>
        </div>
        <ReviewsRow />
        <div className="shell mt-16">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
            {TRUST.map((t) => (
              <li key={t} className="label text-muted">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Areas ───────── */}
      <section className="theme-stone py-24 md:py-36" aria-labelledby="areas-title">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6">Where we work</p>
            <SplitReveal id="areas-title" className="display-l">
              Dallas, the Park Cities <em className="italic-accent">&amp; beyond.</em>
            </SplitReveal>
            <p className="lede mt-6">
              A dedicated site lead on every job, never more than forty minutes from the workshop. We know the review boards, the inspectors and the soil.
            </p>
            <div className="mt-8">
              <TextLink href="/areas">Service areas</TextLink>
            </div>
          </div>
          <div className="lg:col-span-8">
            <AreaMap pins={AREAS.map((a) => ({ slug: a.slug, short: a.short, name: a.name, x: a.map.x, y: a.map.y, drive: a.drive }))} />
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="shell grid gap-14 py-24 md:py-36 lg:grid-cols-12" aria-labelledby="faq-title">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">Questions</p>
          <SplitReveal id="faq-title" className="display-l">
            Good to <em className="italic-accent">know.</em>
          </SplitReveal>
          <div className="mt-8">
            <TextLink href="/faq">All questions</TextLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqList items={FAQS.slice(0, 5)} />
        </div>
      </section>
    </PageShell>
  );
}
