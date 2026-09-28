"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "@/data/content";
import MagneticButton from "@/components/MagneticButton";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const SLIDE_MS = 6000;
const FADE_S = 1.4;

const lineReveal = (delay: number) => ({
  initial: { y: "110%" },
  animate: { y: 0 },
  transition: { duration: 1, delay, ease: EASE },
});

/**
 * Full-viewport hero slideshow: every slide is kept mounted (so images stay
 * warm) and the active one fades in on top with its own ken-burns drift.
 * Parallax + fade on scroll, masked headline, and clickable progress bars.
 */
const HomeHero = ({ started }: { started: boolean }) => {
  const ref = useRef(null);
  const [slide, setSlide] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
    // `slide` is a dependency so a manual jump restarts the interval.
  }, [started, slide]);

  return (
    <section ref={ref} className="relative flex h-screen min-h-[640px] items-end overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        {HERO_SLIDES.map((s, i) => {
          const isActive = i === slide;
          return (
            <motion.div
              key={s.image}
              className="absolute inset-0"
              style={{ zIndex: isActive ? 2 : 1 }}
              initial={{ opacity: i === 0 ? 1 : 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{
                // Active slide fades in on top; hidden slides drop out late,
                // after the newcomer fully covers them — no brightness dip.
                duration: FADE_S,
                delay: isActive ? 0 : FADE_S,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="relative h-full w-full"
                animate={{ scale: isActive && started ? 1.1 : 1 }}
                transition={{ duration: SLIDE_MS / 1000 + FADE_S, ease: "linear" }}
              >
                <Image
                  src={s.image}
                  alt={`${s.label} — renovated by Arden & Stone`}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          );
        })}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/30" />
      </motion.div>

      <motion.div className="container relative z-10 pb-24 md:pb-32" style={{ y: contentY, opacity }}>
        {started && (
          <>
            <div className="overflow-hidden">
              <motion.p className="eyebrow mb-6 !text-bronze-light" {...lineReveal(0.2)}>
                Design · Build · Interiors — London
              </motion.p>
            </div>
            <h1 className="headline-xl text-ivory">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span className="block" {...lineReveal(0.35)}>
                  Homes, reimagined
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span className="block" {...lineReveal(0.5)}>
                  with <em className="text-bronze-light">uncommon</em> care.
                </motion.span>
              </span>
            </h1>
            <motion.div
              className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
            >
              <p className="max-w-md font-body text-base leading-relaxed text-ivory/70">
                A renovation studio where the people who design your home also build it. Kitchens,
                bathrooms, extensions and whole-home transformations — one team, without compromise.
              </p>
              <MagneticButton>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-4 border border-ivory/30 px-8 py-4 font-body text-[12px] uppercase tracking-[0.25em] text-ivory transition-all duration-500 hover:border-bronze-light hover:bg-bronze-light/10"
                >
                  Explore our craft
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.5} />
                </Link>
              </MagneticButton>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Slide indicators: rotating label + clickable progress bars + counter */}
      <motion.div
        className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-6 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity }}
      >
        <div className="relative h-28 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={slide}
              className="block font-body text-[10px] uppercase tracking-[0.35em] text-ivory/50 [writing-mode:vertical-rl]"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {HERO_SLIDES[slide].label}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.image}
              onClick={() => setSlide(i)}
              aria-label={`Show slide ${i + 1}: ${s.label}`}
              className="group flex w-4 justify-center py-0.5"
            >
              <span className="relative h-9 w-[2px] overflow-hidden bg-ivory/25 transition-colors duration-300 group-hover:bg-ivory/50">
                {i === slide && (
                  <motion.span
                    key={`progress-${slide}`}
                    className="absolute inset-x-0 top-0 bg-bronze-light"
                    initial={{ height: "0%" }}
                    animate={{ height: "100%" }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <span className="font-body text-[10px] tracking-[0.3em] text-ivory/40 tabular-nums">
          0{slide + 1} / 0{HERO_SLIDES.length}
        </span>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{ opacity }}
      >
        <span className="font-body text-[10px] uppercase tracking-[0.4em] text-ivory/40 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="h-4 w-4 text-bronze-light" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeHero;
