import Link from "next/link";
import { Mark } from "@/components/brand/Logo";
import { ImageTrail } from "@/components/fx/ImageTrail";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { RatingPill } from "@/components/ui/Bits";
import { AREAS } from "@/data/areas";
import { SERVICES } from "@/data/services";
import { pic, type ImageKey } from "@/lib/images";
import { site } from "@/lib/site";
import { defaultBiz } from "@/lib/biz";
import { L, telOf, type Biz } from "@/lib/biz-core";

const TRAIL: ImageKey[] = [
  "kitchen/warm-white",
  "bath/travertine-suite",
  "living/traditional",
  "outdoor/loggia-kitchen",
  "exterior/tudor",
  "interior/arched-bed",
  "kitchen/walnut-island",
  "hero/modern-dusk-2",
  "bath/sunlit-tub",
  "living/terracotta",
];

export function Footer({ biz = defaultBiz }: { biz?: Biz }) {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-ink relative overflow-hidden pb-24 md:pb-10 phone:pb-20">
      <ImageTrail pics={TRAIL.map((k) => pic(k, ""))} className="relative">
        <div className="shell relative py-24 phone:py-8 md:py-36">
          <p className="eyebrow mb-8 phone:mb-2.5">Start with a conversation</p>
          <p className="display-xxl max-w-[14ch] text-balance">
            Let&rsquo;s draw your <em className="italic-accent">home.</em>
          </p>
          <div className="mt-12 flex flex-col gap-6 phone:mt-5 phone:gap-4 md:flex-row md:items-center md:justify-between phone:flex-col phone:items-stretch">
            <div className="flex flex-wrap items-center gap-4 phone:gap-2.5 phone:[&_.btn]:w-full phone:[&>span]:w-full">
              <Button href="/contact">Book a consultation</Button>
              {/* The bar and the details below carry the number on phones */}
              {biz.phone && (
                <span className="contents phone:hidden">
                  <Button href={telOf(biz)!} variant="line" arrow={false}>
                    {biz.phoneDisplay}
                  </Button>
                </span>
              )}
            </div>
            <p className="max-w-sm text-muted">The first visit is free, takes about ninety minutes, and you will leave with an honest budget range.</p>
          </div>
        </div>
      </ImageTrail>

      <div className="shell relative">
        <div className="hairline" />
        <div className="grid gap-12 py-16 phone:grid-cols-2 phone:gap-x-4 phone:gap-y-4 phone:py-5 sm:grid-cols-2 lg:grid-cols-12">
          <div className="phone:col-span-2 lg:col-span-4">
            <address className="not-italic">
              {biz.preview ? (
                <p className="font-display text-3xl leading-tight phone:text-2xl">{biz.address.full}</p>
              ) : (
                <>
                  <p className="font-display text-3xl leading-tight phone:text-2xl">
                    {site.address.street}
                    <br />
                    {site.address.locality}, {site.address.region} {site.address.postalCode}
                  </p>
                  <p className="label mt-3 text-faint">{site.address.district}</p>
                </>
              )}
            </address>
            <div className="mt-8 grid gap-3 phone:mt-3 phone:flex phone:flex-wrap phone:items-center phone:gap-x-4 phone:gap-y-1.5">
              {biz.phone && (
                <a href={telOf(biz)!} className="link-draw w-fit tabular text-lg">
                  {biz.phoneDisplay}
                </a>
              )}
              {!biz.preview && (
                <a href={`mailto:${site.email}`} className="link-draw w-fit">
                  {site.email}
                </a>
              )}
              <OpenBadge className="mt-2 text-muted" />
              <RatingPill className="mt-1 text-ivory" />
            </div>
          </div>

          <FooterCol title="Services" className="lg:col-span-3" links={SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.title }))} />
          <FooterCol
            title="Studio"
            className="lg:col-span-2"
            links={[
              { href: "/work", label: "Work" },
              { href: "/process", label: "Process" },
              { href: "/estimate", label: "Cost estimator" },
              { href: "/about", label: "About" },
              { href: "/reviews", label: "Reviews" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Areas"
            className="footer-areas phone:col-span-2 lg:col-span-3"
            links={biz.preview ? [{ href: "/areas", label: biz.area }] : [{ href: "/areas", label: "All service areas" }, ...AREAS.map((a) => ({ href: `/areas/${a.slug}`, label: a.name }))]}
          />
        </div>

        <div className="hairline" />
        <div className="flex flex-col gap-4 py-8 text-sm text-faint phone:gap-1.5 phone:py-3 md:flex-row md:items-center md:justify-between phone:flex-col phone:items-start">
          <p>
            {biz.preview
              ? `© ${year} ${biz.name}. ${L(biz, `A preview homepage made for ${biz.name}.`, `Pregled početne strane napravljen za ${biz.name}.`)}`
              : `© ${year} ${site.legalName}. A fictional studio.`}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="link-draw hover:text-ivory">
              Privacy
            </Link>
            <a href={site.agencyUrl} target="_blank" rel="noopener" className="link-draw hover:text-ivory">
              Design &amp; development: {site.agency}
            </a>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none flex items-end justify-between gap-6 pt-4 text-ivory/[0.07] select-none phone:pt-0">
          <svg viewBox="0 0 1000 150" className="h-auto w-full min-w-0 flex-1 overflow-visible" aria-hidden focusable="false">
            <text x="0" y="128" fill="currentColor" fontFamily="var(--font-cormorant)" fontSize="172" letterSpacing="-6" textLength="1000" lengthAdjust="spacingAndGlyphs">
              {biz.preview ? biz.shortName : "Arden & Stone"}
            </text>
          </svg>
          <Mark className="mb-[2vw] hidden h-[9vw] w-[9vw] shrink-0 md:block [--mark-accent:currentColor] [--ivory:var(--ink)]" />
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, className }: { title: string; links: { href: string; label: string }[]; className?: string }) {
  return (
    <nav aria-label={title} className={className}>
      <p className="label mb-5 text-faint phone:mb-2">{title}</p>
      <ul className="footer-links grid gap-2.5 phone:gap-0 phone:text-[0.875rem]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-draw text-ivory/85 hover:text-ivory">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
