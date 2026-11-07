import clsx from "clsx";
import { RatingPill, Stars } from "@/components/ui/Bits";
import { REVIEWS, type Review } from "@/data/studio";
import { defaultBiz } from "@/lib/biz";
import { L, num, type Biz } from "@/lib/biz-core";

function Card({ r, className, area }: { r: Review; className?: string; area?: string }) {
  return (
    <figure className={clsx("flex h-full flex-col justify-between rounded-sm border border-line bg-bg p-7 phone:p-4", className)}>
      <div>
        <div className="flex items-center justify-between">
          <Stars value={r.rating} />
          <span className="label text-faint">{r.date}</span>
        </div>
        <blockquote className="mt-5 text-[1.02rem] leading-relaxed text-fg/90 phone:mt-2 phone:text-[0.9375rem] phone:leading-[1.45]">&ldquo;{r.text}&rdquo;</blockquote>
      </div>
      <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5 phone:mt-3 phone:pt-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface font-display text-lg phone:h-9 phone:w-9 phone:shrink-0" aria-hidden>
          {r.name[0]}
        </span>
        <span className="phone:min-w-0">
          <span className="block font-medium">{r.name}</span>
          <span className="label text-faint">
            {area ?? r.area} · {r.project}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Horizontal swipe/drag row of review cards with the Google-style summary. Phones: the first three in full, then the rest in a swipe row. */
const PREVIEW_REVIEWS = ["Catherine M.", "Marcus F.", "James T.", "Brian O.", "Nadia L.", "Tom & Grace P."];
const PHONE_STACKED = 3;

export function ReviewsRow({ count = 8, biz = defaultBiz }: { count?: number; biz?: Biz }) {
  const list = biz.preview ? REVIEWS.filter((r) => PREVIEW_REVIEWS.includes(r.name)) : REVIEWS.slice(0, count);
  const area = biz.preview ? biz.area : undefined;
  const item = (r: Review, stacked?: boolean) => (
    <li key={r.name} className={clsx("w-[84vw] shrink-0 snap-start sm:w-[46vw] lg:w-[28vw]", stacked && "cv [--cv:237px]")}>
      <Card r={r} area={area} />
    </li>
  );
  return (
    <div>
      <div className="shell flex flex-col gap-6 phone:gap-3 md:flex-row md:items-end md:justify-between phone:flex-col phone:items-start">
        {biz.rating && (
          <div className="phone:flex phone:items-center phone:gap-3">
            <p className="font-display text-[clamp(4rem,9vw,8rem)] leading-none tabular phone:text-[2.75rem]">{num(biz, biz.rating.value)}</p>
            <RatingPill className="mt-3 phone:mt-0" />
          </div>
        )}
        <p className="max-w-sm text-muted phone:max-w-none phone:text-[0.9375rem] phone:leading-[1.45]">
          {biz.preview
            ? L(biz, "Sample reviews, to show how yours would look here.", "Primeri recenzija, da vidite kako bi vaše izgledale ovde.")
            : "Every review is from a finished project. We ask each client once, at the 12-month visit, when the house has had time to prove itself."}
        </p>
      </div>
      {/* On desktop both lists dissolve (display: contents), so the cards are one row. */}
      <div data-cursor="Drag" data-lenis-prevent-wheel className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 phone:mt-4 phone:block phone:overflow-visible phone:p-0" aria-label="Client reviews" role="group">
        <ul className="contents phone:grid phone:gap-2.5 phone:px-[var(--gutter)] [&>li]:phone:w-auto">{list.slice(0, PHONE_STACKED).map((r) => item(r, true))}</ul>
        <ul className="cv [--cv:283px] contents phone:mt-2.5 phone:flex swipe swipe-wide">{list.slice(PHONE_STACKED).map((r) => item(r))}</ul>
      </div>
    </div>
  );
}

export function ReviewsGrid() {
  return (
    <ul className="columns-1 gap-4 md:columns-2 xl:columns-3">
      {REVIEWS.map((r) => (
        <li key={r.name} className="mb-4 break-inside-avoid">
          <Card r={r} />
        </li>
      ))}
    </ul>
  );
}
