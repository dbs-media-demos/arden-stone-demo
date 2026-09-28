import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { Parallax, SplitReveal } from "@/components/ui/Reveal";
import type { Pic } from "@/lib/images";
import { site } from "@/lib/site";

/** Closing call to action used on inner pages (image + headline + two actions). */
export function CtaBand({ title, text, image }: { title: React.ReactNode; text: string; image: Pic }) {
  return (
    <section className="shell py-24 md:py-32" aria-label="Get in touch">
      <div className="grid overflow-hidden rounded-sm bg-paper md:grid-cols-2">
        <Parallax className="min-h-[300px] md:min-h-[520px]">
          <div className="absolute inset-0">
            <Img pic={image} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </Parallax>
        <div className="flex flex-col justify-center p-8 md:p-14">
          <SplitReveal className="display-l">{title}</SplitReveal>
          <p className="mt-6 max-w-md text-muted leading-relaxed">{text}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact">Book a consultation</Button>
            <Button href={site.phoneHref} variant="line" arrow={false}>
              {site.phone}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
