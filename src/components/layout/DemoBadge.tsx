"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const KEY = "as-demo-badge-dismissed";

/** Small fixed pill marking this as a DBS Media concept site. */
export function DemoBadge() {
  const [shown, setShown] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) setShown(false);
    } catch {}
  }, []);

  if (!shown) return null;

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-3 z-[60] flex items-center overflow-hidden rounded-full border border-ivory/15 bg-ink/90 text-ivory shadow-lg backdrop-blur md:bottom-4 md:left-4">
      <a href={site.dbs} target="_blank" rel="noopener" className="flex min-h-9 items-center gap-2 py-2 pr-2 pl-3.5 text-[0.72rem] font-medium tracking-wide hover:text-bronze-light">
        <span className="h-1.5 w-1.5 rounded-full bg-bronze-light" aria-hidden />
        Concept site by DBS Media <span aria-hidden>↗</span>
      </a>
      <button
        type="button"
        aria-label="Dismiss concept site notice"
        onClick={() => {
          setShown(false);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        className="flex h-9 w-9 items-center justify-center border-l border-ivory/15 text-ivory/70 hover:text-ivory"
      >
        <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden>
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
    </div>
  );
}
