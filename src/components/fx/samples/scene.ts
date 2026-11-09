/**
 * The materials section's sample board: eight real samples on linen, the way a designer lays them out
 * for a client. Rift oak, a Calacatta slab, fluted oak, a Leuders limestone block, walnut slats, a
 * terrazzo disc, a knurled brass toggle on its plate and a travertine piece, each with its own surface
 * (photo textures for oak, marble and terrazzo; relief drawn in code for the rest). One low, warm light
 * rakes across them: it sweeps from left to right as the section scrolls past and follows the pointer
 * over the board, so the marble glints, the brass flashes and every chip's shadow swings. A hovered
 * sample lifts off the board. Frames are drawn only while something moves.
 *
 * Imports nothing but three (and one addon) so scripts/render-room.mjs can render the still from it.
 */
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Raycaster,
  RepeatWrapping,
  Scene,
  SpotLight,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type Texture,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const SAMPLES_ASPECT = 2.4;
export type SamplesOptions = { still?: boolean; base?: string };
export type SamplesScene = {
  onReady: (cb: () => void) => void;
  /** Pointer over the board (-1..1 both ways), or null when it leaves. */
  pointer: (p: { x: number; y: number } | null) => void;
  /** 0 as the section comes in at the bottom, 1 as it leaves at the top. */
  scroll: (p: number) => void;
  /** Lift a sample from outside (its label is hovered); null drops it. */
  highlight: (i: number | null) => void;
  onHover: (cb: (i: number | null) => void) => void;
  setVisible: (v: boolean) => void;
  resize: () => void;
  /** Where each sample's label goes, as fractions of the canvas (for the still's HTML labels). */
  anchors: () => { x: number; y: number }[];
  dispose: () => void;
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas2d(w: number, h = w) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

/** A normal map from a grey height canvas (white = high), so the raking light finds the relief. */
function normalFrom(src: HTMLCanvasElement, strength = 2) {
  const w = src.width, h = src.height;
  const d = src.getContext("2d")!.getImageData(0, 0, w, h).data;
  const [c, g] = canvas2d(w, h);
  const out = g.createImageData(w, h);
  const H = (x: number, y: number) => d[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength;
      const dy = (H(x, y + 1) - H(x, y - 1)) * strength;
      const n = new Vector3(-dx, dy, 1).normalize();
      const i = (y * w + x) * 4;
      out.data[i] = (n.x * 0.5 + 0.5) * 255;
      out.data[i + 1] = (n.y * 0.5 + 0.5) * 255;
      out.data[i + 2] = (n.z * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  g.putImageData(out, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

function colorTex(c: HTMLCanvasElement, repeat = 1) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  return t;
}

/** Linen: a fine weave with slubs. Colour and height share the pattern. */
function linen() {
  const R = rng(3);
  const S = 256;
  const [c, g] = canvas2d(S);
  const [hc, hg] = canvas2d(S);
  g.fillStyle = "#e4ddd1";
  g.fillRect(0, 0, S, S);
  hg.fillStyle = "#808080";
  hg.fillRect(0, 0, S, S);
  for (let i = 0; i < S; i += 2) {
    const a = 0.05 + R() * 0.07;
    g.fillStyle = `rgba(120,104,84,${a})`;
    g.fillRect(0, i, S, 1);
    g.fillRect(i, 0, 1, S);
    hg.fillStyle = `rgba(255,255,255,${0.25 + R() * 0.3})`;
    hg.fillRect(0, i, S, 1);
    hg.fillStyle = `rgba(0,0,0,${0.25 + R() * 0.3})`;
    hg.fillRect(i + 1, 0, 1, S);
  }
  for (let k = 0; k < 60; k++) {
    const y = Math.floor(R() * S);
    const x = R() * S;
    g.fillStyle = "rgba(110,95,75,0.12)";
    g.fillRect(x, y, 8 + R() * 30, 1);
    hg.fillStyle = "rgba(255,255,255,0.5)";
    hg.fillRect(x, y, 8 + R() * 30, 1);
  }
  return { map: colorTex(c, 14), normal: (() => { const n = normalFrom(hc, 1.6); n.repeat.set(14, 14); return n; })() };
}

/** Stone without a photo: a base colour, speckle, soft bands and pits (travertine) that the light catches. */
function stone(seed: number, base: string, speck: string, opts: { bands?: boolean; pits?: number; mottle?: number }) {
  const R = rng(seed);
  const S = 256;
  const [c, g] = canvas2d(S);
  const [hc, hg] = canvas2d(S);
  g.fillStyle = base;
  g.fillRect(0, 0, S, S);
  hg.fillStyle = "#909090";
  hg.fillRect(0, 0, S, S);
  if (opts.bands)
    for (let k = 0; k < 18; k++) {
      const y = R() * S;
      g.fillStyle = `rgba(${165 + R() * 25},${145 + R() * 20},${118 + R() * 18},${0.12 + R() * 0.16})`;
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= S; x += 16) g.lineTo(x, y + Math.sin(x * 0.03 + k) * 3 + R() * 2);
      g.lineTo(S, y + 2 + R() * 6);
      g.lineTo(0, y + 2 + R() * 6);
      g.fill();
    }
  for (let k = 0; k < (opts.mottle ?? 0); k++) {
    const grd = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    const dark = R() < 0.5;
    grd.addColorStop(0, dark ? "rgba(150,128,96,0.16)" : "rgba(250,244,232,0.22)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.save();
    g.translate(R() * S, R() * S);
    g.scale(10 + R() * 40, 8 + R() * 30);
    g.fillStyle = grd;
    g.beginPath();
    g.arc(0, 0, 1, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  for (let k = 0; k < 4200; k++) {
    g.fillStyle = speck.replace("A", String(0.08 + R() * 0.2));
    const z = R() < 0.1 ? 2 : 1;
    g.fillRect(R() * S, R() * S, z, z);
  }
  for (let k = 0; k < (opts.pits ?? 0); k++) {
    const x = R() * S, y = R() * S, w = opts.bands ? 2 + R() * 9 : 0.8 + R() * 1.6, h = opts.bands ? 0.6 + R() * 1.4 : 0.8 + R() * 1.2;
    g.fillStyle = "rgba(118,104,88,0.55)";
    g.beginPath();
    g.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    g.fill();
    hg.fillStyle = "#202020";
    hg.beginPath();
    hg.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    hg.fill();
  }
  return { map: colorTex(c), normal: normalFrom(hc, 2.4) };
}

/** Walnut: dark, straight grain. */
function walnut() {
  const R = rng(17);
  const [c, g] = canvas2d(256);
  g.fillStyle = "#5a3a26";
  g.fillRect(0, 0, 256, 256);
  for (let k = 0; k < 160; k++) {
    const y = R() * 256;
    g.strokeStyle = `rgba(${30 + R() * 30},${18 + R() * 15},10,${0.1 + R() * 0.2})`;
    g.lineWidth = 0.5 + R() * 1.8;
    g.beginPath();
    g.moveTo(0, y);
    g.bezierCurveTo(85, y + R() * 4 - 2, 170, y + R() * 4 - 2, 256, y + R() * 3 - 1.5);
    g.stroke();
  }
  return colorTex(c);
}

/** Knurling: a fine diamond crosshatch, as height. */
function knurl() {
  const S = 128;
  const [c, g] = canvas2d(S);
  const img = g.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const a = Math.abs(Math.sin(((x + y) / S) * Math.PI * 16));
      const b = Math.abs(Math.sin(((x - y) / S) * Math.PI * 16));
      const v = Math.min(a, b) * 255;
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  return normalFrom(c, 3);
}

/** Calacatta: the photo's fine veining, plus the few bold soft veins the stone is known for. */
function calacatta(photo: Texture) {
  const R = rng(31);
  const S = 512;
  const [c, g] = canvas2d(S);
  g.drawImage(photo.image as CanvasImageSource, 0, 0, S, S);
  const vein = (x: number, y: number, ang: number, w: number, a: number) => {
    g.lineCap = "round";
    for (let s = 0; s < 46; s++) {
      const nx = x + Math.cos(ang) * 14, ny = y + Math.sin(ang) * 14;
      g.strokeStyle = `rgba(${118 + R() * 20},${112 + R() * 16},${100 + R() * 14},${a})`;
      g.lineWidth = w * (0.5 + R() * 0.8);
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(nx, ny);
      g.stroke();
      x = nx;
      y = ny;
      ang += (R() - 0.5) * 0.4;
    }
  };
  g.shadowColor = "rgba(150,140,125,0.9)";
  g.shadowBlur = 16;
  vein(-20, S * 0.72, -0.55, 7, 0.22);
  vein(S * 0.35, S + 20, -1.15, 6, 0.2);
  g.shadowBlur = 3;
  vein(-20, S * 0.72, -0.55, 2.4, 0.55);
  vein(S * 0.35, S + 20, -1.15, 2, 0.5);
  vein(S * 0.1, -10, 0.9, 1, 0.35);
  return colorTex(c);
}

/** Bright on the side the light comes from: start with the light raking in from the left. */
const LIGHT0 = { az: -58, el: 19 };

export async function createSamples(canvas: HTMLCanvasElement, opts: SamplesOptions = {}): Promise<SamplesScene> {
  const still = !!opts.still;
  const base = opts.base ?? "";
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: still, powerPreference: "high-performance" });
  renderer.setPixelRatio(still ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(canvas.clientWidth || canvas.width, canvas.clientHeight || canvas.height, false);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setClearColor(0xe5e1dc, 1);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.2;
  pmrem.dispose();
  scene.add(new HemisphereLight(0xfff6ea, 0x9c8a74, 0.18));

  const camera = new PerspectiveCamera(22, SAMPLES_ASPECT, 1, 60);
  camera.position.set(0, 10.6, 7.6);
  camera.lookAt(0, 0, 0.6);

  const disposables: { dispose: () => void }[] = [envRT];
  const loader = new TextureLoader();
  const photo = (name: string, repeat = 1) =>
    loader.loadAsync(`${base}/images/samples/${name}.webp`).then((t) => {
      t.colorSpace = SRGBColorSpace;
      t.wrapS = t.wrapT = RepeatWrapping;
      t.repeat.set(repeat, repeat);
      t.anisotropy = 8;
      disposables.push(t);
      return t;
    });
  const [marblePhoto, oakMap, terrazzoMap] = await Promise.all([photo("marble"), photo("oak"), photo("terrazzo")]);
  const marbleMap = calacatta(marblePhoto);
  disposables.push(marbleMap);

  const lin = linen();
  const lime = stone(5, "#ddd2bf", "rgba(110,96,74,A)", { mottle: 30, pits: 18 });
  const trav = stone(9, "#e2d6c2", "rgba(120,104,84,A)", { bands: true, pits: 110 });
  const walnutMap = walnut();
  const knurlN = knurl();
  knurlN.repeat.set(3, 1);
  disposables.push(lin.map, lin.normal, lime.map, lime.normal, trav.map, trav.normal, walnutMap, knurlN);

  const mat = <M extends Material>(m: M) => (disposables.push(m), m);
  const M = {
    linen: mat(new MeshStandardMaterial({ map: lin.map, normalMap: lin.normal, normalScale: new Vector2(0.6, 0.6), roughness: 0.95 })),
    marble: mat(new MeshPhysicalMaterial({ map: marbleMap, roughness: 0.12, clearcoat: 0.8, clearcoatRoughness: 0.08 })),
    oak: mat(new MeshStandardMaterial({ map: oakMap, roughness: 0.55 })),
    terrazzo: mat(new MeshPhysicalMaterial({ map: terrazzoMap, roughness: 0.38, clearcoat: 0.25, clearcoatRoughness: 0.3 })),
    limestone: mat(new MeshStandardMaterial({ map: lime.map, normalMap: lime.normal, normalScale: new Vector2(0.5, 0.5), roughness: 0.92 })),
    travertine: mat(new MeshStandardMaterial({ map: trav.map, normalMap: trav.normal, normalScale: new Vector2(0.9, 0.9), roughness: 0.7 })),
    walnut: mat(new MeshStandardMaterial({ map: walnutMap, roughness: 0.5 })),
    felt: mat(new MeshStandardMaterial({ color: 0x2b2420, roughness: 1 })),
    brass: mat(new MeshStandardMaterial({ color: new Color(0xd2ad6d), metalness: 1, roughness: 0.3, normalMap: knurlN, normalScale: new Vector2(1.2, 1.2) })),
    brassSmooth: mat(new MeshStandardMaterial({ color: new Color(0xd2ad6d), metalness: 1, roughness: 0.2 })),
    plate: mat(new MeshStandardMaterial({ color: 0xf1ede5, roughness: 0.6 })),
  };

  const board = new Mesh(new PlaneGeometry(40, 20), M.linen);
  board.rotation.x = -Math.PI / 2;
  board.receiveShadow = true;
  scene.add(board);
  disposables.push(board.geometry);

  // ── The samples, laid out in two loose rows ──
  type Sample = { group: Group; lift: number; target: number; label: Vector3 };
  const samples: Sample[] = [];
  const geo = <G extends { dispose: () => void }>(g: G) => (disposables.push(g), g);
  const mesh = (g: ConstructorParameters<typeof Mesh>[0], m: Material | Material[], x = 0, y = 0, z = 0) => {
    const o = new Mesh(g, m);
    o.position.set(x, y, z);
    o.castShadow = o.receiveShadow = true;
    return o;
  };
  const sample = (x: number, z: number, rot: number, depth: number, build: (g: Group) => void) => {
    const g = new Group();
    g.position.set(x, 0, z);
    g.rotation.y = rot;
    build(g);
    scene.add(g);
    samples.push({ group: g, lift: 0, target: 0, label: new Vector3(x, 0, z + depth / 2 + 0.16) });
  };
  const slab = (w: number, h: number, d: number, m: Material, r = 0.04) => mesh(geo(new RoundedBoxGeometry(w, h, d, 3, r)), m, 0, h / 2, 0);

  // order = MATERIALS in data/studio.ts: 01-04 along the back row, 05-08 along the front
  sample(-4.15, -0.95, 0.05, 1.0, (g) => g.add(slab(3.1, 0.18, 0.95, M.oak))); // Rift white oak
  sample(-1.05, -1.1, -0.07, 2.0, (g) => g.add(slab(2.0, 0.16, 2.0, M.marble, 0.03))); // Calacatta marble
  sample(1.75, -0.95, 0.09, 1.25, (g) => g.add(slab(1.65, 0.42, 1.25, M.limestone, 0.05))); // Leuders limestone
  sample(4.35, -0.95, -0.1, 1.3, (g) => {
    // Knurled brass: a bar pull on two posts, on an ivory lacquer sample door
    g.add(slab(1.5, 0.08, 1.3, M.plate, 0.03));
    for (const px of [-0.42, 0.42]) g.add(mesh(geo(new CylinderGeometry(0.055, 0.07, 0.2, 24)), M.brassSmooth, px, 0.18, 0));
    const bar = mesh(geo(new CylinderGeometry(0.085, 0.085, 1.22, 48).rotateZ(Math.PI / 2)), M.brass, 0, 0.3, 0);
    g.add(bar);
    for (const px of [-0.61, 0.61]) g.add(mesh(geo(new CylinderGeometry(0.087, 0.087, 0.02, 48).rotateZ(Math.PI / 2)), M.brassSmooth, px, 0.3, 0));
  });
  sample(-3.75, 1.4, -0.05, 1.45, (g) => {
    // Walnut slats on felt
    g.add(slab(2.05, 0.06, 1.45, M.felt, 0.02));
    for (let i = 0; i < 7; i++) g.add(mesh(geo(new RoundedBoxGeometry(0.2, 0.2, 1.45, 2, 0.02)), M.walnut, -0.87 + i * 0.29, 0.16, 0));
  });
  sample(-0.95, 1.45, 0, 1.9, (g) => {
    const disc = mesh(geo(new CylinderGeometry(0.95, 0.95, 0.16, 72)), [M.terrazzo, M.terrazzo, M.terrazzo], 0, 0.08, 0);
    g.add(disc);
  }); // Stone terrazzo
  sample(1.25, 1.35, 0.08, 1.6, (g) => {
    // Fluted oak
    g.add(slab(1.7, 0.1, 1.6, M.oak, 0.02));
    const flute = geo(new CylinderGeometry(0.095, 0.095, 1.6, 20, 1, false, 0, Math.PI).rotateX(Math.PI / 2).rotateZ(Math.PI / 2));
    for (let i = 0; i < 9; i++) g.add(mesh(flute, M.oak, -0.76 + i * 0.19, 0.1, 0));
  });
  sample(3.85, 1.3, 0.06, 1.2, (g) => g.add(slab(1.9, 0.26, 1.2, M.travertine, 0.04))); // Travertine

  // ── The raking light ──
  const key = new SpotLight(0xffdcb2, 520, 36, 0.85, 1, 2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 4;
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.02;
  key.shadow.camera.near = 4;
  key.shadow.camera.far = 30;
  key.target.position.set(0, 0, 0.2);
  scene.add(key, key.target);

  // ── State ──
  const light = { az: LIGHT0.az, el: LIGHT0.el };
  const goal = { az: LIGHT0.az, el: LIGHT0.el };
  let scrollAz = LIGHT0.az;
  let ptr: { x: number; y: number } | null = null;
  let hovered: number | null = null;
  let external: number | null = null;
  let hoverCb: ((i: number | null) => void) | null = null;
  let visible = true;
  let raf = 0;
  let disposed = false;
  let ready = false;
  let readyCb: (() => void) | null = null;
  const ray = new Raycaster();

  const placeLight = () => {
    const az = MathUtils.degToRad(light.az), el = MathUtils.degToRad(light.el);
    const d = 13;
    key.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, -Math.cos(az) * Math.cos(el) * d * 0.45 + 1.5);
  };
  // The stage keeps the board's aspect (CSS), so the camera never needs to reframe
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w && h) renderer.setSize(w, h, false);
    camera.aspect = (w || canvas.width) / (h || canvas.height);
    camera.updateProjectionMatrix();
  };
  const render = () => {
    placeLight();
    samples.forEach((s, i) => {
      s.group.position.y = s.lift * 0.22;
      s.group.rotation.z = s.lift * (i % 2 ? 0.04 : -0.04);
    });
    renderer.render(scene, camera);
  };
  const tick = () => {
    raf = 0;
    if (disposed) return;
    if (ptr) {
      goal.az = ptr.x * 70;
      goal.el = MathUtils.lerp(34, 12, (ptr.y + 1) / 2);
    } else {
      goal.az = scrollAz;
      goal.el = LIGHT0.el;
    }
    let moving = false;
    const k = 0.08;
    light.az += (goal.az - light.az) * k;
    light.el += (goal.el - light.el) * k;
    if (Math.abs(goal.az - light.az) > 0.05 || Math.abs(goal.el - light.el) > 0.05) moving = true;
    const want = external ?? hovered;
    samples.forEach((s, i) => {
      s.target = i === want ? 1 : 0;
      s.lift += (s.target - s.lift) * 0.16;
      if (Math.abs(s.target - s.lift) > 0.002) moving = true;
    });
    render();
    if (moving) kick();
  };
  const kick = () => {
    if (!raf && visible && !disposed && !still) raf = requestAnimationFrame(tick);
  };
  const pick = (p: { x: number; y: number }) => {
    ray.setFromCamera(new Vector2(p.x, -p.y), camera);
    const hit = ray.intersectObjects(
      samples.map((s) => s.group),
      true,
    )[0];
    if (!hit) return null;
    return samples.findIndex((s) => {
      let o: typeof hit.object | null = hit.object;
      while (o) {
        if (o === s.group) return true;
        o = o.parent;
      }
      return false;
    });
  };

  resize();
  await renderer.compileAsync(scene, camera);
  render();
  if (!still)
    requestAnimationFrame(() => {
      render();
      requestAnimationFrame(() => {
        ready = true;
        readyCb?.();
      });
    });

  return {
    onReady(cb) {
      if (ready) cb();
      else readyCb = cb;
    },
    pointer(p) {
      ptr = p;
      const h = p ? pick(p) : null;
      if (h !== hovered) {
        hovered = h === -1 ? null : h;
        hoverCb?.(hovered);
      }
      kick();
    },
    scroll(p) {
      scrollAz = MathUtils.lerp(-62, 62, MathUtils.clamp(p, 0, 1));
      kick();
    },
    highlight(i) {
      external = i;
      kick();
    },
    onHover(cb) {
      hoverCb = cb;
    },
    setVisible(v) {
      visible = v;
      if (v) kick();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    resize() {
      resize();
      render();
    },
    anchors() {
      return samples.map((s) => {
        const v = s.label.clone().project(camera);
        return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 };
      });
    },
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      scene.traverse((o) => {
        if ((o as Mesh).isMesh) (o as Mesh).geometry.dispose();
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

