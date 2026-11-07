"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { isStill, prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";

/**
 * Workshop film. Opens from a small window to full bleed as you scroll.
 * Plays only while on screen, never with reduced motion or Data Saver.
 * Phones and touch screens get a still of the film and never load the video.
 */
export function WorkshopFilm({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v || isStill()) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // The poster always loads (lazily); the film itself only plays when motion is welcome.
    const canPlay = !prefersReducedMotion() && !conn?.saveData;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return v.pause();
        if (!v.poster) v.poster = "/video/workshop-poster.jpg";
        if (!canPlay) return;
        if (!v.src) v.src = "/video/workshop.mp4";
        v.play().catch(() => {});
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useDesktopGSAP(
    ({ gsap, whenIdle }, contextSafe) => {
      if (prefersReducedMotion()) return;
      return whenIdle(
        contextSafe(() => {
          const frame = root.current!.querySelector("[data-film]");
          gsap.fromTo(
            frame,
            { clipPath: "inset(14% 22% 14% 22% round 4px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "top top", scrub: true } },
          );
          gsap.fromTo(
            root.current!.querySelector("video"),
            { scale: 1.25 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={clsx("relative h-[92svh] min-h-[560px] overflow-hidden bg-ivory phone:h-[18rem] phone:min-h-0", className)} aria-label="Our workshop">
      <div data-film className="absolute inset-0 overflow-hidden bg-ink">
        <video ref={video} muted loop playsInline preload="none" aria-hidden className="absolute inset-0 h-full w-full object-cover still:hidden" />
        <div className="absolute inset-0 hidden still:block">
          <Image src="/video/workshop-poster.jpg" alt="" fill sizes="(min-width: 768px) 100vw, 150vw" quality={75} className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent phone:from-ink/90 phone:via-ink/45" />
        <div className="absolute inset-0 flex flex-col justify-end text-ivory [--accent:var(--bronze-light)]">
          <div className="shell pb-14 phone:pb-5 md:pb-20">{children}</div>
        </div>
      </div>
    </section>
  );
}
