/**
 * What every live three.js scene on this site goes through, so none of them ever stutters, even on a
 * weak laptop. Imports no three.js: it decides whether three.js is fetched at all.
 *
 * - Only a big screen with a mouse, no reduced motion, no Save-Data (`canRun3D`).
 * - After load, while the browser is idle, a quick look at the machine (`machineOk`): a processor
 *   that isn't crawling (or three.js is never downloaded), then a real graphics chip (no software
 *   WebGL, no "major performance caveat"), asked of a worker that also pre-compiles the shaders
 *   every scene starts with (gpu.worker.ts). Either missing keeps the stills.
 * - Scenes warm up one after another (`warmUp`), in small steps that hand the main thread back
 *   (`breathe`), so the page keeps scrolling and animating while they load and compile.
 * - The first 2 seconds of each scene's frames are watched (`watchFrames`): under about 45 fps, or
 *   any frame over 100 ms, and the scene fades back to its still. That's remembered for the visit
 *   (sessionStorage), and every other scene drops back to its still too (`demote`, `onDemote`).
 */

export const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
/** Sharp enough on a retina laptop, without paying for 2x or 3x the pixels. */
export const MAX_DPR = 1.5;
/** Asked of every live renderer: the fast GPU, and no software rendering. */
export const GL_ATTRS: WebGLContextAttributes = { powerPreference: "high-performance", failIfMajorPerformanceCaveat: true };

const KEY = "as-3d";
const MIN_FPS = 45;
const WATCH_MS = 2000;
const MAX_FRAME_MS = 100;

type Conn = { saveData?: boolean };

const stored = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/** This visit stays on the stills (a scene was too slow, or the machine was checked and found weak). */
export const isDemoted = () => stored() === "still";

/** Desktop with a mouse, motion allowed, no Save-Data, and not already sent back to the stills. */
export function canRun3D() {
  if (typeof window === "undefined" || !window.matchMedia(DESK_3D).matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if ((navigator as Navigator & { connection?: Conn }).connection?.saveData) return false;
  return !isDemoted();
}

const listeners = new Set<() => void>();

/** Back to the stills for the rest of the visit, every scene at once. */
export function demote(why: string) {
  if (isDemoted()) return;
  try {
    sessionStorage.setItem(KEY, "still");
  } catch {}
  performance.mark(`3d:still:${why}`);
  listeners.forEach((f) => f());
}

export function onDemote(cb: () => void) {
  listeners.add(cb);
  return () => void listeners.delete(cb);
}

const ric = (cb: () => void, timeout: number) =>
  window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout }) : window.setTimeout(cb, 16);

/** Hands the main thread back between steps of a warm-up: the next step runs when the browser is idle. */
export const breathe = () => new Promise<void>((r) => ric(r, 250));

let loaded: Promise<void> | null = null;
/** After the load event, once the browser is idle: the first paint never waits for the 3D. */
export function afterLoad() {
  return (loaded ??= new Promise<void>((resolve) => {
    const go = () => window.setTimeout(() => ric(resolve, 1200), 50);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  }));
}

/**
 * The same small piece of arithmetic, timed: about 2.5 ms on a current desktop (Ryzen 9000), 3-5 ms
 * on a decent laptop, 10 ms with DevTools' 4x CPU slowdown. Best of five, so a stray task can't
 * fail it.
 */
function cpuMs() {
  let best = Infinity;
  let x = 0;
  for (let k = 0; k < 5; k++) {
    const t = performance.now();
    for (let i = 1; i < 60_000; i++) x = (x + Math.sqrt(i) * Math.sin(i)) % 1e6;
    best = Math.min(best, performance.now() - t);
  }
  if (x === -1) console.log(x); // keeps the loop from being optimised away
  return best;
}
const CPU_LIMIT_MS = 5;

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/** A software or blocklisted GPU, judged by a throwaway context here: when the worker can't tell. */
function gpuOk() {
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl2", GL_ATTRS);
  if (!gl) return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return !SOFTWARE.test(name);
}

type Scout = { gpu: Promise<string | false | null>; warm: Promise<void> };
let scout: Scout | null = null;
/** The worker (gpu.worker.ts): its GPU verdict, then the environment-light shaders. Never more than 5 s. */
function startScout(): Scout {
  if (scout) return scout;
  let gpuDone!: (v: string | false | null) => void;
  let warmDone!: () => void;
  const gpu = new Promise<string | false | null>((r) => (gpuDone = r));
  const warm = new Promise<void>((r) => (warmDone = r));
  let w: Worker | undefined;
  const end = () => {
    window.clearTimeout(t);
    w?.terminate();
    gpuDone(null);
    warmDone();
  };
  const t = window.setTimeout(end, 5000);
  try {
    w = new Worker(new URL("./gpu.worker.ts", import.meta.url), { type: "module" });
    w.onmessage = (e: MessageEvent<{ gpu?: string | false | null; done?: true }>) => {
      if ("gpu" in e.data) gpuDone(e.data.gpu ?? null);
      if (e.data.done) end();
    };
    w.onerror = end;
    w.postMessage(GL_ATTRS);
  } catch {
    end();
  }
  return (scout = { gpu, warm });
}

/** Resolves once the environment-light shaders are in the browser's cache (or the worker gave up). */
export const warmShaders = () => startScout().warm;

let machine: Promise<boolean> | null = null;
/**
 * Once per page: a processor that keeps up, then a proper graphics chip (asked of the worker, so the
 * GPU connection is set up off the main thread). Failing either keeps the stills for the visit, and
 * a slow processor never even downloads three.js.
 */
export function machineOk() {
  return (machine ??= (async () => {
    const ms = cpuMs();
    performance.mark(`3d:cpu:${ms.toFixed(1)}ms`);
    let ok = ms < CPU_LIMIT_MS;
    if (ok) {
      const gpu = await startScout().gpu;
      ok = gpu === null ? gpuOk() : gpu !== false && !SOFTWARE.test(gpu);
    }
    if (!ok) demote("machine");
    return ok;
  })());
}

let queue: Promise<unknown> = Promise.resolve();
let busy = 0;
/** Scenes warm up one at a time, in page order, so two never compete for the main thread. */
export function warmUp<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    busy++;
    try {
      return await job();
    } finally {
      busy--;
    }
  });
  queue = run.catch(() => {});
  return run;
}
/** Resolves once every warm-up asked for so far has finished. */
export const warmedUp = () => queue.then(() => {});

/**
 * Watches a scene's first 2 seconds of frames (only frames drawn back to back, and none while a
 * scene is warming up). Returns the function the scene's loop calls with each frame's length.
 */
export function watchFrames(name: string, onSlow: () => void) {
  let skip = 3; // the first frames after the fade-in settle the GPU
  let sum = 0;
  let n = 0;
  let done = false;
  const fail = (why: string) => {
    done = true;
    performance.mark(`3d:${name}:slow:${why}`);
    onSlow();
  };
  return (dt: number) => {
    if (done || busy) return;
    if (skip > 0) return void skip--;
    if (dt > MAX_FRAME_MS) return fail(`frame ${Math.round(dt)}ms`);
    sum += dt;
    n++;
    if (sum < WATCH_MS) return;
    done = true;
    const fps = (n * 1000) / sum;
    if (fps < MIN_FPS) fail(`${fps.toFixed(0)}fps`);
    else performance.mark(`3d:${name}:ok:${fps.toFixed(0)}fps`);
  };
}
