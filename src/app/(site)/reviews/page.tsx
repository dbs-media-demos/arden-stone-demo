import { PageShell } from "@/components/layout/PageShell";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ReviewsGrid } from "@/components/sections/Reviews";
import { RatingPill } from "@/components/ui/Bits";
import { JsonLd } from "@/components/ui/JsonLd";
import { REVIEWS } from "@/data/studio";
import { pic } from "@/lib/images";
import { breadcrumbSchema, businessId, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Client Reviews",
  description: `Rated ${site.rating.value} from ${site.rating.count} Google reviews. What Dallas homeowners say about renovating with Arden & Stone, twelve months after handover.`,
  path: "/reviews",
  eyebrow: `${site.rating.value} ★ · ${site.rating.count} reviews`,
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Reviews", path: "/reviews" },
];

const dist = [
  { stars: 5, n: 119 },
  { stars: 4, n: 6 },
  { stars: 3, n: 2 },
  { stars: 2, n: 0 },
  { stars: 1, n: 0 },
];

export default function ReviewsPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(breadcrumbSchema(crumbs), {
          "@id": businessId,
          "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
          name: site.name,
          aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5 },
          review: REVIEWS.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.text,
          })),
        })}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Reviews"
        title={["Judged at twelve", <span key="2">months, <em className="italic-accent">not at handover.</em></span>]}
        lede="We ask every client for a review once, at the 12-month care visit, when the house has had a year to prove itself."
        aside={
          <div className="mt-8 border-t border-line pt-6">
            <p className="font-display text-7xl leading-none tabular">{site.rating.value.toFixed(1)}</p>
            <RatingPill className="mt-3" />
            <ul className="mt-6 grid gap-2">
              {dist.map((d) => (
                <li key={d.stars} className="flex items-center gap-3 text-sm">
                  <span className="label w-6 tabular">{d.stars}★</span>
                  <span className="h-1 flex-1 bg-line">
                    <span className="block h-full bg-bronze" style={{ width: `${(d.n / site.rating.count) * 100}%` }} />
                  </span>
                  <span className="label w-8 text-right text-faint tabular">{d.n}</span>
                </li>
              ))}
            </ul>
          </div>
        }
      />
      <section className="shell py-16 md:py-24" aria-label="All reviews">
        <ReviewsGrid />
      </section>
      <CtaBand
        title={
          <>
            Become our next <em className="italic-accent">review.</em>
          </>
        }
        text="Start with a free home visit. We'll be back at twelve months to make sure you still love it."
        image={pic("living/traditional", "Sunlit sitting room with a curved sofa")}
      />
    </PageShell>
  );
}
