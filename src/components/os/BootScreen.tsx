"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/constants";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const BOOT_LINES = [
  "initializing kernel",
  "mounting portfolio volumes",
  "loading window server",
  "registering applications",
  "starting render services",
  "resolving profile",
  "finalizing session"
];

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const totalDuration = reducedMotion ? 450 : 1450;

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();

    const tick = (now: number) => {
      if (cancelled) {
        return;
      }
      const elapsed = now - started;
      const ratio = Math.min(1, elapsed / totalDuration);
      setProgress(ratio);
      setLineIndex(Math.min(BOOT_LINES.length - 1, Math.floor(ratio * BOOT_LINES.length)));
      if (ratio < 1) {
        requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [onDone, totalDuration]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        onDone();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  const lines = useMemo(
    () => BOOT_LINES.slice(0, lineIndex + 1),
    [lineIndex]
  );

  return (
    <button
      type="button"
      className="os-boot"
      onClick={onDone}
      aria-label="Skip boot sequence"
    >
      <motion.div
        className="os-boot__panel"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="os-boot__mark" aria-hidden="true">
          <span className="os-boot__mark-glyph">ea</span>
        </div>
        <p className="os-boot__title">{siteConfig.name}</p>
        <p className="os-boot__subtitle">Developer OS</p>
        <div className="os-boot__log" aria-hidden="true">
          {lines.map((line, idx) => (
            <p key={line} className="os-boot__log-line">
              <span className="os-boot__log-prefix">[ ok ]</span>
              {line}
              {idx === lines.length - 1 && <span className="os-boot__cursor" />}
            </p>
          ))}
        </div>
        <div className="os-boot__progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="os-boot__hint">press any key to skip</p>
      </motion.div>
    </button>
  );
}
