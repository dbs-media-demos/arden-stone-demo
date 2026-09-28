"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import type { Pic } from "@/lib/images";

export type JourneyStage = { n: string; title: string; weeks: string; text: string; points: string[]; image: Pic };

/**
 * The renovation journey. Desktop: pinned; scrolling walks through five stages while one
 * room is drawn, stamped, framed and finally photographed. Phones: a plain stacked list.
 */
export function Journey({ stages, heading }: { stages: JourneyStage[]; heading: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", root.current);
        const texts = gsap.utils.toArray<HTMLElement>("[data-stage-text]", root.current);
        const bar = root.current!.querySelector("[data-progress]");
        gsap.set(frames.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (stages.length - 0.2)}`,
            scrub: 0.7,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.min(stages.length - 1, Math.floor(self.progress * stages.length * 0.999))),
          },
        });
        tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: stages.length }, 0);
        for (let i = 1; i < stages.length; i++) {
          const at = i - 0.35;
          tl.to(texts[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, at)
            .to(frames[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.inOut" }, at)
            .fromTo(frames[i].querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 0.8 }, at)
            .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.25);
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-ink relative lg:h-svh" aria-labelledby="journey-title">
      <div className="shell grid gap-12 py-24 lg:h-full lg:grid-cols-12 lg:gap-10 lg:py-0">
        {/* Left: heading + stage rail */}
        <div className="flex flex-col justify-center lg:col-span-5 lg:pt-[var(--header-h)]">
          {heading}
          <ol className="relative mt-12 hidden gap-4 pl-6 lg:grid">
            <span className="absolute top-1 bottom-1 left-0 w-px bg-line" aria-hidden />
            <span data-progress className="absolute top-1 bottom-1 left-0 w-px origin-top bg-bronze-light" aria-hidden />
            {stages.map((s, i) => (
              <li key={s.n} className={clsx("flex items-baseline gap-4 transition-colors duration-500", i === active ? "text-ivory" : "text-faint")}>
                <span className="label tabular">{s.n}</span>
                <span className={clsx("font-display text-2xl transition-transform duration-500", i === active && "translate-x-2 italic")}>{s.title}</span>
                <span className="label ml-auto tabular">{s.weeks}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right (desktop): stacked frames + the active stage's words */}
        <div className="relative hidden lg:col-span-7 lg:block lg:py-[calc(var(--header-h)+1.5rem)]">
          <div className="relative h-[58%] overflow-hidden rounded-sm">
            {stages.map((s, i) => (
              <div key={s.n} data-frame className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                <Image src={s.image.src} alt={s.image.alt} fill sizes="55vw" quality={75} className="object-cover" />
                <span className="label absolute top-4 left-4 rounded-sm bg-ink/75 px-2 py-1 text-ivory">
                  Stage {s.n} · {s.weeks}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-8 h-[30%]">
            {stages.map((s) => (
              <div key={s.n} data-stage-text className="absolute inset-0 grid grid-cols-7 gap-8">
                <p className="col-span-4 text-lg leading-relaxed text-ivory/85">{s.text}</p>
                <ul className="col-span-3 grid content-start gap-2 border-l border-line pl-6 text-sm text-muted">
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Phones: simple list */}
        <ol className="grid gap-14 lg:hidden">
          {stages.map((s) => (
            <li key={s.n}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" quality={70} className="object-cover" />
              </div>
              <div className="mt-5 flex items-baseline gap-4">
                <span className="label text-bronze-light tabular">{s.n}</span>
                <h3 className="display-m">{s.title}</h3>
                <span className="label ml-auto text-faint">{s.weeks}</span>
              </div>
              <p className="mt-4 text-ivory/85 leading-relaxed">{s.text}</p>
              <ul className="mt-4 grid gap-1.5 text-sm text-muted">
                {s.points.map((p) => (
                  <li key={p}>— {p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
