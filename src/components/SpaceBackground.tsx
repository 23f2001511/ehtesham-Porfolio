"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
};

type ShootingStar = {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
};

type Planet = {
  x: number;
  y: number;
  radius: number;
  color: string;
  ringColor: string | null;
  speedX: number;
  speedY: number;
  glowColor: string;
};

const STAR_COUNT = 200;
const PLANET_COUNT = 3;

function createStar(w: number, h: number): Star {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: 0.5 + Math.random() * 2,
    baseOpacity: 0.3 + Math.random() * 0.7,
    twinkleSpeed: 1 + Math.random() * 3,
    twinklePhase: Math.random() * Math.PI * 2,
  };
}

function createShootingStar(w: number, h: number): ShootingStar {
  return {
    x: Math.random() * w * 0.8,
    y: Math.random() * h * 0.5,
    length: 60 + Math.random() * 100,
    speed: 8 + Math.random() * 12,
    angle: 0.3 + Math.random() * 0.4,
    opacity: 0,
    life: 0,
    maxLife: 40 + Math.random() * 30,
  };
}

function createPlanet(w: number, h: number, index: number): Planet {
  const colors = [
    { color: "#3b4c7a", ring: "rgba(120, 140, 200, 0.3)", glow: "rgba(80, 120, 200, 0.15)" },
    { color: "#8b5c3a", ring: null, glow: "rgba(200, 140, 80, 0.12)" },
    { color: "#2d5a4a", ring: "rgba(100, 200, 160, 0.2)", glow: "rgba(80, 200, 140, 0.1)" },
  ];
  const c = colors[index % colors.length];

  return {
    x: w * (0.15 + Math.random() * 0.7),
    y: h * (0.2 + Math.random() * 0.6),
    radius: 8 + Math.random() * 18,
    color: c.color,
    ringColor: c.ring,
    speedX: (Math.random() - 0.5) * 0.12,
    speedY: (Math.random() - 0.5) * 0.08,
    glowColor: c.glow,
  };
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let disposed = false;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let planets: Planet[] = [];
    let shootingStarTimer = 0;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    }

    function init() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      stars = Array.from({ length: STAR_COUNT }, () => createStar(w, h));
      planets = Array.from({ length: PLANET_COUNT }, (_, i) => createPlanet(w, h, i));
      shootingStars = [];
    }

    function drawNebula(time: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Subtle nebula clouds
      const nebulaConfigs = [
        { cx: w * 0.2, cy: h * 0.3, r: w * 0.25, color: "rgba(40, 20, 80, 0.06)" },
        { cx: w * 0.75, cy: h * 0.6, r: w * 0.2, color: "rgba(20, 50, 80, 0.05)" },
        { cx: w * 0.5, cy: h * 0.8, r: w * 0.3, color: "rgba(60, 20, 40, 0.04)" },
      ];

      for (const n of nebulaConfigs) {
        const drift = Math.sin(time * 0.3) * 10;
        const grad = ctx.createRadialGradient(
          n.cx + drift, n.cy, 0,
          n.cx + drift, n.cy, n.r
        );
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
    }

    function drawStars(time: number) {
      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.baseOpacity * (0.5 + twinkle * 0.5);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Star glow for larger stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${opacity * 0.08})`;
          ctx.fill();
        }
      }
    }

    function drawShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;

        // Fade in then fade out
        const progress = ss.life / ss.maxLife;
        if (progress < 0.15) {
          ss.opacity = progress / 0.15;
        } else if (progress > 0.7) {
          ss.opacity = (1 - progress) / 0.3;
        } else {
          ss.opacity = 1;
        }

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Draw tail
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.6, `rgba(200, 220, 255, ${ss.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.fill();
      }
    }

    function drawPlanets() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (const p of planets) {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;

        // Planet glow
        const glowGrad = ctx.createRadialGradient(p.x, p.y, p.radius, p.x, p.y, p.radius * 3);
        glowGrad.addColorStop(0, p.glowColor);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        const bodyGrad = ctx.createRadialGradient(
          p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.1,
          p.x, p.y, p.radius
        );
        bodyGrad.addColorStop(0, p.color);
        bodyGrad.addColorStop(1, "#0a0a1a");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        if (p.ringColor) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1, 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = p.ringColor;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    const startTime = performance.now();

    function loop() {
      if (disposed) return;
      const time = (performance.now() - startTime) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      drawNebula(time);
      drawStars(time);
      drawPlanets();

      // Spawn shooting stars periodically
      shootingStarTimer++;
      if (shootingStarTimer > 180 + Math.random() * 200) {
        shootingStars.push(createShootingStar(w, h));
        shootingStarTimer = 0;
      }
      drawShootingStars();

      animId = requestAnimationFrame(loop);
    }

    resize();
    init();
    loop();

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: "radial-gradient(ellipse at 50% 20%, #0a0a1e 0%, #020210 50%, #000005 100%)" }}
      aria-hidden="true"
    />
  );
}
