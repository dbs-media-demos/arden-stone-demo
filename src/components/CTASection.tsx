"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { IMAGES } from "@/data/content";
import TextReveal from "./TextReveal";
import AnimatedSection from "./AnimatedSection";
import MagneticButton from "./MagneticButton";

/** Full-width parallax call-to-action used at the bottom of every page. */
const CTASection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-32 md:py-48">
      <motion.div className="absolute -inset-y-24 inset-x-0" style={{ y }}>
        <Image src={IMAGES.cta} alt="A finished Arden & Stone living space" fill sizes="100vw" className="object-cover opacity-30" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/60" />

      <div className="container relative z-10 text-center">
        <AnimatedSection direction="none">
          <p className="eyebrow mb-8 !text-bronze-light">Begin the conversation</p>
        </AnimatedSection>
        <TextReveal
          as="h2"
          text="Your home deserves this level of care."
          className="headline-lg mx-auto max-w-3xl text-ivory"
        />
        <AnimatedSection delay={0.35} direction="none">
          <p className="mx-auto mt-8 max-w-xl font-body text-base leading-relaxed text-ivory/60">
            Tell us about your house, your habits and your hopes. We&rsquo;ll tell you honestly what it
            will take — in time, in cost, and in craft.
          </p>
          <div className="mt-12">
            <MagneticButton>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 border border-ivory/30 px-10 py-5 font-body text-[13px] uppercase tracking-[0.25em] text-ivory transition-all duration-500 hover:border-bronze-light hover:bg-bronze-light/10"
              >
                Start your project
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.5} />
              </Link>
            </MagneticButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
