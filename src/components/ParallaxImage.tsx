"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Parallax travel in px (image moves against scroll). */
  strength?: number;
  sizes?: string;
  priority?: boolean;
}

/**
 * Image with a curtain-wipe entrance and continuous scroll parallax.
 * The wrapper clips; the inner image is oversized and drifts on scroll.
 */
const ParallaxImage = ({
  src,
  alt,
  className = "",
  strength = 60,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: ParallaxImageProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-10 bg-background"
        initial={{ scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
        style={{ transformOrigin: "top" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div style={{ y }} className="absolute -inset-y-16 inset-x-0">
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 1.25 }}
          animate={isInView ? { scale: 1 } : { scale: 1.25 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ParallaxImage;
