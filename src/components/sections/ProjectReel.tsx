"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, ViewTransition, type ReactNode } from "react";
import clsx from "clsx";
import { prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";
import type { Pic } from "@/lib/images";

export type ReelItem = { slug: string; title: string; area: string; year: number; tag: string; types: string[]; image: Pic };

/**
 * Selected work. Desktop: the section pins and the row of projects slides sideways
 * as you scroll, each photo drifting inside its frame. Phones: the gallery by project type,
 * a native swipe row with the next photo half showing.
 */
export function ProjectReel({
  items,
  intro,
  types,
  allLabel = "All",
  className,
  trFirst,
}: {
  items: ReelItem[];
  intro: ReactNode;
  types: { id: string; label: string }[];
  allLabel?: string;
  className?: string;
  /** Already translated in the server's HTML: Translate's gate needn't hide it. */
  trFirst?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [type, setType] = useState("all");

  useDesktopGSAP(
    ({ gsap }) => {
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

  const shown = types.filter((c) => items.some((p) => p.types.includes(c.id)));

  return (
    <section ref={root} data-tr-first={trFirst || undefined} className={clsx("reel relative overflow-hidden py-20 pin:flex pin:h-svh pin:items-center pin:py-0", className)} aria-labelledby="reel-title">
      <div ref={track} className="reel-track no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pin:snap-none pin:gap-8 pin:overflow-visible pin:will-change-transform">
        <div className="reel-intro flex w-[82vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] lg:w-[34vw] lg:pr-10">
          {intro}
          <div role="group" aria-label="Project type" className="swipe swipe-chips mt-4 hidden phone:flex">
            {[{ id: "all", label: allLabel }, ...shown].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={type === c.id}
                onClick={() => {
                  setType(c.id);
                  rail.current?.scrollTo({ left: 0 });
                }}
                className={clsx("inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm transition-colors duration-200", type === c.id ? "border-fg bg-fg text-bg" : "border-line-strong")}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        {/* Only a box of its own on phones; on desktop the cards belong to the track. */}
        <div ref={rail} className="contents phone:flex swipe reel-rail">
          {items.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor="View"
              className={clsx("reel-card group w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[38vw]", type !== "all" && !p.types.includes(type) && "phone:hidden")}
              style={{ marginTop: i % 2 ? "3.5rem" : 0 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-paper phone:aspect-square lg:aspect-[5/6]">
                <ViewTransition name={`work-${p.slug}`} share="morph" default="none">
                  <div data-drift className="absolute -inset-x-[10%] inset-y-0 phone:inset-x-0">
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      fill
                      sizes="(min-width: 1024px) 46vw, (max-width: 767.98px) 45vw, (hover: none) 30vw, 82vw"
                      quality={75}
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                    />
                  </div>
                </ViewTransition>
                <span className="label absolute top-4 left-4 rounded-sm bg-ivory/90 px-2 py-1 phone:top-2.5 phone:left-2.5">{p.tag}</span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 phone:mt-2.5 phone:gap-2">
                <h3 className="display-s transition-colors group-hover:text-accent">{p.title}</h3>
                <span className="label shrink-0 text-faint tabular">{p.year}</span>
              </div>
              <p className="label mt-2 text-muted phone:mt-1">{p.area}</p>
            </Link>
          ))}
        </div>
        <div className="w-[4vw] shrink-0 phone:hidden" aria-hidden />
      </div>
    </section>
  );
}
