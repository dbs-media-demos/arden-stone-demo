import type { MetadataRoute } from "next";
import { AREAS } from "@/data/areas";
import { PROJECTS } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-28");
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.85)),
    page("/work", 0.9, "weekly"),
    ...PROJECTS.map((p) => ({ ...page(`/work/${p.slug}`, 0.7), images: [absoluteUrl(`/images/${p.hero.key}.jpg`)] })),
    page("/process", 0.7),
    page("/estimate", 0.8),
    page("/areas", 0.8),
    ...AREAS.map((a) => page(`/areas/${a.slug}`, 0.8)),
    page("/about", 0.6),
    page("/reviews", 0.6),
    page("/faq", 0.6),
    page("/contact", 0.9),
    page("/privacy", 0.2, "yearly"),
  ];
}
