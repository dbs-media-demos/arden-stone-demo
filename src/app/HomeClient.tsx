"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Preloader from "@/components/Preloader";
import HomeHero from "@/components/home/HomeHero";
import ServicesIndex from "@/components/home/ServicesIndex";
import WorksHorizontal from "@/components/home/WorksHorizontal";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/CTASection";
import AnimatedSection from "@/components/AnimatedSection";
import TextReveal from "@/components/TextReveal";
import ParallaxImage from "@/components/ParallaxImage";
import Marquee from "@/components/Marquee";
import Counter from "@/components/Counter";
import { IMAGES, STATS } from "@/data/content";
import { scroll } from "@/lib/scroll";

const MARQUEE_ITEMS = ["Kitchens", "Bathrooms", "Extensions", "Interiors", "Heritage", "Whole Homes"];

const HomeClient = () => {
  const [showPreloader, setShowPreloader] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Play the intro once per browser session.
    if (sessionStorage.getItem("as-preloaded")) {
      setStarted(true);
    } else {
      setShowPreloader(true);
      scroll.lenis?.stop();
    }
  }, []);

  const handlePreloaderDone = () => {
    sessionStorage.setItem("as-preloaded", "1");
    setShowPreloader(false);
    setStarted(true);
    scroll.lenis?.start();
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderDone} />}

      <HomeHero started={started} />

      {/* Discipline marquee */}
      <div className="border-y border-border bg-background py-6">
        <Marquee>
          {MARQUEE_ITEMS.map((item) => (
            <span key={item} className="mx-6 flex items-center gap-12 font-display text-2xl md:text-3xl text-ink/70">
              {item}
              <span className="h-1.5 w-1.5 rotate-45 bg-bronze" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* Editorial intro */}
      <section className="py-24 md:py-36">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <AnimatedSection>
                <p className="eyebrow mb-4">The studio</p>
              </AnimatedSection>
              <TextReveal
                text="We renovate homes the way tailors cut cloth — by hand, to fit, to last."
                className="headline-md text-ink"
              />
              <AnimatedSection delay={0.3}>
                <p className="mt-8 font-body text-base leading-relaxed text-muted-foreground">
                  Founded in 2007 as a two-man joinery workshop, Arden &amp; Stone has grown into a
                  forty-two-strong studio of architects, makers and site craftsmen — yet every project
                  still passes through our own workshop benches.
                </p>
                <p className="mt-5 font-body text-base leading-relaxed text-muted-foreground">
                  We take on fewer projects than we are offered, because a renovation done properly
                  demands presence: the same hands from the first sketch to the final coat of wax.
                </p>
                <Link
                  href="/about"
                  className="group mt-10 inline-flex items-center gap-3 font-body text-[12px] uppercase tracking-[0.25em] text-ink"
                  data-cursor
                >
                  <span className="link-sweep">Our story</span>
                  <ArrowRight className="h-4 w-4 text-bronze transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.5} />
                </Link>
              </AnimatedSection>
            </div>

            <div className="relative lg:col-span-7">
              <ParallaxImage
                src={IMAGES.introEditorial}
                alt="A calm, renovated interior with natural materials"
                className="aspect-[4/3] w-full"
                strength={50}
              />
              <AnimatedSection delay={0.2} direction="right" className="absolute -bottom-12 -left-4 hidden w-64 md:block lg:-left-12">
                <ParallaxImage
                  src={IMAGES.introDetail}
                  alt="Material detail of oak and stone"
                  className="aspect-[3/4] w-full shadow-2xl"
                  strength={30}
                  sizes="256px"
                />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-2 gap-y-14 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1} className="text-center">
                <p className="font-display text-5xl text-ivory md:text-7xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 font-body text-[11px] uppercase tracking-[0.3em] text-ivory/40">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <ServicesIndex />
      <WorksHorizontal />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default HomeClient;
