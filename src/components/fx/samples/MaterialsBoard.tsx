"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import anchors from "./anchors.json";
import type { SamplesScene } from "./scene";

const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
/** The board is desktop only (phones and tablets keep the swatch row): nothing below 1024 px fetches it. */
const NOT_DESK = "(max-width: 1023.98px)";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const SIZES = "(min-width: 1680px) 1580px, 94vw";
const set = (ext: string) => `/images/samples/board-1400.${ext} 1400w, /images/samples/board-2400.${ext} 2400w`;

type Conn = { saveData?: boolean };

/**
 * The materials as a sample board (desktop). The server HTML carries a still of the 3D board
 * (scripts/render-room.mjs) with every sample's name laid under it, so it reads on the first frame.
 * On a desktop with a mouse, as the section comes near, the scene is fetched with `await import()`
 * (three.js is already cached from the hero) and takes over from the still: a low, warm light rakes
 * across the samples as the page scrolls and follows the pointer over the board, and a sample lifts
 * when it or its name is hovered.
 */
export function MaterialsBoard({ names, hint }: { names: string[]; hint: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<SamplesScene | null>(null);
  const [on, setOn] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = canvas.current;
    const box = stage.current;
    if (!el || !box || !window.matchMedia(DESK_3D).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator as Navigator & { connection?: Conn }).connection?.saveData) return;

    let cancelled = false;
    let started = false;
    let sc: SamplesScene | undefined;
    const off: (() => void)[] = [];

    const start = async () => {
      if (started) return;
      started = true;
      try {
        const { createSamples } = await import("./scene");
        if (cancelled) return;
        sc = await createSamples(el);
        if (cancelled) return sc.dispose();
      } catch {
        return; // no WebGL: the still stays
      }
      const s = sc;
      scene.current = s;
      s.onHover(setActive);
      s.onReady(() => !cancelled && setOn(true));

      let onScreen = false;
      const progress = () => {
        const r = box.getBoundingClientRect();
        return (window.innerHeight - r.top) / (window.innerHeight + r.height);
      };
      const onScroll = () => s.scroll(progress());
      const sync = () => s.setVisible(onScreen && !document.hidden);
      const io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        sync();
      });
      io.observe(box);
      const ro = new ResizeObserver(() => s.resize());
      ro.observe(el);
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        s.pointer({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 });
      };
      const leave = () => s.pointer(null);
      box.addEventListener("pointermove", move);
      box.addEventListener("pointerleave", leave);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", sync);
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        box.removeEventListener("pointermove", move);
        box.removeEventListener("pointerleave", leave);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", sync);
      });
      onScroll();
    };

    // Set up once the page has loaded and the board is about a screen away
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
        const go = () => ric(() => void start(), { timeout: 1500 });
        if (document.readyState === "complete") go();
        else {
          window.addEventListener("load", go, { once: true });
          off.push(() => window.removeEventListener("load", go));
        }
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(box);

    return () => {
      cancelled = true;
      near.disconnect();
      off.forEach((f) => f());
      scene.current = null;
      sc?.dispose();
    };
  }, []);

  const lift = (i: number | null) => {
    setActive(i);
    scene.current?.highlight(i);
  };

  return (
    <div>
      <div ref={stage} className="sample-board relative aspect-[12/5] overflow-hidden rounded-sm bg-stone">
        <picture>
          <source media={NOT_DESK} srcSet={BLANK} />
          <source type="image/avif" srcSet={set("avif")} sizes={SIZES} />
          <img src="/images/samples/board-2400.webp" srcSet={set("webp")} sizes={SIZES} width={2400} height={1000} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <canvas ref={canvas} aria-hidden className={clsx("absolute inset-0 h-full w-full transition-opacity duration-700", on ? "opacity-100" : "opacity-0")} />
        <ol className="pointer-events-none absolute inset-0">
          {names.map((n, i) => (
            <li
              key={n}
              className="sample-label absolute"
              style={{ left: `${anchors[i].x * 100}%`, top: `${anchors[i].y * 100}%` }}
              data-active={active === i || undefined}
            >
              <span className="pointer-events-auto" onPointerEnter={() => lift(i)} onPointerLeave={() => lift(null)}>
                <span className="tabular text-bronze-text">{String(i + 1).padStart(2, "0")}</span> {n}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="label mt-5 text-faint">{hint}</p>
    </div>
  );
}
