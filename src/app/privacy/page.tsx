import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Arden & Stone handles the information you share through this website, by phone or in person.",
  path: "/privacy",
  eyebrow: "Privacy",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

const SECTIONS: [string, string[]][] = [
  [
    "About this site",
    [
      `This website is a concept design by DBS Media for a fictional studio, ${site.name}. The contact form does not send or store anything, and no account, tracking or advertising cookies are used.`,
      "The policy below shows the kind of plain-English privacy notice we write for real clients.",
    ],
  ],
  [
    "What we collect",
    [
      "When you request a consultation we collect your name, email, phone number, the neighborhood or ZIP code of your home, and the details you choose to share about your project.",
      "During a project we keep drawings, photographs and specifications of your home. We never publish photographs of your home without written permission, and never publish your address.",
    ],
  ],
  [
    "How we use it",
    [
      "Only to reply to you, arrange a visit, prepare proposals and run your project. We don't sell or rent personal information, and we don't use it for third-party advertising.",
      "We share details with the trades, engineers and suppliers working on your project only as far as they need to do their work.",
    ],
  ],
  [
    "How long we keep it",
    [
      "Enquiries that don't become projects are deleted after 24 months. Project records are kept for ten years to support our workmanship warranty.",
    ],
  ],
  [
    "Your choices",
    [
      `You can ask to see, correct or delete the information we hold about you at any time by emailing ${site.email} or calling ${site.phone}. We reply within 30 days.`,
    ],
  ],
  ["Updates", ["Last updated September 2026. We'll post any changes on this page."]],
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero crumbs={crumbs} eyebrow="Privacy policy" title={["Your information,", <em key="2" className="italic-accent">handled with care.</em>]} />
      <section className="shell py-16 md:py-24" aria-label="Policy">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="grid gap-12 lg:col-span-8 lg:col-start-3">
            {SECTIONS.map(([h, ps], i) => (
              <div key={h} className="grid gap-4 border-t border-line pt-8 md:grid-cols-[4rem_1fr]">
                <span className="label text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="display-s">{h}</h2>
                  {ps.map((p) => (
                    <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
