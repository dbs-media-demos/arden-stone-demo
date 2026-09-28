"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";
import { NAV_LINKS, CONTACT, SITE_NAME } from "@/lib/site";
import AnimatedSection from "./AnimatedSection";
import Marquee from "./Marquee";

const Footer = () => (
  <footer className="bg-ink text-ivory">
    {/* CTA marquee */}
    <Link href="/contact" className="group block border-b border-ivory/10 py-10 md:py-14" data-cursor-label="Let's talk">
      <Marquee slow>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mx-8 flex items-center gap-6 font-display text-4xl md:text-6xl text-ivory/90 transition-colors duration-500 group-hover:text-bronze-light"
          >
            Start your renovation
            <ArrowUpRight className="h-8 w-8 md:h-12 md:w-12 text-bronze-light" strokeWidth={1} />
          </span>
        ))}
      </Marquee>
    </Link>

    <div className="container py-16 md:py-24">
      <AnimatedSection>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl tracking-[0.18em] uppercase">
              Arden <span className="text-bronze-light">&amp;</span> Stone
            </p>
            <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-ivory/50">
              A full-service renovation studio crafting considered, enduring homes. Design, build and
              interiors under one roof — one accountable team from first sketch to final styling.
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 transition-all duration-300 hover:border-bronze-light hover:text-bronze-light"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 transition-all duration-300 hover:border-bronze-light hover:text-bronze-light"
              >
                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-6 !text-ivory/40">Navigate</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-sweep font-body text-sm text-ivory/70 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow mb-6 !text-ivory/40">Studio</p>
            <address className="space-y-3 font-body text-sm not-italic text-ivory/70">
              <p>{CONTACT.street}</p>
              <p>
                {CONTACT.locality}, {CONTACT.postalCode}
              </p>
              <p className="pt-2">
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-bronze-light">
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-bronze-light">
                  {CONTACT.email}
                </a>
              </p>
              <p className="pt-2 text-ivory/40">{CONTACT.hours}</p>
            </address>
          </div>
        </div>
      </AnimatedSection>

      <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 md:flex-row">
        <p className="font-body text-xs tracking-wider text-ivory/30">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
        <p className="font-body text-xs tracking-wider text-ivory/30">Design &amp; build, without compromise.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
