"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const WORDS = ["Kitchens", "Bathrooms", "Extensions", "Interiors", "Homes"];

/**
 * Full-screen intro shown once per session: cycling discipline words, a thin
 * progress line, then a two-panel curtain lift revealing the page.
 */
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 900);
          }, 350);
          return 100;
        }
        return Math.min(prev + Math.random() * 12 + 4, 100);
      });
    }, 90);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 450);
    return () => clearInterval(wordTimer);
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div className="fixed inset-0 z-[100]" exit={{ transition: { duration: 0.9 } }}>
          {/* Two curtain panels that split apart on exit */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            exit={{ y: "100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          />

          <motion.div
            className="relative z-10 flex h-full flex-col items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <motion.span
              className="font-display text-3xl md:text-4xl tracking-[0.2em] uppercase text-ivory"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Arden <span className="text-bronze-light">&amp;</span> Stone
            </motion.span>
            <motion.span
              className="mt-3 font-body text-[10px] uppercase tracking-[0.5em] text-ivory/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {SITE_TAGLINE}
            </motion.span>

            <div className="relative mt-12 h-6 w-40 overflow-hidden text-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={wordIndex}
                  className="absolute inset-0 font-body text-xs uppercase tracking-[0.3em] text-ivory/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="relative mt-8 h-px w-56 overflow-hidden bg-ivory/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-bronze-light"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="mt-4 font-body text-xs tracking-widest text-ivory/30 tabular-nums">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
