"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling on desktop, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Touch devices keep native momentum scrolling; reduced motion keeps native scrolling.
    if (prefersReducedMotion() || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1, anchors: { offset: -90 } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // New page: re-measure every trigger once the new layout (and fonts/images) settle.
  useEffect(() => {
    window.__lenis?.resize();
    const a = window.setTimeout(() => ScrollTrigger.refresh(), 350);
    const b = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [pathname]);

  return null;
}
