"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { PROJECTS } from "@/data/content";
import AnimatedSection from "@/components/AnimatedSection";

/**
 * Pinned horizontal gallery: the section is tall, its inner viewport sticks,
 * and vertical scroll drives a horizontal translation through the projects.
 */
const WorksHorizontal = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-ink">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container mb-10 flex items-end justify-between">
          <AnimatedSection>
            <p className="eyebrow mb-3 !text-bronze-light">Selected works</p>
            <h2 className="headline-lg text-ivory">Recent transformations</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="hidden md:block">
            <p className="max-w-xs text-right font-body text-sm leading-relaxed text-ivory/50">
              Keep scrolling — the gallery moves with you.
            </p>
          </AnimatedSection>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-6 md:gap-10">
          {PROJECTS.map((project) => (
            <div key={project.slug} className="group relative w-[78vw] shrink-0 sm:w-[55vw] lg:w-[38vw]" data-cursor-label="View">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 60vw, 38vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <span className="absolute left-5 top-5 border border-ivory/25 bg-ink/30 px-3 py-1 font-body text-[10px] uppercase tracking-[0.25em] text-ivory/80 backdrop-blur-sm">
                  {project.category}
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-ivory transition-colors duration-500 group-hover:text-bronze-light">
                    {project.title}
                  </h3>
                  <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-ivory/40">
                    {project.location} — {project.year}
                  </p>
                </div>
              </div>
              <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-ivory/50">{project.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Progress line */}
        <div className="container mt-12">
          <div className="h-px w-full bg-ivory/10">
            <motion.div className="h-full origin-left bg-bronze-light" style={{ scaleX: progressScale }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorksHorizontal;
