/**
 * Renders the stills of the two live three.js scenes, so the HTML, phones and every no-3D visitor show
 * exactly what the desktop canvas draws: the hero's room (src/components/fx/room3d/scene.ts) and the
 * materials sample board (src/components/fx/samples/scene.ts, plus its label positions).
 *
 *   node scripts/render-room.mjs            writes public/images/room/*, public/images/samples/board-*
 *                                           and src/components/fx/samples/anchors.json
 *   node scripts/render-room.mjs --preview <dir> [build ...]   PNGs only, e.g. 0 0.4 1
 *
 * Needs Playwright with a Chromium (set PLAYWRIGHT=<path to the playwright package> if it isn't
 * resolvable from here) and sharp. Software WebGL (SwiftShader), so it's slow but the same everywhere.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const req = createRequire(path.join(ROOT, "package.json"));
const ts = req("typescript");
const { chromium } = req(process.env.PLAYWRIGHT || "playwright");
const OUT = path.join(ROOT, "public/images/room");

const compile = (f) => ts.transpileModule(fs.readFileSync(path.join(ROOT, f), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const js = { room: compile("src/components/fx/room3d/scene.ts"), samples: compile("src/components/fx/samples/scene.ts") };

// Aspect 1.12 = STILL_ASPECT in the scene: the desktop box crops around it like object-fit: cover
const W = 1520;
const H = Math.round(W / 1.12);
let shots = [
  { name: "room-drawn", w: W, h: H, still: "drawn", sizes: [1520, 960], quality: 74, avif: 50 },
  { name: "room-built", w: W, h: H, still: "built", sizes: [1520, 960], quality: 76, avif: 52 },
  { name: "room-phone", w: 960, h: 960, still: "built", aspect: 1, view: { dist: 17.2, tx: 0.2, ty: 0.55, tz: 0 }, sizes: [480], quality: 78, avif: 58 },
  { name: "board", scene: "samples", out: "samples", w: 2400, h: 1000, sizes: [2400, 1400], quality: 74, avif: 50 },
];
const pi = process.argv.indexOf("--preview");
const preview = pi > 0 ? path.resolve(process.argv[pi + 1]) : null;
if (preview) {
  const builds = process.argv.slice(pi + 2).map(Number);
  // 1030 x 1000: the narrowest desktop box (1440 x 900), cropped from the 1.12 design aspect
  shots = (builds.length ? builds : [0, 1]).map((b) => ({ name: `preview-${b}`, w: 1030, h: 1000, still: b, aspect: 1.12 }));
  shots.push({ name: "preview-phone", w: 640, h: 640, still: "built", aspect: 1, view: { dist: 17.2, tx: 0.2, ty: 0.55, tz: 0 } });
  shots.push({ name: "preview-board", scene: "samples", w: 1440, h: 600 });
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME || undefined,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
fs.mkdirSync(preview ?? OUT, { recursive: true });
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error(e.message));
  page.on("console", (m) => m.type() === "error" && console.error(m.text()));
  const samples = shot.scene === "samples";
  const opts = samples ? { still: true, base: "http://still.local" } : { still: shot.still, view: shot.view ?? {}, aspect: shot.aspect ?? 1.12 };
  const html = `<!doctype html><html><head><style>html,body{margin:0;background:transparent}canvas{width:${shot.w}px;height:${shot.h}px;display:block}</style>
<script type="importmap">{"imports":{"three":"http://still.local/build/three.module.js","three/examples/jsm/":"http://still.local/jsm/"}}</script></head><body><canvas id=c></canvas>
<script type="module">
import { ${samples ? "createSamples as create" : "createRoom as create"} } from "http://still.local/scene.js";
const sc = await create(document.getElementById("c"), ${JSON.stringify(opts)});
window.anchors = sc.anchors?.();
window.png = document.getElementById("c").toDataURL("image/png");
</script></body></html>`;
  await page.route("http://still.local/**", (route) => {
    const f = new URL(route.request().url()).pathname.slice(1);
    if (f === "index.html") return route.fulfill({ body: html, contentType: "text/html" });
    if (f === "scene.js") return route.fulfill({ body: js[samples ? "samples" : "room"], contentType: "text/javascript" });
    if (f.startsWith("images/")) return route.fulfill({ path: path.join(ROOT, "public", f) });
    if (f.startsWith("jsm/")) return route.fulfill({ path: path.join(ROOT, "node_modules/three/examples", f), contentType: "text/javascript" });
    return route.fulfill({ path: path.join(ROOT, "node_modules/three", f), contentType: "text/javascript" });
  });
  await page.goto("http://still.local/index.html");
  const png = Buffer.from((await page.waitForFunction(() => window.png, null, { timeout: 240000 }).then((h) => h.jsonValue())).split(",")[1], "base64");
  if (preview) {
    // on the site's paper, as it's seen
    const file = path.join(preview, `${shot.name}.png`);
    await sharp({ create: { width: shot.w, height: shot.h, channels: 4, background: "#f1ede6" } }).composite([{ input: png }]).png().toFile(file);
    console.log(file);
  } else {
    if (samples) {
      const anchors = (await page.evaluate(() => window.anchors)).map(({ x, y }) => ({ x: +x.toFixed(4), y: +y.toFixed(4) }));
      fs.writeFileSync(path.join(ROOT, "src/components/fx/samples/anchors.json"), `${JSON.stringify(anchors)}\n`);
    }
    const dir = path.join(ROOT, "public/images", shot.out ?? "room");
    fs.mkdirSync(dir, { recursive: true });
    for (const size of shot.sizes) {
      const base = path.join(dir, shot.sizes.length > 1 ? `${shot.name}-${size}` : shot.name);
      await sharp(png).resize(size).avif({ quality: shot.avif, effort: 7 }).toFile(`${base}.avif`);
      await sharp(png).resize(size).webp({ quality: shot.quality, alphaQuality: 80, effort: 6, smartSubsample: true }).toFile(`${base}.webp`);
      for (const ext of ["avif", "webp"]) console.log(path.relative(ROOT, `${base}.${ext}`), `${(fs.statSync(`${base}.${ext}`).size / 1024).toFixed(1)} KB`);
    }
  }
  await page.close();
}
await browser.close();
