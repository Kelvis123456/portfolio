"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_bg;
uniform float u_isDark;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.02;

  vec2 c1 = vec2(sin(t * 0.8) * 0.55, cos(t * 0.6) * 0.45);
  vec2 c2 = vec2(cos(t * 0.5) * 0.65, sin(t * 0.9) * 0.5);
  vec2 c3 = vec2(sin(t * 0.3 + 2.0) * 0.45, cos(t * 0.4 + 1.0) * 0.6);

  float d1 = length(p - c1);
  float d2 = length(p - c2);
  float d3 = length(p - c3);

  float g1 = smoothstep(1.0, 0.0, d1);
  float g2 = smoothstep(0.9, 0.0, d2);
  float g3 = smoothstep(0.95, 0.0, d3);

  vec3 color = u_bg;
  if (u_isDark > 0.5) {
    color += u_colorA * g1 * 0.32;
    color += u_colorB * g2 * 0.2;
    color += u_colorA * g3 * 0.14;
  } else {
    color = mix(color, u_colorA, g1 * 0.32);
    color = mix(color, u_colorB, g2 * 0.2);
    color = mix(color, u_colorA, g3 * 0.14);
  }

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r || 0, g || 0, b || 0];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const RENDER_SCALE = 0.6;

export function GradientCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const colorALoc = gl.getUniformLocation(program, "u_colorA");
    const colorBLoc = gl.getUniformLocation(program, "u_colorB");
    const bgLoc = gl.getUniformLocation(program, "u_bg");
    const isDarkLoc = gl.getUniformLocation(program, "u_isDark");

    function readColors() {
      const styles = getComputedStyle(document.documentElement);
      const accent = hexToRgb01(styles.getPropertyValue("--accent") || "#ff5a1f");
      const accent2 = hexToRgb01(styles.getPropertyValue("--accent-2") || "#1f8a5f");
      const bg = hexToRgb01(styles.getPropertyValue("--background") || "#faf8f5");
      const isDark = document.documentElement.classList.contains("dark");
      gl!.uniform3f(colorALoc, accent[0], accent[1], accent[2]);
      gl!.uniform3f(colorBLoc, accent2[0], accent2[1], accent2[2]);
      gl!.uniform3f(bgLoc, bg[0], bg[1], bg[2]);
      gl!.uniform1f(isDarkLoc, isDark ? 1 : 0);
    }

    let width = 0;
    let height = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    function resize() {
      if (!parent || !canvas || !gl) return;
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width * RENDER_SCALE));
      height = Math.max(1, Math.round(rect.height * RENDER_SCALE));
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLoc, width, height);
    }

    function scheduleResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    }

    let frameId = 0;
    const start = performance.now();

    function draw(time: number) {
      if (!gl) return;
      gl.uniform1f(timeLoc, (time - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop(time: number) {
      draw(time);
      frameId = requestAnimationFrame(loop);
    }

    readColors();
    resize();
    window.addEventListener("resize", scheduleResize);

    if (shouldReduceMotion) {
      draw(start);
    } else {
      frameId = requestAnimationFrame(loop);
    }

    const themeObserver = new MutationObserver(() => {
      readColors();
      if (shouldReduceMotion) draw(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("resize", scheduleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      themeObserver.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [shouldReduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className={className ?? "absolute inset-0 h-full w-full"} />;
}
