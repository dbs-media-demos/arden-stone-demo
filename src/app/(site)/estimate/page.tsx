import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { Estimator } from "@/components/sections/Estimator";
import { PageHero } from "@/components/sections/PageHero";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { SplitReveal } from "@/components/ui/Reveal";
import { FINISHES, ROOMS } from "@/data/estimator";
import { pic } from "@/lib/images";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Renovation Cost Estimator for Dallas Homes",
  description:
    "How much does a kitchen, bathroom or whole-home renovation cost in Dallas? Pick the room, size and finish level for an instant 2026 price range and timeline.",
  path: "/estimate",
  eyebrow: "Cost estimator",
  image: "/images/material/marble.jpg",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Estimate", path: "/estimate" },
];

const FAQ = [
  { q: "How accurate is the estimator?", a: "It's based on our completed Dallas projects from the last three years. Nine in ten land inside the range shown. Your fixed price comes after the design phase, once every material is chosen." },
  { q: "What's included in the range?", a: "Design, engineering, permits, construction, finishes, our project management and fee. Furniture, appliances above standard allowances and landscaping outside the work area are not included." },
  { q: "Why do historic homes cost more?", a: "Conservation-district approvals, hand restoration of original windows and plaster, and careful routing of new systems through old walls all take more time." },
  { q: "Do you offer financing?", a: "We work with two local lenders who offer renovation loans and HELOCs, and can introduce you during the design phase." },
];

export default function EstimatePage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(breadcrumbSchema(crumbs), faqSchema(FAQ), {
          "@type": "WebApplication",
          name: "Arden & Stone renovation cost estimator",
          url: absoluteUrl("/estimate"),
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
        })}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Cost estimator · 2026 Dallas prices"
        title={["What will it", <em key="2" className="italic-accent">really cost?</em>]}
        lede="An honest range in ten seconds. Pick the room, the size and the finish level; we'll show the budget and time on site we'd expect."
      />
      <section className="shell py-16 md:py-24" aria-label="Estimator">
        <Estimator />
      </section>

      <section className="theme-stone py-24 md:py-32" aria-labelledby="rates-title">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6">The numbers behind it</p>
            <SplitReveal id="rates-title" className="display-l">
              Typical rates, <em className="italic-accent">per square foot.</em>
            </SplitReveal>
          </div>
          <div className="overflow-x-auto lg:col-span-8">
            <table className="w-full min-w-[540px] text-left">
              <caption className="sr-only">Typical cost per square foot by room type and finish level</caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="label py-4 font-normal text-faint">
                    Room
                  </th>
                  {FINISHES.map((f) => (
                    <th key={f.id} scope="col" className="label py-4 text-right font-normal text-faint">
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROOMS.map((r) => (
                  <tr key={r.id} className="border-b border-line">
                    <th scope="row" className="py-4 font-display text-2xl font-normal">
                      {r.label}
                    </th>
                    {FINISHES.map((f) => (
                      <td key={f.id} className="py-4 text-right tabular">
                        ${Math.round(r.rate * f.factor).toLocaleString("en-US")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="shell grid gap-14 py-24 lg:grid-cols-12" aria-labelledby="efaq-title">
        <div className="lg:col-span-4">
          <SplitReveal id="efaq-title" className="display-l">
            About the <em className="italic-accent">numbers.</em>
          </SplitReveal>
        </div>
        <div className="lg:col-span-8">
          <FaqList items={FAQ} />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Turn the range into a <em className="italic-accent">price.</em>
          </>
        }
        text="After a free home visit and the design phase, you get a fixed, open-book price for every line of the work."
        image={pic("process/plan-pens", "Floor plan with drafting pens")}
      />
    </PageShell>
  );
}
