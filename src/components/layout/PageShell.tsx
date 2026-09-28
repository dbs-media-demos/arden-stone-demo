import { ViewTransition, type ReactNode } from "react";

/** Every page's root: gives route changes the curtain page transition. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div className="theme-ivory min-h-dvh">{children}</div>
    </ViewTransition>
  );
}
