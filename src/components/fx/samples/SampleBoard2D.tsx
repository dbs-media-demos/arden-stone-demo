"use client";

import { useRef, useState } from "react";
import anchors from "./anchors.json";

/** Desktop only, like the 3D board: nothing below 1024 px fetches the picture. */
const NOT_DESK = "(max-width: 1023.98px)";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const SIZES = "(min-width: 1680px) 1580px, 94vw";
const set = (ext: string) => `/images/samples/board-1400.${ext} 1400w, /images/samples/board-2400.${ext} 2400w`;

/**
 * /v2's sample board (no WebGL): the still of the 3D board (MaterialsBoard's own picture), lit by a
 * low warm light that follows the pointer over the board, in CSS. A sample's name lifts on hover and
 * the light settles on that sample. Same picture, names and hint as at /.
 */
export function SampleBoard2D({ names, hint }: { names: string[]; hint: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const aim = (x: number, y: number) => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--bx", `${x * 100}%`);
    el.style.setProperty("--by", `${y * 100}%`);
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || active !== null) return;
    const r = e.currentTarget.getBoundingClientRect();
    aim((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  const lift = (i: number | null) => {
    setActive(i);
    // the label sits under its sample: light the sample itself
    if (i !== null) aim(anchors[i].x, Math.max(0, anchors[i].y - 0.2));
  };

  return (
    <div>
      <div
        ref={stage}
        className="sample-board sample-board-2d relative aspect-[12/5] overflow-hidden rounded-sm bg-stone"
        onPointerMove={move}
        onPointerEnter={() => stage.current?.setAttribute("data-lit", "")}
        onPointerLeave={() => {
          stage.current?.removeAttribute("data-lit");
          setActive(null);
        }}
      >
        <picture>
          <source media={NOT_DESK} srcSet={BLANK} />
          <source type="image/avif" srcSet={set("avif")} sizes={SIZES} />
          <img src="/images/samples/board-2400.webp" srcSet={set("webp")} sizes={SIZES} width={2400} height={1000} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <span aria-hidden className="board-light" />
        <ol className="pointer-events-none absolute inset-0">
          {names.map((n, i) => (
            <li key={n} className="sample-label absolute" style={{ left: `${anchors[i].x * 100}%`, top: `${anchors[i].y * 100}%` }} data-active={active === i || undefined}>
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
