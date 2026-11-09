# Arden & Stone (Scale by Noon demo)

- Niche: Home renovation / design-build   (matches www.scalebynoon.com industry id: none yet. Closest are `professional-services` or a future `renovation` id)
- Market / city: US – Dallas–Fort Worth, TX (Highland Park, University Park, Preston Hollow, Lakewood, Southlake, Fort Worth)
- Languages: en
- Live URL: https://arden-stone-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/arden-stone-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/arden-stone
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText, Flip), Lenis, three.js 0.187 (desktop only)
- Palette: #F8F6F2 ivory · #F1EDE6 paper · #E5E1DC stone · #1D1916 ink · #986B3E bronze · #C49764 bronze-light · #7E552C bronze (text)   Fonts: Cormorant Garamond, Manrope, IBM Plex Mono
- Pages: 32 routes. Home, services + 6 service pages, work + 9 case studies, process, estimate, about, reviews, FAQ, service areas + 5 area pages, contact, privacy, 404. Plus sitemap, robots, manifest and `/api/og`.
- Signature features:
  - 3D hero (desktop): a cutaway architect's model of the Bluffview kitchen in three.js, built from primitives (no downloaded model). It starts as a pencil drawing that a bronze drafting line reveals; then a section line sweeps through it and builds the room behind it (oak floor, plaster, a marble slab wall, the waterfall island, walnut stools, ring pendants, an olive tree), with late sun through the window laying soft patches on the floor while the camera drifts. It leans towards the pointer. The finished photo sits in the corner as an "As built · 2024" plate; scrolling opens the frame to full bleed and the photo grows to fill it, and then a cursor lens shows the pencil drawing underneath the photo.
  - 3D sample board (desktop, materials section): the eight materials as real samples on linen (oak, Calacatta, Leuders limestone, a knurled brass pull, walnut slats, terrazzo, fluted oak, travertine). A low warm light rakes across them as the page scrolls and follows the cursor over the board; hovering a sample or its name lifts it.
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

- 3D (9 Nov 2026): `src/components/fx/room3d` (hero) and `src/components/fx/samples` (board). The HTML carries stills rendered from the same scene files (`node scripts/render-room.mjs`, which needs Playwright + Chromium: set `PLAYWRIGHT` and `CHROME`; it also writes the board's label positions to `samples/anchors.json`). three.js is fetched with `await import()` only after load on a screen ≥ 1024 px with a mouse, without reduced motion or Save-Data; everyone else keeps the stills (the built room for reduced motion and Save-Data). Frames are drawn only while something moves and the scene is on screen. Phones download zero bytes of three.js: they get the photo hero with a small still of the model on it, and the swatch row instead of the board. Change the scene and re-run the script, or the still and the live canvas stop lining up.
- 3D that never stutters (9 Nov 2026): every scene goes through `src/components/fx/gate3d.ts`. After load, at idle, a quick CPU check (a slow processor never downloads three.js), then a worker (`fx/gpu.worker.ts`) opens the first WebGL context off the main thread, rejects software or blocklisted GPUs and pre-compiles the environment-light shaders. Scenes then warm up one after another (hero, then the board, long before it's reached) in small idle steps: textures uploaded one by one, shaders and shadow shaders compiled with `compileAsync`, one frame drawn invisibly, and only then does the canvas fade in over the still. The first 2 s of each scene's frames are watched: under ~45 fps or any frame over 100 ms, every scene fades back to its still for the rest of the visit (sessionStorage `as-3d`). Pixel ratio capped at 1.5. Measured on the production build: hero on screen ~1.5-2.2 s after navigation, board ready ~2.0-2.8 s; with DevTools' 4x CPU slowdown the stills stay and three.js isn't fetched. The hero's drafting line moves by transform, so it stays smooth while the 3D loads.
- Phones (decided 7 Nov 2026, below 768 px or touch; desktop at 1024 px and up is unchanged):
  - First screen: project photo, service + town headline, Google stars + count, Call button with the number; the next section peeks above the Call + Get a quote bar.
  - Order by CSS: gallery by project type, before/after, reviews naming the project, services, how it works, budget guide, workshop, materials, statement, team, FAQ, areas, quote form. The team and the short form are phone-only; previews show roles instead of the concept studio's named people.
  - GSAP and Lenis load on desktop only (`src/lib/motion.ts`); phones use two subset Cormorant files (`scripts/gen-phone-fonts.py`) and a still instead of the workshop film. Widths are in `src/lib/media.ts` and the `phone` / `still` / `pin` variants in `globals.css`.
  - Load freeze (7 Nov 2026): the cost was the first layout, not JavaScript. Below the first screen sections hold back (`.cv`, heights in `--cv`, content height at 375 px), start a beat apart, and finish rendering at idle (`PhoneRise`); the closed menu waits for idle (`Header`) and a small head script opens the system fonts early (`layout.tsx`). Change a section's height a lot and update its `--cv`.

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
- Photos: Unsplash; the workshop video is from Pexels. Credits are in `public/images/SOURCES.md`. The "pencil drawings" are generated from the photos with ffmpeg. The 3D models are built in code; the sample board's oak, marble and terrazzo surfaces are 512 px crops of the site's own Unsplash material photos (`public/images/samples`).
- Vercel project: `arden-stone-demo` on team "Dimitrije's projects", no custom domain.
