# Arden & Stone (Scale by Noon demo)

- Niche: Home renovation / design-build   (matches www.scalebynoon.com industry id: none yet. Closest are `professional-services` or a future `renovation` id)
- Market / city: US – Dallas–Fort Worth, TX (Highland Park, University Park, Preston Hollow, Lakewood, Southlake, Fort Worth)
- Languages: en
- Live URL: https://arden-stone-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/arden-stone-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/arden-stone
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText, Flip), Lenis
- Palette: #F8F6F2 ivory · #F1EDE6 paper · #E5E1DC stone · #1D1916 ink · #986B3E bronze · #C49764 bronze-light · #7E552C bronze (text)   Fonts: Cormorant Garamond, Manrope, IBM Plex Mono
- Pages: 32 routes. Home, services + 6 service pages, work + 9 case studies, process, estimate, about, reviews, FAQ, service areas + 5 area pages, contact, privacy, 404. Plus sitemap, robots, manifest and `/api/og`.
- Signature features:
  - Blueprint-to-room hero: each room starts as a pencil drawing and "develops" into the photograph behind a bronze drafting line. A cursor lens shows the drawing underneath the photo, three rooms rotate, and scrolling opens the frame to full bleed.
  - Before/after sliders (1984 galley kitchen → 2024; 1930s bath → spa; design drawing → built kitchen). Drag, touch or keyboard; the slider sweeps once on first view.
  - Pinned "renovation journey": five stages (consultation, design & 3D, permits, build, handover), with the room going from sketch to blueprint to framing to finished.
  - Cost estimator: room type, size, finish level and extras give an animated price range and timeline, which carry into the contact form.
  - Work gallery with animated filters (GSAP Flip) and shared-element morphs into case studies (React ViewTransition).
  - Also: sticky stacking service cards, horizontal project reel, workshop film, material marquee, drafted DFW map, footer image trail, multi-step contact form, live "Open now" badge.
- Lighthouse (mobile, home):
  - Live noindexed demo: P 83 / A 100 / BP 100 / SEO 69. SEO fails only on "blocked from indexing", which is intentional.
  - Local production build with `NEXT_PUBLIC_NOINDEX=false`: P 88–89 / A 100 / BP 100 / SEO 100.
  - Inner pages (mobile): P 87–91, A 100.
  - Desktop: P 97–99.

## Portfolio copy
EN title: Arden & Stone: Design-Build Renovation, Dallas
EN one-liner (≤ 120 chars): A renovation studio site where every room is drawn first, then revealed, with cost estimator and before/after stories.
EN summary (2–3 sentences): A concept site for a Dallas design-build renovation studio. Each room starts as a pencil drawing and develops into the finished photo, and visitors can uncover the drawing with their cursor. Before/after sliders, a pinned five-stage renovation journey and an instant cost estimator turn browsing into booked consultations.
SR title: Arden & Stone: renoviranje po sistemu projektuj-i-izvedi, Dalas
SR one-liner: Sajt studija za renoviranje gde je svaka prostorija prvo nacrtana, pa otkrivena, uz kalkulator cene i priče pre/posle.
SR summary: Koncept sajt za studio za renoviranje domova u Dalasu. Svaka prostorija počinje kao crtež olovkom i pretvara se u fotografiju gotovog enterijera, a posetilac kursorom može da otkrije crtež ispod fotografije. Slajderi pre/posle, fiksirana priča o pet faza renoviranja i trenutni kalkulator cene pretvaraju razgledanje u zakazane konsultacije.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png, handoff/mobile-home.png, handoff/scroll.mp4

## Notes
- The business, people, reviews, projects and address (2217 Tinsmith Row) are fictional. The phone number is in the reserved 555-01xx range, and the contact form sends nothing.
- `NEXT_PUBLIC_NOINDEX` defaults to noindex (meta, `X-Robots-Tag` and a robots.txt disallow). Set it to `"false"` to make the site indexable.
- Photos: Unsplash; the workshop video is from Pexels. Credits are in `public/images/SOURCES.md`. The "pencil drawings" are generated from the photos with ffmpeg.
- Vercel project: `arden-stone-demo` on team "Dimitrije's projects", no custom domain.
