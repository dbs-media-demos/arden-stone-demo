"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

/** True while the element's top edge is still below the fold (safe to hide for a reveal). */
export const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

/**
 * Runs `cb` once the main thread is idle (after first paint and hydration), so
 * below-the-fold animation setup never delays the LCP. Returns a cancel function.
 */
export function whenIdle(cb: () => void, timeout = 1200) {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 250);
  return () => clearTimeout(id);
}

export { gsap, ScrollTrigger };
