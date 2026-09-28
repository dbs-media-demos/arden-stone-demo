import Image from "next/image";
import type { Pic } from "@/lib/images";

/** Endless strip of material swatches (CSS animation; pauses on hover). */
export function MaterialMarquee({ items }: { items: { pic: Pic; name: string }[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee overflow-hidden py-4" style={{ "--marquee-duration": "60s" } as React.CSSProperties}>
      <ul className="marquee-track flex w-max gap-5">
        {row.map((m, i) => (
          <li key={i} aria-hidden={i >= items.length} className="group w-48 shrink-0 md:w-60">
            <div className="relative aspect-square overflow-hidden rounded-full">
              <Image
                src={m.pic.src}
                alt={i >= items.length ? "" : m.pic.alt}
                fill
                sizes="240px"
                quality={60}
                className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110"
              />
            </div>
            <p className="label mt-4 text-center text-muted">{m.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
