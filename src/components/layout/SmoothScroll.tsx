"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { isStill, loadKit, prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling on desktop, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Touch devices keep native momentum scrolling (and never download Lenis); reduced motion keeps native scrolling.
    if (prefersReducedMotion() || isStill()) return;
    let dead = false;
    let stop: (() => void) | undefined;
    void Promise.all([loadKit(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: LenisClass }]) => {
      if (dead) return;
      const lenis = new LenisClass({ lerp: 0.095, wheelMultiplier: 1, anchors: { offset: -90 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
      };
    });
    return () => {
      dead = true;
      stop?.();
    };
  }, []);

  // New page: re-measure every trigger once the new layout (and fonts/images) settle.
  useEffect(() => {
    if (isStill()) return;
    window.__lenis?.resize();
    const refresh = () => void loadKit().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    const a = window.setTimeout(refresh, 350);
    const b = window.setTimeout(refresh, 1200);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [pathname]);

  return null;
}
