import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 10" className={clsx("arrow h-2.5 w-5 shrink-0", className)} aria-hidden>
      <path d="M0 5h18M14 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
  cursor?: string;
};

export function Button({ href, children, variant = "solid", className, magnetic = true, arrow = true, cursor }: Props) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const cls = clsx("btn", variant === "solid" ? "btn-solid" : "btn-line", className);
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );
  const el = external ? (
    <a href={href} className={cls} data-cursor={cursor}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} data-cursor={cursor}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Quiet text link with a drawn underline and arrow. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={clsx("group inline-flex items-center gap-3 text-[0.78rem] font-semibold tracking-[0.14em] uppercase", className)}>
      <span className="link-draw pb-1">{children}</span>
      <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  );
}
