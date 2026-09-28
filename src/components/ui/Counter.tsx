"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Number that counts up once it scrolls into view. The final value is in the HTML. */
export function Counter({ value, suffix = "", prefix = "", className }: { value: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
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
