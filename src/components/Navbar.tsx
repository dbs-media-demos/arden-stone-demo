"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, CONTACT } from "@/lib/site";
import { scroll } from "@/lib/scroll";
import MagneticButton from "./MagneticButton";

const menuVariants = {
  closed: { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], when: "afterChildren" as const } },
  open: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], when: "beforeChildren" as const, staggerChildren: 0.07 } },
};

const itemVariants = {
  closed: { y: 80, opacity: 0, transition: { duration: 0.3 } },
  open: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

/**
 * Fixed header: transparent over the hero, frosted after scroll, hides on
 * scroll-down / returns on scroll-up. Mobile menu is a full-screen ink
 * overlay with staggered oversized links.
 */
const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 60);
    setIsHidden(latest > prev && latest > 300 && !isOpen);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) scroll.lenis?.stop();
    else scroll.lenis?.start();
    return () => {
      document.body.style.overflow = "";
      scroll.lenis?.start();
    };
  }, [isOpen]);

  const darkText = isScrolled || isOpen;

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          isScrolled && !isOpen ? "bg-ivory/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"
        }`}
        animate={{ y: isHidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container flex h-20 items-center justify-between">
          <Link
            href="/"
            className={`font-display text-lg md:text-xl tracking-[0.18em] uppercase transition-colors duration-500 ${
              isOpen ? "text-ivory" : darkText ? "text-ink" : "text-ivory"
            }`}
          >
            Arden <span className="text-bronze-light">&amp;</span> Stone
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`link-sweep font-body text-[13px] uppercase tracking-[0.22em] transition-colors duration-500 ${
                  pathname === link.href ? "is-active" : ""
                } ${darkText ? "text-ink/80 hover:text-ink" : "text-ivory/80 hover:text-ivory"}`}
              >
                {link.label}
              </Link>
            ))}
            <MagneticButton>
              <Link
                href="/contact"
                className={`border px-6 py-2.5 font-body text-[12px] uppercase tracking-[0.22em] transition-all duration-500 ${
                  darkText
                    ? "border-ink/25 text-ink hover:bg-ink hover:text-ivory"
                    : "border-ivory/40 text-ivory hover:bg-ivory hover:text-ink"
                }`}
              >
                Start a project
              </Link>
            </MagneticButton>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-[7px] md:hidden"
          >
            <motion.span
              className={`block h-px w-7 ${isOpen ? "bg-ivory" : darkText ? "bg-ink" : "bg-ivory"}`}
              animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className={`block h-px w-7 ${isOpen ? "bg-ivory" : darkText ? "bg-ink" : "bg-ivory"}`}
              animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-8 pb-10 pt-32 md:hidden"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <div key={link.href} className="overflow-hidden">
                  <motion.div variants={itemVariants}>
                    <Link
                      href={link.href}
                      className={`flex items-baseline gap-4 font-display text-5xl text-ivory transition-colors hover:text-bronze-light ${
                        pathname === link.href ? "text-bronze-light" : ""
                      }`}
                    >
                      <span className="font-body text-xs tracking-widest text-ivory/30">0{i + 1}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div variants={itemVariants} className="space-y-2">
              <p className="font-body text-xs uppercase tracking-[0.3em] text-ivory/40">Studio</p>
              <p className="font-body text-sm text-ivory/70">
                {CONTACT.street}, {CONTACT.locality}
              </p>
              <p className="font-body text-sm text-bronze-light">{CONTACT.email}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
