"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { NAV, site } from "@/lib/site";
import { useBiz, useT } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

const MENU_IMAGES: Record<string, string> = {
  "/work": "/images/hero/modern-dusk-2.jpg",
  "/services": "/images/kitchen/warm-white.jpg",
  "/process": "/images/process/sketch-warm-white.jpg",
  "/estimate": "/images/material/marble.jpg",
  "/about": "/images/craft/pencil-mark.jpg",
  "/contact": "/images/living/traditional.jpg",
};

export function Header() {
  const biz = useBiz();
  const t = useT();
  const phoneHref = telOf(biz) ?? "";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hover, setHover] = useState<string>("/work");
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, reveal on scroll up; gain a backdrop once away from the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > 160 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation (derived during render, no effect needed).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          solid && !open ? "bg-ivory/80 backdrop-blur-md" : "bg-transparent",
          // Phones: opaque from the first pixel, nothing shows through
          !open && "phone:bg-ivory phone:backdrop-blur-none",
          open ? "text-ivory" : "text-ink",
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label={`${biz.name}, ${biz.lang === "sr" ? "početna" : "home"}`} className="relative z-10 [--mark-accent:var(--bronze)]">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.78rem] font-semibold tracking-[0.14em] uppercase">
              {NAV.slice(0, 5).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className="link-draw pb-1">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3 md:gap-5">
            <a href={phoneHref} className="hidden label md:inline-flex tabular link-draw pb-1">
              {biz.phoneDisplay}
            </a>
            <Link href="/contact" className={clsx("btn hidden min-h-11 px-5 sm:inline-flex", open ? "btn-line border-ivory/40 text-ivory" : "btn-solid")}>
              {t("Book a consultation")}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-7">
                <span className={clsx("absolute left-0 h-px w-full bg-current transition-transform duration-500", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={clsx("absolute left-0 h-px w-full bg-current transition-transform duration-500", open ? "top-1.5 -rotate-45" : "top-3")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu (mobile / tablet). */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={clsx(
          "theme-ink fixed inset-0 z-40 flex flex-col overflow-y-auto transition-[clip-path] duration-[900ms] ease-[var(--ease-in-out-quart)] lg:hidden",
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
        )}
      >
        {open && (
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <Image key={hover} src={MENU_IMAGES[hover] ?? MENU_IMAGES["/work"]} alt="" fill sizes="100vw" quality={60} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
          </div>
        )}
        <nav aria-label="Menu" className="shell relative mt-[calc(var(--header-h)+2rem)] flex-1">
          <ul>
            {[{ href: "/", label: "Home" }, ...NAV].map((l, i) => (
              <li key={l.href} className="overflow-hidden border-b border-line">
                <Link
                  href={l.href}
                  onPointerEnter={() => setHover(l.href)}
                  onFocus={() => setHover(l.href)}
                  className={clsx(
                    "flex items-baseline justify-between py-3 font-display text-[2.6rem] leading-none transition-transform duration-[900ms] ease-[var(--ease-out-expo)] sm:text-6xl",
                    open ? "translate-y-0" : "translate-y-full",
                  )}
                  style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                >
                  <span className={clsx(active(l.href) && l.href !== "/" && "italic text-bronze-light")}>{l.label}</span>
                  <span className="label text-faint">{String(i).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="shell relative grid gap-2 pt-8 pb-32 text-sm text-muted">
          <a href={phoneHref} className="font-display text-3xl text-ivory tabular">
            {biz.phoneDisplay}
          </a>
          {!biz.preview && <a href={`mailto:${site.email}`}>{site.email}</a>}
          <p>{biz.preview ? biz.address.full : `${site.address.street}, ${site.address.locality}, ${site.address.region}`}</p>
        </div>
      </div>
    </>
  );
}
