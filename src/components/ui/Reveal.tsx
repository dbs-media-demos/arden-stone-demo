"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import { belowFold, gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/*
 * Scroll-driven reveals.
 * Content is always visible in the HTML. Top-of-page variants (`immediate`) animate with
 * pure CSS so they paint at once. Everything else is hidden by JavaScript only while it is
 * still below the fold (opacity only), then animated in as it arrives.
 */

const delayStyle = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

type SplitProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  stagger?: number;
  id?: string;
};

/** Headline that rises line by line out of a mask. SplitText loads only when it's about to be seen. */
export function SplitReveal({ children, as: Tag = "h2", className, delay = 0, immediate, stagger = 0.08, id }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      gsap.set(el, { opacity: 0 });
      let split: SplitText | null = null;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { opacity: 1 });
              return gsap.from(self.lines, { yPercent: 118, rotate: 2, duration: 1.35, stagger, delay, ease: "expo.out" });
            },
          });
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-heading", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  immediate?: boolean;
  id?: string;
};

/** Fade + rise when scrolled into view (optionally staggering direct children). */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 36, stagger, immediate, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || immediate || prefersReducedMotion() || !belowFold(el)) return;
      const targets = stagger ? Array.from(el.children) : [el];
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => gsap.to(targets, { opacity: 1, y: 0, duration: 1.25, delay, stagger: stagger ?? 0, ease: "expo.out", clearProps: "transform" }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx(immediate && "anim-fade", className)} style={immediate ? delayStyle(delay) : undefined}>
      {children}
    </Tag>
  );
}

/** Paragraph whose words darken one by one as you scroll through it. */
export function ScrubWords({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      // Starts around 3:1 contrast so the large text stays readable before scrolling.
      gsap.fromTo(
        words,
        { opacity: 0.32 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.5 } },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w className={w.startsWith("*") ? "italic text-accent" : undefined}>
          {w.replace(/^\*/, "")}{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Image frame that unmasks on enter and drifts with scroll. The first child is the moving layer. */
export function Parallax({
  children,
  className,
  amount = 14,
  reveal = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  reveal?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!el || !inner || prefersReducedMotion()) return;
      gsap.set(inner, { scale: 1 + amount / 100 });
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      if (reveal && belowFold(el)) {
        gsap.fromTo(
          el,
          { clipPath: "inset(14% 10% 14% 10%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}

/** Masked lines for top-of-page headings: CSS-only, paints immediately. */
export function Lines({ lines, className, delay = 0, as: Tag = "span" }: { lines: ReactNode[]; className?: string; delay?: number; as?: ElementType }) {
  return (
    <Tag className={clsx("lines block", className)} style={delayStyle(delay)}>
      {lines.map((l, i) => (
        <span key={i} className="ln" style={{ "--i": i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
