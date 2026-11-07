import Image from "next/image";
import clsx from "clsx";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { TEAM } from "@/data/studio";
import { pic, type ImageKey } from "@/lib/images";
import { L, type Biz } from "@/lib/biz-core";

/** On a preview: who does the work, by role. The concept site's named people aren't a real firm's. */
const ROLES: { en: [string, string]; sr: [string, string]; key: ImageKey; alt: [string, string] }[] = [
  {
    en: ["Project lead", "Your one point of contact, from first drawing to handover."],
    sr: ["Vođa projekta", "Vaša jedna kontakt osoba, od prvog crteža do primopredaje."],
    key: "process/drafting",
    alt: ["Architect drafting a plan with a scale rule", "Arhitekta crta plan uz razmernik"],
  },
  {
    en: ["Site lead", "On the job every working day, with a written report every Friday."],
    sr: ["Šef gradilišta", "Na licu mesta svakog radnog dana, uz pisani izveštaj svakog petka."],
    key: "process/framing-interior",
    alt: ["House interior during framing with exposed timber studs", "Unutrašnjost kuće tokom gradnje sa vidljivom drvenom konstrukcijom"],
  },
  {
    en: ["Workshop makers", "Every cabinet, door and stair, made in our own workshop."],
    sr: ["Majstori u radionici", "Svaki ormarić, vrata i stepenište iz naše radionice."],
    key: "craft/sanding",
    alt: ["Craftsperson sanding timber in the workshop", "Majstor brusi drvo u radionici"],
  },
  {
    en: ["Interiors team", "Plaster, timber, stone and textile, sampled together in your rooms."],
    sr: ["Tim za enterijer", "Malter, drvo, kamen i tekstil, isprobani zajedno u vašim prostorijama."],
    key: "process/samples",
    alt: ["Material samples laid out on a table", "Uzorci materijala na stolu"],
  },
];

/** Phones only, before the form: the people who draw and build it, swiped through. */
export function PhoneTeam({ biz, className }: { biz: Biz; className?: string }) {
  const cards = biz.preview
    ? ROLES.map((r) => ({ title: L(biz, r.en[0], r.sr[0]), sub: "", text: L(biz, r.en[1], r.sr[1]), image: pic(r.key, L(biz, r.alt[0], r.alt[1])), portrait: false }))
    : TEAM.map((m) => ({ title: m.name, sub: m.role, text: "", image: pic(m.image.key, m.image.alt), portrait: true }));
  return (
    <section className={clsx("hidden py-6 phone:block", className)} aria-labelledby="team-title">
      <div className="shell">
        <p className="eyebrow mb-2.5">{L(biz, "The team", "Tim")}</p>
        <h2 id="team-title" className="display-l">
          {biz.lang === "sr" ? (
            <>
              Ljudi koji crtaju <em className="italic-accent">i grade.</em>
            </>
          ) : (
            <>
              The people who draw <em className="italic-accent">and build it.</em>
            </>
          )}
        </h2>
      </div>
      <ul className="swipe mt-3.5">
        {cards.map((c) => (
          <li key={c.title}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-sm bg-paper">
              <Image src={c.image.src} alt={c.image.alt} fill sizes="45vw" quality={60} className={clsx("object-cover", c.portrait && "duotone object-[50%_18%]")} />
            </div>
            <h3 className="display-s mt-2.5">{c.title}</h3>
            {c.sub && <p className="label mt-1 text-faint">{c.sub}</p>}
            {c.text && <p className="mt-1 text-sm leading-[1.4] text-muted">{c.text}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Phones only: the form closes the page, and the bar's "Get a quote" lands here. */
export function QuoteSection({ biz, className }: { biz: Biz; className?: string }) {
  return (
    <section id="quote" className={clsx("theme-stone hidden py-6 phone:block", className)} aria-labelledby="quote-title">
      <div className="shell">
        <p className="eyebrow mb-2.5">{L(biz, "Get a quote", "Zatražite ponudu")}</p>
        <h2 id="quote-title" className="display-l">
          {biz.lang === "sr" ? (
            <>
              Opišite nam <em className="italic-accent">svoj</em> projekat.
            </>
          ) : (
            <>
              Tell us about <em className="italic-accent">your</em> project.
            </>
          )}
        </h2>
        <QuoteForm />
      </div>
    </section>
  );
}
