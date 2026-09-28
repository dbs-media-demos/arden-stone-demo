import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

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

/** Google-style rating summary pill. */
export function RatingPill({ className }: { className?: string }) {
  return (
    <Link href="/reviews" className={clsx("inline-flex items-center gap-3 label", className)}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
        <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7H2.1a11 11 0 0 0 0 9.9z" />
        <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z" />
      </svg>
      <span className="tabular">{site.rating.value.toFixed(1)}</span>
      <Stars value={site.rating.value} />
      <span className="text-muted normal-case tracking-normal font-sans text-[0.8rem]">{site.rating.count} Google reviews</span>
    </Link>
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
