"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";
import AnimatedSection from "@/components/AnimatedSection";

const AUTOPLAY_MS = 6000;

/** Auto-advancing testimonial theatre with crossfade and a timing bar. */
const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index]);

  const current = TESTIMONIALS[index];

  return (
    <section className="bg-muted py-24 md:py-36">
      <div className="container">
        <AnimatedSection className="text-center">
          <p className="eyebrow mb-4">In their words</p>
        </AnimatedSection>

        <div className="relative mx-auto mt-8 max-w-4xl text-center">
          <Quote className="mx-auto mb-8 h-10 w-10 text-bronze/30" strokeWidth={1} />
          <div className="relative min-h-[220px] md:min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <blockquote className="font-display text-2xl leading-snug text-ink md:text-3xl">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8">
                  <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-ink">{current.name}</p>
                  <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {current.project}
                  </p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Progress dots with fill animation */}
          <div className="mt-12 flex items-center justify-center gap-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className="group relative h-6 w-10"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/15" />
                {i === index && (
                  <motion.span
                    key={`fill-${index}`}
                    className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 origin-left bg-bronze"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
