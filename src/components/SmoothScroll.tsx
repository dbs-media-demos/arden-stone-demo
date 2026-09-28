"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { scroll } from "@/lib/scroll";

/**
 * Lenis-powered inertia scrolling for the whole site. The instance is shared
 * via `scroll.lenis` so the page-transition scroll reset, the preloader and
 * the mobile menu can pause / reposition it.
 */
const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      anchors: true,
    });
    scroll.lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      scroll.lenis = null;
    };
  }, []);

  return null;
};

export default SmoothScroll;
