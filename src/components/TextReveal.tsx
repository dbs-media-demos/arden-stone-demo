"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  /** Renders each line inside an overflow mask and slides it up. */
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Editorial line-mask reveal: splits text on words and slides them up out of
 * an invisible mask with a slight stagger — the signature "expensive" reveal.
 */
const TextReveal = ({ text, className = "", delay = 0, as: Tag = "h2" }: TextRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.045,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
