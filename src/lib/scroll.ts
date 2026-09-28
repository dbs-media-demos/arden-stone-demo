import type Lenis from "lenis";

/** Shared handle to the active Lenis instance (set by <SmoothScroll/>). */
export const scroll: { lenis: Lenis | null } = { lenis: null };
