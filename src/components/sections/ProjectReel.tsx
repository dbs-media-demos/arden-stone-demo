"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, ViewTransition, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import type { Pic } from "@/lib/images";

export type ReelItem = { slug: string; title: string; area: string; year: number; tag: string; image: Pic };

/**
 * Selected work. Desktop: the section pins and the row of projects slides sideways
 * as you scroll, each photo drifting inside its frame. Phones: a native swipe row.
 */
export function ProjectReel({ items, intro }: { items: ReelItem[]; intro: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-drift]", t).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden py-20 lg:flex lg:h-svh lg:items-center lg:py-0" aria-labelledby="reel-title">
      <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] lg:snap-none lg:gap-8 lg:overflow-visible lg:will-change-transform">
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] lg:w-[34vw] lg:pr-10">{intro}</div>
        {items.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            data-cursor="View"
            className="group w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[38vw]"
            style={{ marginTop: i % 2 ? "3.5rem" : 0 }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-paper lg:aspect-[5/6]">
              <ViewTransition name={`work-${p.slug}`} share="morph" default="none">
                <div data-drift className="absolute -inset-x-[10%] inset-y-0">
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    sizes="(min-width: 1024px) 46vw, 82vw"
                    quality={75}
                    placeholder="blur"
                    blurDataURL={p.image.blurDataURL}
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                </div>
              </ViewTransition>
              <span className="label absolute top-4 left-4 rounded-sm bg-ivory/90 px-2 py-1">{p.tag}</span>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="display-s transition-colors group-hover:text-accent">{p.title}</h3>
              <span className="label shrink-0 text-faint tabular">{p.year}</span>
            </div>
            <p className="label mt-2 text-muted">{p.area}</p>
          </Link>
        ))}
        <div className="w-[4vw] shrink-0" aria-hidden />
      </div>
    </section>
  );
}
