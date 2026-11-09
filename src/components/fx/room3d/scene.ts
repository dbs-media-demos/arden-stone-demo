/**
 * The hero's 3D centrepiece: an architect's cutaway model of the Bluffview kitchen (the hero photo),
 * built from primitives. It starts as a pencil drawing on the sheet (graphite lines, paper surfaces),
 * then a bronze section line sweeps through it and the room is "built" behind it: rift oak, plaster,
 * a marble slab wall, the white waterfall island, walnut stools, ring pendants, and late sun through
 * the tall window laying soft patches across the floor. The camera drifts while it builds, leans
 * towards the pointer and dollies in with the scroll. Frames are drawn only while something moves.
 *
 * Imports nothing but three (and two of its addons) so scripts/render-room.mjs can render the stills
 * from this same file.
 */
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  ClampToEdgeWrapping,
  CylinderGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  InstancedMesh,
  LatheGeometry,
  LineSegments,
  MathUtils,
  Mesh,
  Object3D,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type RoomView = { az: number; el: number; dist: number; tx: number; ty: number; tz: number };
export type RoomOptions = {
  /** Render one frame of a fixed state and stop (the stills). */
  still?: "drawn" | "built" | number;
  /** Override the framing (the phone still). */
  view?: Partial<RoomView>;
  /** The aspect the stills are rendered at; the live canvas crops like object-fit: cover around it. */
  aspect?: number;
};
export type RoomScene = {
  onReady: (cb: () => void) => void;
  /** The room is built behind the section line while the camera drifts. */
  intro: () => void;
  /** Skip the build (it already ran, or the still shown first was the built one). */
  built: () => void;
  pointer: (x: number, y: number) => void;
  /** 0 at the top of the page, 1 once the photo has taken the frame. */
  scroll: (p: number) => void;
  setVisible: (v: boolean) => void;
  resize: () => void;
  dispose: () => void;
};


/** Where the camera starts (the drawing, the still that's in the HTML) and where the intro drift ends. */
export const START: RoomView = { az: 47, el: 27, dist: 19.2, tx: 0.08, ty: 0.05, tz: 0.08 };
export const END: RoomView = { az: 34, el: 22, dist: 16.4, tx: 0.38, ty: 0.25, tz: -0.2 };
export const STILL_ASPECT = 1.12;
const FOV = 26;

/** Seeded random, so the still and the live scene draw the same grain and veins. */
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

function canvas2d(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function tex(c: HTMLCanvasElement, repeat = 1, aniso = 8) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = aniso;
  return t;
}

/** Wide-plank white oak, the planks running along x. One texture tile = 2.4 m. */
function oakFloor() {
  const R = rng(7);
  const S = 1024;
  const [c, g] = canvas2d(S, S);
  const rows = 12; // 0.2 m planks
  const ph = S / rows;
  for (let r = 0; r < rows; r++) {
    let x = -R() * S * 0.6;
    while (x < S) {
      const len = S * (0.45 + R() * 0.55);
      const l = 55 + R() * 7;
      g.fillStyle = `hsl(${30 + R() * 4}, ${34 + R() * 8}%, ${l}%)`;
      g.fillRect(x, r * ph, len, ph);
      // grain: long, slightly wavy strokes
      for (let k = 0; k < 26; k++) {
        const y0 = r * ph + R() * ph;
        g.strokeStyle = `rgba(${80 + R() * 30}, ${45 + R() * 20}, 18, ${0.06 + R() * 0.12})`;
        g.lineWidth = 0.6 + R() * 1.6;
        g.beginPath();
        g.moveTo(x, y0);
        const amp = R() * 2.5;
        for (let s = 0; s <= 8; s++) g.lineTo(x + (len * s) / 8, y0 + Math.sin(s * 0.9 + R()) * amp);
        g.stroke();
      }
      if (R() < 0.35) {
        g.fillStyle = "rgba(80, 48, 20, 0.35)";
        g.beginPath();
        g.ellipse(x + R() * len, r * ph + ph * (0.3 + R() * 0.4), 3 + R() * 4, 1.6 + R() * 2, 0, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = "rgba(60, 38, 18, 0.55)";
      g.fillRect(x, r * ph, 1.5, ph); // butt joint
      x += len;
    }
    g.fillStyle = "rgba(60, 38, 18, 0.5)";
    g.fillRect(0, r * ph, S, 1.5); // long joint
  }
  return tex(c);
}

/** Rift oak veneer, grain vertical (cabinet fronts, the island core). */
function oakVeneer() {
  const R = rng(11);
  const [c, g] = canvas2d(512, 512);
  g.fillStyle = "#c7ab88";
  g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 340; k++) {
    const x = R() * 512;
    g.strokeStyle = `rgba(${110 + R() * 40}, ${75 + R() * 25}, 40, ${0.05 + R() * 0.1})`;
    g.lineWidth = 0.5 + R() * 2;
    g.beginPath();
    g.moveTo(x, 0);
    g.bezierCurveTo(x + R() * 4 - 2, 170, x + R() * 4 - 2, 340, x + R() * 3 - 1.5, 512);
    g.stroke();
  }
  return tex(c);
}

/** Bookmatched statuario: white, soft grey clouds, bold grey veins (the slab wall in the photo). */
function marble() {
  const R = rng(23);
  const W = 1024;
  const H = 640;
  const [c, g] = canvas2d(W, H);
  g.fillStyle = "#f2f1ee";
  g.fillRect(0, 0, W, H);
  for (let k = 0; k < 26; k++) {
    const grd = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    grd.addColorStop(0, "rgba(160,162,166,0.10)");
    grd.addColorStop(1, "rgba(160,162,166,0)");
    g.save();
    g.translate(R() * W, R() * H);
    g.scale(80 + R() * 220, 40 + R() * 120);
    g.fillStyle = grd;
    g.beginPath();
    g.arc(0, 0, 1, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  const vein = (x: number, y: number, ang: number, w: number, steps: number, a: number, R = rng(Math.round(x * 13 + ang * 1000))) => {
    g.strokeStyle = `rgba(105, 110, 116, ${a})`;
    g.lineCap = "round";
    for (let s = 0; s < steps; s++) {
      const nx = x + Math.cos(ang) * 14;
      const ny = y + Math.sin(ang) * 14;
      g.lineWidth = Math.max(0.4, w * (0.6 + R() * 0.7));
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(nx, ny);
      g.stroke();
      x = nx;
      y = ny;
      ang += (R() - 0.5) * 0.32;
      if (R() < 0.03 && w > 2) vein(x, y, ang + (R() - 0.5) * 1.6, w * 0.4, (steps - s) * 0.45, a * 0.75, rng(s * 31 + Math.round(x)));
    }
  };
  // the slab is bookmatched, so draw one half and mirror it: a few bold bands, a haze around them, hairlines
  const R2 = rng(29);
  const seeds = [0, 1, 2].map((k) => [W * (0.08 + k * 0.15 + R2() * 0.05), -Math.PI / 2 - 0.45 + R2() * 0.7, R2()]);
  g.shadowColor = "rgba(140,146,152,1)";
  g.shadowBlur = 18;
  for (const [x, a] of seeds) vein(x, H + 10, a, 9, 60, 0.28);
  g.shadowBlur = 3;
  for (const [x, a] of seeds) vein(x, H + 10, a, 3.2, 60, 0.75);
  for (let k = 0; k < 7; k++) vein(R() * W * 0.5, R() * H, R() * Math.PI * 2, 0.6 + R() * 0.5, 22, 0.3, rng(k + 100));
  g.shadowBlur = 0;
  g.save();
  g.translate(W, 0);
  g.scale(-1, 1);
  g.drawImage(c, 0, 0, W / 2, H, 0, 0, W / 2, H);
  g.restore();
  const t = tex(c);
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  return t;
}

/** A soft contact shadow for the sheet under the model. */
function contactShadow() {
  // alphaMap reads the green channel: white shadow on black
  const [c, g] = canvas2d(256, 256);
  g.fillStyle = "#000";
  g.fillRect(0, 0, 256, 256);
  g.shadowColor = "#fff";
  g.shadowBlur = 30;
  g.shadowOffsetX = 1000;
  g.fillRect(-1000 + 46, 46, 164, 164);
  const t = new CanvasTexture(c);
  return t;
}

/** Uniforms shared by every material: where the section line has reached. */
const U = {
  uBuild: { value: -10 },
  uDir: { value: new Vector2(0.93, 0.36).normalize() },
  uSoft: { value: 0.3 },
  // the site's paper and bronze, in sRGB: the shaders mix after the output encoding
  uPaper: { value: new Vector3(0xf1 / 255, 0xed / 255, 0xe6 / 255) },
  uBronze: { value: new Vector3(0xc4 / 255, 0x97 / 255, 0x64 / 255) },
  uEdge: { value: 1 },
};

const BUILD_GLSL = /* glsl */ `
  float bs = dot(vBuildPos.xz, uDir) - uBuild;
  float bk = smoothstep(-uSoft, 0.0, bs);
  float bw = fwidth(bs);
  float bl = (1.0 - smoothstep(0.0, bw * 1.6, abs(bs))) * uEdge;
  float bg = exp(-abs(bs) * 9.0) * 0.22 * uEdge * step(bs, 0.0);
`;

/** Paper until the section line reaches it, then the real material (fade: transparent things just appear). */
function developable<M extends Material>(m: M, mode: "surface" | "fade" | "discard" = "surface"): M {
  m.onBeforeCompile = (sh: WebGLProgramParametersWithUniforms) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBuildPos;")
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\n{ vec4 bp = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\nbp = instanceMatrix * bp;\n#endif\nvBuildPos = (modelMatrix * bp).xyz; }",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vBuildPos;\nuniform float uBuild; uniform vec2 uDir; uniform float uSoft; uniform vec3 uPaper; uniform vec3 uBronze; uniform float uEdge;",
      )
      .replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\n{" +
          BUILD_GLSL +
          (mode === "surface"
            ? "gl_FragColor.rgb = mix(gl_FragColor.rgb, uPaper, bk); gl_FragColor.rgb = mix(gl_FragColor.rgb, uBronze, clamp(bl + bg, 0.0, 1.0)); gl_FragColor.a = mix(gl_FragColor.a, 1.0, bk);"
            : mode === "fade"
              ? "gl_FragColor *= (1.0 - bk);"
              : "if (bk > 0.5) discard; gl_FragColor.rgb = mix(gl_FragColor.rgb, uBronze, clamp(bl + bg, 0.0, 1.0));") +
          "}",
      );
  };
  m.customProgramCacheKey = () => `build-${mode}`;
  if (mode === "surface") {
    // Lines sit on the surfaces' edges: push the surfaces back a hair so the pencil always wins
    m.polygonOffset = true;
    m.polygonOffsetFactor = 1;
    m.polygonOffsetUnits = 1;
  }
  return m;
}

/** The pencil: one draw call for every line in the model. */
function lineMaterial() {
  return new ShaderMaterial({
    uniforms: { ...U, uColor: { value: new Vector3(0x3b / 255, 0x34 / 255, 0x2d / 255) }, uOpacity: { value: 0.82 } },
    vertexShader: /* glsl */ `
      attribute float aKeep;
      varying vec3 vBuildPos;
      varying float vKeep;
      void main() {
        vKeep = aKeep;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vBuildPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uBuild; uniform vec2 uDir; uniform float uSoft; uniform vec3 uPaper; uniform vec3 uBronze; uniform float uEdge;
      uniform vec3 uColor; uniform float uOpacity;
      varying vec3 vBuildPos;
      varying float vKeep;
      void main() {
        ${BUILD_GLSL}
        float a = uOpacity * mix(bk, 0.55, vKeep);
        if (a < 0.003) discard;
        gl_FragColor = vec4(uColor, a);
      }`,
    transparent: true,
    depthWrite: false,
  });
}

type PartOpts = { lines?: BufferGeometry | null; cast?: boolean; receive?: boolean };

export async function createRoom(canvas: HTMLCanvasElement, opts: RoomOptions = {}): Promise<RoomScene> {
  const still = opts.still;
  const aspect0 = opts.aspect ?? STILL_ASPECT;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: !!still, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(still ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.42;
  pmrem.dispose();

  const camera = new PerspectiveCamera(FOV, aspect0, 0.5, 60);
  const disposables: { dispose: () => void }[] = [envRT];
  const lineGeos: { geo: BufferGeometry; keep: number }[] = [];
  const model = new Group();
  scene.add(model);

  // ── Materials ──
  const floorTex = oakFloor();
  floorTex.repeat.set(6 / 2.4, 4.4 / 2.4);
  const veneer = oakVeneer();
  const marbleTex = marble();
  disposables.push(floorTex, veneer, marbleTex);
  const std = (p: ConstructorParameters<typeof MeshStandardMaterial>[0], mode: "surface" | "discard" = "surface") => {
    const m = developable(new MeshStandardMaterial(p), mode);
    disposables.push(m);
    return m;
  };
  const phys = (p: ConstructorParameters<typeof MeshPhysicalMaterial>[0], mode: "surface" | "fade" = "surface") => {
    const m = developable(new MeshPhysicalMaterial(p), mode);
    disposables.push(m);
    return m;
  };
  const M = {
    floor: std({ map: floorTex, roughness: 0.42, color: 0xffffff }),
    cut: std({ color: 0x3a312a, roughness: 0.85 }),
    plaster: std({ color: 0xf4f0e9, roughness: 0.95 }),
    stone: phys({ color: 0xf6f4f0, roughness: 0.22, clearcoat: 0.35, clearcoatRoughness: 0.3 }),
    marble: phys({ map: marbleTex, roughness: 0.16, clearcoat: 0.5, clearcoatRoughness: 0.15 }),
    veneer: std({ map: veneer, roughness: 0.6 }),
    lacquer: phys({ color: 0xece7de, roughness: 0.35, clearcoat: 0.25 }),
    greige: phys({ color: 0xe0d9cd, roughness: 0.4, clearcoat: 0.2 }),
    glassDark: phys({ color: 0x141414, roughness: 0.08, metalness: 0.2, clearcoat: 1 }),
    bronzeMetal: std({ color: 0x2b2622, roughness: 0.38, metalness: 0.75 }),
    steel: std({ color: 0xb9b6b0, roughness: 0.25, metalness: 1 }),
    brass: std({ color: 0xc9a46a, roughness: 0.28, metalness: 1 }),
    walnut: std({ color: 0x4a3122, roughness: 0.55 }),
    fabric: std({ color: 0xe9e2d6, roughness: 0.95 }),
    potStone: std({ color: 0xd9d1c4, roughness: 0.9 }),
    bark: std({ color: 0x5b4c3c, roughness: 0.9 }),
    olive: std({ color: 0xffffff, roughness: 0.65 }, "discard"),
    lemon: std({ color: 0xe6c13e, roughness: 0.55 }, "discard"),
    glow: developable(new MeshBasicMaterial({ color: new Color(1.0, 0.85, 0.62).multiplyScalar(3), toneMapped: false })),
    glass: phys({ color: 0xffffff, roughness: 0.04, transparent: true, opacity: 0.1, depthWrite: false }, "fade"),
  };
  disposables.push(M.glow);

  /** Every mesh carries its pencil outline, made from the plain shape (not the rounded one). */
  const add = (mesh: Mesh, o: PartOpts = {}, parent: Object3D = model) => {
    mesh.castShadow = o.cast ?? true;
    mesh.receiveShadow = o.receive ?? true;
    parent.add(mesh);
    if (o.lines !== null) {
      mesh.updateMatrixWorld(true);
      const src = o.lines ?? new EdgesGeometry(mesh.geometry, 28);
      const g = src.clone().applyMatrix4(mesh.matrixWorld);
      lineGeos.push({ geo: g, keep: 0 });
      src.dispose();
    }
    disposables.push(mesh.geometry);
    return mesh;
  };
  /** A box from its min/max corners (metres), softly rounded, outlined as a box. */
  const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, mat: Material | Material[], o: PartOpts & { r?: number } = {}) => {
    const w = x1 - x0;
    const h = y1 - y0;
    const d = z1 - z0;
    const r = Math.min(o.r ?? 0.008, w / 2.2, h / 2.2, d / 2.2);
    const geo = Array.isArray(mat) || r <= 0.0015 ? new BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, 2, r);
    const mesh = new Mesh(geo, mat);
    mesh.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    const lines = o.lines === null ? null : (o.lines ?? new EdgesGeometry(new BoxGeometry(w, h, d)));
    return add(mesh, { ...o, lines });
  };

  const shadowTex = contactShadow();
  disposables.push(shadowTex);
  // Soft contact shadows where things meet the floor (the room's ambient occlusion, baked by hand)
  const ao = (x0: number, z0: number, x1: number, z1: number, o: number, y = 0.003) => {
    const m = developable(new MeshBasicMaterial({ color: 0x1d1610, alphaMap: shadowTex, transparent: true, opacity: o, depthWrite: false }), "fade");
    disposables.push(m);
    const pad = 0.42;
    const p = new Mesh(new PlaneGeometry((x1 - x0) / (1 - pad) , (z1 - z0) / (1 - pad)), m);
    p.rotation.x = -Math.PI / 2;
    p.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
    p.renderOrder = 1;
    add(p, { cast: false, receive: false, lines: null });
  };
  // ── The room: oak floor on a slab cut in section, two plaster walls, a tall window ──
  const FX0 = -3.0, FX1 = 3.0, FZ0 = -2.2, FZ1 = 2.2, H = 2.8, T = 0.16;
  box(FX0 - T, -0.16, FZ0 - T, FX1, 0, FZ1, [M.cut, M.cut, M.floor, M.cut, M.cut, M.cut], { r: 0 });
  const wall = [M.plaster, M.plaster, M.cut, M.plaster, M.plaster, M.plaster];
  // back wall
  box(FX0, 0, FZ0 - T, FX1, H, FZ0, wall, { r: 0 });
  // left wall around the window (z -1.3 .. 0.7, y 0.45 .. 2.45)
  const WZ0 = -1.3, WZ1 = 0.7, WY0 = 0.45, WY1 = 2.45;
  box(FX0 - T, 0, FZ0 - T, FX0, H, WZ0, wall, { r: 0 });
  box(FX0 - T, 0, WZ1, FX0, H, FZ1, wall, { r: 0 });
  box(FX0 - T, 0, WZ0, FX0, WY0, WZ1, wall, { r: 0 });
  box(FX0 - T, WY1, WZ0, FX0, H, WZ1, wall, { r: 0 });
  // window frame: dark bronze, a mullion and a transom (their shadows cross the floor)
  const f = 0.045, fx0 = FX0 - T * 0.6, fx1 = FX0 - T * 0.15;
  box(fx0, WY0, WZ0, fx1, WY0 + f, WZ1, M.bronzeMetal, { r: 0.004 });
  box(fx0, WY1 - f, WZ0, fx1, WY1, WZ1, M.bronzeMetal, { r: 0.004 });
  box(fx0, WY0, WZ0, fx1, WY1, WZ0 + f, M.bronzeMetal, { r: 0.004 });
  box(fx0, WY0, WZ1 - f, fx1, WY1, WZ1, M.bronzeMetal, { r: 0.004 });
  box(fx0, WY0, -0.3 - f / 2, fx1, WY1, -0.3 + f / 2, M.bronzeMetal, { r: 0.004 });
  box(fx0, 1.92, WZ0, fx1, 1.92 + f, WZ1, M.bronzeMetal, { r: 0.004 });
  const pane = new Mesh(new PlaneGeometry(WZ1 - WZ0, WY1 - WY0), M.glass);
  pane.rotation.y = Math.PI / 2;
  pane.position.set((fx0 + fx1) / 2, (WY0 + WY1) / 2, (WZ0 + WZ1) / 2);
  add(pane, { cast: false, receive: false, lines: null });

  // ── Back run: oak base cabinets, stone top with a waterfall end, the marble slab, greige uppers ──
  const BX0 = -0.35, BX1 = 2.72, BZ0 = FZ0, BZ1 = FZ0 + 0.62;
  box(BX0, 0, BZ0, BX1 - 0.07, 0.08, BZ1 - 0.06, M.cut, { r: 0, lines: null }); // toe kick
  const drawers = [BX0, 0.45, 1.2, 1.95, BX1 - 0.07];
  for (let i = 0; i < drawers.length - 1; i++) {
    box(drawers[i] + 0.004, 0.08, BZ0, drawers[i + 1] - 0.004, 0.47, BZ1, M.veneer);
    box(drawers[i] + 0.004, 0.476, BZ0, drawers[i + 1] - 0.004, 0.86, BZ1, M.veneer);
  }
  box(BX0 - 0.01, 0.86, BZ0, BX1, 0.92, BZ1 + 0.02, M.stone, { r: 0.006 });
  box(BX1 - 0.06, 0, BZ0, BX1, 0.92, BZ1 + 0.02, M.stone, { r: 0.006 });
  const slab = new Mesh(new BoxGeometry(BX1 - BX0 + 0.01, H - 0.92, 0.025), [M.plaster, M.plaster, M.plaster, M.plaster, M.marble, M.plaster]);
  slab.position.set((BX0 + BX1) / 2, (0.92 + H) / 2, FZ0 + 0.0125);
  add(slab, { lines: new EdgesGeometry(new BoxGeometry(BX1 - BX0 + 0.01, H - 0.92, 0.025)) });
  box(1.15, 0.92, FZ0 + 0.1, 1.95, 0.935, FZ0 + 0.5, M.glassDark, { r: 0.003 }); // cooktop
  const uppers = [0.3, 1.07, 1.84, 2.6];
  for (let i = 0; i < 3; i++) box(uppers[i] + 0.005, 1.62, FZ0 + 0.03, uppers[i + 1] - 0.005, 2.22, FZ0 + 0.4, M.greige, { r: 0.006 });
  // a stoneware crock of wooden spoons
  const crock = new Mesh(new CylinderGeometry(0.06, 0.055, 0.17, 24), M.fabric);
  crock.position.set(2.35, 1.005, FZ0 + 0.25);
  add(crock, { lines: new EdgesGeometry(new CylinderGeometry(0.06, 0.055, 0.17, 12), 40) });

  // ── Tall bank: white lacquer, two ovens in dark glass ──
  const TX = [-2.86, -2.06, -1.26, -0.46];
  const TZ0 = FZ0, TZ1 = FZ0 + 0.62;
  for (let i = 0; i < 3; i++) {
    const x0 = TX[i] + 0.005, x1 = TX[i + 1] - 0.005;
    if (i === 0) {
      box(x0, 0.06, TZ0, x1, 1.28, TZ1, M.lacquer);
    } else {
      box(x0, 0.06, TZ0, x1, 0.92, TZ1, M.lacquer);
      box(x0, 0.925, TZ0, x1, 1.6, TZ1 - 0.01, M.lacquer);
      box(x0 + 0.04, 1.04, TZ1 - 0.01, x1 - 0.04, 1.5, TZ1 + 0.006, M.steel, { r: 0.004, cast: false });
      box(x0 + 0.06, 1.06, TZ1, x1 - 0.06, 1.42, TZ1 + 0.01, M.glassDark, { r: 0.003, cast: false, lines: null });
    }
    box(x0, i === 0 ? 1.285 : 1.605, TZ0, x1, 2.5, TZ1, M.lacquer);
  }
  box(TX[0], 0, TZ0, TX[3], 0.06, TZ1 - 0.05, M.cut, { r: 0, lines: null });

  // ── The island: white stone waterfall ends that taper, an oak core, a seating overhang ──
  const IX0 = -0.95, IX1 = 1.95, IZ0 = -0.15, IZ1 = 0.95, IH = 0.94;
  box(IX0, IH - 0.06, IZ0, IX1, IH, IZ1, M.stone, { r: 0.008 });
  box(IX0 + 0.12, 0, IZ0 + 0.12, IX1 - 0.12, IH - 0.06, IZ1 - 0.3, M.veneer, { r: 0.004 });
  // drawn with x = -z: rotated a quarter turn, the shape's x becomes world z and the extrusion world x
  const taper = new Shape();
  taper.moveTo(-IZ0, IH - 0.06);
  taper.lineTo(-IZ0 - 0.14, 0);
  taper.lineTo(-IZ1 + 0.2, 0);
  taper.lineTo(-IZ1, IH - 0.06);
  taper.closePath();
  for (const x of [IX0, IX1 - 0.08]) {
    const geo = new ExtrudeGeometry(taper, { depth: 0.08, bevelEnabled: false });
    geo.rotateY(Math.PI / 2);
    const m = new Mesh(geo, M.stone);
    m.position.x = x;
    add(m);
  }
  // brass faucet
  const tap = new Group();
  tap.position.set(0.85, IH, 0.12);
  model.add(tap);
  const stem = new Mesh(new CylinderGeometry(0.014, 0.018, 0.34, 16), M.brass);
  stem.position.y = 0.17;
  add(stem, { lines: null }, tap);
  const spout = new Mesh(new TorusGeometry(0.09, 0.012, 10, 24, Math.PI), M.brass);
  spout.position.set(0, 0.34, 0.09);
  spout.rotation.y = Math.PI / 2;
  add(spout, { lines: null }, tap);
  // a walnut bowl of lemons
  const bowlPts = [0, 0.05, 0.1, 0.14, 0.16].map((r, i) => new Vector2(r, i * 0.018));
  const bowl = new Mesh(new LatheGeometry(bowlPts, 32), M.walnut);
  bowl.position.set(-0.35, IH, 0.5);
  add(bowl, { lines: null });
  const lemonGeo = new SphereGeometry(0.038, 20, 14);
  lemonGeo.scale(1.25, 1, 1);
  [
    [-0.4, 0.52, 0.3],
    [-0.31, 0.47, -0.6],
    [-0.36, 0.58, 1.4],
    [-0.28, 0.55, 2.2],
    [-0.35, 0.5, 0.9],
  ].forEach(([x, z, r], i) => {
    const l = new Mesh(i ? lemonGeo.clone() : lemonGeo, M.lemon);
    l.position.set(x, IH + 0.05 + (i === 4 ? 0.05 : 0), z);
    l.rotation.y = r;
    add(l, { lines: null });
  });

  // ── Three walnut stools with cream seats, backs to the camera ──
  const stoolXs = [-0.35, 0.45, 1.25];
  for (const sx of stoolXs) {
    const z0 = IZ1 + 0.14, z1 = z0 + 0.44, x0 = sx - 0.22, x1 = sx + 0.22, l = 0.035;
    for (const [lx, lz] of [
      [x0, z0],
      [x1 - l, z0],
      [x0, z1 - l],
      [x1 - l, z1 - l],
    ])
      box(lx, 0, lz, lx + l, lz > z0 ? 0.9 : 0.64, lz + l, M.walnut, { r: 0.006 });
    box(x0 + l, 0.22, z0, x1 - l, 0.245, z0 + l, M.walnut, { r: 0.005 });
    box(x0 + l, 0.22, z1 - l, x1 - l, 0.245, z1, M.walnut, { r: 0.005 });
    box(x0, 0.6, z0, x1, 0.64, z1, M.walnut, { r: 0.006 });
    box(x0 + 0.01, 0.64, z0 + 0.01, x1 - 0.01, 0.7, z1 - 0.03, M.fabric, { r: 0.025 });
    box(x0 + 0.02, 0.76, z1 - 0.06, x1 - 0.02, 0.9, z1 - 0.01, M.fabric, { r: 0.02 });
  }

  // ── An olive tree in a stone pot, by the window: its leaves dapple the sunlight on the floor ──
  {
    const R = rng(41);
    const ox = -2.35, oz = 1.35;
    const potPts = [
      [0, 0],
      [0.2, 0],
      [0.25, 0.04],
      [0.27, 0.38],
      [0.25, 0.4],
      [0.23, 0.38],
      [0.22, 0.34],
      [0, 0.34],
    ].map(([r, y]) => new Vector2(r, y));
    const pot = new Mesh(new LatheGeometry(potPts, 40), M.potStone);
    pot.position.set(ox, 0, oz);
    const potLines = new BufferGeometry();
    const pl: number[] = [];
    for (const [r, y] of [
      [0.27, 0.39],
      [0.2, 0.0],
    ])
      for (let k = 0; k < 40; k++) {
        const a0 = (k / 40) * Math.PI * 2, a1 = ((k + 1) / 40) * Math.PI * 2;
        pl.push(Math.cos(a0) * r, y, Math.sin(a0) * r, Math.cos(a1) * r, y, Math.sin(a1) * r);
      }
    potLines.setAttribute("position", new Float32BufferAttribute(pl, 3));
    add(pot, { lines: potLines });
    // trunk: three leaning limbs
    const crowns: [number, number, number, number][] = [];
    const limbs = [
      [0.12, 1.62, 0.06, 0.36],
      [-0.16, 1.42, -0.1, 0.3],
      [0.02, 1.95, -0.05, 0.3],
    ];
    for (const [dx, h, dz, rad] of limbs) {
      const len = Math.hypot(dx, h - 0.34, dz);
      const limb = new Mesh(new CylinderGeometry(0.018, 0.035, len, 8), M.bark);
      limb.position.set(ox + dx / 2, 0.34 + (h - 0.34) / 2, oz + dz / 2);
      limb.lookAt(ox + dx, h, oz + dz);
      limb.rotateX(Math.PI / 2);
      add(limb, { lines: null });
      const ll = new BufferGeometry();
      ll.setAttribute("position", new Float32BufferAttribute([ox, 0.34, oz, ox + dx, h - rad * 0.55, oz + dz], 3));
      lineGeos.push({ geo: ll, keep: 0 });
      crowns.push([ox + dx, h, oz + dz, rad]);
    }
    const leaf = new SphereGeometry(1, 6, 4);
    leaf.scale(0.048, 0.008, 0.014);
    const N = 1300;
    const leaves = new InstancedMesh(leaf, M.olive, N);
    const o = new Object3D();
    for (let i = 0; i < N; i++) {
      const [cx, cy, cz, r] = crowns[i % crowns.length];
      // clumped, flatter at the bottom
      const u = R() * Math.PI * 2, v = Math.acos(2 * R() - 1), rr = r * Math.cbrt(R());
      o.position.set(cx + Math.sin(v) * Math.cos(u) * rr, cy + Math.cos(v) * rr * 0.62, cz + Math.sin(v) * Math.sin(u) * rr);
      o.rotation.set((R() - 0.5) * 1.4, R() * Math.PI * 2, (R() - 0.5) * 1.4);
      o.scale.setScalar(0.8 + R() * 0.5);
      o.updateMatrix();
      leaves.setMatrixAt(i, o.matrix);
      leaves.setColorAt(i, new Color().setHSL(0.2 + R() * 0.05, 0.2 + R() * 0.14, 0.14 + R() * 0.12));
    }
    add(leaves, { lines: null });
    // in the drawing, each crown is a loose drafted cloud
    const cl: number[] = [];
    for (const [cx, cy, cz, r] of crowns) {
      const n = 40;
      for (let k = 0; k < n; k++) {
        const a0 = (k / n) * Math.PI * 2, a1 = ((k + 1) / n) * Math.PI * 2;
        const w0 = r * (0.92 + 0.12 * Math.sin(a0 * 7 + cx * 9)), w1 = r * (0.92 + 0.12 * Math.sin(a1 * 7 + cx * 9));
        cl.push(cx + Math.cos(a0) * w0 * 0.8, cy + Math.sin(a0) * w0 * 0.62, cz - Math.cos(a0) * w0 * 0.6, cx + Math.cos(a1) * w1 * 0.8, cy + Math.sin(a1) * w1 * 0.62, cz - Math.cos(a1) * w1 * 0.6);
      }
    }
    const cg = new BufferGeometry();
    cg.setAttribute("position", new Float32BufferAttribute(cl, 3));
    lineGeos.push({ geo: cg, keep: 0 });
    ao(ox - 0.26, oz - 0.26, ox + 0.26, oz + 0.26, 0.5);
  }

  // ── Two ring pendants over the island, hung from the (cut away) ceiling ──
  const glows: PointLight[] = [];
  for (const px of [-0.05, 1.05]) {
    const y = 1.78;
    const ring = new Mesh(new TorusGeometry(0.3, 0.014, 12, 72), M.bronzeMetal);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(px, y, 0.4);
    const ringLines = new BufferGeometry();
    const pts: number[] = [];
    for (let k = 0; k < 48; k++) {
      const a0 = (k / 48) * Math.PI * 2, a1 = ((k + 1) / 48) * Math.PI * 2;
      // the outer rim, just outside the tube so the paper-white ring never hides it
      pts.push(Math.cos(a0) * 0.318, Math.sin(a0) * 0.318, 0.004, Math.cos(a1) * 0.318, Math.sin(a1) * 0.318, 0.004);
    }
    ringLines.setAttribute("position", new Float32BufferAttribute(pts, 3));
    add(ring, { cast: true, receive: false, lines: ringLines });
    const strip = new Mesh(new TorusGeometry(0.3, 0.008, 6, 72), M.glow);
    strip.rotation.x = Math.PI / 2;
    strip.position.set(px, y - 0.016, 0.4);
    add(strip, { cast: false, receive: false, lines: null });
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2 + 0.4;
      const wx = px + Math.cos(a) * 0.3, wz = 0.4 + Math.sin(a) * 0.3;
      const len = H - y;
      const wire = new Mesh(new CylinderGeometry(0.0025, 0.0025, Math.hypot(len, 0.3), 4), M.bronzeMetal);
      wire.position.set((wx + px) / 2, y + len / 2, (wz + 0.4) / 2);
      wire.lookAt(px, H, 0.4);
      wire.rotateX(Math.PI / 2);
      const wl = new BufferGeometry();
      wl.setAttribute("position", new Float32BufferAttribute([wx, y, wz, px, H, 0.4], 3));
      lineGeos.push({ geo: wl, keep: 0 });
      add(wire, { cast: false, receive: false, lines: null });
    }
    const canopy = new Mesh(new CylinderGeometry(0.07, 0.07, 0.025, 24), M.bronzeMetal);
    canopy.position.set(px, H - 0.0125, 0.4);
    add(canopy, { cast: false, lines: new EdgesGeometry(new CylinderGeometry(0.07, 0.07, 0.025, 12), 40) });
    const pl = new PointLight(0xffc98a, 0, 3.2, 2);
    pl.position.set(px, y - 0.12, 0.4);
    scene.add(pl);
    glows.push(pl);
  }

  // ── The sheet under the model: a soft contact shadow and drafted dimension lines ──
  const ground = new Mesh(new PlaneGeometry(8.6, 6.9), developable(new MeshBasicMaterial({ color: 0x1d1916, alphaMap: shadowTex, transparent: true, opacity: 0.38, depthWrite: false }), "fade"));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0.35, -0.17, 0.25);
  add(ground, { cast: false, receive: false, lines: null });
  {
    const pts: number[] = [];
    const seg = (a: number[], b: number[]) => pts.push(...a, ...b);
    const y = -0.16;
    const tick = 0.09;
    // along the front edge
    const z = FZ1 + 0.55;
    seg([FX0 - T - 0.15, y, z], [FX1 + 0.15, y, z]);
    for (const x of [FX0 - T, -0.95, 1.95, FX1]) {
      seg([x - tick, y, z + tick], [x + tick, y, z - tick]);
      seg([x, y, z - 0.25], [x, y, z + 0.08]);
    }
    // along the right edge
    const x = FX1 + 0.55;
    seg([x, y, FZ0 - T - 0.15], [x, y, FZ1 + 0.15]);
    for (const zz of [FZ0 - T, -0.15, 0.95, FZ1]) {
      seg([x - tick, y, zz + tick], [x + tick, y, zz - tick]);
      seg([x - 0.25, y, zz], [x + 0.08, y, zz]);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    lineGeos.push({ geo: g, keep: 1 });
  }

  ao(IX0 + 0.1, IZ0 + 0.1, IX1 - 0.1, IZ1 - 0.25, 0.55);
  ao(BX0, BZ0, BX1, BZ1, 0.45);
  ao(TX[0], TZ0, TX[3], TZ1, 0.45);
  for (const sx of stoolXs) ao(sx - 0.2, IZ1 + 0.16, sx + 0.2, IZ1 + 0.56, 0.3);
  ao(FX0, FZ0, FX1, FZ0 + 0.25, 0.25); // along the back wall
  ao(FX0, FZ0, FX0 + 0.25, FZ1, 0.25); // along the left wall

  // ── Light: late sun through the window, soft fill from the room, warm pendants ──
  const sun = new DirectionalLight(0xffdcae, 7.5);
  sun.position.set(-8.5, 6.2, -3.4);
  sun.target.position.set(0.4, 0, 0.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 5;
  sun.shadow.camera.bottom = -5;
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 22;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 3.5;
  scene.add(sun, sun.target);
  // warm bounce off the oak and the plaster, so the shade is warm and never grey
  scene.add(new HemisphereLight(0xfff3e2, 0xb98a5a, 0.55));
  // The cut-away ceiling still blocks the sun (the light only comes in through the window); it's never drawn
  const ceilingMat = new MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  disposables.push(ceilingMat);
  const ceiling = new Mesh(new BoxGeometry(FX1 - FX0 + 2 * T, 0.05, FZ1 - FZ0 + 2 * T), ceilingMat);
  ceiling.position.set((FX0 + FX1) / 2, H + 0.03, (FZ0 + FZ1) / 2);
  ceiling.castShadow = true;
  scene.add(ceiling);
  disposables.push(ceiling.geometry);

  // ── Pencil lines (merged), each stroke run a little past the corner, the way drafters draw ──
  let lineMesh: LineSegments;
  {
    let count = 0;
    for (const { geo } of lineGeos) count += geo.getAttribute("position").count;
    const pos = new Float32Array(count * 3);
    const keep = new Float32Array(count);
    let o = 0;
    const a = new Vector3(), b = new Vector3(), d = new Vector3();
    for (const { geo, keep: k } of lineGeos) {
      const p = geo.getAttribute("position");
      for (let i = 0; i < p.count; i += 2) {
        a.fromBufferAttribute(p, i);
        b.fromBufferAttribute(p, i + 1);
        const len = a.distanceTo(b);
        const over = k ? 0 : Math.min(0.045, len * 0.12);
        d.subVectors(b, a).normalize().multiplyScalar(over);
        a.sub(d);
        b.add(d);
        pos.set([a.x, a.y, a.z, b.x, b.y, b.z], o * 3);
        keep[o] = keep[o + 1] = k;
        o += 2;
      }
      geo.dispose();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aKeep", new BufferAttribute(keep, 1));
    const lm = lineMaterial();
    lineMesh = new LineSegments(g, lm);
    lineMesh.renderOrder = 2;
    scene.add(lineMesh);
    disposables.push(g, lm);
  }

  // The section line travels from behind the window to the front-right corner
  const dir = U.uDir.value;
  const corners = [
    [FX0 - T - 0.6, FZ0 - T - 0.6],
    [FX1 + 0.7, FZ1 + 0.7],
    [FX0 - T - 0.6, FZ1 + 0.7],
    [FX1 + 0.7, FZ0 - T - 0.6],
  ].map(([x, z]) => x * dir.x + z * dir.y);
  const BUILD0 = Math.min(...corners) - 0.05;
  const BUILD1 = Math.max(...corners) + U.uSoft.value + 0.05;

  // ── State ──
  const view = { ...START, ...opts.view };
  const endView = { ...END, ...opts.view };
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollP = 0;
  let scrollCur = 0;
  let build = still === "built" ? 1 : typeof still === "number" ? still : 0;
  let drift = still === "built" ? 1 : 0;
  let visible = true;
  let raf = 0;
  let introStart = -1;
  let disposed = false;
  let readyCb: (() => void) | null = null;
  let ready = false;

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const BUILD_MS = 3400;
  const DRIFT_MS = 9000;

  const setBuild = (b: number) => {
    U.uBuild.value = MathUtils.lerp(BUILD0, BUILD1, b);
    U.uEdge.value = b > 0 && b < 1 ? 1 : 0;
    // the pendants come on as they're built
    for (const pl of glows) pl.intensity = 2.4 * MathUtils.smoothstep(b, 0.55, 0.85);
  };

  const place = () => {
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;
    const a = w / h;
    camera.aspect = a;
    // like object-fit: cover around the still's aspect, so the live frame lines up with the picture
    const t0 = Math.tan(MathUtils.degToRad(FOV / 2));
    camera.fov = MathUtils.radToDeg(2 * Math.atan(a >= aspect0 ? (t0 * aspect0) / a : t0));
    camera.updateProjectionMatrix();
  };

  const pose = () => {
    const d = easeOut(drift);
    const s = scrollCur;
    const az = MathUtils.lerp(view.az, endView.az, d) + ptr.x * 5 - s * 6;
    const el = MathUtils.lerp(view.el, endView.el, d) - ptr.y * 2.6 - s * 5;
    const dist = MathUtils.lerp(view.dist, endView.dist, d) * (1 - s * 0.3);
    const tx = MathUtils.lerp(view.tx, endView.tx, d) + s * 0.35;
    const ty = MathUtils.lerp(view.ty, endView.ty, d) + s * 0.1;
    const tz = MathUtils.lerp(view.tz, endView.tz, d) + s * 0.3;
    const azr = MathUtils.degToRad(az), elr = MathUtils.degToRad(el);
    camera.position.set(tx + dist * Math.cos(elr) * Math.sin(azr), ty + dist * Math.sin(elr), tz + dist * Math.cos(elr) * Math.cos(azr));
    camera.lookAt(tx, ty, tz);
  };

  const render = () => {
    setBuild(build);
    pose();
    renderer.render(scene, camera);
  };

  const tick = (now: number) => {
    raf = 0;
    if (disposed) return;
    let moving = false;
    if (introStart >= 0) {
      const t = now - introStart;
      build = Math.min(1, t / BUILD_MS);
      build = ease(build);
      drift = Math.min(1, t / DRIFT_MS);
      if (t < DRIFT_MS) moving = true;
      else introStart = -1;
    }
    const k = 0.06;
    ptr.x += (ptr.tx - ptr.x) * k;
    ptr.y += (ptr.ty - ptr.y) * k;
    scrollCur += (scrollP - scrollCur) * 0.12;
    if (Math.abs(ptr.tx - ptr.x) > 0.0005 || Math.abs(ptr.ty - ptr.y) > 0.0005 || Math.abs(scrollP - scrollCur) > 0.0005) moving = true;
    render();
    if (moving) kick();
  };
  const kick = () => {
    if (!raf && visible && !disposed && !still) raf = requestAnimationFrame(tick);
  };

  renderer.setSize(canvas.clientWidth || canvas.width, canvas.clientHeight || canvas.height, false);
  place();
  if (still) {
    await renderer.compileAsync(scene, camera);
    render();
  } else {
    await renderer.compileAsync(scene, camera);
    render();
    // two frames so the first composited one is the finished picture
    requestAnimationFrame(() => {
      render();
      requestAnimationFrame(() => {
        ready = true;
        readyCb?.();
      });
    });
  }

  return {
    onReady(cb) {
      if (ready) cb();
      else readyCb = cb;
    },
    intro() {
      if (introStart >= 0 || build >= 1) return;
      introStart = performance.now();
      kick();
    },
    built() {
      introStart = -1;
      build = 1;
      drift = 1;
      kick();
      render();
    },
    pointer(x, y) {
      ptr.tx = MathUtils.clamp(x, -1, 1);
      ptr.ty = MathUtils.clamp(y, -1, 1);
      kick();
    },
    scroll(p) {
      scrollP = MathUtils.clamp(p, 0, 1);
      kick();
    },
    setVisible(v) {
      visible = v;
      if (v) kick();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        // the intro keeps its clock: if it's scrolled away mid-build, it shows the right moment on return
      }
    },
    resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      place();
      render();
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
