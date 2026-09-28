"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useState } from "react";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import TextReveal from "@/components/TextReveal";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import CTASection from "@/components/CTASection";
import Marquee from "@/components/Marquee";
import { FAQS, IMAGES, SERVICES } from "@/data/content";

const MATERIALS = ["Oak", "Travertine", "Lime plaster", "Unlacquered brass", "Ceppo di Gré", "Walnut", "Microcement", "Linen"];

const ServicesClient = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything a home needs, under one roof."
        description="Six disciplines practised by one studio — so nothing is lost between the drawing and the build."
        image={IMAGES.heroServices}
      />

      {/* Anchor index */}
      <section className="border-b border-border py-10">
        <div className="container flex flex-wrap gap-x-8 gap-y-3">
          {SERVICES.map((s, i) => (
            <AnimatedSection key={s.slug} delay={i * 0.05} direction="none">
              <a
                href={`#${s.slug}`}
                className="link-sweep font-body text-[12px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-ink"
              >
                <span className="mr-2 text-bronze">0{i + 1}</span>
                {s.title}
              </a>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Alternating editorial sections */}
      {SERVICES.map((service, i) => {
        const reversed = i % 2 === 1;
        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`scroll-mt-24 py-20 md:py-28 ${reversed ? "bg-muted" : ""}`}
          >
            <div className="container">
              <div className={`grid items-center gap-12 lg:grid-cols-12 ${reversed ? "" : ""}`}>
                <div className={`lg:col-span-6 ${reversed ? "lg:order-2" : ""}`}>
                  <ParallaxImage
                    src={service.image}
                    alt={service.title}
                    className="aspect-[4/3] w-full"
                    strength={45}
                  />
                </div>

                <div className={`lg:col-span-6 ${reversed ? "lg:order-1 lg:pr-16" : "lg:pl-16"}`}>
                  <AnimatedSection direction={reversed ? "left" : "right"}>
                    <p className="eyebrow mb-4">
                      0{i + 1} — {service.short}
                    </p>
                  </AnimatedSection>
                  <TextReveal text={service.title} className="headline-md text-ink" />
                  <AnimatedSection delay={0.2} direction={reversed ? "left" : "right"}>
                    <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">{service.details}</p>

                    <ul className="mt-8 space-y-3 border-t border-border pt-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-4 font-body text-sm text-ink/80">
                          <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className="group mt-10 inline-flex items-center gap-3 font-body text-[12px] uppercase tracking-[0.25em] text-ink"
                      data-cursor
                    >
                      <span className="link-sweep">Discuss this service</span>
                      <ArrowRight
                        className="h-4 w-4 text-bronze transition-transform duration-500 group-hover:translate-x-2"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Materials marquee band */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container mb-10 text-center">
          <AnimatedSection direction="none">
            <p className="eyebrow mb-4 !text-bronze-light">The palette</p>
          </AnimatedSection>
          <TextReveal text="Materials chosen to age, not date." className="headline-md mx-auto max-w-2xl text-ivory" />
        </div>
        <Marquee slow className="border-y border-ivory/10 py-8">
          {MATERIALS.map((m) => (
            <span key={m} className="mx-8 flex items-center gap-16 font-display text-3xl italic text-ivory/60 md:text-4xl">
              {m}
              <span className="h-1.5 w-1.5 rotate-45 bg-bronze-light/70" />
            </span>
          ))}
        </Marquee>
        <div className="container mt-10 text-center">
          <AnimatedSection direction="none">
            <p className="mx-auto max-w-xl font-body text-sm leading-relaxed text-ivory/50">
              Every material is sampled in your home&rsquo;s own light before it is specified — and every
              slab, board and bolt of cloth is inspected by the person who will install it.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-36">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <AnimatedSection>
                <p className="eyebrow mb-4">Questions</p>
              </AnimatedSection>
              <TextReveal text="Asked before, answered honestly." className="headline-md text-ink" />
              <AnimatedSection delay={0.2}>
                <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
                  Anything else on your mind? Write to us — a real person replies within one working
                  day.
                </p>
                <MagneticButton className="mt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 border border-ink/20 px-8 py-4 font-body text-[12px] uppercase tracking-[0.25em] text-ink transition-all duration-500 hover:bg-ink hover:text-ivory"
                  >
                    Ask us anything
                  </Link>
                </MagneticButton>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-7">
              <div className="border-t border-border">
                {FAQS.map((faq, i) => (
                  <AnimatedSection key={faq.question} delay={i * 0.07}>
                    <div className="border-b border-border">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between gap-6 py-7 text-left"
                        aria-expanded={openFaq === i}
                      >
                        <span className="font-display text-xl text-ink md:text-2xl">{faq.question}</span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-bronze">
                          {openFaq === i ? <Minus className="h-4 w-4" strokeWidth={1.5} /> : <Plus className="h-4 w-4" strokeWidth={1.5} />}
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-7 pr-16 font-body text-sm leading-relaxed text-muted-foreground">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default ServicesClient;
