"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AnimatedBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0 noise-mask opacity-50"
        animate={reducedMotion ? undefined : { opacity: [0.28, 0.5, 0.34] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(115deg,rgba(34,211,238,0.16),transparent_30%,rgba(16,185,129,0.1)_64%,transparent)]"
        animate={reducedMotion ? undefined : { x: ["-8%", "4%", "-8%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/85 to-transparent" />
    </div>
  );
}
