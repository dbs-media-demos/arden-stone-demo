import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Arrow, TextLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { SERVICES } from "@/data/services";
import { STAGES } from "@/data/studio";
import { pic } from "@/lib/images";
import { breadcrumbSchema, graph, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Renovation Services in Dallas",
  description:
    "Whole-home renovation, kitchens, primary baths, additions and outdoor living, interior design and historic restoration in Dallas and Fort Worth, designed and built by one studio.",
  path: "/services",
  eyebrow: "Services",
  image: "/images/kitchen/warm-white.jpg",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <PageShell>
      <JsonLd data={graph(breadcrumbSchema(crumbs), ...SERVICES.map(serviceSchema))} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Six disciplines · one studio"
        title={["Everything a home", <span key="2">needs, <em className="italic-accent">under one roof.</em></span>]}
        lede="Design, build and interiors practised by the same people, so nothing gets lost between the drawing and the house."
      />

      <section className="shell py-20 md:py-28" aria-label="Services">
        <ol className="grid gap-y-24 md:gap-y-36">
          {SERVICES.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={s.slug} className="grid items-center gap-10 md:grid-cols-12">
                <Link href={`/services/${s.slug}`} data-cursor="Explore" className={flip ? "md:order-2 md:col-span-7 md:col-start-6" : "md:col-span-7"}>
                  <Parallax className="aspect-[4/3] rounded-sm bg-paper">
                    <div className="absolute inset-0">
                      <Img pic={pic(s.hero.key, s.hero.alt)} sizes="(min-width: 768px) 58vw, 100vw" />
                    </div>
                  </Parallax>
                </Link>
                <div className={flip ? "md:order-1 md:col-span-4 md:col-start-1" : "md:col-span-4 md:col-start-9"}>
                  <p className="label text-faint">
                    <span className="mr-3 border border-line-strong px-1.5 py-0.5 text-fg">{s.sheet}</span>
                    {String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                  </p>
                  <SplitReveal className="display-l mt-6">
                    <Link href={`/services/${s.slug}`} className="hover:text-accent">
                      {s.title}
                    </Link>
                  </SplitReveal>
                  <Reveal>
                    <p className="mt-5 leading-relaxed text-muted">{s.lede}</p>
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
                    <div className="mt-8">
                      <TextLink href={`/services/${s.slug}`}>Explore {s.short.toLowerCase()}</TextLink>
                    </div>
                  </Reveal>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="theme-ink py-24 md:py-32" aria-labelledby="how-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6">How every project runs</p>
            <SplitReveal id="how-title" className="display-l">
              Five stages, <em className="italic-accent">one programme.</em>
            </SplitReveal>
          </div>
          <ol className="grid gap-px lg:col-span-8">
            {STAGES.map((s) => (
              <li key={s.n} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-6 md:grid-cols-[4rem_14rem_1fr]">
                <span className="label pt-2 text-bronze-light tabular">{s.n}</span>
                <div>
                  <h3 className="display-s">{s.title}</h3>
                  <p className="label mt-1 text-faint">{s.weeks}</p>
                </div>
                <p className="col-span-2 text-muted md:col-span-1">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-8 lg:col-start-5">
            <Link href="/process" className="group inline-flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.14em] text-ivory uppercase">
              <span className="link-draw pb-1">The full process</span>
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Not sure where to <em className="italic-accent">start?</em>
          </>
        }
        text="Most projects touch more than one discipline. Tell us about the house and we'll suggest the right scope, with an honest budget range."
        image={pic("process/samples", "Hands choosing material samples on a table")}
      />
    </PageShell>
  );
}
