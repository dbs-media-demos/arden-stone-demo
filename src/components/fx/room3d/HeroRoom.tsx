"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { NOT_PHONE_MEDIA, PHONE_MEDIA } from "@/lib/media";
import type { RoomScene } from "./scene";

/** Live 3D only on a big screen with a mouse. Everything else keeps the still. */
const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
/** Where the live scene may run, the HTML shows the drawing it starts from; everywhere else the built room. */
const DRAWN_MEDIA = `${DESK_3D} and (prefers-reduced-motion: no-preference)`;
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const SIZES = "(min-width: 1024px) 54vw, 1px";
const set = (name: string, ext: string) => `/images/room/${name}-960.${ext} 960w, /images/room/${name}-1520.${ext} 1520w`;
/** The CSS drafting line has revealed the drawing by then (0.3 s + 2.6 s); the build starts after it. */
const DRAWN_AT = 3000;

type Conn = { saveData?: boolean };

/**
 * The hero's model of the kitchen. The server HTML carries a still rendered from the 3D scene
 * (scripts/render-room.mjs): the pencil drawing, which a bronze drafting line reveals with CSS on the
 * first frame. On a desktop with a mouse, once the page has loaded and the browser is idle, the scene
 * is fetched with `await import()` (three.js never reaches a phone or a tablet) and the canvas takes
 * over from the very same camera, invisibly. Then a section line sweeps through the drawing and builds
 * the room behind it while the camera drifts; it leans towards the pointer and dollies in with the
 * scroll. Frames are drawn only while something moves and the model is on screen.
 *
 * Anyone who doesn't get the live scene (reduced motion, Save-Data, no WebGL) sees the built room.
 */
export function HeroRoom({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el || !window.matchMedia(DESK_3D).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // the picture is already the built room
    const timers: number[] = [];
    // Save-Data: no 3D download; once the drafting line has drawn it, the drawing gives way to the built room
    if ((navigator as Navigator & { connection?: Conn }).connection?.saveData) {
      timers.push(window.setTimeout(() => setFallback(true), DRAWN_AT));
      return () => timers.forEach(clearTimeout);
    }

    let cancelled = false;
    let sc: RoomScene | undefined;
    const off: (() => void)[] = [];

    const start = async () => {
      try {
        const { createRoom } = await import("./scene");
        if (cancelled) return;
        sc = await createRoom(el);
        if (cancelled) return sc.dispose();
      } catch {
        if (!cancelled) setFallback(true); // no WebGL: show the built room instead of the drawing
        return;
      }
      const scene = sc;
      scene.onReady(() => {
        if (cancelled) return;
        setOn(true);
        timers.push(window.setTimeout(() => scene.intro(), Math.max(250, DRAWN_AT - performance.now())));
      });

      let onScreen = true;
      // The hero is pinned for 70% of a screen while the photo takes the frame
      const progress = () => Math.min(1, window.scrollY / (window.innerHeight * 0.7));
      const sync = () => scene.setVisible(onScreen && progress() < 0.9 && !document.hidden);
      const onScroll = () => {
        scene.scroll(progress());
        sync();
      };
      const onMove = (e: PointerEvent) => scene.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      const io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        sync();
      });
      io.observe(el);
      const ro = new ResizeObserver(() => scene.resize());
      ro.observe(el);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("visibilitychange", sync);
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", sync);
      });
      scene.scroll(progress());
    };

    // After load and when the browser is idle: the first paint never waits for the 3D
    const idle = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
      timers.push(window.setTimeout(() => ric(() => void start(), { timeout: 1200 }), 50));
    };
    if (document.readyState === "complete") idle();
    else {
      window.addEventListener("load", idle, { once: true });
      off.push(() => window.removeEventListener("load", idle));
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      off.forEach((f) => f());
      sc?.dispose();
    };
  }, []);

  return (
    <div aria-hidden className={clsx("room", className)}>
      <picture>
        <source media={PHONE_MEDIA} srcSet={BLANK} />
        <source media={DRAWN_MEDIA} type="image/avif" srcSet={set("room-drawn", "avif")} sizes={SIZES} />
        <source media={DRAWN_MEDIA} srcSet={set("room-drawn", "webp")} sizes={SIZES} />
        <source type="image/avif" srcSet={set("room-built", "avif")} sizes={SIZES} />
        {/* Stills pre-rendered with alpha at two fixed sizes, so no image optimiser touches them */}
        <img
          src="/images/room/room-built-1520.webp"
          srcSet={set("room-built", "webp")}
          sizes={SIZES}
          width={1520}
          height={1357}
          alt=""
          decoding="async"
          fetchPriority="high"
          className={clsx("room-still room-develop", on && "opacity-0 transition-opacity delay-200 duration-500")}
        />
      </picture>
      {fallback && (
        <picture>
          <source type="image/avif" srcSet={set("room-built", "avif")} sizes={SIZES} />
          <img src="/images/room/room-built-1520.webp" srcSet={set("room-built", "webp")} sizes={SIZES} alt="" decoding="async" className="room-still room-fallback" />
        </picture>
      )}
      <span className="room-line" />
      <canvas ref={canvas} className={clsx("room-still transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
    </div>
  );
}

/** Phones: the same model, built, as a small plate on the hero photo. No script. */
export function HeroRoomPlate({ label }: { label: string }) {
  return (
    <figure aria-hidden className="room-plate">
      <picture>
        <source media={NOT_PHONE_MEDIA} srcSet={BLANK} />
        <source type="image/avif" srcSet="/images/room/room-phone.avif" />
        <img src="/images/room/room-phone.webp" width={480} height={480} alt="" decoding="async" fetchPriority="low" />
      </picture>
      <figcaption className="label">{label}</figcaption>
    </figure>
  );
}
