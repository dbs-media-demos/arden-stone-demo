import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBar } from "./MobileBar";
import { DemoBadge } from "./DemoBadge";
import type { Biz } from "@/lib/biz-core";

/** Header, the page, footer, the phone bar and the demo badge. Client parts read the business from BizProvider. */
export function SiteChrome({ children, biz }: { children: ReactNode; biz?: Biz }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer biz={biz} />
      <MobileBar />
      <DemoBadge />
    </>
  );
}
