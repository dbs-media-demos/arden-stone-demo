"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { openStatus } from "@/lib/biz-core";
import { isStill } from "@/lib/motion";
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
    // The first time zone lookup stalls a phone for tens of ms: not in the same task as hydration
    const first = isStill() ? window.setTimeout(tick) : (tick(), 0);
    const id = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [biz]);

  if (!biz.hours) return null;
  return (
    <span className={clsx("inline-flex items-center gap-2 label phone:h-4 phone:max-w-full phone:whitespace-nowrap", className)} aria-live="polite">
      <span className={clsx("relative flex h-2 w-2 phone:shrink-0", !status && "phone:invisible")}>
        {status?.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/60 phone:hidden" />}
        <span className={clsx("relative h-2 w-2 rounded-full", status?.open ? "bg-emerald-600" : status ? "bg-bronze" : "bg-faint")} />
      </span>
      <span className={clsx("phone:truncate", !status && "phone:invisible")}>{status?.label ?? biz.hoursSummary}</span>
    </span>
  );
}
