"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { studioStatus } from "@/lib/hours";

/** Live "Open now · closes 6 pm" pill, computed in Dallas time. Server HTML shows the neutral hours. */
export function OpenBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const tick = () => setStatus(studioStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={clsx("inline-flex items-center gap-2 label", className)} aria-live="polite">
      <span className="relative flex h-2 w-2">
        {status?.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/60" />}
        <span className={clsx("relative h-2 w-2 rounded-full", status?.open ? "bg-emerald-600" : status ? "bg-bronze" : "bg-faint")} />
      </span>
      {status?.label ?? "Mon – Fri 8 am – 6 pm · Sat 9 am – 1 pm"}
    </span>
  );
}
