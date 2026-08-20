"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type UseParallaxOptions = {
  enabled?: boolean;
};

const DEFAULT_MAGNITUDE = 160;

function canHoverDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Scroll-linked vertical parallax for flat/decorative elements.
 *
 * - `speed`: multiplier. 0.3 → the element lags at ~30% of page scroll
 *   (subtle depth). Negative values move it in the opposite direction.
 * - Returns `{ ref, y }`: attach `ref` to the target element and use `y`
 *   as its `style.transform` / motion value.
 * - Auto-disabled on touch / non-hover devices (mobile stays light) and for
 *   `prefers-reduced-motion` via the `enabled` flag from the consumer.
 *
 * Only applies GPU-friendly `transform` — safe alongside framer animations,
 * but do NOT use it on the Hero3D canvas (it owns its own camera).
 */
export function useParallax<T extends HTMLElement = HTMLElement>(
  speed = 0.3,
  { enabled = true }: UseParallaxOptions = {}
) {
  const ref = useRef<T | null>(null);
  const [hoverDevice, setHoverDevice] = useState(false);

  useEffect(() => {
    setHoverDevice(canHoverDevice());
  }, []);

  const active = enabled && hoverDevice;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const magnitude = DEFAULT_MAGNITUDE * speed;
  const y: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    active ? [magnitude, -magnitude] : [0, 0]
  );

  return { ref, y };
}
