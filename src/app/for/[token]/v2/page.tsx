import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeContent } from "@/components/sections/HomeContent";
import { previewBiz } from "@/lib/preview";
import { generateMetadata as previewMetadata } from "../page";

// Always the CRM's current data, like /for/<token>
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

/** The personalised preview without 3D: /for/<token> with /v2's hero. */
export function generateMetadata(props: Props): Promise<Metadata> {
  return previewMetadata(props);
}

export default async function PreviewV2Page({ params }: Props) {
  const biz = await previewBiz((await params).token);
  if (!biz) notFound();
  return <HomeContent biz={biz} hero="2d" />;
}
