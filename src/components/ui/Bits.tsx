import clsx from "clsx";
import type { ReactNode } from "react";

/** Five stars, filled to `value`. */
export function Stars({ value = 5, className }: { value?: number; className?: string }) {
  return (
    <span className={clsx("inline-flex gap-0.5 text-bronze", className)} aria-label={`${value} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z"
            fill={i < Math.round(value) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      ))}
    </span>
  );
}

/** Architect's sheet tag: "A-210 · Kitchens". */
export function Sheet({ n, children, className }: { n: string; children?: ReactNode; className?: string }) {
  return (
    <span className={clsx("label inline-flex items-center gap-3 text-faint", className)}>
      <span className="border border-line-strong px-1.5 py-0.5 text-fg">{n}</span>
      {children}
    </span>
  );
}

/** Section heading block used across pages. */
export function SectionHead({
  eyebrow,
  title,
  children,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "left" | "split";
}) {
  return (
    <div className={clsx(align === "split" ? "grid gap-8 md:grid-cols-12 md:items-end" : "max-w-4xl", className)}>
      <div className={align === "split" ? "md:col-span-7" : undefined}>
        {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
        {title}
      </div>
      {children && <div className={clsx(align === "split" ? "md:col-span-4 md:col-start-9" : "mt-6", "lede")}>{children}</div>}
    </div>
  );
}

/** Scale bar ornament (0 · 1 · 2 · 5 m), drawn like the corner of a plan. */
export function ScaleBar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 18" className={clsx("h-4 w-28 text-faint", className)} aria-hidden>
      <path d="M1 12h118" stroke="currentColor" strokeWidth=".8" />
      <path d="M1 8v8M25 10v4M49 8v8M119 8v8" stroke="currentColor" strokeWidth=".8" />
      <rect x="1" y="10.5" width="24" height="3" fill="currentColor" />
      <rect x="49" y="10.5" width="35" height="3" fill="currentColor" />
      <text x="1" y="6" fontSize="5.5" fill="currentColor" fontFamily="monospace">0</text>
      <text x="47" y="6" fontSize="5.5" fill="currentColor" fontFamily="monospace">2</text>
      <text x="113" y="6" fontSize="5.5" fill="currentColor" fontFamily="monospace">5m</text>
    </svg>
  );
}

export { RatingPill } from "./RatingPill";
