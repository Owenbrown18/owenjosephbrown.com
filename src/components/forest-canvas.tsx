"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The brand's forest gradient, rendered live: a slow noise field drifting
 * through the radial gradient, with a soft light that follows the pointer.
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
uniform float u_time;
uniform vec2 u_pointer; // 0..1, y up
uniform float u_scroll; // 0..1 page progress
uniform float u_dpr;    // device pixels per CSS pixel
uniform float u_tunnel; // 1 on the landing page, 0 elsewhere
// Viewport-space y (0 bottom .. 1 top) of each section break currently on
// screen. -1 means "not visible", so it contributes nothing.
uniform float u_seams[4];

const vec3 FOREST = vec3(0.043, 0.122, 0.114); // #0b1f1d
const vec3 MID    = vec3(0.118, 0.227, 0.216); // #1e3a37
const vec3 HIGH   = vec3(0.180, 0.329, 0.314); // #2e5450
const vec3 SAGE   = vec3(0.482, 0.643, 0.620); // #7ba49e

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  v += 0.6 * noise(p);
  v += 0.3 * noise(p * 2.1 + 13.7);
  v += 0.1 * noise(p * 4.3 + 41.3);
  return v;
}

// Anti-aliased grid lines, measured in PIXELS so weight is identical at
// any aspect or DPR. Deliberately derivative-free: because the input is
// already gl_FragCoord, the distance to the nearest line is exact, so
// this needs no OES_standard_derivatives extension (fwidth is not core in
// WebGL 1 and would silently fail to compile on some devices).
// Thickness is the feather width in device pixels.
float gridLines(vec2 px, float cell, float thickness) {
  // Distance to the nearest line on each axis, in device pixels.
  vec2 f = abs(fract(px / cell - 0.5) - 0.5) * cell;
  vec2 m = 1.0 - smoothstep(0.0, thickness, f);
  // Union the axes premultiplied rather than with min(): min() sums both
  // lines at every crossing, so intersections bloom into visible blobs.
  return mix(m.x, 1.0, m.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Drift through the noise field — visible, not subliminal.
  float t = u_time * 0.055;
  float n = fbm(p * 1.6 + vec2(t, -t * 0.6));

  // The brand's radial gradient, its centre displaced by the noise.
  vec2 centre = vec2(0.2 * aspect, 0.75) + (n - 0.5) * 0.3;
  float d = distance(p, centre) / (0.75 * max(aspect, 1.0));
  d = clamp(d, 0.0, 1.0);

  vec3 col = mix(HIGH, MID, smoothstep(0.0, 0.45, d));
  col = mix(col, FOREST, smoothstep(0.35, 0.95, d));

  // Noise breathes sage into the mid band.
  col += SAGE * (n - 0.5) * 0.08 * (1.0 - d);

  // Two slow orbiting glows: one warm (golden-hour), one sage. The
  // moving elements that keep the field alive.
  float t2 = u_time * 0.12;
  vec2 orb1 = vec2(0.8 * aspect, 0.68)
    + vec2(sin(t2 * 0.7), cos(t2 * 0.45)) * 0.14;
  float g1 = exp(-distance(p, orb1) * 4.5);
  // Warm light, kept to a whisper: at full strength it read as a yellow
  // blob sitting on the page rather than depth in the field.
  col += vec3(0.52, 0.42, 0.30) * g1 * 0.05;

  vec2 orb2 = vec2(0.3 * aspect, 0.3)
    + vec2(cos(t2 * 0.5 + 2.0), sin(t2 * 0.65 + 1.0)) * 0.18;
  float g2 = exp(-distance(p, orb2) * 5.0);
  col += SAGE * g2 * 0.14;

  // Soft pointer light.
  vec2 m = vec2(u_pointer.x * aspect, u_pointer.y);
  float glow = exp(-distance(p, m) * 3.2);
  col += SAGE * glow * 0.07;

  // Pinned to the viewport, never drifting: any scroll-linked offset has
  // to be pixel-snapped to avoid shimmer, and that snapping is what made
  // it step visibly.
  // The cell does breathe, but only just — 24 to 22px across the work,
  // and only on the landing page (u_tunnel). The old 26-to-17 range was
  // wide enough to read as the whole field zooming.
  float inWork = smoothstep(0.18, 0.40, u_scroll)
               * (1.0 - smoothstep(0.58, 0.80, u_scroll));
  float cell = mix(24.0, 22.0, inWork * u_tunnel);

  vec2 gpx = gl_FragCoord.xy;
  float minor = gridLines(gpx, cell * u_dpr, 0.75 * u_dpr);
  float major = gridLines(gpx, cell * 5.0 * u_dpr, 1.1 * u_dpr);

  // Full-bleed: the grid carries all the way to the edges. Only the
  // faintest falloff into the far corners so it doesn't read as a decal,
  // but never enough to look cut off.
  float mask = 1.0 - 0.15 * d;
  float spot = exp(-distance(p, m) * 2.4);
  // Only the landing page has a tunnel to be calmer inside. On a project
  // page this would just read as the grid dimming for no reason, so it is
  // switched off entirely there.
  float quiet = 1.0 - u_tunnel * 0.45
                    * smoothstep(0.34, 0.5, u_scroll)
                    * smoothstep(0.72, 0.56, u_scroll);

  col += SAGE * minor * (0.030 + 0.075 * spot) * mask * quiet;
  col += SAGE * major * (0.050 + 0.110 * spot) * mask * quiet;

  // Horizon seams: a soft band of light lying along each section break,
  // so the boundary is felt in the field itself and not just drawn on top
  // of it. Constant loop bound — WebGL 1 requires it.
  float seam = 0.0;
  for (int i = 0; i < 4; i++) {
    float sy = u_seams[i];
    if (sy > -0.5) {
      seam += exp(-abs(uv.y - sy) * 60.0);
    }
  }
  col += SAGE * seam * 0.06;

  // Dither to kill banding on the dark ramp.
  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

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
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    const uDpr = gl.getUniformLocation(program, "u_dpr");
    const uSeams = gl.getUniformLocation(program, "u_seams[0]");
    const uTunnel = gl.getUniformLocation(program, "u_tunnel");
    // The page-grade layer only exists on the landing page, so it is
    // the honest marker for "this page has a tunnel".
    let tunnel = document.querySelector(".page-grade") ? 1 : 0;

    // Section breaks feed the horizon seams. Their document positions are
    // measured once (and on resize) rather than every frame, so the loop
    // never forces a layout.
    let seamTops: number[] = [];
    const measureSeams = () => {
      seamTops = Array.from(document.querySelectorAll(".section-rule"))
        .slice(0, 4)
        .map((el) => el.getBoundingClientRect().top + window.scrollY);
    };
    const seams = new Float32Array(4).fill(-1);
    const updateSeams = () => {
      const vh = window.innerHeight;
      for (let i = 0; i < 4; i++) {
        const top = seamTops[i];
        if (top === undefined) {
          seams[i] = -1;
          continue;
        }
        const screenY = top - window.scrollY;
        // shader y runs bottom-up; -1 parks it offscreen
        seams[i] =
          screenY > -40 && screenY < vh + 40 ? 1 - screenY / vh : -1;
      }
    };

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

    // Pointer easing: the shader gets a smoothed position, never raw events.
    // The canvas is fixed to the viewport, so viewport size IS its rect —
    // measuring it per event would force a synchronous layout on every
    // pointer move for a number we already know.
    const target = { x: 0.25, y: 0.7 };
    const eased = { x: 0.25, y: 0.7 };
    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = false;
    const start = performance.now();

    let easedScroll = 0;
    const scrollProgress = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? window.scrollY / max : 0;
    };

    // Native frame rate: everything moving is a smooth gradient, and a
    // half-rate gate showed up as stepping on the slow drifts.
    const frame = () => {
      raf = 0;
      if (!running) return;
      raf = requestAnimationFrame(frame);
      resize();
      eased.x += (target.x - eased.x) * 0.05;
      eased.y += (target.y - eased.y) * 0.05;
      easedScroll += (scrollProgress() - easedScroll) * 0.07;
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uPointer, eased.x, eased.y);
      gl.uniform1f(uScroll, easedScroll);
      gl.uniform1f(uDpr, dpr);
      updateSeams();
      gl.uniform1fv(uSeams, seams);
      gl.uniform1f(uTunnel, tunnel);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const setRunning = (next: boolean) => {
      if (reducedMotion) return; // static frame only
      if (next && !running) {
        running = true;
        if (!raf) raf = requestAnimationFrame(frame);
      } else if (!next) {
        running = false;
      }
    };

    // One static frame so the canvas is never blank (also the
    // reduced-motion end state).
    const drawStaticFrame = () => {
      resize();
      updateSeams();
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, 12.0);
      gl.uniform2f(uPointer, eased.x, eased.y);
      gl.uniform1f(uScroll, scrollProgress());
      gl.uniform1f(uDpr, dpr);
      gl.uniform1fv(uSeams, seams);
      gl.uniform1f(uTunnel, tunnel);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    measureSeams();
    drawStaticFrame();

    // Called on every route change: the new page has its own breaks, and
    // may not be the landing page at all.
    resyncRef.current = () => {
      tunnel = document.querySelector(".page-grade") ? 1 : 0;
      easedScroll = scrollProgress();
      measureSeams();
      updateSeams();
      if (!running) drawStaticFrame();
    };

    const onResize = () => measureSeams();
    window.addEventListener("resize", onResize, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) setRunning(false);
      else setRunning(true);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Honour the preference if it changes mid-session, rather than only at
    // mount. Turning it on freezes the field on its current frame; turning
    // it off starts the loop again.
    const onMotionPref = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (reducedMotion) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        setRunning(!document.hidden);
      }
    };
    motionQuery.addEventListener("change", onMotionPref);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionPref);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      running = false;
      if (raf) cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(quad);
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
