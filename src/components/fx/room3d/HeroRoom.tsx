"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { NOT_PHONE_MEDIA, PHONE_MEDIA } from "@/lib/media";
import { afterLoad, breathe, canRun3D, demote, DESK_3D, GL_ATTRS, machineOk, onDemote, warmedUp, warmShaders, warmUp, watchFrames } from "../gate3d";
import type { RoomScene } from "./scene";

/** Where the live scene may run, the HTML shows the drawing it starts from; everywhere else the built room. */
const DRAWN_MEDIA = `${DESK_3D} and (prefers-reduced-motion: no-preference)`;
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const SIZES = "(min-width: 1024px) 54vw, 1px";
const set = (name: string, ext: string) => `/images/room/${name}-960.${ext} 960w, /images/room/${name}-1520.${ext} 1520w`;
/** The CSS drafting line has revealed the drawing by then (0.3 s + 2.6 s); the build starts after it. */
const DRAWN_AT = 3000;

/**
 * The hero's model of the kitchen. The server HTML carries a still rendered from the 3D scene
 * (scripts/render-room.mjs): the pencil drawing, which a bronze drafting line reveals with CSS on the
 * first frame. On a desktop with a mouse, once the page has loaded and the browser is idle, the scene
 * is fetched with `await import()` (three.js never reaches a phone or a tablet) and the canvas takes
 * over from the very same camera, invisibly. Then a section line sweeps through the drawing and builds
 * the room behind it while the camera drifts; it leans towards the pointer and dollies in with the
 * scroll. Frames are drawn only while something moves and the model is on screen.
 *
 * The canvas only fades in once the scene is built, its textures are up, its shaders are compiled
 * and a frame has been drawn invisibly (fx/gate3d.ts covers the rest: the GPU and CPU check, the
 * idle warm-up, and the first 2 seconds of frames, which send a slow machine back to the still).
 *
 * Anyone who doesn't get the live scene (reduced motion, Save-Data, no proper GPU, too slow) sees the
 * built room: after the drafting line has drawn it, the drawing gives way to it.
 */
export function HeroRoom({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  /** The built room: faded in over the drawing, or put straight under a canvas that's fading out. */
  const [fallback, setFallback] = useState<false | "fade" | "under">(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el || !window.matchMedia(DESK_3D).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // the picture is already the built room
    const timers: number[] = [];
    const toStill = () => timers.push(window.setTimeout(() => setFallback("fade"), Math.max(0, DRAWN_AT - performance.now())));
    // Save-Data, or this visit already went back to the stills: no 3D download
    if (!canRun3D()) {
      toStill();
      return () => timers.forEach(clearTimeout);
    }

    let cancelled = false;
    let sc: RoomScene | undefined;
    const off: (() => void)[] = [];
    const stop = () => {
      cancelled = true;
      off.splice(0).forEach((f) => f());
    };

    const start = async () => {
      await afterLoad();
      if (cancelled) return;
      if (!canRun3D() || !(await machineOk()) || cancelled) return; // a weak machine is sent to the still by onDemote
      try {
        sc = await warmUp(async () => {
          const [{ createRoom }] = await Promise.all([import("./scene"), warmShaders()]);
          if (cancelled) return;
          const s = await createRoom(el, { gl: GL_ATTRS, pause: breathe, onFrame: watchFrames("hero", () => demote("hero")) });
          await new Promise<void>((r) => s.onReady(r));
          return s;
        });
      } catch {
        if (!cancelled) demote("webgl"); // no WebGL, or not a proper GPU
        return;
      }
      if (!sc) return;
      if (cancelled) return sc.dispose();
      const scene = sc;
      performance.mark("3d:hero:on");
      setOn(true);
      // The build starts once the drawing is done and the scenes further down have warmed up too
      void Promise.race([warmedUp(), new Promise((r) => window.setTimeout(r, 2000))]).then(() => {
        if (!cancelled) timers.push(window.setTimeout(() => scene.intro(), Math.max(250, DRAWN_AT - performance.now())));
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

    // Too slow here (this scene or another): fade back to the built room, stop, and free the GPU
    off.push(
      onDemote(() => {
        stop();
        if (!sc) return void toStill(); // never shown: the drawing gives way to the built room as usual
        // the built room goes in under the canvas, which fades out once it has loaded
        setFallback((f) => f || "under");
        timers.push(window.setTimeout(() => setOn(false), 1500));
        sc?.setVisible(false);
        const s = sc;
        timers.push(window.setTimeout(() => s?.dispose(), 900));
      }),
    );
    void start();

    return () => {
      stop();
      timers.forEach(clearTimeout);
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
          className={clsx("room-still room-develop", (on || fallback) && "opacity-0 transition-opacity delay-200 duration-500")}
        />
      </picture>
      {fallback && (
        <picture>
          <source type="image/avif" srcSet={set("room-built", "avif")} sizes={SIZES} />
          <img
            src="/images/room/room-built-1520.webp"
            srcSet={set("room-built", "webp")}
            sizes={SIZES}
            alt=""
            decoding="async" className={clsx("room-still", fallback === "fade" && "room-fallback")}
            onLoad={fallback === "under" ? () => setOn(false) : undefined}
          />
        </picture>
      )}
      <span className="room-line" />
      <canvas ref={canvas} className={clsx("room-still transition-opacity", on ? "opacity-100 duration-300" : "opacity-0 duration-700")} />
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
