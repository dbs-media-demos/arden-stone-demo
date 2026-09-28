"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Mode = { type: "default" | "pointer" | "text" | "label"; label?: string };

const RING_SIZE: Record<Mode["type"], number> = {
  default: 36,
  pointer: 72,
  label: 96,
  text: 0,
};

/**
 * Replaces the OS cursor (hidden globally via CSS on fine pointers).
 * A white dot rides the pointer exactly; a spring-trailed ring morphs by
 * context — inverting circle over links (mix-blend-difference), an ivory
 * badge with text over [data-cursor-label] elements, and a thin text-beam
 * over form fields. Both layers are inert and hidden on touch devices.
 */
const CustomCursor = () => {
  const [mode, setMode] = useState<Mode>({ type: "default" });
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const trailX = useSpring(x, { stiffness: 400, damping: 32, mass: 0.45 });
  const trailY = useSpring(y, { stiffness: 400, damping: 32, mass: 0.45 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const labelled = target.closest?.("[data-cursor-label]");
      if (labelled) {
        setMode({ type: "label", label: labelled.getAttribute("data-cursor-label") ?? "" });
      } else if (target.closest?.("input, textarea, select")) {
        setMode({ type: "text" });
      } else if (target.closest?.("a, button, [data-cursor]")) {
        setMode({ type: "pointer" });
      } else {
        setMode({ type: "default" });
      }
    };
    const down = () => setIsPressed(true);
    const up = () => setIsPressed(false);
    const leave = () => setIsVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  const ringSize = RING_SIZE[mode.type] * (isPressed ? 0.8 : 1);
  const isFilled = mode.type === "pointer";
  const isLabel = mode.type === "label";
  const isText = mode.type === "text";

  return (
    <>
      {/* Dot: rides the pointer exactly; becomes a text-beam over fields */}
      <motion.div
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[96] mix-blend-difference"
        style={{ x, y, opacity: isVisible ? 1 : 0 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 bg-white"
          animate={{
            width: isText ? 2 : isFilled || isLabel ? 4 : 7,
            height: isText ? 26 : isFilled || isLabel ? 4 : 7,
            borderRadius: isText ? 1 : 999,
            scale: isPressed && !isText ? 0.6 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>

      {/* Trailing ring: morphs by context */}
      <motion.div
        className={`cursor-ring pointer-events-none fixed left-0 top-0 z-[95] ${isLabel ? "" : "mix-blend-difference"}`}
        style={{ x: trailX, y: trailY, opacity: isVisible ? 1 : 0 }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ borderStyle: "solid" }}
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: isText ? 0 : 1,
            borderWidth: isFilled || isLabel ? 0 : 1,
            borderColor: "rgba(255, 255, 255, 0.75)",
            backgroundColor: isFilled
              ? "rgba(255, 255, 255, 1)"
              : isLabel
                ? "hsla(40, 27%, 96%, 0.96)"
                : "rgba(255, 255, 255, 0)",
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatePresence>
            {isLabel && (
              <motion.span
                key={mode.label}
                className="whitespace-nowrap px-2 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                {mode.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;
