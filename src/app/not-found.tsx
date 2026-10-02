import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Reveal";
import { pic } from "@/lib/images";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

const sketch = pic("process/sketch-linen-after", "");

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="theme-ivory relative flex min-h-svh items-center overflow-hidden">
        <Image src={sketch.src} alt="" fill sizes="100vw" quality={60} className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/85 to-ivory/30" />
        <div className="shell relative py-40">
          <p className="eyebrow anim-fade mb-6">Error 404 · Sheet missing</p>
          <h1>
            <Lines className="display-xxl" lines={["This room", <em key="2" className="italic-accent">isn&rsquo;t built yet.</em>]} delay={0.1} />
          </h1>
          <p className="lede anim-fade mt-8 max-w-md" style={{ "--d": "0.4s" } as React.CSSProperties}>
            The page you&rsquo;re looking for has moved or never existed. The drawing above is all we have of it.
          </p>
          <div className="anim-fade mt-10 flex flex-wrap items-center gap-6" style={{ "--d": "0.55s" } as React.CSSProperties}>
            <Button href="/">Back to the home page</Button>
            <Link href="/work" className="label link-draw">
              See our work
            </Link>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
