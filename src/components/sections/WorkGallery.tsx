"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import clsx from "clsx";
import { isStill, loadKit, prefersReducedMotion } from "@/lib/motion";
import type { Pic } from "@/lib/images";

// Flip comes with the desktop motion kit; phones re-flow the grid plainly and never load it.
let flipKit: Promise<{ gsap: Awaited<ReturnType<typeof loadKit>>["gsap"]; Flip: typeof import("gsap/Flip").Flip }> | null = null;
const loadFlip = () =>
  (flipKit ??= Promise.all([loadKit(), import("gsap/Flip")]).then(([{ gsap }, { Flip }]) => {
    gsap.registerPlugin(Flip);
    return { gsap, Flip };
  }));

export type GalleryItem = { slug: string; title: string; area: string; year: number; categories: string[]; summary: string; image: Pic };

/** Filterable project grid. Filtering re-flows the cards with GSAP Flip; each card morphs into its case study. */
export function WorkGallery({ items, categories }: { items: GalleryItem[]; categories: { id: string; label: string }[] }) {
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isStill()) void loadFlip();
  }, []);

  const apply = async (next: string) => {
    if (next === filter) return;
    const el = grid.current;
    if (!el || prefersReducedMotion() || isStill()) {
      setFilter(next);
      return;
    }
    const { gsap, Flip } = await loadFlip();
    const state = Flip.getState(el.querySelectorAll("[data-item]"));
    setFilter(next);
    requestAnimationFrame(() =>
      Flip.from(state, {
        duration: 0.9,
        ease: "expo.inOut",
        absolute: true,
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.5 }),
      }),
    );
  };

  const count = (id: string) => (id === "all" ? items.length : items.filter((i) => i.categories.includes(id)).length);

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2">
        {[{ id: "all", label: "All work" }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filter === c.id}
            onClick={() => apply(c.id)}
            className={clsx(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300",
              filter === c.id ? "border-fg bg-fg text-bg" : "border-line-strong hover:border-fg",
            )}
          >
            {c.label}
            <sup className="label text-[0.6rem] opacity-70">{count(c.id)}</sup>
          </button>
        ))}
      </div>

      <ul ref={grid} className="relative mt-12 grid gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {items.map((p, i) => {
          const shown = filter === "all" || p.categories.includes(filter);
          return (
            <li key={p.slug} data-item className={clsx(!shown && "hidden", i % 3 === 1 && "xl:mt-20")}>
              <Link href={`/work/${p.slug}`} data-cursor="View" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-paper">
                  <ViewTransition name={`work-${p.slug}`} share="morph" default="none">
                    <div className="absolute inset-0">
                      <Image
                        src={p.image.src}
                        alt={p.image.alt}
                        fill
                        sizes="(min-width: 1280px) 31vw, (min-width: 768px) 48vw, 100vw"
                        quality={75}
                        preload={i === 0}
                        className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                      />
                    </div>
                  </ViewTransition>
                  <span className="label absolute top-4 left-4 rounded-sm bg-ivory/90 px-2 py-1 tabular">
                    {String(i + 1).padStart(2, "0")} · {p.year}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="display-s transition-colors group-hover:text-accent">{p.title}</h2>
                  <span className="label shrink-0 text-faint">{p.area}</span>
                </div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{p.summary}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
