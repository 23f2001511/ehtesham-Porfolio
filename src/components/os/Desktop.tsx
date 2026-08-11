"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { OS_TASKBAR_HEIGHT, useOS, WALLPAPERS } from "./OSContext";

function DesktopParticles({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;

    // Additive canvas painting uses destination-over for the translucent
    // fade pass so trails persist without a global alpha reset.
    context.globalCompositeOperation = "destination-over";

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.max(
      24,
      Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 22000))
    );
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.1,
      r: 0.6 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2
    }));

    const step = () => {
      raf = requestAnimationFrame(step);
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.fillStyle = "rgba(0, 0, 0, 0.22)";
      context.fillRect(0, 0, width, height);
      context.fillStyle = colorRef.current;
      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.phase += 0.015;
        if (dot.x < -4) dot.x = width + 4;
        if (dot.x > width + 4) dot.x = -4;
        if (dot.y < -4) dot.y = height + 4;
        if (dot.y > height + 4) dot.y = -4;
        const breathe = 0.65 + Math.sin(dot.phase) * 0.35;
        context.globalAlpha = breathe;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return <canvas ref={canvasRef} className="os-wallpaper__particles" aria-hidden="true" />;
}

export default function Desktop() {
  const { wallpaperIndex, cycleWallpaper, particlesEnabled } = useOS();
  const wallpaper = WALLPAPERS[wallpaperIndex];

  const changeWallpaper = useCallback(() => cycleWallpaper(), [cycleWallpaper]);

  return (
    <>
      <div
        className="os-wallpaper"
        style={{ background: wallpaper.base }}
        onDoubleClick={changeWallpaper}
        aria-hidden="true"
      >
        <div
          className="os-wallpaper__blob"
          style={{
            background: `radial-gradient(closest-side, ${wallpaper.blobA}, transparent 68%)`,
            left: "-10%",
            top: "-15%",
            width: "60vw",
            height: "60vw"
          }}
        />
        <div
          className="os-wallpaper__blob"
          style={{
            background: `radial-gradient(closest-side, ${wallpaper.blobB}, transparent 68%)`,
            right: "-15%",
            bottom: "-20%",
            width: "55vw",
            height: "55vw"
          }}
        />
        <div
          className="os-wallpaper__grid"
          style={{
            backgroundImage: `linear-gradient(${wallpaper.grid} 1px, transparent 1px), linear-gradient(90deg, ${wallpaper.grid} 1px, transparent 1px)`,
            paddingBottom: OS_TASKBAR_HEIGHT
          }}
        />
        {particlesEnabled && <DesktopParticles color={wallpaper.particle} />}
      </div>
      <div className="os-vignette" aria-hidden="true" />
    </>
  );
}
