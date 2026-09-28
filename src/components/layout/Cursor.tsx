"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * A soft ring that trails the pointer and grows into a labelled disc over
 * elements marked `data-cursor="View"` (or "Drag", "Play"…). The native cursor stays visible.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let current: string | null = null;
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      const next = target?.getAttribute("data-cursor") || null;
      if (next !== current) {
        current = next;
        setLabel(next);
      }
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="cursor pointer-events-none fixed top-0 left-0 z-[95] opacity-0 transition-opacity duration-300">
      <div
        className={
          "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] " +
          (label ? "h-24 w-24 bg-ink/90 text-ivory backdrop-blur-sm" : "h-8 w-8 border border-ink/35")
        }
      >
        <span className={"label text-[0.65rem] transition-opacity duration-300 " + (label ? "opacity-100" : "opacity-0")}>{label}</span>
      </div>
    </div>
  );
}
