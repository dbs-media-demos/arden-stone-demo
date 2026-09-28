"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";
import { SERVICES } from "@/data/content";
import AnimatedSection from "@/components/AnimatedSection";
import TextReveal from "@/components/TextReveal";

/**
 * Editorial index of services: hovering a row floats a preview image that
 * trails the cursor with a spring — the classic "studio site" interaction.
 */
const ServicesIndex = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const previewX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.5 });
  const previewY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.5 });

  const handleMove = (e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section className="py-24 md:py-36">
      <div className="container">
        <AnimatedSection>
          <p className="eyebrow mb-4">What we do</p>
        </AnimatedSection>
        <TextReveal text="Six disciplines. One standard." className="headline-lg max-w-2xl text-ink" />

        <div ref={containerRef} className="relative mt-16" onMouseMove={handleMove}>
          {/* Floating preview image (desktop only) */}
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-20 hidden h-72 w-56 overflow-hidden lg:block"
                style={{ x: previewX, y: previewY, translateX: "3rem", translateY: "-50%" }}
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={hovered}
                    className="absolute inset-0"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <Image
                      src={SERVICES[hovered].image}
                      alt={SERVICES[hovered].title}
                      fill
                      sizes="224px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border-t border-border">
            {SERVICES.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.06}>
                <Link
                  href={`/services#${service.slug}`}
                  className="group relative flex items-center justify-between gap-6 border-b border-border py-8 md:py-10 transition-colors duration-500"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  data-cursor
                >
                  {/* Sliding ink background on hover */}
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />

                  <span className="relative z-10 flex items-baseline gap-6 md:gap-12 px-2 md:px-6">
                    <span className="font-body text-xs tracking-widest text-muted-foreground transition-colors duration-500 group-hover:text-bronze-light">
                      0{i + 1}
                    </span>
                    <span>
                      <span className="font-display headline-md text-ink transition-colors duration-500 group-hover:text-ivory">
                        {service.title}
                      </span>
                      <span className="mt-1 hidden font-body text-sm text-muted-foreground transition-colors duration-500 group-hover:text-ivory/60 md:block">
                        {service.short}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    className="relative z-10 mr-2 h-6 w-6 shrink-0 text-muted-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-bronze-light md:mr-6"
                    strokeWidth={1.25}
                  />
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesIndex;
