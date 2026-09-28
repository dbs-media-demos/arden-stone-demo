"use client";

import { useContext, useRef, type ReactNode } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Freezes the Next.js layout router context for a subtree so that an exiting
 * page (kept alive by AnimatePresence during its exit animation) does not
 * re-render to the new route's content mid-transition.
 */
const FrozenRouter = ({ children }: { children: ReactNode }) => {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  return <LayoutRouterContext.Provider value={frozen}>{children}</LayoutRouterContext.Provider>;
};

export default FrozenRouter;
