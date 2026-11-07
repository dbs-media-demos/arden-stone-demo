"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isStill, prefersReducedMotion } from "@/lib/motion";

/**
 * One small fade-and-rise per section on phones, once. A section is only hidden just before it
 * scrolls into view, so everything stays visible until then: without JS, for crawlers and in
 * reduced-motion mode nothing ever hides.
 */
export function PhoneRise() {
  const pathname = usePathname();

  // The page is live; and a jump across it needs the real heights of everything it passes, not .cv's estimates.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.live = "";
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.('a[href^="#"]')) root.dataset.full = "";
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // What .cv held back still gets rendered, nearest first, one piece per idle moment: from then on the page is whole.
  useEffect(() => {
    if (!isStill()) return;
    const hasIdle = "requestIdleCallback" in window;
    const later = (cb: () => void) => (hasIdle ? window.requestIdleCallback(cb, { timeout: 1500 }) : window.setTimeout(cb, 60));
    let left: HTMLElement[] | null = null;
    let id = 0;
    const next = () => {
      left ??= [...document.querySelectorAll<HTMLElement>(".cv, .reel-rail")].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      const el = left.shift();
      if (!el) return;
      el.style.contentVisibility = "visible";
      id = later(next);
    };
    id = later(next);
    return () => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, [pathname]);

  useEffect(() => {
    if (!isStill() || prefersReducedMotion()) return;
    const show = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          show.unobserve(target);
          target.classList.add("rise-in");
          target.classList.remove("rise-wait");
          target.addEventListener("transitionend", () => target.classList.remove("rise-in"), { once: true });
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    const arm = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting, boundingClientRect } of entries) {
          if (!isIntersecting) continue;
          arm.unobserve(target);
          // Already on screen (first load, a fast flick): leave it alone
          if (boundingClientRect.top < window.innerHeight) continue;
          target.classList.add("rise-wait");
          show.observe(target);
        }
      },
      { rootMargin: "0px 0px 500px 0px" },
    );
    document.querySelectorAll("main section:not([data-hero])").forEach((s) => arm.observe(s));
    return () => {
      arm.disconnect();
      show.disconnect();
      document.querySelectorAll(".rise-wait, .rise-in").forEach((s) => s.classList.remove("rise-wait", "rise-in"));
    };
  }, [pathname]);

  return null;
}
