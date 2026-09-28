import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { siteUrl } from "@/lib/site";

// Brand fonts read once; URLs relative to this file are traced into the deployment bundle.
const [serif, serifItalic, mono] = await Promise.all([
  readFile(new URL("../../../../assets/fonts/Cormorant-500.ttf", import.meta.url)),
  readFile(new URL("../../../../assets/fonts/Cormorant-500-italic.ttf", import.meta.url)),
  readFile(new URL("../../../../assets/fonts/PlexMono-400.ttf", import.meta.url)),
]);

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=…&image=/images/… */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Arden & Stone").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Dallas design-build studio").slice(0, 60);
  const imagePath = searchParams.get("image");
  // Only our own photos; resized through the image optimizer to keep the render light.
  const image = imagePath && /^\/images\/[\w/-]+\.jpg$/.test(imagePath) ? `${origin}/_next/image?url=${encodeURIComponent(imagePath)}&w=1080&q=75` : null;
  const size = title.length > 60 ? 64 : title.length > 36 ? 76 : 92;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#f8f6f2", color: "#1d1916", fontFamily: "Cormorant" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: image ? 640 : 1200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="44" height="44" viewBox="0 0 48 48">
              <path d="M13 38V21.5a11 11 0 0 1 22 0V38" fill="none" stroke="#1d1916" strokeWidth="1.6" />
              <path d="M18.5 38V22.5a5.5 5.5 0 0 1 11 0V38" fill="none" stroke="#1d1916" strokeWidth="1.1" opacity=".55" />
              <path d="M22.4 9.2h3.2l-.5 3.4h-2.2z" fill="#986b3e" />
              <rect x="8" y="38" width="32" height="5.5" fill="#986b3e" />
            </svg>
            <div style={{ display: "flex", fontSize: 34 }}>
              Arden <span style={{ fontStyle: "italic", color: "#986b3e", margin: "0 8px" }}>&amp;</span> Stone
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", fontFamily: "Plex", fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: "#7e552c" }}>{eyebrow}</div>
            <div style={{ display: "flex", fontSize: size, lineHeight: 0.98, letterSpacing: -1.5 }}>{title}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Plex", fontSize: 16, letterSpacing: 2, color: "#6b625b", textTransform: "uppercase" }}>
            <span>Dallas · Fort Worth</span>
            <span>{new URL(siteUrl).host}</span>
          </div>
        </div>
        {image && (
          <div style={{ display: "flex", width: 560, height: 630, position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} width={560} height={630} style={{ objectFit: "cover", width: 560, height: 630 }} alt="" />
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Cormorant", data: serif, weight: 500, style: "normal" },
        { name: "Cormorant", data: serifItalic, weight: 500, style: "italic" },
        { name: "Plex", data: mono, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
