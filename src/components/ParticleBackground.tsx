"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  shape: "circle" | "triangle" | "square" | "diamond";
  rotation: number;
  rotationSpeed: number;
};

const PARTICLE_COUNT = 45;
const COLORS = [
  "34, 211, 238",  // cyan
  "16, 185, 129",  // emerald
  "251, 191, 36",  // amber
  "148, 163, 184", // slate
];

function createParticle(canvasWidth: number, canvasHeight: number, randomY = false): Particle {
  const shapes: Particle["shape"][] = ["circle", "triangle", "square", "diamond"];

  return {
    x: Math.random() * canvasWidth,
    y: randomY ? Math.random() * canvasHeight : canvasHeight + Math.random() * 50,
    size: 2 + Math.random() * 4,
    speedY: -(0.15 + Math.random() * 0.45), // float upward (anti-gravity)
    speedX: (Math.random() - 0.5) * 0.3,    // gentle lateral drift
    opacity: 0.12 + Math.random() * 0.28,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.015,
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, color: string) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = `rgba(${color}, ${p.opacity})`;

  switch (p.shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "triangle":
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size, p.size);
      ctx.lineTo(-p.size, p.size);
      ctx.closePath();
      ctx.fill();
      break;
    case "square":
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      break;
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size, 0);
      ctx.lineTo(0, p.size);
      ctx.lineTo(-p.size, 0);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx!.scale(dpr, dpr);
    }

    function initParticles() {
      particles = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(w, h, true));
      }
    }

    function animate() {
      if (!ctx || !canvas) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // gentle sine wave for organic feel
        p.x += Math.sin(p.y * 0.008) * 0.15;

        // recycle particles that float off screen
        if (p.y < -20 || p.x < -20 || p.x > w + 20) {
          particles[i] = createParticle(w, h, false);
        }

        const color = COLORS[i % COLORS.length];
        drawParticle(ctx, p, color);
      }

      animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-5 opacity-60"
      aria-hidden="true"
    />
  );
}
