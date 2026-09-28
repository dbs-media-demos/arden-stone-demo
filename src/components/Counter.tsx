"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

/** Animates from 0 to `value` when scrolled into view. */
const Counter = ({ value, suffix = "", className = "", duration = 2 }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
      {suffix}
    </span>
  );
};

export default Counter;
