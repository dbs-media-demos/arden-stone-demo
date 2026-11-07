"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useT } from "@/components/preview/BizContext";
import { isStill, isTouch, prefersReducedMotion, useDesktopGSAP, type MotionKit } from "@/lib/motion";
import { NOT_PHONE_MEDIA, PHONE_MEDIA } from "@/lib/media";
import type { Pic } from "@/lib/images";

export type HeroSlide = { photo: Pic; sketch: Pic; sheet: string; room: string; place: string; position?: string };

const SLIDE_MS = 7200;
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/** The drawing under the photo. Only the desktop layout uses it, so a phone never fetches it. */
function Sketch({ sketch, position, preload }: { sketch: Pic; position?: string; preload: boolean }) {
  const { srcSet, sizes } = getImageProps({ src: sketch.src, alt: "", fill: true, sizes: "100vw", quality: 60 }).props;
  return (
    <>
      {preload && <link rel="preload" as="image" imageSrcSet={srcSet} imageSizes={sizes} media={NOT_PHONE_MEDIA} />}
      <picture>
        <source media={NOT_PHONE_MEDIA} srcSet={srcSet} sizes={sizes} />
        <img src={BLANK} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
      </picture>
    </>
  );
}

/** Phones: the photo is the LCP, so it starts before any script. Desktop keeps its own order. */
function PhonePhotoPreload({ photo }: { photo: Pic }) {
  const { srcSet, sizes } = getImageProps({ src: photo.src, alt: "", fill: true, sizes: "100vw", quality: 75 }).props;
  return <link rel="preload" as="image" imageSrcSet={srcSet} imageSizes={sizes} media={PHONE_MEDIA} fetchPriority="high" />;
}

/**
 * The home hero. A pencil drawing of each room "develops" into the photograph
 * behind a bronze drafting line (first slide is pure CSS, so it paints with the HTML).
 * On desktop a lens follows the pointer and shows the drawing underneath the photo,
 * and scrolling opens the frame out to full bleed. On phones the photo is there at once:
 * the drafting line crosses it one time and leaves a dimension mark.
 */
export function HeroSketch({ slides, children, footer }: { slides: HeroSlide[]; children: React.ReactNode; footer: React.ReactNode }) {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const motion = useRef<MotionKit | null>(null);
  const [index, setIndex] = useState(0);
  const [extra, setExtra] = useState(false); // other slides mount after the first has painted
  const [paused, setPaused] = useState(false);
  // Rotation starts on the visitor's first interaction, so the first room stays the LCP.
  const [armed, setArmed] = useState(false);
  const busy = useRef(false);

  // Mount the other rooms once the browser is idle, so they never compete with the LCP. Phones keep the one photo.
  useEffect(() => {
    if (prefersReducedMotion() || isStill()) return;
    const hasIdle = "requestIdleCallback" in window;
    const id = hasIdle ? window.requestIdleCallback(() => setExtra(true), { timeout: 2500 }) : window.setTimeout(() => setExtra(true), 1800);
    return () => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);

  const goTo = (next: number) => {
    const el = frame.current;
    const gsap = motion.current?.gsap;
    if (!el || !gsap || busy.current || next === index) return;
    const slidesEls = el.querySelectorAll<HTMLElement>("[data-slide]");
    const incoming = slidesEls[next];
    const outgoing = slidesEls[index];
    if (!incoming || !outgoing) return;
    busy.current = true;
    const photo = incoming.querySelector<HTMLElement>("[data-photo]");
    const sketch = incoming.querySelector<HTMLElement>("[data-sketch]");
    const line = el.querySelector<HTMLElement>("[data-line]");
    gsap.set(incoming, { zIndex: 3, autoAlpha: 1 });
    gsap.set(outgoing, { zIndex: 2 });
    photo?.classList.remove("hero-develop");
    line?.classList.remove("hero-draft-line");
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(outgoing, { autoAlpha: 0, zIndex: 1 });
        gsap.set(incoming, { zIndex: 2 });
        busy.current = false;
      },
    });
    tl.fromTo(sketch, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.out" })
      .fromTo(photo, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.4, ease: "power2.inOut" }, 0.7)
      .fromTo(line, { left: "100%", opacity: 1 }, { left: "0%", duration: 2.4, ease: "power2.inOut" }, 0.7)
      .to(line, { opacity: 0, duration: 0.3 }, 2.8);
    setIndex(next);
  };

  useEffect(() => {
    const arm = () => setArmed(true);
    const events = ["pointermove", "pointerdown", "scroll", "keydown", "wheel"] as const;
    events.forEach((e) => window.addEventListener(e, arm, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, arm));
  }, []);

  // Auto-advance.
  useEffect(() => {
    if (!extra || !armed || paused || prefersReducedMotion()) return;
    const id = window.setTimeout(() => goTo((index + 1) % slides.length), index === 0 ? SLIDE_MS + 1400 : SLIDE_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extra, armed, paused, index, slides.length]);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useDesktopGSAP(
    (kit) => {
      motion.current = kit;
      const { gsap, ScrollTrigger } = kit;
      const el = frame.current;
      const section = root.current;
      if (!el || !section || prefersReducedMotion()) return;

      // Drawing lens (desktop pointer only).
      if (!isTouch()) {
        const r = { v: 0 };
        const setR = () => el.style.setProperty("--lr", `${r.v}px`);
        const move = (e: PointerEvent) => {
          const b = el.getBoundingClientRect();
          el.style.setProperty("--lx", `${e.clientX - b.left}px`);
          el.style.setProperty("--ly", `${e.clientY - b.top}px`);
        };
        const enter = () => gsap.to(r, { v: Math.min(170, window.innerWidth * 0.11), duration: 0.9, ease: "expo.out", onUpdate: setR });
        const leave = () => gsap.to(r, { v: 0, duration: 0.6, ease: "power3.out", onUpdate: setR });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
      }

      // Desktop: the frame opens out to full bleed as you scroll, the headline column drifts away.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const copy = section.querySelector("[data-hero-copy]");
        // Same box as the CSS start state, in plain numbers GSAP can interpolate.
        const start = () => {
          const cs = getComputedStyle(document.documentElement);
          const px = (v: string) => {
            const probe = document.createElement("div");
            probe.style.cssText = `position:absolute;visibility:hidden;width:${v}`;
            document.body.appendChild(probe);
            const w = probe.getBoundingClientRect().width;
            probe.remove();
            return w;
          };
          const top = px("calc(var(--header-h) + 0.75rem)");
          const side = px(cs.getPropertyValue("--gutter").trim() || "3rem");
          return `inset(${top}px ${side}px 88px 44%)`;
        };
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "+=70%", scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(el, { clipPath: start }, { clipPath: "inset(0px 0px 0px 0%)", ease: "none" })
          .to(copy, { yPercent: -18, opacity: 0, ease: "none" }, 0)
          .fromTo(el.querySelectorAll("[data-zoom]"), { scale: 1.08 }, { scale: 1, ease: "none" }, 0);
        return () => ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-hero data-tr-first className="hero-stage relative lg:h-svh lg:min-h-[640px]" aria-label="Introduction">
      <PhonePhotoPreload photo={slides[0].photo} />
      <div data-hero-copy className="hero-copy shell relative z-10 flex flex-col pt-[calc(var(--header-h)+2.5rem)] lg:mx-0 lg:h-full lg:w-[44%] lg:max-w-none lg:justify-center lg:pt-[var(--header-h)] lg:pr-10">
        {children}
      </div>

      {/* Frame: mobile = block below the copy; desktop = full-bleed layer clipped to the right column. */}
      <div
        ref={frame}
        className="hero-frame lens-host relative mx-[var(--gutter)] mt-7 h-[64svh] md:mt-10 min-h-[420px] overflow-hidden bg-paper lg:absolute lg:inset-0 lg:m-0 lg:h-auto lg:[clip-path:inset(calc(var(--header-h)+0.75rem)_var(--gutter)_88px_44%)]"
      >
        {slides.map((s, i) => {
          if (i > 0 && !extra) return null;
          return (
            <div key={s.photo.src} data-slide className={clsx("absolute inset-0", i === 0 ? "z-2" : "invisible z-1 opacity-0")}>
              <div data-zoom className="absolute inset-0">
                <div data-sketch className="absolute inset-0 phone:hidden">
                  <Sketch sketch={s.sketch} position={s.position} preload={i === 0} />
                </div>
                <div data-photo className={clsx("lens absolute inset-0", i === 0 && "hero-develop")}>
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    fill
                    sizes="100vw"
                    quality={75}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    className="object-cover"
                    style={{ objectPosition: s.position }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <span data-line aria-hidden className="hero-draft-line pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-bronze shadow-[0_0_0_1px_rgba(196,151,100,0.25)]" style={{ left: "0%", opacity: 0 }} />
        <span aria-hidden className="hero-dim pointer-events-none absolute inset-x-4 top-4 z-10 hidden h-2 phone:block" />

        {/* Sheet chrome, aligned to the initially visible column on desktop. */}
        <div className="pointer-events-none absolute inset-0 z-20 lg:top-[calc(var(--header-h)+0.75rem)] lg:right-[var(--gutter)] lg:bottom-[5.5rem] lg:left-[44%]">
          <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 text-ink phone:right-3 phone:bottom-3 phone:left-3 md:right-6 md:bottom-6 md:left-6">
            <div className="hero-sheet rounded-sm bg-ivory/88 px-3 py-2 backdrop-blur-sm">
              <p className="label">
                <span className="mr-2 border border-ink/40 px-1">{slides[index].sheet}</span>
                {t(slides[index].room)}
              </p>
              <p className="label mt-1 text-muted">{slides[index].place}</p>
            </div>
            <div className="pointer-events-auto flex items-center gap-3 rounded-sm bg-ivory/88 px-3 py-2.5 backdrop-blur-sm still:hidden">
              <span className="label whitespace-nowrap tabular">
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <div className="hidden gap-1.5 sm:flex">
                {slides.map((s, i) => (
                  <button
                    key={s.photo.src}
                    type="button"
                    onClick={() => extra && goTo(i)}
                    aria-label={`Show ${s.room}`}
                    aria-current={i === index}
                    className="relative flex h-6 w-8 items-center"
                  >
                    <span className="absolute inset-x-0 h-px bg-ink/25" />
                    {i === index && (
                      <span
                        key={`${index}-${paused}`}
                        className="absolute inset-x-0 h-px origin-left bg-ink"
                        style={{ animation: extra && armed && !paused ? `bar-fill ${(index === 0 ? SLIDE_MS + 1400 : SLIDE_MS) / 1000}s linear both` : undefined }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="label absolute top-4 right-4 hidden rounded-sm bg-ivory/88 px-3 py-2 text-ink backdrop-blur-sm pin:block">
            {t("Move over the photo to see the drawing")}
          </p>
        </div>
      </div>

      <div className="hero-foot shell relative z-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:max-w-none">{footer}</div>
    </section>
  );
}
