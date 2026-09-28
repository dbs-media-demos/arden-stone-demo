"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import TextReveal from "./TextReveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
}

/**
 * Shared inner-page hero: full-bleed image with slow zoom, dark scrim,
 * parallax on scroll and masked headline reveal.
 */
const PageHero = ({ eyebrow, title, description, image }: PageHeroProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[72vh] min-h-[560px] items-end overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/25" />
      </motion.div>

      <motion.div className="container relative z-10 pb-16 md:pb-24" style={{ opacity }}>
        <motion.p
          className="eyebrow mb-6 !text-bronze-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {eyebrow}
        </motion.p>
        <TextReveal as="h1" text={title} className="headline-xl max-w-4xl text-ivory" delay={0.55} />
        {description && (
          <motion.p
            className="mt-8 max-w-xl font-body text-base md:text-lg leading-relaxed text-ivory/70"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
};

export default PageHero;
