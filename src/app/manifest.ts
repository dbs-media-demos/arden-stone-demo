import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · Dallas Design-Build Renovation`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f6f2",
    theme_color: "#f8f6f2",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/logo-192.png", type: "image/png", sizes: "192x192" },
      { src: "/brand/logo-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
