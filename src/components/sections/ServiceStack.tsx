"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";
import type { Pic } from "@/lib/images";
import { Arrow } from "@/components/ui/Button";

export type StackItem = { href: string; sheet: string; title: string; lede: string; price: string; duration: string; image: Pic };

/** Sticky cards that stack on top of each other; the covered card sinks back and dims. Phones: a swipe row of the same cards. */
export function ServiceStack({ items }: { items: StackItem[] }) {
  const root = useRef<HTMLDivElement>(null);

  useDesktopGSAP(
    ({ gsap, whenIdle }, contextSafe) => {
      if (prefersReducedMotion()) return;
      return whenIdle(
        contextSafe(() => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
          cards.forEach((card, i) => {
            const next = cards[i + 1];
            if (!next) return;
            gsap.to(card.querySelector("[data-card-inner]"), {
              scale: 0.92,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top+=120", scrub: true },
            });
            gsap.fromTo(
              card.querySelector("[data-card-shade]"),
              { opacity: 0 },
              { opacity: 0.55, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top top+=120", scrub: true } },
            );
          });
        }),
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="service-stack relative">
      {items.map((s, i) => (
        <div key={s.href} data-card className="sticky pb-6" style={{ top: `calc(var(--header-h) + ${0.5 + i * 0.9}rem)` }}>
          <div data-card-inner className="relative origin-top overflow-hidden rounded-sm bg-paper will-change-transform">
            <Link href={s.href} data-cursor="Explore" className="group grid min-h-[72svh] md:grid-cols-12">
              <div className="flex flex-col justify-between gap-10 p-6 md:col-span-5 md:p-10 lg:p-14">
                <div className="flex items-center justify-between">
                  <span className="label border border-line-strong px-1.5 py-0.5">{s.sheet}</span>
                  <span className="label text-faint tabular">
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="display-l transition-colors duration-500 group-hover:text-accent">{s.title}</h3>
                  <p className="mt-6 max-w-md text-muted leading-relaxed">{s.lede}</p>
                </div>
                <dl className="grid grid-cols-2 gap-4 border-t border-line pt-5">
                  <div>
                    <dt className="label text-faint">Typical investment</dt>
                    <dd className="mt-1 font-display text-2xl">{s.price}</dd>
                  </div>
                  <div>
                    <dt className="label text-faint">Timeline</dt>
                    <dd className="mt-1 font-display text-2xl">{s.duration}</dd>
                  </div>
                </dl>
                <span className="inline-flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.14em] uppercase">
                  <span className="link-draw pb-1 group-hover:[background-size:100%_1px]">Explore {s.title.toLowerCase()}</span>
                  <Arrow />
                </span>
              </div>
              <div className="relative min-h-[42svh] overflow-hidden md:col-span-7">
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  sizes="(max-width: 767.98px) 45vw, (hover: none) and (max-width: 1023.98px) 30vw, (min-width: 768px) 58vw, 100vw"
                  quality={75}
                  className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
              </div>
            </Link>
            <div data-card-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}
