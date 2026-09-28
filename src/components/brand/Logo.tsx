import clsx from "clsx";

/** The mark: an arched doorway (Arden) standing on a dressed stone block (Stone). */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M13 38V21.5a11 11 0 0 1 22 0V38" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18.5 38V22.5a5.5 5.5 0 0 1 11 0V38" fill="none" stroke="currentColor" strokeWidth="1.1" opacity=".55" />
      <path d="M22.4 9.2h3.2l-.5 3.4h-2.2z" fill="var(--mark-accent, #986b3e)" />
      <rect x="8" y="38" width="32" height="5.5" fill="var(--mark-accent, #986b3e)" />
      <path d="M19 38v5.5M29 38v5.5" stroke="var(--ivory, #f8f6f2)" strokeWidth=".9" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <Mark className="h-8 w-8 shrink-0" />
      {!compact && (
        <span className="font-display text-[1.45rem] leading-none tracking-[0.02em] whitespace-nowrap">
          Arden <em className="italic text-bronze">&amp;</em> Stone
        </span>
      )}
    </span>
  );
}
