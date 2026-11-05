"use client";

import { motion } from "framer-motion";

/**
 * Sanidhyy Space-Portfolio Celestial Accretion Vortex.
 * Matches the signature top blackhole glow from https://spaceportfolio.netlify.app/.
 */
export default function BlackHoleVortex() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-52 sm:-top-72 left-1/2 -translate-x-1/2 z-0 h-[680px] w-[1100px] max-w-[100vw] select-none overflow-hidden"
    >
      {/* ── Soft Deep Violet Accretion Flare ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#7042f8]/45 via-[#a855f7]/20 to-transparent blur-[140px] rounded-full" />

      {/* ── Center Radiant Singularity Core ── */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 h-56 w-[520px] rounded-full bg-gradient-to-b from-[#00f0ff]/25 via-[#7042f8]/40 to-transparent blur-[90px]" />

      {/* ── Inner Blinding Photon Arc ── */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 h-20 w-80 rounded-full bg-gradient-to-b from-white/40 via-[#00f0ff]/30 to-transparent blur-[40px]" />

      {/* ── Rotating Accretion Disk Ray Streams ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[750px] w-[750px] rounded-full opacity-35"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(112,66,248,0.7) 0deg, transparent 45deg, rgba(0,240,255,0.6) 90deg, transparent 135deg, rgba(168,85,247,0.7) 180deg, transparent 225deg, rgba(0,240,255,0.5) 270deg, transparent 315deg, rgba(112,66,248,0.7) 360deg)",
          filter: "blur(48px)"
        }}
      />
    </div>
  );
}
