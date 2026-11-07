"use client";

import { useEffect, type RefObject } from "react";
import { STILL_MEDIA } from "./media";

/**
 * Phones and touch screens get no pinning, scrubbing, parallax or smooth scrolling, so GSAP and
 * Lenis aren't even downloaded there. Desktop fetches them as soon as this module runs.
 */
export const isStill = () => typeof window !== "undefined" && window.matchMedia(STILL_MEDIA).matches;

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

export type MotionKit = typeof import("./gsap");

let kit: Promise<MotionKit> | null = null;
export const loadKit = () => (kit ??= import("./gsap"));

if (typeof window !== "undefined" && !isStill()) void loadKit();

/** gsap.context's contextSafe: the callback keeps running inside the context. */
export type ContextSafe = <T extends (...args: never[]) => unknown>(fn: T) => T;

/**
 * useGSAP for desktop only: nothing runs (or loads) on a phone. Everything is reverted when the
 * window crosses into phone width, and set up again on the way back.
 */
export function useDesktopGSAP(setup: (kit: MotionKit, contextSafe: ContextSafe) => void | (() => void), { scope }: { scope?: RefObject<Element | null> } = {}) {
  useEffect(() => {
    let run = 0;
    let revert: (() => void) | undefined;
    const sync = () => {
      const id = ++run;
      revert?.();
      revert = undefined;
      if (isStill()) return;
      void loadKit().then((k) => {
        if (id !== run) return;
        const ctx = k.gsap.context((_self, contextSafe) => setup(k, contextSafe as unknown as ContextSafe), scope?.current ?? undefined);
        revert = () => ctx.revert();
      });
    };
    sync();
    const mq = window.matchMedia(STILL_MEDIA);
    mq.addEventListener("change", sync);
    return () => {
      run++;
      mq.removeEventListener("change", sync);
      revert?.();
    };
    // Runs once per mount, like useGSAP without dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
