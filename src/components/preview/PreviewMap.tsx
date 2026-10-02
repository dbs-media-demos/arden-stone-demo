import { SplitReveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { DAY_NAMES, L, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";

/** A preview's "where we work": the business's real address on a Google map, hours and directions. */
export function PreviewMap({ biz }: { biz: Biz }) {
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section className="theme-stone py-24 md:py-36" aria-labelledby="areas-title">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">{L(biz, "Where we work", "Gde radimo")}</p>
          <SplitReveal id="areas-title" className="display-l">
            {biz.lang === "sr" ? (
              <>
                Svratite <em className="italic-accent">do nas.</em>
              </>
            ) : (
              <>
                {biz.area} <em className="italic-accent">&amp; around.</em>
              </>
            )}
          </SplitReveal>
          {biz.address.full && <p className="lede mt-6">{biz.address.full}</p>}
          <div className="mt-8">
            <OpenBadge className="text-muted" />
            {biz.hours && (
              <dl className="mt-4 grid max-w-sm grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 text-sm">
                {weekFromMonday(biz.hours).map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-muted">{DAY_NAMES[biz.lang][h.day]}</dt>
                    <dd className="text-right tabular">{dayRange(h, biz.lang)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="mt-8">
            <Button href={directions} variant="line" arrow={false}>
              {L(biz, "Get directions", "Kako do nas")}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
            <iframe src={embed} title={L(biz, `Map: ${query}`, `Mapa: ${query}`)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
