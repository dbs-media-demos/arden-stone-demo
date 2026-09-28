"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import TextReveal from "@/components/TextReveal";
import ParallaxImage from "@/components/ParallaxImage";
import Counter from "@/components/Counter";
import CTASection from "@/components/CTASection";
import Marquee from "@/components/Marquee";
import { IMAGES, STATS, TEAM, TIMELINE, VALUES } from "@/data/content";

const AboutClient = () => {
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

  return (
    <>
      <PageHero
        eyebrow="About the studio"
        title="Built by hand, run on principle."
        description="Eighteen years, two hundred and fifty homes, one belief: the people who design a home should also build it."
        image={IMAGES.heroAbout}
      />

      {/* Story */}
      <section className="py-24 md:py-36">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <AnimatedSection>
                <p className="eyebrow mb-4">Our story</p>
              </AnimatedSection>
              <TextReveal
                text="It began with a single workbench in Bermondsey."
                className="headline-md text-ink"
              />
              <AnimatedSection delay={0.25}>
                <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-muted-foreground">
                  <p>
                    In 2007, Thomas Arden — a cabinetmaker who had gone on to study architecture — grew
                    tired of watching beautiful drawings die on building sites. Details were simplified,
                    materials substituted, tolerances quietly widened. The gap between design and build
                    seemed to swallow everything that mattered.
                  </p>
                  <p>
                    So he closed the gap. A two-man workshop under a railway arch took on its first
                    kitchen; the drawings and the chisels sat on the same bench. Word travelled the way
                    it does in London — from one dinner table to the next.
                  </p>
                  <p>
                    Isabelle Stone joined in 2011, bringing an interiors practice trained in Milan, and
                    the studio took its present name and its present shape: architecture, construction
                    and interiors as one continuous act of care. Today forty-two people work across the
                    Belgravia studio and the Bermondsey workshop — and every project, however large,
                    still passes across those original benches.
                  </p>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-6">
                <ParallaxImage
                  src={IMAGES.storyOne}
                  alt="A finished bathroom in honed stone"
                  className="aspect-[3/4] w-full"
                  strength={40}
                />
                <div className="pt-16">
                  <ParallaxImage
                    src={IMAGES.storyTwo}
                    alt="Detail of bespoke joinery"
                    className="aspect-[3/4] w-full"
                    strength={60}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink py-24 md:py-36">
        <div className="container">
          <AnimatedSection>
            <p className="eyebrow mb-4 !text-bronze-light">What we stand for</p>
          </AnimatedSection>
          <TextReveal text="Four promises we have never broken." className="headline-lg max-w-3xl text-ivory" />

          <div className="mt-16 grid gap-px bg-ivory/10 sm:grid-cols-2">
            {VALUES.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <div className="group h-full bg-ink p-10 transition-colors duration-700 hover:bg-ink-soft md:p-14">
                  <span className="font-body text-xs tracking-[0.3em] text-bronze-light">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-3xl text-ivory transition-transform duration-500 group-hover:translate-x-2">
                    {value.title}
                  </h3>
                  <p className="mt-4 font-body text-sm leading-relaxed text-ivory/50">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-36">
        <div className="container">
          <AnimatedSection className="text-center">
            <p className="eyebrow mb-4">Milestones</p>
          </AnimatedSection>
          <TextReveal text="Eighteen years in six chapters." className="headline-md mx-auto max-w-2xl text-center text-ink" />

          <div ref={timelineRef} className="relative mx-auto mt-20 max-w-3xl">
            <motion.div
              className="absolute left-4 top-0 w-px bg-border md:left-1/2"
              initial={{ height: 0 }}
              animate={timelineInView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <div className="space-y-16">
              {TIMELINE.map((item, i) => (
                <AnimatedSection
                  key={item.year}
                  delay={i * 0.08}
                  direction={i % 2 === 0 ? "left" : "right"}
                  className={`relative pl-14 md:w-1/2 md:pl-0 ${
                    i % 2 === 0 ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-3 w-3 rotate-45 bg-bronze left-[10.5px] md:left-auto ${
                      i % 2 === 0 ? "md:-right-[6.5px]" : "md:-left-[6.5px]"
                    }`}
                  />
                  <p className="font-display text-4xl text-bronze">{item.year}</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{item.event}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted py-24 md:py-36">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <AnimatedSection>
                <p className="eyebrow mb-4">The people</p>
              </AnimatedSection>
              <TextReveal text="Led by makers, not managers." className="headline-md text-ink" />
            </div>
            <AnimatedSection delay={0.2}>
              <p className="max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
                Every director on this page still draws, still visits site weekly, and still answers
                their own phone.
              </p>
            </AnimatedSection>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="group" data-cursor>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`Portrait of ${member.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover grayscale transition-all duration-[1.2s] ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/85 p-5 backdrop-blur-sm transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                      <p className="font-body text-xs leading-relaxed text-ivory/80">{member.bio}</p>
                    </div>
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-ink">{member.name}</h3>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-[0.25em] text-bronze">{member.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats reprise */}
      <section className="border-y border-border py-16">
        <div className="container grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl text-ink md:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <div className="border-b border-border bg-background py-6">
        <Marquee slow>
          {["Considered", "Enduring", "Precise", "Honest", "Crafted"].map((word) => (
            <span key={word} className="mx-6 flex items-center gap-12 font-display text-2xl italic text-ink/50">
              {word}
              <span className="h-1.5 w-1.5 rotate-45 bg-bronze/60" />
            </span>
          ))}
        </Marquee>
      </div>

      <CTASection />
    </>
  );
};

export default AboutClient;
