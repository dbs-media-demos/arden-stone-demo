"use client";

import { useId, useState } from "react";
import clsx from "clsx";

/** Accessible accordion. Answers stay in the DOM (for search engines) and animate with grid rows. */
export function FaqList({ items, className, defaultOpen = 0 }: { items: { q: string; a: string }[]; className?: string; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const id = useId();

  return (
    <div className={clsx("border-t border-line", className)}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left phone:gap-3 phone:py-3 md:py-7"
              >
                <span className="flex gap-5 phone:gap-3">
                  <span className="label pt-2 text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display-s transition-colors group-hover:text-accent">{f.q}</span>
                </span>
                <span className="relative mt-3 h-4 w-4 shrink-0" aria-hidden>
                  <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
                  <span className={clsx("absolute top-0 left-1/2 h-4 w-px bg-current transition-transform duration-500", isOpen && "scale-y-0")} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              className={clsx("grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className={clsx("max-w-2xl pb-8 pl-11 text-muted leading-relaxed transition-opacity duration-500 phone:pb-4 phone:pl-8 phone:text-[0.9375rem] phone:leading-[1.45]", !isOpen && "opacity-0")}>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
