"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";
import type { Pic } from "@/lib/images";

export type JourneyStage = { n: string; title: string; weeks: string; text: string; points: string[]; image: Pic };

/**
 * The renovation journey. Desktop: pinned; scrolling walks through five stages while one
 * room is drawn, stamped, framed and finally photographed. Phones: a plain stacked timeline,
 * one stage open at a time (the words of the closed ones stay in the HTML).
 */
export function Journey({ stages, heading, className }: { stages: JourneyStage[]; heading: React.ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(0);

  useDesktopGSAP(
    ({ gsap }) => {
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
    <section ref={root} className={clsx("theme-ink relative pin:h-svh pin:motion-reduce:h-auto", className)} aria-labelledby="journey-title">
      <div className="shell grid gap-12 py-24 phone:gap-3.5 phone:py-7 pin:h-full pin:grid-cols-12 pin:gap-10 pin:py-0 pin:motion-reduce:py-24">
        {/* Left: heading + stage rail */}
        <div className="flex flex-col justify-center pin:col-span-5 pin:pt-[var(--header-h)]">
          {heading}
          <ol className="relative mt-12 hidden gap-4 pl-6 pin:grid pin:motion-reduce:hidden">
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
        <div className="relative hidden pin:col-span-7 pin:block pin:py-[calc(var(--header-h)+1.5rem)] pin:motion-reduce:hidden">
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
        <ol className="grid gap-14 phone:gap-0 phone:border-b phone:border-line pin:hidden pin:col-span-12 pin:motion-reduce:grid pin:motion-reduce:grid-cols-2 pin:motion-reduce:gap-x-10">
          {stages.map((s, i) => (
            <li key={s.n} className="phone:border-t phone:border-line">
              <button
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
                className="block w-full text-left phone:flex phone:items-center phone:gap-3 phone:py-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm phone:order-3 phone:ml-auto phone:aspect-square phone:w-11 phone:shrink-0">
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes="(max-width: 767.98px) 72px, (hover: none) and (max-width: 1023.98px) 72px, 100vw"
                    quality={60}
                    className="object-cover"
                  />
                </div>
                <div className="mt-5 flex items-baseline gap-4 phone:mt-0 phone:block phone:min-w-0">
                  <span className="label text-bronze-light tabular phone:mr-2">{s.n}</span>
                  <h3 className="display-m phone:inline">{s.title}</h3>
                  <span className="label ml-auto text-faint phone:ml-0 phone:block">{s.weeks}</span>
                </div>
              </button>
              <div className={clsx("phone:grid phone:transition-[grid-template-rows] phone:duration-500 phone:ease-[var(--ease-out-expo)]", open === i ? "phone:grid-rows-[1fr]" : "phone:grid-rows-[0fr]")}>
                <div className="phone:overflow-hidden">
                  <p className="mt-4 text-ivory/85 leading-relaxed phone:mt-0 phone:text-[0.9375rem] phone:leading-[1.45]">{s.text}</p>
                  <ul className="mt-4 grid gap-1.5 text-sm text-muted phone:mt-2 phone:gap-0.5 phone:pb-3.5 phone:text-[0.8125rem]">
                    {s.points.map((p) => (
                      <li key={p}>— {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
