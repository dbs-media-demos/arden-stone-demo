"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Pin = { slug: string; short: string; name: string; x: number; y: number; drive: string };

/**
 * A drafted map of Dallas–Fort Worth: freeways and the Trinity River as pen lines,
 * our service areas as pins. Lines draw themselves in when the map scrolls into view.
 */
export function AreaMap({ pins, className }: { pins: Pin[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const paths = gsap.utils.toArray<SVGPathElement>("[data-draw]", root.current);
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const dots = gsap.utils.toArray<SVGGElement>("[data-pin]", root.current);
      gsap.set(dots, { scale: 0, transformOrigin: "center" });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(paths, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut", stagger: 0.08 });
          gsap.to(dots, { scale: 1, duration: 0.8, ease: "back.out(2)", stagger: 0.1, delay: 1 });
        },
      });
    },
    { scope: root },
  );

  const studio = { x: 57, y: 50 };

  return (
    <div ref={root} className={clsx("relative", className)}>
      <svg viewBox="0 0 100 70" className="h-auto w-full text-fg" role="img" aria-label="Map of the Dallas–Fort Worth area showing Arden & Stone's service areas">
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M5 0H0V5" fill="none" stroke="currentColor" strokeWidth=".05" opacity=".35" />
          </pattern>
        </defs>
        <rect width="100" height="70" fill="url(#grid)" />
        {/* Trinity River */}
        <path data-draw d="M2 52C12 50 16 58 24 55S34 46 42 50S50 58 56 54S60 44 66 47S76 58 86 56S94 60 98 58" fill="none" stroke="var(--bronze)" strokeWidth=".45" opacity=".7" />
        {/* Freeways, roughly: I-30, I-20, I-35E, I-35W, I-635, US-75, Loop 820, SH-114 */}
        <g fill="none" stroke="currentColor" strokeWidth=".28" opacity=".55">
          <path data-draw d="M4 56H96" />
          <path data-draw d="M4 64C30 63 60 64 96 63" />
          <path data-draw d="M56 4C57 20 58 34 57 50S56 64 55 69" />
          <path data-draw d="M18 4C18 22 17 40 18 69" />
          <path data-draw d="M40 30C48 26 64 25 74 30S80 44 74 52" />
          <path data-draw d="M60 4C60 20 61 36 59 50" />
          <path data-draw d="M18 44C8 44 6 56 10 62S26 68 28 58 26 44 18 44Z" />
          <path data-draw d="M20 20C30 24 40 32 50 38" />
        </g>
        <text x="60.5" y="7" fontSize="1.6" fill="currentColor" opacity=".45" fontFamily="var(--font-plex-mono)">US-75</text>
        <text x="80" y="54.5" fontSize="1.6" fill="currentColor" opacity=".45" fontFamily="var(--font-plex-mono)">I-30</text>
        <text x="64" y="27" fontSize="1.6" fill="currentColor" opacity=".45" fontFamily="var(--font-plex-mono)">I-635</text>
        <text x="84" y="61" fontSize="1.6" fill="var(--bronze)" opacity=".8" fontFamily="var(--font-plex-mono)">Trinity River</text>

        {/* Studio */}
        <g data-pin>
          <rect x={studio.x - 1.1} y={studio.y - 1.1} width="2.2" height="2.2" fill="var(--bronze)" />
          <text x={studio.x - 2} y={studio.y + 3.6} fontSize="1.7" textAnchor="end" fill="currentColor" fontFamily="var(--font-plex-mono)">
            STUDIO · DESIGN DISTRICT
          </text>
        </g>

        {pins.map((p) => (
          <g key={p.slug} data-pin className="cursor-pointer" onPointerEnter={() => setHover(p.slug)} onPointerLeave={() => setHover(null)}>
            <circle cx={p.x} cy={p.y} r={hover === p.slug ? 2.6 : 1.9} fill="var(--bg)" stroke="currentColor" strokeWidth=".3" style={{ transition: "r .4s" }} />
            <circle cx={p.x} cy={p.y} r=".7" fill="currentColor" />
            <text x={p.x} y={p.y - 3.2} fontSize="2.3" textAnchor="middle" fill="currentColor" fontFamily="var(--font-cormorant)" fontStyle={hover === p.slug ? "italic" : "normal"}>
              {p.short}
            </text>
          </g>
        ))}
      </svg>

      <ul className="mt-8 grid gap-px border-y border-line sm:grid-cols-2 lg:grid-cols-3">
        {pins.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/areas/${p.slug}`}
              onPointerEnter={() => setHover(p.slug)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(p.slug)}
              onBlur={() => setHover(null)}
              className={clsx("flex h-full flex-col gap-1 py-4 pr-4 transition-colors", hover === p.slug && "text-accent")}
            >
              <span className="font-display text-2xl leading-tight">{p.name}</span>
              <span className="label text-faint">{p.drive}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
