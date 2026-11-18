"use client";

import { useEffect, useState, type ComponentType } from "react";

type Props = { position?: string };

/** HeroBuild is desktop only: phones and tablets never download it. Fetched after hydration; the build starts at 2.9 s. */
export function HeroBuildLazy(props: Props) {
  const [Build, setBuild] = useState<ComponentType<Props> | null>(null);
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let on = true;
    void import("./HeroBuild").then((m) => on && setBuild(() => m.HeroBuild));
    return () => {
      on = false;
    };
  }, []);
  return Build ? <Build {...props} /> : null;
}
