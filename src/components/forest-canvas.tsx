"use client";

import { useEffect, useRef } from "react";

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

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Slow drift through the noise field.
  float t = u_time * 0.03;
  float n = fbm(p * 1.6 + vec2(t, -t * 0.6));

  // The brand's radial gradient, its centre gently displaced by the noise.
  vec2 centre = vec2(0.2 * aspect, 0.75) + (n - 0.5) * 0.22;
  float d = distance(p, centre) / (0.75 * max(aspect, 1.0));
  d = clamp(d, 0.0, 1.0);

  vec3 col = mix(HIGH, MID, smoothstep(0.0, 0.45, d));
  col = mix(col, FOREST, smoothstep(0.35, 0.95, d));

  // Noise breathes a little sage into the mid band.
  col += SAGE * (n - 0.5) * 0.05 * (1.0 - d);

  // Soft pointer light, very restrained.
  vec2 m = vec2(u_pointer.x * aspect, u_pointer.y);
  float glow = exp(-distance(p, m) * 3.2);
  col += SAGE * glow * 0.055;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
    const target = { x: 0.25, y: 0.7 };
    const eased = { x: 0.25, y: 0.7 };
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.height === 0) return;
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = false;
    let last = 0;
    const start = performance.now();

    // The drift is slow; 30fps is indistinguishable and halves the cost.
    const frame = (now: number) => {
      raf = 0;
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return;
      last = now;
      resize();
      eased.x += (target.x - eased.x) * 0.09;
      eased.y += (target.y - eased.y) * 0.09;
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uPointer, eased.x, eased.y);
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
    resize();
    gl.uniform2f(uRes, width, height);
    gl.uniform1f(uTime, 12.0);
    gl.uniform2f(uPointer, eased.x, eased.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

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

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
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
