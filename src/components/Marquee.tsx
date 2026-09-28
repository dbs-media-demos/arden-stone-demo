"use client";

import { type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  slow?: boolean;
}

/** Infinite horizontal marquee — content is duplicated for a seamless loop. */
const Marquee = ({ children, className = "", slow = false }: MarqueeProps) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`}>
    <div className={`inline-flex w-max items-center ${slow ? "animate-marquee-slow" : "animate-marquee"}`}>
      <div className="inline-flex items-center">{children}</div>
      <div className="inline-flex items-center" aria-hidden>
        {children}
      </div>
    </div>
  </div>
);

export default Marquee;
