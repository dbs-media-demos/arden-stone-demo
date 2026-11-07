"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { isStill, prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";
import type { Pic } from "@/lib/images";

type Props = {
  before: Pic;
  after: Pic;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  sizes?: string;
};

/**
 * Before/after comparison. A native range input sits over the image, so drag,
 * touch and keyboard all work and screen readers announce the position.
 * The first time it scrolls into view it sweeps once to show what it does.
 * On phones the visitor drives it with a sideways drag on the photo (touch-action: pan-y),
 * so an up or down swipe that starts here still scrolls the page; the input stays for keyboards
 * and screen readers.
 */
export function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After", className, sizes = "(min-width: 1024px) 80vw, 100vw" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const dragging = useRef(false);

  useDesktopGSAP(
    ({ gsap, ScrollTrigger, whenIdle }, contextSafe) => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      return whenIdle(
        contextSafe(() => {
          const state = { p: 50 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 70%",
            once: true,
            onEnter: () => {
              if (touched.current) return;
              gsap
                .timeline({ onUpdate: () => !touched.current && setPos(state.p) })
                .to(state, { p: 88, duration: 1.1, ease: "power2.inOut" })
                .to(state, { p: 12, duration: 1.6, ease: "power2.inOut" })
                .to(state, { p: 50, duration: 1.1, ease: "power3.out" });
            },
          });
        }),
      );
    },
    { scope: root },
  );

  const fromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={root}
      data-cursor="Drag"
      className={clsx("group relative overflow-hidden bg-paper select-none still:touch-pan-y", className)}
      style={{ "--pos": `${pos}%` } as React.CSSProperties}
      onPointerDown={() => {
        if (!isStill()) return;
        touched.current = true;
        dragging.current = true;
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e)}
      onPointerUp={(e) => {
        if (dragging.current) fromPointer(e);
        dragging.current = false;
      }}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after.src} alt={after.alt} fill sizes={sizes} quality={75} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
        <Image src={before.src} alt={before.alt} fill sizes={sizes} quality={75} className="object-cover" />
      </div>

      <span className="label pointer-events-none absolute top-4 left-4 rounded-sm bg-ink/80 px-2.5 py-1.5 text-ivory">{beforeLabel}</span>
      <span className="label pointer-events-none absolute top-4 right-4 rounded-sm bg-ivory/90 px-2.5 py-1.5 text-ink">{afterLabel}</span>

      {/* Handle */}
      <div className="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-px -translate-x-1/2 bg-ivory shadow-[0_0_12px_rgba(0,0,0,0.25)]">
        <div className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-ink shadow-lg transition-transform duration-500 group-active:scale-90 phone:h-12 phone:w-12">
          <svg viewBox="0 0 28 12" className="h-3 w-7" aria-hidden>
            <path d="M6 1L1 6l5 5M22 1l5 5-5 5M1 6h26" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={(e) => {
          touched.current = true;
          setPos(Number(e.target.value));
        }}
        onPointerDown={() => (touched.current = true)}
        aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
        aria-valuetext={`${Math.round(pos)}% ${beforeLabel.toLowerCase()}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-0 still:pointer-events-none"
      />
      <span className="pointer-events-none absolute inset-0 ring-bronze ring-inset group-has-[input:focus-visible]:ring-2" aria-hidden />
    </div>
  );
}
