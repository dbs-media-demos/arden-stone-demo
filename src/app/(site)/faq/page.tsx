import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { SERVICES } from "@/data/services";
import { FAQS } from "@/data/studio";
import { pic } from "@/lib/images";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Renovation FAQ",
  description:
    "Answers about renovating with Arden & Stone in Dallas: costs, timelines, permits, HOA and Landmark approvals, warranties, payments and living at home during the work.",
  path: "/faq",
  eyebrow: "Questions & answers",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  const byService = SERVICES.flatMap((s) => s.faqs);
  return (
    <PageShell>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema([...FAQS, ...byService]))} />
      <PageHero
        crumbs={crumbs}
        eyebrow="FAQ"
        title={["Good questions,", <em key="2" className="italic-accent">straight answers.</em>]}
        lede="If yours isn't here, call the studio. A person who works on projects will answer."
      />
      <section className="shell grid gap-14 py-16 md:py-24 lg:grid-cols-12" aria-labelledby="general">
        <h2 id="general" className="label text-faint lg:col-span-3">
          Working with us
        </h2>
        <div className="lg:col-span-9">
          <FaqList items={FAQS} />
        </div>
      </section>
      <section className="shell grid gap-14 pb-16 md:pb-24 lg:grid-cols-12" aria-labelledby="by-service">
        <h2 id="by-service" className="label text-faint lg:col-span-3">
          By service
        </h2>
        <div className="lg:col-span-9">
          <FaqList items={byService} defaultOpen={null} />
        </div>
      </section>
      <CtaBand
        title={
          <>
            Still <em className="italic-accent">wondering?</em>
          </>
        }
        text="Ask us in person. The first consultation is free and there's no obligation."
        image={pic("process/scale-rule", "Architect at a drawing table with a scale rule")}
      />
    </PageShell>
  );
}
