"use client";

import Image, { getImageProps } from "next/image";
import { useRef } from "react";
import { HeroRoom, HeroRoomPlate } from "@/components/fx/room3d/HeroRoom";
import { HeroBuildLazy } from "@/components/fx/build2d/HeroBuildLazy";
import { useT } from "@/components/preview/BizContext";
import { isTouch, prefersReducedMotion, useDesktopGSAP } from "@/lib/motion";
import { NOT_PHONE_MEDIA, PHONE_MEDIA } from "@/lib/media";
import type { Pic } from "@/lib/images";

export type HeroSlide = { photo: Pic; sketch: Pic; sheet: string; room: string; place: string; position?: string };
/** `3d`: the homepage at / (the live model). `2d`: /v2, the same page with no WebGL at all. */
export type HeroMode = "3d" | "2d";

/** /v2's build card: the order the kitchen goes in, ticked off in step with the canvas (HeroBuild). */
const BUILD_STEPS = [
  // name, note, start and length in seconds (HeroBuild's T, plus the drafting line's 0.3 s delay)
  ["Drawn", "Pencil, 1:20", 0.3, 2.3],
  ["Floor", "Rift white oak", 2.9, 1.1],
  ["Joinery", "From our workshop", 3.55, 0.95],
  ["Stone", "Calacatta slab", 4.25, 0.75],
  ["Lights on", "Handover", 4.9, 0.9],
] as const;

const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
/** The "as built" plate on desktop: the photo layer at this scale, tucked into the model's corner. */
const PLATE = 0.2;

/** The drawing under the photo, for the lens. Only layouts wider than a phone use it, so a phone never fetches it. */
function Sketch({ sketch, position, first }: { sketch: Pic; position?: string; first?: boolean }) {
  const { srcSet, sizes } = getImageProps({ src: sketch.src, alt: "", fill: true, sizes: "100vw", quality: 60 }).props;
  return (
    <picture>
      <source media={NOT_PHONE_MEDIA} srcSet={srcSet} sizes={sizes} />
      <img src={BLANK} alt="" decoding="async" fetchPriority={first ? "high" : "low"} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
    </picture>
  );
}

/** /v2 on desktop opens on the drawing: it starts loading with the HTML. */
function SketchPreload({ sketch }: { sketch: Pic }) {
  const { srcSet, sizes } = getImageProps({ src: sketch.src, alt: "", fill: true, sizes: "100vw", quality: 60 }).props;
  return <link rel="preload" as="image" imageSrcSet={srcSet} imageSizes={sizes} media="(min-width: 1024px)" fetchPriority="high" />;
}

/** Phones: the photo is the LCP, so it starts before any script. Desktop keeps its own order. */
function PhonePhotoPreload({ photo }: { photo: Pic }) {
  const { srcSet, sizes } = getImageProps({ src: photo.src, alt: "", fill: true, sizes: "100vw", quality: 75 }).props;
  return <link rel="preload" as="image" imageSrcSet={srcSet} imageSizes={sizes} media={PHONE_MEDIA} fetchPriority="high" />;
}

/**
 * The home hero. Desktop: a 3D model of the kitchen (HeroRoom) starts as a pencil drawing, and a
 * section line builds the room behind it while the camera drifts; the photograph of the finished
 * kitchen sits in its corner as a small "as built" plate. Scrolling opens the frame to full bleed and
 * the photo takes it over: drawn, then built. Once the photo fills the frame, a lens follows the
 * pointer and shows the pencil drawing underneath it.
 * Phones: the photo is there at once; the drafting line crosses it one time and leaves a dimension
 * mark, and a still of the same model sits on it as a small plate.
 *
 * `hero="2d"` (/v2, no WebGL): on desktop the column holds the pencil drawing, revealed by the same
 * bronze line, and the kitchen is built over it trade by trade (HeroBuild, canvas 2D) while a small
 * card ticks off the sequence; then the photo is simply there, full size. The scroll, the lens, the
 * copy and every other width are the same as at /.
 */
export function HeroSketch({ slide, children, footer, hero = "3d" }: { slide: HeroSlide; children: React.ReactNode; footer: React.ReactNode; hero?: HeroMode }) {
  const flat = hero === "2d";
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useDesktopGSAP(
    ({ gsap, ScrollTrigger }) => {
      const el = frame.current;
      const section = root.current;
      if (!el || !section || prefersReducedMotion()) return;

      // Drawing lens (pointer only), once the photo has the frame to itself.
      let open = !window.matchMedia("(min-width: 1024px)").matches;
      let inside = false;
      const r = { v: 0 };
      // /v2 draws the photo in a box that the scroll scales up: the lens works in that box's own pixels
      const zoom = el.querySelector<HTMLElement>("[data-zoom]");
      const k = () => (flat && zoom ? zoom.getBoundingClientRect().width / zoom.offsetWidth || 1 : 1);
      const setR = () => el.style.setProperty("--lr", `${r.v / k()}px`);
      const grow = () => gsap.to(r, { v: Math.min(170, window.innerWidth * 0.11), duration: 0.9, ease: "expo.out", onUpdate: setR, overwrite: true });
      const shrink = () => gsap.to(r, { v: 0, duration: 0.6, ease: "power3.out", onUpdate: setR, overwrite: true });
      const setOpen = (v: boolean) => {
        if (v === open) return;
        open = v;
        if (v && inside) grow();
        else shrink();
      };
      if (!isTouch()) {
        const move = (e: PointerEvent) => {
          if (flat && zoom) {
            const z = zoom.getBoundingClientRect();
            const s = k();
            el.style.setProperty("--lx", `${(e.clientX - z.left) / s}px`);
            el.style.setProperty("--ly", `${(e.clientY - z.top) / s}px`);
            return setR();
          }
          const b = el.getBoundingClientRect();
          el.style.setProperty("--lx", `${e.clientX - b.left}px`);
          el.style.setProperty("--ly", `${e.clientY - b.top}px`);
        };
        const enter = () => {
          inside = true;
          if (open) grow();
        };
        const leave = () => {
          inside = false;
          shrink();
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
      }

      // Desktop: the frame opens out to full bleed as you scroll, the headline column drifts away,
      // and the photo grows from its plate to fill the frame.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        open = false;
        const copy = section.querySelector("[data-hero-copy]");
        const built = el.querySelector("[data-built]");
        const px = (v: string) => {
          const probe = document.createElement("div");
          probe.style.cssText = `position:absolute;visibility:hidden;width:${v}`;
          document.body.appendChild(probe);
          const w = probe.getBoundingClientRect().width;
          probe.remove();
          return w;
        };
        // /v2: the photo's box (sized to the column in CSS, .build-box) grows to cover the whole frame
        const toFullBleed = () => {
          const z = zoom!;
          // the photo's width when it covers the frame (2:3, like the <img> at /)
          const w = () => Math.max(el.clientWidth, el.clientHeight / 1.5);
          return {
            x: () => (el.clientWidth - w()) / 2 - z.offsetLeft,
            y: () => (el.clientHeight - w() * 1.5) * 0.62 - z.offsetTop,
            scale: () => w() / z.offsetWidth,
          };
        };
        // Same boxes as the CSS start state, in plain numbers GSAP can interpolate.
        const start = () => {
          const side = px("var(--gutter)");
          return `inset(${px("calc(var(--header-h) + 0.75rem)")}px ${side}px 88px 44%)`;
        };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=70%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setOpen(self.progress > 0.97),
          },
        });
        tl.fromTo(el, { clipPath: start }, { clipPath: "inset(0px 0px 0px 0%)", ease: "none" })
          .to(copy, { yPercent: -18, opacity: 0, ease: "none" }, 0);
        // /v2 has no plate: the photo is built full size, in the frame
        if (!flat)
          tl.fromTo(
            built,
            { x: () => -px("calc(var(--gutter) + 1.25rem)"), y: () => -px("6.75rem"), scale: PLATE, transformOrigin: "100% 100%" },
            { x: 0, y: 0, scale: 1, ease: "power2.inOut" },
            0,
          );
        tl.to(el.querySelectorAll("[data-plate]"), { autoAlpha: 0, duration: 0.12, ease: "none" }, 0)
          .fromTo(
            el.querySelectorAll("[data-zoom]"),
            flat ? { x: 0, y: 0, scale: 1, transformOrigin: "0% 0%" } : { scale: 1.08 },
            flat ? { ...toFullBleed(), ease: "power2.inOut" } : { scale: 1, ease: "none" },
            0,
          )
          .fromTo(el.querySelectorAll("[data-hint]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: "none" }, 0.9);
        return () => {
          open = true;
          ScrollTrigger.refresh();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-hero data-tr-first className={`hero-stage relative lg:h-svh lg:min-h-[640px]${flat ? " hero-2d" : ""}`} aria-label="Introduction">
      <PhonePhotoPreload photo={slide.photo} />
      {flat && <SketchPreload sketch={slide.sketch} />}
      <div data-hero-copy className="hero-copy shell relative z-10 flex flex-col pt-[calc(var(--header-h)+2.5rem)] lg:mx-0 lg:h-full lg:w-[44%] lg:max-w-none lg:justify-center lg:pt-[var(--header-h)] lg:pr-10">
        {children}
      </div>

      {/* Frame: mobile = block below the copy; desktop = full-bleed layer clipped to the right column. */}
      <div
        ref={frame}
        className="hero-frame lens-host relative mx-[var(--gutter)] mt-7 h-[64svh] md:mt-10 min-h-[420px] overflow-hidden bg-paper lg:absolute lg:inset-0 lg:m-0 lg:h-auto lg:[clip-path:inset(calc(var(--header-h)+0.75rem)_var(--gutter)_88px_44%)]"
      >
        {/* Desktop: the model, in the initially visible column (/v2: the photo is built over its drawing instead) */}
        {!flat && (
          <>
            <div className="absolute top-[calc(var(--header-h)+0.75rem)] right-[var(--gutter)] bottom-[5.5rem] left-[44%] hidden lg:block">
              <HeroRoom className="absolute inset-0" />
            </div>
            <div data-plate className="hero-plate-shadow hidden lg:block" />
          </>
        )}

        <div data-built className="hero-built absolute inset-0 z-2 overflow-hidden">
          <div data-zoom className={flat ? "build-box absolute max-lg:inset-0" : "absolute inset-0"}>
            <div data-sketch className="build-draw absolute inset-0 phone:hidden">
              <Sketch sketch={slide.sketch} position={slide.position} first={flat} />
            </div>
            {flat && (
              <>
                <span aria-hidden className="build-line hidden lg:block" />
                <div className="hidden lg:contents">
                  <HeroBuildLazy position={slide.position} />
                </div>
              </>
            )}
            <div data-photo className="hero-develop lens absolute inset-0">
              <Image
                src={slide.photo.src}
                alt={slide.photo.alt}
                fill
                sizes="100vw"
                quality={75}
                loading="eager"
                fetchPriority="high"
                className="object-cover"
                style={{ objectPosition: slide.position }}
              />
            </div>
          </div>
        </div>
        {!flat && (
          <div data-plate className="hero-plate hidden lg:block">
            <p className="label">
              {t("As built")} · <span className="tabular">2024</span>
            </p>
          </div>
        )}
        <span data-line aria-hidden className="hero-draft-line pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-bronze shadow-[0_0_0_1px_rgba(196,151,100,0.25)] lg:hidden" style={{ left: "0%", opacity: 0 }} />
        <span aria-hidden className="hero-dim pointer-events-none absolute inset-x-4 top-4 z-10 hidden h-2 phone:block" />
        <div className="absolute right-3 bottom-3 z-20 hidden h-[42%] max-h-[8.75rem] phone:block">
          <HeroRoomPlate label={t("3D design")} />
        </div>

        {/* Sheet chrome, aligned to the initially visible column on desktop. */}
        <div className="pointer-events-none absolute inset-0 z-20 lg:top-[calc(var(--header-h)+0.75rem)] lg:right-[var(--gutter)] lg:bottom-[5.5rem] lg:left-[44%]">
          <div className="absolute bottom-4 left-4 text-ink phone:bottom-3 phone:left-3 md:bottom-6 md:left-6">
            <div className="hero-sheet rounded-sm bg-ivory/88 px-3 py-2 backdrop-blur-sm">
              <p className="label">
                <span className="mr-2 border border-ink/40 px-1">{slide.sheet}</span>
                {t(slide.room)}
              </p>
              <p className="label mt-1 text-muted">{slide.place}</p>
            </div>
          </div>
          {flat && (
            <div data-plate className="build-card absolute right-4 bottom-4 hidden md:right-6 md:bottom-6 lg:block">
              <p className="label text-muted">
                {t("Build sequence")} · <span className="tabular">{slide.sheet}</span>
              </p>
              <ol className="mt-3">
                {BUILD_STEPS.map(([step, note, at, dur], i) => (
                  <li key={step} style={{ "--s": `${at}s`, "--d": `${dur}s` } as React.CSSProperties}>
                    <span className="tabular text-bronze-text">{String(i + 1).padStart(2, "0")}</span>
                    <span className="build-step">{t(step)}</span>
                    <span className="build-note">{t(note)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p data-hint className="hero-hint label absolute top-4 right-4 hidden rounded-sm bg-ivory/88 px-3 py-2 text-ink backdrop-blur-sm pin:block">
            {t("Move over the photo to see the drawing")}
          </p>
        </div>
      </div>

      <div className="hero-foot shell relative z-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:max-w-none">{footer}</div>
    </section>
  );
}
