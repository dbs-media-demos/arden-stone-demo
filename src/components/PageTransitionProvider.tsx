"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import FrozenRouter from "./FrozenRouter";
import { SITE_NAME } from "@/lib/site";
import { scroll } from "@/lib/scroll";

const EASE = [0.76, 0, 0.24, 1] as const;
const EXIT_DURATION = 0.6;

/** Resets scroll when the incoming route mounts (after the previous one exits). */
const ScrollReset = () => {
  useEffect(() => {
    if (scroll.lenis) {
      scroll.lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);
  return null;
};

/**
 * Curtain-style route transitions.
 *
 * Leave: the page sinks and dims while an ink curtain sweeps up from the
 * bottom and the wordmark fades in over it.
 * Enter: the new page mounts already covered by ink; the curtain continues
 * upward off-screen while the content lifts into place.
 *
 * The enter curtain deliberately has no `exit` prop — once it has swept away
 * it must stay parked off-screen, or it would flash back over the page and
 * mask the leave animation.
 */
const PageTransitionProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Page content: lifts in under the curtain, sinks + dims on leave */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
          exit={{
            opacity: 0.4,
            y: 60,
            scale: 0.985,
            transition: { duration: EXIT_DURATION, ease: EASE },
          }}
        >
          <ScrollReset />
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>

        {/* Enter curtain: covers the screen on mount, sweeps up and stays gone */}
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
          initial={{ y: 0 }}
          animate={{ y: "-100%", transition: { duration: 0.7, delay: 0.15, ease: EASE } }}
          style={{ pointerEvents: "none" }}
        >
          <motion.span
            className="font-display text-2xl tracking-[0.25em] uppercase text-ivory/80"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30, transition: { duration: 0.35, delay: 0.15, ease: EASE } }}
          >
            {SITE_NAME}
          </motion.span>
        </motion.div>

        {/* Leave curtain: parked below the viewport, sweeps up over the dying page */}
        <motion.div
          className="fixed inset-0 z-[91] flex items-center justify-center bg-ink"
          initial={{ y: "100%" }}
          animate={{ y: "100%" }}
          exit={{ y: 0, transition: { duration: EXIT_DURATION, ease: EASE } }}
          style={{ pointerEvents: "none" }}
        >
          <motion.span
            className="font-display text-2xl tracking-[0.25em] uppercase text-ivory/80"
            initial={{ opacity: 0, y: 30 }}
            exit={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.25, ease: EASE } }}
          >
            {SITE_NAME}
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionProvider;
