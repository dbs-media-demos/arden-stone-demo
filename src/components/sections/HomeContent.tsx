import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AreaMap } from "@/components/sections/AreaMap";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Estimator } from "@/components/sections/Estimator";
import { HeroSketch, type HeroSlide } from "@/components/sections/HeroSketch";
import { Journey } from "@/components/sections/Journey";
import { MaterialMarquee } from "@/components/sections/MaterialMarquee";
import { MaterialsBoard } from "@/components/fx/samples/MaterialsBoard";
import { ProjectReel } from "@/components/sections/ProjectReel";
import { ReviewsRow } from "@/components/sections/Reviews";
import { ServiceStack } from "@/components/sections/ServiceStack";
import { WorkshopFilm } from "@/components/sections/WorkshopFilm";
import { RatingPill, ScaleBar, SectionHead } from "@/components/ui/Bits";
import { Button, TextLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { FaqList } from "@/components/ui/FaqList";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Lines, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { AREAS } from "@/data/areas";
import { CATEGORIES, PROJECTS, projectBySlug } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { FAQS, MATERIALS, STAGES, STATS, TRUST } from "@/data/studio";
import { pic } from "@/lib/images";
import { PreviewMap } from "@/components/preview/PreviewMap";
import { PhoneTeam, QuoteSection } from "@/components/sections/PhoneSections";
import { sr as srDict } from "@/i18n/sr";
import { defaultBiz } from "@/lib/biz";
import { L, openDays, telOf, type Biz } from "@/lib/biz-core";

/** The finished kitchen the hero's 3D model is drawn from (and the photo phones lead with). */
const SLIDE: HeroSlide = {
  photo: pic("hero/kitchen", "Renovated kitchen with a white stone island, bronze stools and a cedar ceiling"),
  sketch: pic("hero/kitchen-sketch", ""),
  sheet: "A-210",
  room: "Kitchen",
  place: "Bluffview, Dallas",
  position: "50% 62%",
};

/** On previews: no projects named after Dallas neighbourhoods, and FAQs that hold anywhere. */
const PREVIEW_PROJECT_SKIP = ["preston-hollow-modern", "the-m-streets-tudor", "westover-hills-residence"];
const PREVIEW_FAQS = [0, 3, 5, 7, 9];

export const homeFaqs = FAQS.slice(0, 5);

/**
 * Phones reorder the page with CSS for project work: gallery by type (with the before/after slider),
 * reviews naming the project, how it works, the budget guide, the team, the form. Desktop keeps this
 * file's order and never shows the phone-only team and form.
 *
 * The homepage sections. The concept site renders them as they are; a personalised preview
 * (/for/<token>) passes a real business: its name, phone, hours, rating and a map of its address
 * replace Arden & Stone's, and Dallas places, prices and credentials step aside. Serbian previews
 * are translated (i18n/sr; the first screen and the gallery heading already in the server's HTML)
 * and skip the dollar cost estimator.
 */
export function HomeContent({ biz = defaultBiz, children }: { biz?: Biz; children?: ReactNode }) {
  const linen = projectBySlug("the-linen-kitchen")!;
  const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
  const sr = biz.lang === "sr";
  // What the first screen shows (and the section peeking into it) can't wait for Translate.
  const t = (s: string) => (sr ? (srDict[s] ?? s) : s);
  const slide = biz.preview ? { ...SLIDE, place: biz.area } : SLIDE;
  const days = openDays(biz);
  const stats = biz.preview
    ? [
        ...(biz.rating ? [{ value: biz.rating.count, suffix: "", label: L(biz, "Google reviews", "Google recenzija") }] : []),
        ...(days ? [{ value: days, suffix: "", label: L(biz, "Days a week we pick up", "Dana nedeljno radimo") }] : []),
        { value: 1, suffix: "", label: L(biz, "Team, sketch to keys", "Tim, od skice do ključeva") },
        { value: 10, suffix: "", label: L(biz, "Year workmanship warranty", "Godina garancije na izradu") },
      ]
    : STATS;
  const projects = biz.preview ? PROJECTS.filter((p) => !PREVIEW_PROJECT_SKIP.includes(p.slug)) : PROJECTS;
  const faqs = biz.preview ? PREVIEW_FAQS.map((i) => FAQS[i]) : homeFaqs;
  const lede = biz.preview
    ? L(
        biz,
        `Architects, designers and makers under one roof. We renovate homes across ${biz.area}, from the first pencil line to the final coat of wax.`,
        "Projektanti, dizajneri i majstori pod jednim krovom. Renoviramo domove od prve linije olovkom do poslednjeg sloja voska.",
      )
    : "Architects, designers and makers under one roof. We renovate homes across Highland Park, Preston Hollow and DFW, from the first pencil line to the final coat of wax.";

  return (
    <PageShell>
      {children}
      <div className="home-flow">
      {/* ───────── Hero ───────── */}
      <HeroSketch
        slide={slide}
        footer={
          <div className="hero-facts flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line py-5 lg:border-0 lg:py-6">
            <span className="contents phone:hidden">
              <RatingPill />
            </span>
            <span className="hidden phone:contents">
              <RatingPill href="#reviews" />
            </span>
            {biz.phone && (
              <a href={telOf(biz)} className="btn btn-solid hero-call hidden phone:inline-flex">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
                  <path
                    d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
                <span>{t("Call")}</span>
                <span className="tabular">{biz.phoneDisplay}</span>
              </a>
            )}
            <OpenBadge className="hero-open text-muted" />
            {biz.phone && (
              <a href={telOf(biz)} className="label link-draw tabular phone:hidden">
                {biz.phoneDisplay}
              </a>
            )}
          </div>
        }
      >
        <h1>
          <span className="eyebrow mb-4 md:mb-7">
            {biz.preview ? L(biz, `Design-build renovation studio · ${biz.area}`, `Projektovanje i renoviranje · ${biz.area}`) : "Dallas design-build renovation studio"}
          </span>
          {/* Phones lead with the service and the town */}
          <span className="hero-service hidden font-display phone:block">
            {sr ? (
              <>
                Renoviranje domova, <em className="italic-accent">{biz.area}.</em>
              </>
            ) : (
              <>
                Home renovation in <em className="italic-accent">{biz.area}.</em>
              </>
            )}
          </span>
          <Lines
            className="hero-lines mt-3 font-display text-[clamp(3.1rem,6.1vw,7.4rem)] md:mt-6 leading-[0.92] tracking-[-0.03em]"
            lines={
              sr
                ? [
                    "Nacrtano rukom.",
                    "Izgrađeno",
                    <span key="l3">
                      istim <em className="italic-accent">rukama.</em>
                    </span>,
                  ]
                : [
                    "Drawn by hand.",
                    "Built by the",
                    <span key="l3">
                      same <em className="italic-accent">hands.</em>
                    </span>,
                  ]
            }
          />
        </h1>
        <p className="lede mt-5 max-w-md max-md:text-base md:mt-8 phone:hidden">
          {lede}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-9 phone:hidden">
          <Button href="/contact">{t("Book a consultation")}</Button>
          <TextLink href="/work">{t("See the work")}</TextLink>
        </div>
      </HeroSketch>

      {/* ───────── Statement + numbers ───────── */}
      <section className="cv [--cv:445px] shell py-28 md:py-44 phone:order-9 phone:py-6" aria-labelledby="studio-title">
        <div className="grid gap-12 phone:gap-3 lg:grid-cols-12">
          <div className="lg:col-span-3 phone:flex phone:items-center phone:justify-between">
            <p id="studio-title" className="eyebrow">
              The studio
            </p>
            <ScaleBar className="mt-6 phone:mt-0" />
          </div>
          <div className="lg:col-span-9">
            <ScrubWords
              className="display-m statement text-pretty"
              text={
                biz.preview
                  ? L(
                      biz,
                      "We draw your home, build it in our own workshop, and hand you the keys to a house that feels as if it had *always *been *this *way. One team, one contract, one number to call.",
                      "Nacrtamo vaš dom, izradimo ga u sopstvenoj radionici i predamo vam ključeve kuće koja deluje kao da je *oduvek *bila *takva. Jedan tim, jedan ugovor, jedan broj telefona.",
                    )
                  : "We draw your home, build it in our own Design District workshop, and hand you the keys to a house that feels as if it had *always *been *this *way. One team, one contract, one number to call."
              }
            />
            <p className="lede mt-2.5 hidden phone:block phone:text-[0.9375rem]">{lede}</p>
            <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-10 phone:mt-5 phone:grid-cols-2 phone:gap-x-4 phone:gap-y-4 phone:pt-4 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none tabular phone:text-[2.5rem]">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="label mt-3 text-faint phone:mt-1">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───────── Before / after ───────── */}
      <section className="cv [--cv:448px] theme-stone py-24 md:py-36 phone:order-2 phone:py-6" aria-labelledby="ba-title">
        <div className="shell">
          <SectionHead
            align="split"
            eyebrow={biz.preview ? L(biz, "Before & after", "Pre i posle") : "Before & after · University Park"}
            title={
              <SplitReveal id="ba-title" className="display-l">
                A 1984 galley, <em className="italic-accent">set free.</em>
              </SplitReveal>
            }
          >
            {linen.beforeAfter!.caption} Drag the line to compare.
          </SectionHead>
          <Reveal className="mt-14 phone:mt-3.5">
            <BeforeAfter
              before={pic(linen.beforeAfter!.before.key, linen.beforeAfter!.before.alt)}
              after={pic(linen.beforeAfter!.after.key, linen.beforeAfter!.after.alt)}
              beforeLabel="1984"
              afterLabel="2024"
              className="aspect-[4/5] w-full rounded-sm phone:aspect-[3/2] sm:aspect-[16/10] lg:aspect-[16/8]"
              sizes="(min-width: 1680px) 1580px, (max-width: 767.98px) 62vw, 94vw"
            />
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 phone:mt-3 phone:gap-2">
            <p className="label text-faint">
              {biz.preview ? linen.title : `${linen.title} · ${linen.duration} · ${linen.budget}`}
            </p>
            <TextLink href={`/work/${linen.slug}`}>Read the project</TextLink>
          </div>
        </div>
      </section>

      {/* ───────── Services stack ───────── */}
      <section className="cv [--cv:565px] shell py-24 md:py-36 phone:order-4 phone:py-6" aria-labelledby="services-title">
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
        <div className="mt-16 phone:mt-4">
          <ServiceStack
            items={SERVICES.map((s) => ({
              href: `/services/${s.slug}`,
              sheet: s.sheet,
              title: s.title,
              lede: s.lede,
              price: sr ? "Po proceni" : s.price,
              duration: s.duration,
              image: pic(s.hero.key, s.hero.alt),
            }))}
          />
        </div>
      </section>

      {/* ───────── Selected work (horizontal) ───────── */}
      <ProjectReel
        className="cv [--cv:567px] phone:order-1"
        trFirst={sr}
        types={CATEGORIES.map((c) => ({ id: c.id, label: t(c.label) }))}
        allLabel={L(biz, "All", "Sve")}
        items={projects.map((p) => ({
          slug: p.slug,
          title: t(p.title),
          area: biz.preview ? biz.area : p.area,
          year: p.year,
          tag: t(catLabel(p.categories[0])),
          types: p.categories,
          image: pic(p.hero.key, t(p.hero.alt)),
        }))}
        intro={
          <>
            <p className="eyebrow mb-6 phone:mb-2.5">{t("Selected work · 2023 – 2025")}</p>
            <h2 id="reel-title" className="display-xl">
              {t("Homes we’ve")} <em className="italic-accent">{t("drawn")}</em> {t("and built.")}
            </h2>
            <p className="lede mt-6 max-w-sm phone:mt-2 phone:max-w-none">
              {biz.preview ? L(biz, "Recent projects. Scroll sideways through the sheets.", "Nedavni projekti. Prelistajte listove u stranu.") : "Nine recent projects across Dallas and Fort Worth. Scroll sideways through the sheets."}
            </p>
            <div className="mt-8 phone:mt-2.5">
              <TextLink href="/work">{t("All projects")}</TextLink>
            </div>
          </>
        }
      />

      {/* ───────── Journey (pinned) ───────── */}
      <Journey
        className="cv [--cv:659px] phone:order-5"
        stages={STAGES.map((s) => ({ ...s, image: pic(s.image.key, s.image.alt) }))}
        heading={
          <div>
            <p className="eyebrow mb-6 phone:mb-2.5">The renovation journey</p>
            <h2 id="journey-title" className="display-l">
              From a first visit to a finished home, <em className="italic-accent">in five stages.</em>
            </h2>
            <div className="mt-8 phone:mt-2.5">
              <TextLink href="/process" className="text-ivory">
                How we work
              </TextLink>
            </div>
          </div>
        }
      />

      {/* ───────── Workshop film ───────── */}
      <WorkshopFilm className="cv [--cv:288px] phone:order-7">
        <p className="eyebrow mb-6 phone:mb-2.5">{biz.preview ? L(biz, "The workshop", "Radionica") : "The workshop · Design District"}</p>
        <p className="display-l max-w-4xl">
          {biz.preview ? (
            sr ? (
              <>
                Svaki ormarić, vrata i stepenište pravimo <em className="italic-accent">u svojoj</em> radionici.
              </>
            ) : (
              <>
                Every cabinet, door and stair is made <em className="italic-accent">in our own</em> workshop.
              </>
            )
          ) : (
            <>
              Every cabinet, door and stair is made <em className="italic-accent">twelve minutes</em> from your house.
            </>
          )}
        </p>
      </WorkshopFilm>

      {/* ───────── Materials ───────── */}
      <section className="cv [--cv:264px] py-24 md:py-32 phone:order-8 phone:py-6" aria-labelledby="materials-title">
        <div className="shell mb-12 flex flex-col gap-6 phone:mb-4 phone:flex-col phone:items-start phone:gap-2 md:flex-row md:items-end md:justify-between">
          <SplitReveal id="materials-title" className="display-l max-w-3xl">
            Materials chosen to <em className="italic-accent">age,</em> not just to photograph.
          </SplitReveal>
          <p className="max-w-sm text-muted">Every palette is sampled in the light of your own rooms before anything is ordered.</p>
        </div>
        {/* Phones and tablets: the swatch row; desktop: the same samples as a 3D board under a raking light */}
        <div className="lg:hidden">
          <MaterialMarquee items={MATERIALS.map((m) => ({ pic: pic(m.key, m.name), name: m.name }))} />
        </div>
        <div className="shell hidden lg:block">
          <MaterialsBoard names={MATERIALS.map((m) => m.name)} hint={t("Move over the board: the light follows you")} />
        </div>
      </section>

      {!sr && (
        <>
          {/* ───────── Estimator ───────── */}
          <section className="cv [--cv:911px] theme-stone py-24 md:py-36 phone:order-6 phone:py-6" aria-labelledby="estimate-title">
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
                <TextLink href="/estimate" className="mt-4 text-fg phone:mt-1.5">
                  Full estimator
                </TextLink>
              </SectionHead>
              <div className="mt-16 phone:mt-4">
                <Estimator compact />
              </div>
            </div>
          </section>
        </>
      )}

      {/* ───────── Reviews ───────── */}
      <section id="reviews" className="cv [--cv:1308px] py-24 md:py-36 phone:order-3 phone:py-6" aria-labelledby="reviews-title">
        <div className="shell mb-12 phone:mb-3">
          <p className="eyebrow mb-6 phone:mb-2.5">Reviews</p>
          <SplitReveal id="reviews-title" className="display-l max-w-3xl">
            Judged at twelve months, <em className="italic-accent">not at handover.</em>
          </SplitReveal>
        </div>
        <ReviewsRow biz={biz} />
        <div className="shell mt-16 phone:mt-1.5 phone:has-[ul:empty]:hidden">
          <ul className="swipe swipe-trust flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8 phone:flex-nowrap phone:gap-x-4 phone:pt-2.5 phone:whitespace-nowrap">
            {(biz.preview ? [] : TRUST).map((t) => (
              <li key={t} className="label text-muted">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {biz.preview ? (
        <PreviewMap biz={biz} className="cv [--cv:562px] phone:order-12 phone:py-6" />
      ) : (
        <>
          {/* ───────── Areas ───────── */}
          <section className="cv [--cv:562px] theme-stone py-24 md:py-36 phone:order-12 phone:py-6" aria-labelledby="areas-title">
            <div className="shell grid gap-14 phone:grid-cols-[minmax(0,1fr)] phone:gap-3 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-6 phone:mb-2.5">Where we work</p>
                <SplitReveal id="areas-title" className="display-l">
                  Dallas, the Park Cities <em className="italic-accent">&amp; beyond.</em>
                </SplitReveal>
                <p className="lede mt-6 phone:mt-2">
                  A dedicated site lead on every job, never more than forty minutes from the workshop. We know the review boards, the inspectors and the soil.
                </p>
                <div className="mt-8 phone:mt-2.5">
                  <TextLink href="/areas">Service areas</TextLink>
                </div>
              </div>
              <div className="lg:col-span-8">
                <AreaMap pins={AREAS.map((a) => ({ slug: a.slug, short: a.short, name: a.name, x: a.map.x, y: a.map.y, drive: a.drive }))} />
              </div>
            </div>
          </section>
        </>
      )}

      {/* ───────── FAQ ───────── */}
      <section className="cv [--cv:521px] shell grid gap-14 py-24 md:py-36 phone:order-11 phone:gap-3 phone:py-6 lg:grid-cols-12" aria-labelledby="faq-title">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 phone:mb-2.5">Questions</p>
          <SplitReveal id="faq-title" className="display-l">
            Good to <em className="italic-accent">know.</em>
          </SplitReveal>
          <div className="mt-8 phone:mt-2.5">
            <TextLink href="/faq">All questions</TextLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqList items={faqs} />
        </div>
      </section>

      <PhoneTeam biz={biz} className="cv [--cv:352px] phone:order-10" />
      <QuoteSection biz={biz} className="cv [--cv:458px] phone:order-13" />
      </div>
    </PageShell>
  );
}
