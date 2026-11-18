"use client";

import { useEffect, useRef, useState } from "react";
import { useBiz } from "@/components/preview/BizContext";

/**
 * /v2's hero (desktop, no 3D): the kitchen is built over its own pencil drawing in the order a
 * renovation really goes in. The drawing is in the server HTML and a bronze drafting line reveals
 * it with CSS on the first frame (HeroSketch, .build-draw). Then this canvas, over the drawing,
 * lays the oak floor board by board from the front, fits the joinery from the floor up, sets the
 * stone slab from the top and switches the lights on, after which the photograph itself takes over
 * underneath and the canvas fades away. Canvas 2D and two images the page already has: no WebGL.
 *
 * The timeline is read from the CSS drafting line's own clock, so the build card (CSS) and the
 * canvas stay in step. Reduced motion: nothing here runs and the photo is simply there.
 */

type Pt = readonly [number, number];
/** Shapes are traced on the photo at 800 x 1200 (it is 2:3 at any size). */
const PW = 800;
const PH = 1200;

const FLOOR: Pt[] = [[0, 788], [60, 786], [752, 792], [752, 905], [800, 908], [800, 1200], [0, 1200]];
const ISLAND: Pt[] = [[76, 662], [640, 662], [640, 858], [492, 862], [492, 902], [352, 902], [160, 866], [86, 810]];
const JOINERY: { pts: Pt[]; at: number }[] = [
  { pts: [[154, 372], [313, 408], [313, 666], [154, 666]], at: 0 }, // tall units and ovens
  { pts: [[0, 652], [57, 652], [57, 792], [0, 792]], at: 0.08 }, // the low run on the left
  { pts: ISLAND, at: 0.16 }, // the island and its stools
  { pts: [[626, 648], [753, 648], [753, 800], [626, 800]], at: 0.26 }, // the back run
  { pts: [[358, 452], [733, 443], [733, 563], [358, 571]], at: 0.36 }, // wall cabinets
];
const STONE: Pt[] = [[376, 342], [748, 326], [748, 658], [376, 662]];
const DOWNLIGHTS: Pt[] = [[128, 348], [258, 318], [275, 388], [332, 378], [403, 367], [445, 277], [563, 338], [662, 224]];
const PENDANTS: { c: Pt; rx: number }[] = [{ c: [228, 512], rx: 46 }, { c: [481, 489], rx: 54 }];

/** Seconds after the drafting line starts (its CSS delay is 0.3 s). Keep in step with .build-card in globals.css. */
export const T = { dims: 0.6, floor: 2.6, joinery: 3.25, stone: 3.95, lights: 4.6, photo: 5.5, fade: 6.4, gone: 7.7 };
const FLOOR_ROWS = 11;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const easeInOut = (v: number) => {
  const x = clamp(v);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

const ready = (img: HTMLImageElement | null): img is HTMLImageElement => !!img && img.complete && img.naturalWidth > 1;

export function HeroBuild({ position = "50% 62%" }: { position?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const biz = useBiz();
  const sr = biz.lang === "sr";
  const [phase, setPhase] = useState<"run" | "fade" | "gone">("run");

  useEffect(() => {
    const el = canvas.current;
    // The box the photo and the drawing fill (HeroSketch's [data-zoom]); the canvas covers it
    const host = el?.closest<HTMLElement>("[data-zoom]");
    if (!el || !host || !window.matchMedia("(min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // the photo is simply there
    const photo = host.querySelector<HTMLImageElement>("[data-photo] img");
    const line = host.querySelector<HTMLElement>(".build-line");
    const ctx = el.getContext("2d");
    if (!ctx || !photo || !line) return;

    // The CSS line's clock: its start time (plus its 0.3 s delay) is this timeline's zero. While the page
    // hydrates the animation can still be pending or be started afresh, so it's looked up on every frame.
    let startMs: number | null = null;
    const now = () => {
      const st = line.getAnimations?.()[0]?.startTime;
      if (st != null) startMs = Number(st);
      return startMs == null ? -1 : (performance.now() - startMs) / 1000 - 0.3;
    };
    if (now() > T.lights) return; // came back late (a background tab): the CSS has it covered

    const [ox, oy] = position.split(" ").map((s) => parseFloat(s) / 100);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cw = 0;
    let ch = 0;
    let box = { x: 0, y: 0, w: 0, h: 0 };
    const size = () => {
      cw = host.clientWidth;
      ch = host.clientHeight;
      el.width = Math.round(cw * dpr);
      el.height = Math.round(ch * dpr);
      // object-fit: cover at the photo's object-position, like the <img> under it
      const s = Math.max(cw / PW, ch / PH);
      box = { w: PW * s, h: PH * s, x: (cw - PW * s) * ox, y: (ch - PH * s) * oy };
      base = null;
    };
    const X = (x: number) => (box.x + (x / PW) * box.w) * dpr;
    const Y = (y: number) => (box.y + (y / PH) * box.h) * dpr;
    const poly = (c: CanvasRenderingContext2D, pts: readonly Pt[]) => {
      c.moveTo(X(pts[0][0]), Y(pts[0][1]));
      for (let i = 1; i < pts.length; i++) c.lineTo(X(pts[i][0]), Y(pts[i][1]));
      c.closePath();
    };
    // The photo as a bitmap decoded off the main thread at the size it's drawn (a sync decode is a long frame)
    let bitmap: ImageBitmap | null = null;
    let decoding = false;
    const decode = () => {
      decoding = true;
      const w = Math.round(box.w * dpr);
      const h = Math.round(box.h * dpr);
      createImageBitmap(photo, { resizeWidth: w, resizeHeight: h, resizeQuality: "high" }).then(
        (b) => {
          bitmap?.close();
          bitmap = b;
        },
        () => (decoding = false),
      );
    };
    const drawPhoto = (c: CanvasRenderingContext2D, alpha = 1) => {
      c.globalAlpha = alpha;
      c.drawImage(bitmap ?? photo, box.x * dpr, box.y * dpr, box.w * dpr, box.h * dpr);
      c.globalAlpha = 1;
    };

    // Pieces: each draws the photo inside its shape, revealed by p (0..1). Finished ones are kept on `base`.
    type Piece = { t0: number; dur: number; draw: (c: CanvasRenderingContext2D, p: number) => void };
    const pieces: Piece[] = [];
    // Floor: boards laid in rows from the front, each sliding in from the left; the island stays drawn.
    const fy0 = 788;
    for (let r = 0; r < FLOOR_ROWS; r++) {
      const a = Math.pow(r / FLOOR_ROWS, 0.75);
      const b = Math.pow((r + 1) / FLOOR_ROWS, 0.75);
      const yb = PH - a * (PH - fy0);
      const yt = PH - b * (PH - fy0);
      pieces.push({
        t0: T.floor + r * 0.07,
        dur: 0.42,
        draw: (c, p) => {
          c.save();
          c.beginPath();
          poly(c, FLOOR);
          c.clip();
          c.beginPath();
          c.rect(0, 0, el.width, el.height);
          poly(c, ISLAND);
          c.clip("evenodd");
          const e = ease(p);
          c.beginPath();
          c.rect(X(0), Y(yt) - 1, X(PW * e) - X(0), Y(yb) - Y(yt) + 2);
          c.clip();
          drawPhoto(c, Math.min(1, p * 2.5));
          c.restore();
          if (p < 1) {
            c.fillStyle = `rgba(196,151,100,${0.85 * (1 - p)})`;
            c.fillRect(X(PW * e) - dpr, Y(yt), 1.5 * dpr, Y(yb) - Y(yt));
          }
        },
      });
    }
    // Joinery: each piece rises from the floor.
    for (const j of JOINERY) {
      const ys = j.pts.map((q) => q[1]);
      const top = Math.min(...ys);
      const bot = Math.max(...ys);
      pieces.push({
        t0: T.joinery + j.at,
        dur: 0.6,
        draw: (c, p) => {
          const e = easeInOut(p);
          c.save();
          c.beginPath();
          poly(c, j.pts);
          c.clip();
          const yEdge = Y(bot - (bot - top) * e);
          c.beginPath();
          c.rect(0, yEdge, el.width, Y(bot) - yEdge + 2);
          c.clip();
          drawPhoto(c);
          c.restore();
        },
      });
    }
    // Stone: one slab, set from the top, with a bronze edge going down it.
    pieces.push({
      t0: T.stone,
      dur: 0.75,
      draw: (c, p) => {
        const e = easeInOut(p);
        const yEdge = Y(326 + (662 - 326) * e);
        c.save();
        c.beginPath();
        poly(c, STONE);
        c.clip();
        c.beginPath();
        c.rect(0, 0, el.width, yEdge);
        c.clip();
        drawPhoto(c);
        c.restore();
        if (p < 1) {
          c.fillStyle = `rgba(196,151,100,${0.9 * (1 - p)})`;
          c.fillRect(X(376), yEdge - dpr, X(748) - X(376), 1.5 * dpr);
        }
      },
    });

    let base: HTMLCanvasElement | null = null;
    let committed = 0;
    const commit = (upTo: number) => {
      if (!base) {
        base = document.createElement("canvas");
        base.width = el.width;
        base.height = el.height;
        committed = 0;
      }
      const b = base.getContext("2d")!;
      while (committed < upTo) pieces[committed++].draw(b, 1);
    };

    // Pencil dimensions, drawn while the drafting line works, gone when the lights come on.
    const mono = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace";
    const dimLabelH = sr ? "2,80 m" : "9′-2″";
    const dimLabelV = sr ? "90 cm" : "36″";
    const dims = (c: CanvasRenderingContext2D, t: number, alpha: number) => {
      if (alpha <= 0) return;
      const p1 = ease((t - T.dims) / 1.1);
      const p2 = ease((t - T.dims - 0.5) / 0.9);
      c.save();
      c.globalAlpha = alpha;
      c.strokeStyle = "rgba(62,54,46,0.85)";
      c.fillStyle = "rgba(62,54,46,0.9)";
      c.lineWidth = dpr;
      const tick = (x: number, y: number) => {
        c.moveTo(x - 5 * dpr, y + 5 * dpr);
        c.lineTo(x + 5 * dpr, y - 5 * dpr);
      };
      // across the wall cabinets, just under them
      if (p1 > 0) {
        const y = Y(586);
        const x0 = X(360);
        const x1 = X(731);
        c.beginPath();
        c.moveTo(x0, y);
        c.lineTo(x0 + (x1 - x0) * p1, y);
        c.moveTo(x0, y - 7 * dpr);
        c.lineTo(x0, y + 7 * dpr);
        tick(x0, y);
        if (p1 > 0.98) {
          c.moveTo(x1, y - 7 * dpr);
          c.lineTo(x1, y + 7 * dpr);
          tick(x1, y);
        }
        c.stroke();
        if (p1 > 0.6) label(c, dimLabelH, (x0 + x1) / 2, y - 12 * dpr, (p1 - 0.6) / 0.4);
      }
      // the island's height, at its far end
      if (p2 > 0) {
        const x = X(62);
        const y0 = Y(800);
        const y1 = Y(668);
        c.beginPath();
        c.moveTo(x, y0);
        c.lineTo(x, y0 + (y1 - y0) * p2);
        c.moveTo(x - 7 * dpr, y0);
        c.lineTo(x + 7 * dpr, y0);
        tick(x, y0);
        if (p2 > 0.98) {
          c.moveTo(x - 7 * dpr, y1);
          c.lineTo(x + 7 * dpr, y1);
          tick(x, y1);
        }
        c.stroke();
        if (p2 > 0.6) label(c, dimLabelV, x + 30 * dpr, (y0 + y1) / 2, (p2 - 0.6) / 0.4);
      }
      c.restore();
    };
    const label = (c: CanvasRenderingContext2D, text: string, x: number, y: number, a: number) => {
      c.save();
      c.globalAlpha *= clamp(a);
      c.font = `500 ${11 * dpr}px ${mono}`;
      const w = c.measureText(text).width + 12 * dpr;
      const h = 18 * dpr;
      c.fillStyle = "rgba(248,246,242,0.92)";
      c.fillRect(x - w / 2, y - h / 2, w, h);
      c.fillStyle = "rgba(41,35,30,0.95)";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(text, x, y + dpr);
      c.restore();
    };

    // Lights on: warm halos under the downlights and the two rings, a flare that settles.
    const glow = (c: CanvasRenderingContext2D, l: number) => {
      if (l <= 0) return;
      const flare = l < 0.35 ? l / 0.35 : 1 - 0.55 * ease((l - 0.35) / 0.65);
      const s = (box.w / PW) * dpr;
      c.save();
      c.globalCompositeOperation = "lighter";
      for (const [x, y] of DOWNLIGHTS) {
        const r = 26 * s;
        const g = c.createRadialGradient(X(x), Y(y), 0, X(x), Y(y), r);
        g.addColorStop(0, `rgba(255,236,205,${0.75 * flare})`);
        g.addColorStop(0.25, `rgba(255,214,160,${0.28 * flare})`);
        g.addColorStop(1, "rgba(255,200,140,0)");
        c.fillStyle = g;
        c.fillRect(X(x) - r, Y(y) - r, 2 * r, 2 * r);
      }
      for (const { c: [x, y], rx } of PENDANTS) {
        c.save();
        c.translate(X(x), Y(y) + 6 * s);
        c.scale(1, 0.32);
        const r = rx * 1.5 * s;
        const g = c.createRadialGradient(0, 0, r * 0.4, 0, 0, r);
        g.addColorStop(0, `rgba(255,222,176,${0.42 * flare})`);
        g.addColorStop(1, "rgba(255,210,150,0)");
        c.fillStyle = g;
        c.fillRect(-r, -r, 2 * r, 2 * r);
        c.restore();
      }
      c.restore();
    };

    let raf = 0;
    let timer = 0;
    let started = false;
    const frame = () => {
      raf = 0;
      const t = now();
      if (!started) {
        // The drawing under the canvas is plain HTML; the photo has to be here. Too late: the CSS shows it alone.
        if (ready(photo) && !decoding) {
          size();
          decode();
        }
        if (!bitmap) {
          if (t > T.lights - 0.3) return setPhase("gone");
          raf = requestAnimationFrame(frame);
          return;
        }
        started = true;
      }
      if (!cw || host.clientWidth !== cw || host.clientHeight !== ch) size();
      const c = ctx;
      c.clearRect(0, 0, el.width, el.height);
      // finished pieces, in order, go onto the base once
      let done = committed;
      while (done < pieces.length && t >= pieces[done].t0 + pieces[done].dur) done++;
      commit(done);
      if (base) c.drawImage(base, 0, 0);
      for (let i = done; i < pieces.length; i++) {
        const p = (t - pieces[i].t0) / pieces[i].dur;
        if (p > 0) pieces[i].draw(c, clamp(p));
      }
      const l = clamp((t - T.lights) / 0.9);
      if (l > 0) drawPhoto(c, easeInOut(l));
      // Unlit until the lights come on: what's built so far sits a little in shadow
      const dim = 0.15 * (1 - easeInOut(l));
      if (dim > 0.002) {
        c.globalCompositeOperation = "source-atop";
        c.fillStyle = `rgba(28,22,17,${dim})`;
        c.fillRect(0, 0, el.width, el.height);
        c.globalCompositeOperation = "source-over";
      }
      dims(c, t, 1 - easeInOut((t - T.lights) / 0.5));
      glow(c, clamp((t - T.lights) / 1.6));
      if (t >= T.fade) {
        // the last frame (halos and all) stays on the canvas while it fades out over the photo
        setPhase("fade");
        timer = window.setTimeout(() => setPhase("gone"), Math.max(0, (T.gone - t) * 1000));
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(() => (cw = 0));
    ro.observe(host);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      bitmap?.close();
      ro.disconnect();
    };
  }, [position, sr]);

  if (phase === "gone") return null;
  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-1 h-full w-full transition-opacity duration-[1200ms] ease-out"
      style={{ opacity: phase === "fade" ? 0 : 1 }}
    />
  );
}
