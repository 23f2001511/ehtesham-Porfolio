"use client";

import { useEffect, useRef, useState } from "react";

export default function SunLoader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"active" | "fading" | "done">("active");

  // Phase timing
  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setPhase("fading"), 2400);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3100);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Canvas sun animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let disposed = false;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    }

    function drawSun(time: number) {
      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = Math.min(w, h) * 0.08;

      ctx.clearRect(0, 0, w, h);

      // Outer glow layers
      for (let i = 4; i >= 0; i--) {
        const glowRadius = baseRadius * (2.5 + i * 0.8) + Math.sin(time * 3 + i) * 8;
        const alpha = 0.04 - i * 0.006;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        grad.addColorStop(0, `rgba(255, 160, 20, ${alpha + 0.02})`);
        grad.addColorStop(0.4, `rgba(255, 100, 0, ${alpha})`);
        grad.addColorStop(1, "rgba(255, 60, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Corona rays (rotating fast)
      const rayCount = 16;
      const rotation = time * 2.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const innerR = baseRadius * 1.1;
        const outerR = baseRadius * (2.0 + Math.sin(time * 4 + i * 1.2) * 0.5);
        const spread = 0.06 + Math.sin(time * 3 + i) * 0.02;

        ctx.beginPath();
        ctx.moveTo(
          Math.cos(angle - spread) * innerR,
          Math.sin(angle - spread) * innerR
        );
        ctx.lineTo(
          Math.cos(angle) * outerR,
          Math.sin(angle) * outerR
        );
        ctx.lineTo(
          Math.cos(angle + spread) * innerR,
          Math.sin(angle + spread) * innerR
        );
        ctx.closePath();

        const rayAlpha = 0.15 + Math.sin(time * 5 + i * 0.8) * 0.08;
        ctx.fillStyle = `rgba(255, 180, 40, ${rayAlpha})`;
        ctx.fill();
      }
      ctx.restore();

      // Core sun body
      const pulse = 1 + Math.sin(time * 4) * 0.04;
      const sunR = baseRadius * pulse;
      const bodyGrad = ctx.createRadialGradient(
        cx - sunR * 0.2, cy - sunR * 0.2, sunR * 0.1,
        cx, cy, sunR
      );
      bodyGrad.addColorStop(0, "#fffbe6");
      bodyGrad.addColorStop(0.3, "#ffd54f");
      bodyGrad.addColorStop(0.6, "#ff9800");
      bodyGrad.addColorStop(0.85, "#f44336");
      bodyGrad.addColorStop(1, "#b71c1c");

      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Surface turbulence spots
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.3);
      for (let i = 0; i < 5; i++) {
        const spotAngle = (i / 5) * Math.PI * 2 + time * 0.5;
        const spotDist = sunR * 0.45;
        const spotR = sunR * (0.12 + Math.sin(time * 2 + i) * 0.04);
        const sx = Math.cos(spotAngle) * spotDist;
        const sy = Math.sin(spotAngle) * spotDist;

        ctx.beginPath();
        ctx.arc(sx, sy, spotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 90, 0, ${0.3 + Math.sin(time * 3 + i) * 0.15})`;
        ctx.fill();
      }
      ctx.restore();

      // White-hot center
      const centerGrad = ctx.createRadialGradient(
        cx - sunR * 0.15, cy - sunR * 0.15, 0,
        cx, cy, sunR * 0.5
      );
      centerGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
      centerGrad.addColorStop(0.5, "rgba(255, 255, 220, 0.15)");
      centerGrad.addColorStop(1, "rgba(255, 200, 100, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = centerGrad;
      ctx.fill();

      // Orbiting ember particles
      for (let i = 0; i < 12; i++) {
        const orbitAngle = time * (1.5 + i * 0.15) + (i / 12) * Math.PI * 2;
        const orbitR = baseRadius * (1.3 + i * 0.12) + Math.sin(time * 2 + i) * 6;
        const px = cx + Math.cos(orbitAngle) * orbitR;
        const py = cy + Math.sin(orbitAngle) * orbitR;
        const dotSize = 1 + Math.sin(time * 4 + i) * 0.8;

        ctx.beginPath();
        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${180 + i * 5}, 50, ${0.5 + Math.sin(time * 3 + i) * 0.3})`;
        ctx.fill();
      }
    }

    resize();
    const startTime = performance.now();

    function loop() {
      if (disposed) return;
      const elapsed = (performance.now() - startTime) / 1000;
      drawSun(elapsed);
      animId = requestAnimationFrame(loop);
    }

    loop();
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-opacity duration-700 ${
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ background: "radial-gradient(ellipse at center, #0a0a1a 0%, #020208 60%, #000000 100%)" }}
      aria-label="Loading portfolio"
      role="status"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        aria-hidden="true"
      />

      {/* Loading text at bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/60 sun-loader-text-pulse">
          Loading Universe
        </p>
        <div className="mt-3 h-[2px] w-40 mx-auto overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-[sun-progress_2.4s_ease-out_forwards] rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
        </div>
      </div>
    </div>
  );
}
