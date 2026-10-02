import clsx from "clsx";
import { RatingPill, Stars } from "@/components/ui/Bits";
import { REVIEWS, type Review } from "@/data/studio";
import { defaultBiz } from "@/lib/biz";
import { L, num, type Biz } from "@/lib/biz-core";

function Card({ r, className, area }: { r: Review; className?: string; area?: string }) {
  return (
    <figure className={clsx("flex h-full flex-col justify-between rounded-sm border border-line bg-bg p-7", className)}>
      <div>
        <div className="flex items-center justify-between">
          <Stars value={r.rating} />
          <span className="label text-faint">{r.date}</span>
        </div>
        <blockquote className="mt-5 text-[1.02rem] leading-relaxed text-fg/90">&ldquo;{r.text}&rdquo;</blockquote>
      </div>
      <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface font-display text-lg" aria-hidden>
          {r.name[0]}
        </span>
        <span>
          <span className="block font-medium">{r.name}</span>
          <span className="label text-faint">
            {area ?? r.area} · {r.project}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Horizontal swipe/drag row of review cards with the Google-style summary. */
const PREVIEW_REVIEWS = ["Catherine M.", "Marcus F.", "James T.", "Brian O.", "Nadia L.", "Tom & Grace P."];

export function ReviewsRow({ count = 8, biz = defaultBiz }: { count?: number; biz?: Biz }) {
  const list = biz.preview ? REVIEWS.filter((r) => PREVIEW_REVIEWS.includes(r.name)) : REVIEWS.slice(0, count);
  const area = biz.preview ? biz.area : undefined;
  return (
    <div>
      <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {biz.rating && (
          <div>
            <p className="font-display text-[clamp(4rem,9vw,8rem)] leading-none tabular">{num(biz, biz.rating.value)}</p>
            <RatingPill className="mt-3" />
          </div>
        )}
        <p className="max-w-sm text-muted">
          {biz.preview
            ? L(biz, "Sample reviews, to show how yours would look here.", "Primeri recenzija, da vidite kako bi vaše izgledale ovde.")
            : "Every review is from a finished project. We ask each client once, at the 12-month visit, when the house has had time to prove itself."}
        </p>
      </div>
      <ul data-cursor="Drag" data-lenis-prevent-wheel className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4" aria-label="Client reviews">
        {list.map((r) => (
          <li key={r.name} className="w-[84vw] shrink-0 snap-start sm:w-[46vw] lg:w-[28vw]">
            <Card r={r} area={area} />
          </li>
        ))}
      </ul>
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
