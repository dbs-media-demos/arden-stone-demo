"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

/** Scroll-triggered entrance wrapper: fades + drifts in once when it enters the viewport. */
const AnimatedSection = ({ children, className = "", delay = 0, direction = "up" }: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const initial =
    direction === "left"
      ? { opacity: 0, x: -60 }
      : direction === "right"
        ? { opacity: 0, x: 60 }
        : direction === "none"
          ? { opacity: 0 }
          : { opacity: 0, y: 60 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
