"use client";

import { useRef } from "react";
import { prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";

/** Number that counts up once it scrolls into view (desktop). The final value is in the HTML; phones just show it. */
export function Counter({ value, suffix = "", prefix = "", className }: { value: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useDesktopGSAP(
    ({ gsap, ScrollTrigger, whenIdle }, contextSafe) => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      return whenIdle(
        contextSafe(() => {
          const obj = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () =>
              gsap.to(obj, {
                v: value,
                duration: 2.2,
                ease: "expo.out",
                onUpdate: () => {
                  el.textContent = `${prefix}${Math.round(obj.v).toLocaleString("en-US")}${suffix}`;
                },
              }),
          });
        }),
      );
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
