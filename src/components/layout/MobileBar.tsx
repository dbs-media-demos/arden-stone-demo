"use client";

import Link from "next/link";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

/** Sticky bottom bar on phones: call + primary CTA. */
export function MobileBar() {
  const biz = useBiz();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-ink/10 bg-ivory/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <a href={telOf(biz)} className="flex min-h-14 items-center justify-center gap-2.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        Call
      </a>
      <Link href="/contact" className="flex min-h-14 items-center justify-center gap-2 bg-ink text-[0.78rem] font-semibold tracking-[0.12em] text-ivory uppercase">
        Get a quote
      </Link>
    </div>
  );
}
