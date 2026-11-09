/**
 * The 3D's scout, off the main thread (fx/gate3d.ts). It opens the page's first WebGL context, which
 * costs about 100 ms of setting up the GPU connection wherever it happens, and reports which graphics
 * chip it got. Then it compiles the environment-light shaders both scenes start with (three's PMREM
 * filter, about 300 ms of compiling on Windows) in a throwaway renderer: the browser keeps compiled
 * programs, so the scenes' own contexts take them from its cache instead of freezing the page.
 *
 * Messages back: { gpu } with the renderer's name, false (only a software or blocklisted context),
 * or null (no WebGL in workers here: the page checks for itself); then { done }.
 */
import { PMREMGenerator, WebGLRenderer } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

self.onmessage = (e: MessageEvent<WebGLContextAttributes>) => {
  let gl: WebGL2RenderingContext | null = null;
  let canvas: OffscreenCanvas | undefined;
  try {
    canvas = new OffscreenCanvas(16, 16);
    gl = canvas.getContext("webgl2", e.data);
    if (!gl) {
      const plain = new OffscreenCanvas(16, 16).getContext("webgl2");
      self.postMessage({ gpu: plain ? false : null });
    } else {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      self.postMessage({ gpu: String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) });
    }
  } catch {
    self.postMessage({ gpu: null });
  }
  if (gl && canvas) {
    try {
      const renderer = new WebGLRenderer({ canvas, context: gl });
      const pmrem = new PMREMGenerator(renderer);
      pmrem.fromScene(new RoomEnvironment(), 0.04).dispose();
      gl.finish();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    } catch {
      // the scenes compile them themselves, a little less smoothly
    }
  }
  self.postMessage({ done: true });
};
