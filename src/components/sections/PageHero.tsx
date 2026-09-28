import type { CSSProperties, ReactNode } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Lines, Parallax } from "@/components/ui/Reveal";
import type { Pic } from "@/lib/images";

type Props = {
  crumbs: { name: string; path: string }[];
  eyebrow: string;
  title: ReactNode[];
  lede?: ReactNode;
  image?: Pic;
  /** Shared-element name so a card image can morph into this hero. */
  morph?: string;
  aside?: ReactNode;
  sheet?: string;
};

/** Inner-page opener: breadcrumbs, masked headline (CSS intro), lede, then a wide photo. */
export function PageHero({ crumbs, eyebrow, title, lede, image, morph, aside, sheet }: Props) {
  const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
  const photo = image && (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      preload
      sizes="(min-width: 1680px) 1580px, 96vw"
      quality={75}
      placeholder="blur"
      blurDataURL={image.blurDataURL}
      className="object-cover"
    />
  );

  return (
    <header className="pt-[calc(var(--header-h)+2rem)] md:pt-[calc(var(--header-h)+3.5rem)]">
      <div className="shell">
        <Breadcrumbs items={crumbs} className="anim-fade" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow anim-fade mb-6" style={d(0.05)}>
              {eyebrow}
            </p>
            <h1>
              <Lines className="display-xl text-balance" lines={title} delay={0.1} />
            </h1>
          </div>
          {(lede || aside) && (
            <div className="anim-fade lg:col-span-4" style={d(0.4)}>
              {lede && <div className="lede">{lede}</div>}
              {aside}
            </div>
          )}
        </div>
      </div>
      {image && (
        <div className="shell mt-12 md:mt-16">
          <Parallax reveal={false} amount={10} className="aspect-[4/5] rounded-sm bg-paper sm:aspect-[16/9] lg:aspect-[21/9]">
            <div className="absolute inset-0">
              {morph ? (
                <ViewTransition name={morph} share="morph" default="none">
                  <div className="absolute inset-0">{photo}</div>
                </ViewTransition>
              ) : (
                photo
              )}
            </div>
          </Parallax>
          {sheet && <p className="label mt-3 text-faint">{sheet}</p>}
        </div>
      )}
    </header>
  );
}
