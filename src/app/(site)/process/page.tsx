import { PageShell } from "@/components/layout/PageShell";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { CtaBand } from "@/components/sections/CtaBand";
import { Journey } from "@/components/sections/Journey";
import { PageHero } from "@/components/sections/PageHero";
import { TextLink } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { FAQS, STAGES } from "@/data/studio";
import { pic } from "@/lib/images";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Renovation Process",
  description:
    "How an Arden & Stone renovation runs: consultation, design and 3D, permits and pricing, build and handover. One programme, open-book costs and a site film every Friday.",
  path: "/process",
  eyebrow: "The process",
  image: "/images/process/sketch-warm-white.jpg",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Process", path: "/process" },
];

const PROMISES = [
  { t: "Open-book costs", d: "You see every quote and invoice from every trade. Our fee is a fixed percentage, agreed up front." },
  { t: "A fixed programme", d: "A week-by-week schedule before we start, updated every Friday. 91% of our projects finish on or before the date." },
  { t: "One site lead", d: "The same person on your job every working day, and a project lead who answers the phone." },
  { t: "A clean, protected house", d: "Floor protection, dust walls and HEPA extraction as standard. The site is swept every evening." },
];

export default function ProcessPage() {
  const faqs = [FAQS[3], FAQS[4], FAQS[8], FAQS[9]];
  return (
    <PageShell>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), {
        "@type": "HowTo",
        name: "How an Arden & Stone renovation works",
        step: STAGES.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })),
      })} />
      <PageHero
        crumbs={crumbs}
        eyebrow="The renovation journey"
        title={["From pencil line", <span key="2">to <em className="italic-accent">front door.</em></span>]}
        lede="A renovation is a long relationship. Here is exactly how ours runs, week by week, so there are no surprises."
      />

      <section className="shell py-16 md:py-24" aria-labelledby="drawing-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SplitReveal id="drawing-title" className="display-l lg:col-span-7">
            Every room is drawn <em className="italic-accent">before it&rsquo;s built.</em>
          </SplitReveal>
          <p className="text-muted lg:col-span-4 lg:col-start-9">
            Drag across the kitchen: on the left, the design drawing we signed off with the owners; on the right, the room we handed over sixteen weeks later.
          </p>
        </div>
        <BeforeAfter
          before={pic("process/sketch-warm-white", "Design drawing of the kitchen with island and stools")}
          after={pic("kitchen/warm-white", "The finished kitchen with a stone island and cedar ceiling")}
          beforeLabel="Drawing"
          afterLabel="Built"
          className="mt-12 aspect-[4/5] w-full rounded-sm sm:aspect-[16/10] lg:aspect-[16/8]"
        />
      </section>

      <Journey
        stages={STAGES.map((s) => ({ ...s, image: pic(s.image.key, s.image.alt) }))}
        heading={
          <div>
            <p className="eyebrow mb-6">Five stages</p>
            <h2 id="journey-title" className="display-l">
              Forty weeks, <em className="italic-accent">week by week.</em>
            </h2>
          </div>
        }
      />

      <section className="shell py-24 md:py-32" aria-labelledby="promise-title">
        <p className="eyebrow mb-6">Our promises</p>
        <SplitReveal id="promise-title" className="display-l max-w-3xl">
          What you can <em className="italic-accent">hold us to.</em>
        </SplitReveal>
        <Reveal stagger={0.08} className="mt-14 grid gap-px overflow-hidden rounded-sm bg-line md:grid-cols-2">
          {PROMISES.map((p, i) => (
            <div key={p.t} className="bg-bg p-8 md:p-12">
              <p className="label text-faint tabular">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display-m mt-4">{p.t}</h3>
              <p className="mt-4 max-w-md text-muted leading-relaxed">{p.d}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="shell grid gap-14 pb-12 lg:grid-cols-12" aria-labelledby="pfaq-title">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">Questions</p>
          <SplitReveal id="pfaq-title" className="display-l">
            Before you <em className="italic-accent">begin.</em>
          </SplitReveal>
          <div className="mt-8">
            <TextLink href="/estimate">Estimate your project</TextLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqList items={faqs} />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Stage one is a <em className="italic-accent">conversation.</em>
          </>
        }
        text="Free, ninety minutes, in your home. Bring photos, plans or nothing at all."
        image={pic("process/drafting", "Architect drafting a plan with a scale rule")}
      />
    </PageShell>
  );
}
