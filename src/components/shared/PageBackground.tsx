"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Fixed decorative backdrop: animated aurora mesh, fine grid, key light,
 * drifting aurora blobs, and a vignette. Purely presentational, pointer-free
 * and disabled for reduced motion.
 */
export default function PageBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-aurora-animated" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-keylight" />

      {/* drifting aurora blobs for depth */}
      {reducedMotion ? null : (
        <>
          <motion.div
            className="absolute -left-40 top-[8%] h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-3xl"
            animate={{ x: [0, 60, -20, 0], y: [0, -40, 24, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-48 top-[46%] h-[38rem] w-[38rem] rounded-full bg-accent/15 blur-3xl"
            animate={{ x: [0, -70, 30, 0], y: [0, 36, -28, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* soft vignette to anchor the page */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 58%, var(--vignette) 100%)"
        }}
      />
    </div>
  );
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      aria-hidden="true"
      role="presentation"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary via-accent to-secondary shadow-[0_0_12px_var(--ring)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
