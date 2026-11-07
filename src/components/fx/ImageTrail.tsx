"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { isTouch, prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";
import type { Pic } from "@/lib/images";

/** Photos that bloom and fall away behind the pointer as it crosses the area (desktop). */
export function ImageTrail({ pics, children, className }: { pics: Pic[]; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useDesktopGSAP(
    ({ gsap }) => {
      const root = ref.current;
      if (!root || isTouch() || prefersReducedMotion()) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-trail]"));
      let i = 0;
      let z = 1;
      let last = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (Math.hypot(x - last.x, y - last.y) < 110) return;
        last = { x, y };
        const el = items[i % items.length];
        i++;
        gsap.killTweensOf(el);
        gsap
          .timeline()
          .set(el, { x: x - el.offsetWidth / 2, y: y - el.offsetHeight / 2, zIndex: z++, opacity: 1, scale: 0.6, rotate: gsap.utils.random(-8, 8) })
          .to(el, { scale: 1, duration: 0.6, ease: "expo.out" })
          .to(el, { opacity: 0, scale: 0.85, y: `+=${60}`, duration: 0.9, ease: "power2.in" }, 0.55);
      };
      root.addEventListener("pointermove", onMove);
      return () => root.removeEventListener("pointermove", onMove);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden still:hidden" aria-hidden>
        {pics.map((p) => (
          <div key={p.src} data-trail className="absolute top-0 left-0 aspect-[4/5] w-44 overflow-hidden opacity-0 md:w-56">
            <Image src={p.src} alt="" fill sizes="224px" quality={60} className="object-cover" />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
