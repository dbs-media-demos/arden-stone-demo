"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useBiz, useT } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

/** Sticky bottom bar on phones: call (with the number) + primary CTA, which lands on the homepage's form. */
export function MobileBar() {
  const biz = useBiz();
  const t = useT();
  const pathname = usePathname();
  const home = pathname === "/" || pathname.startsWith("/for/");
  return (
    <div className={clsx("mobile-bar fixed inset-x-0 bottom-0 z-50 grid border-t border-ink/10 bg-ivory pb-[env(safe-area-inset-bottom)] md:hidden phone:grid", biz.phone ? "grid-cols-2" : "grid-cols-1")}>
      {biz.phone && (
        <a href={telOf(biz)} className="flex min-h-14 min-w-0 items-center justify-center gap-2.5 px-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
            <path
              d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          <span className="min-w-0 text-left leading-tight">
            <span className="block text-[0.625rem] font-semibold tracking-[0.14em] uppercase">{t("Call")}</span>
            <span className="block truncate text-[0.8125rem] font-medium tabular">{biz.phoneDisplay}</span>
          </span>
        </a>
      )}
      <Link href={home ? "#quote" : "/contact"} className="flex min-h-14 items-center justify-center gap-2 bg-ink text-[0.78rem] font-semibold tracking-[0.12em] text-ivory uppercase">
        {t("Get a quote")}
      </Link>
    </div>
  );
}
