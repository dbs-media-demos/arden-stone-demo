"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PROCESS_STEPS } from "@/data/content";
import AnimatedSection from "@/components/AnimatedSection";
import TextReveal from "@/components/TextReveal";

/** Numbered process steps with a growing connector line and staggered reveals. */
const ProcessSection = () => {
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-36">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <AnimatedSection>
              <p className="eyebrow mb-4">How we work</p>
            </AnimatedSection>
            <TextReveal text="A process refined over 250 homes." className="headline-md text-ink" />
            <AnimatedSection delay={0.25}>
              <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground">
                Four movements, each with its own rituals and checkpoints. You always know what is
                happening, what it costs, and what comes next.
              </p>
            </AnimatedSection>
          </div>

          <div ref={lineRef} className="relative md:col-span-8">
            {/* Vertical connector line grows with the section */}
            <motion.div
              className="absolute left-[19px] top-2 hidden w-px bg-border md:block"
              initial={{ height: 0 }}
              animate={lineInView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <div className="space-y-14 md:space-y-20">
              {PROCESS_STEPS.map((step, i) => (
                <AnimatedSection key={step.number} delay={i * 0.12} className="relative md:pl-24">
                  <span className="absolute left-0 top-1 hidden h-10 w-10 items-center justify-center rounded-full border border-bronze/40 bg-background font-body text-xs tracking-widest text-bronze md:flex">
                    {step.number}
                  </span>
                  <span className="mb-3 block font-body text-xs tracking-[0.3em] text-bronze md:hidden">
                    {step.number}
                  </span>
                  <h3 className="font-display text-3xl text-ink md:text-4xl">{step.title}</h3>
                  <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
