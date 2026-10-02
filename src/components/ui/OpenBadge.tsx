"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { openStatus } from "@/lib/biz-core";
import { useBiz } from "@/components/preview/BizContext";

/** Live "Open now · closes 6 pm" pill, computed in the business's time zone. Server HTML shows the neutral hours. */
export function OpenBadge({ className }: { className?: string }) {
  const biz = useBiz();
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const s = openStatus(biz);
      setStatus(s ? { open: s.open, label: s.text } : null);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [biz]);

  if (!biz.hours) return null;
  return (
    <span className={clsx("inline-flex items-center gap-2 label", className)} aria-live="polite">
      <span className="relative flex h-2 w-2">
        {status?.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/60" />}
        <span className={clsx("relative h-2 w-2 rounded-full", status?.open ? "bg-emerald-600" : status ? "bg-bronze" : "bg-faint")} />
      </span>
      {status?.label ?? biz.hoursSummary}
    </span>
  );
}
