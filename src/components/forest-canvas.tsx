"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The brand's forest gradient, rendered live: a slow noise field drifting
 * through the radial gradient, with a soft light that follows the pointer.
 *
 * The horizon seams that used to be drawn here from scrollY moved into
 * SectionRule as DOM glows: a fixed canvas chasing main-thread scrollY
 * always lags composited scrolling, which read as chop on mobile.
 *
 * Rules it obeys:
 * - prefers-reduced-motion: renders a single static frame, no loop.
 * - No WebGL: the .forest-ground CSS gradient underneath simply shows.
 * - Offscreen or hidden tab: the loop pauses.
 * - DPR is clamped to 1.5 to keep fill-rate cheap on mobile.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform vec2 u_pointer; // 0..1, y up
uniform float u_dpr;    // device pixels per CSS pixel
uniform float u_fade;   // 0..1 entrance: the field draws itself in

// Paper, and the green the grid is drawn in.
const vec3 PAPER  = vec3(0.957, 0.953, 0.937); // #f4f3ef
const vec3 FOREST = vec3(0.180, 0.329, 0.314); // #2e5450

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Anti-aliased grid lines, measured in PIXELS so weight is identical at
// any aspect or DPR. Deliberately derivative-free: because the input is
// already a pixel coordinate, the distance to the nearest line is exact,
// so this needs no OES_standard_derivatives extension (fwidth is not core
// in WebGL 1 and would silently fail to compile on some devices).
float gridLines(vec2 px, float cell, float thickness) {
  vec2 f = abs(fract(px / cell - 0.5) - 0.5) * cell;
  vec2 m = 1.0 - smoothstep(0.0, thickness, f);
  // Union the axes premultiplied rather than with min(): min() sums both
  // lines at every crossing, so intersections bloom into visible blobs.
  return mix(m.x, 1.0, m.y);
}

// One static composition, fixed to the viewport. Three soft masses decide
// where the grid shows; gaussians have no edge at all, so every line
// fades out along its own length instead of stopping at a patch border.
// This replaced two earlier versions Owen rejected: a full-viewport grid
// (too much everywhere) and scattered document-space rectangles (read as
// hard-cut boxes).
float field(vec2 uv, float aspect) {
  vec2 p = vec2(uv.x * aspect, uv.y);
  float f = 0.0;
  // Upper-left, behind the hero name and each section heading.
  f += 0.90 * exp(-pow(distance(p, vec2(0.26 * aspect, 0.74)), 2.0) / 0.14);
  // Top-right shoulder.
  f += 0.70 * exp(-pow(distance(p, vec2(0.92 * aspect, 0.95)), 2.0) / 0.09);
  // Low centre-right, broad and faint.
  f += 0.55 * exp(-pow(distance(p, vec2(0.68 * aspect, 0.10)), 2.0) / 0.22);
  return clamp(f, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;

  vec3 col = PAPER;

  float w = field(uv, aspect) * u_fade;
  // A touch of gamma keeps the tails long and the centres honest.
  w = pow(w, 1.3);

  if (w > 0.003) {
    float cellPx = 24.0 * u_dpr;
    float minor = gridLines(gl_FragCoord.xy, cellPx, 0.75 * u_dpr);
    float major = gridLines(gl_FragCoord.xy, cellPx * 5.0, 1.1 * u_dpr);

    // The pointer warms the grid it is near. The only thing that moves.
    vec2 m = vec2(u_pointer.x * aspect, u_pointer.y);
    float spot = exp(-distance(vec2(uv.x * aspect, uv.y), m) * 2.4);

    vec3 ink = vec3(1.0) - FOREST;
    col -= ink * minor * w * (0.100 + 0.075 * spot);
    col -= ink * major * w * (0.150 + 0.105 * spot);
  }

  // Dither to kill banding on the flat ground.
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ForestCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  // The canvas lives in the layout, so it never remounts on a client-side
  // navigation. Anything page-specific has to be re-read on route change
  // or the new page inherits the old one's settings.
  const resyncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Wait a frame so the incoming page has actually committed before we
    // measure its section breaks.
    const id = requestAnimationFrame(() => resyncRef.current?.());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Everything below — context creation, shader compile, first draw —
    // waits for idle. On a throttled phone this work used to land inside
    // the hydration burst and was the biggest single block of main-thread
    // time on the page; the .forest-ground CSS gradient underneath covers
    // the gap, so deferring costs nothing visually.
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    // Safari shipped requestIdleCallback late; the timeout fallback keeps
    // the same deferral there.
    const ric =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : null;
    const idleId = ric
      ? ric(() => (cleanup = init()), { timeout: 2000 })
      : window.setTimeout(() => (cleanup = init()), 200);

    const init = (): (() => void) | undefined => {
      if (cancelled || !canvas) return;

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      let reducedMotion = motionQuery.matches;

      const gl =
        canvas.getContext("webgl", { antialias: false, alpha: false }) ??
        canvas.getContext("experimental-webgl", {
          antialias: false,
          alpha: false,
        });
      if (!(gl instanceof WebGLRenderingContext)) return;

      // A software rasterizer would burn the main thread on every frame;
      // the CSS gradient underneath is the better experience there.
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        const renderer = String(
          gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? "",
        );
        if (/swiftshader|llvmpipe|software/i.test(renderer)) return;
      }

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const aPos = gl.getAttribLocation(program, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, "u_res");
      const uPointer = gl.getUniformLocation(program, "u_pointer");
      const uDpr = gl.getUniformLocation(program, "u_dpr");
      const uFade = gl.getUniformLocation(program, "u_fade");

      let width = 0;
      let height = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(1, Math.round(rect.width * dpr));
        height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };

      // Pointer easing: the shader gets a smoothed position, never raw
      // events. The canvas is fixed to the viewport, so viewport size IS
      // its rect; measuring it per event would force a synchronous layout
      // for a number we already know.
      const target = { x: 0.25, y: 0.7 };
      const eased = { x: 0.25, y: 0.7 };
      // The field fades in over the first second rather than popping with
      // the first draw. Under reduced motion it snaps.
      let fade = reducedMotion ? 1 : 0;

      let raf = 0;
      // The field is static and fixed to the viewport, so there is no
      // render loop. Frames are requested by the only things that change
      // the image — the pointer easing toward a new position, a resize —
      // and stop as soon as everything has settled.
      const draw = () => {
        raf = 0;
        resize();
        if (reducedMotion) {
          eased.x = target.x;
          eased.y = target.y;
          fade = 1;
        } else {
          eased.x += (target.x - eased.x) * 0.08;
          eased.y += (target.y - eased.y) * 0.08;
          fade += (1 - fade) * 0.055;
          if (fade > 0.999) fade = 1;
        }
        gl.uniform2f(uRes, width, height);
        gl.uniform2f(uPointer, eased.x, eased.y);
        gl.uniform1f(uDpr, dpr);
        gl.uniform1f(uFade, fade);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Keep going only while the pointer is still catching up.
        const settling =
          fade < 1 ||
          Math.abs(target.x - eased.x) > 0.0008 ||
          Math.abs(target.y - eased.y) > 0.0008;
        if (settling) raf = requestAnimationFrame(draw);
      };
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(draw);
      };

      const onPointer = (e: PointerEvent) => {
        target.x = e.clientX / window.innerWidth;
        target.y = 1 - e.clientY / window.innerHeight;
        schedule();
      };
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });

      draw();

      // A route change swaps the page under a canvas that never remounts.
      resyncRef.current = schedule;

      // Honour the preference if it changes mid-session. Nothing here is
      // animated, so this only decides whether the pointer glides or snaps.
      const onMotionPref = (e: MediaQueryListEvent) => {
        reducedMotion = e.matches;
        schedule();
      };
      motionQuery.addEventListener("change", onMotionPref);

      return () => {
        motionQuery.removeEventListener("change", onMotionPref);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", schedule);
        if (raf) cancelAnimationFrame(raf);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(quad);
      };
    };

    return () => {
      cancelled = true;
      if (ric) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
