"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP, whenIdle } from "@/lib/gsap";

/**
 * Workshop film. Opens from a small window to full bleed as you scroll.
 * Plays only while on screen, never with reduced motion or Data Saver.
 */
export function WorkshopFilm({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
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

  useGSAP(
    (_ctx, contextSafe) => {
      if (prefersReducedMotion()) return;
      return whenIdle(
        contextSafe!(() => {
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
    <section ref={root} className="relative h-[92svh] min-h-[560px] overflow-hidden bg-ivory" aria-label="Our workshop">
      <div data-film className="absolute inset-0 overflow-hidden bg-ink">
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end text-ivory [--accent:var(--bronze-light)]">
          <div className="shell pb-14 md:pb-20">{children}</div>
        </div>
      </div>
    </section>
  );
}
