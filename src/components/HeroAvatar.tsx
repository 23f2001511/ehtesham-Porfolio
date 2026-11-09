"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Layers,
  Code2,
  Flame,
  Scan,
  Sparkles,
  ShieldCheck,
  Maximize2
} from "lucide-react";

interface HeroAvatarProps {
  imageSrc?: string;
  name?: string;
  leetcodeSolved?: number;
}

type ViewMode = "hologram" | "stage";

export default function HeroAvatar({
  imageSrc = "/profile.png",
  name = "Ehtesham Aalam",
  leetcodeSolved = 103
}: HeroAvatarProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("hologram");
  const [isScanning, setIsScanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if image loads cleanly
  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);

    if (!imageSrc) {
      setImgError(true);
      return;
    }

    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgLoaded(true);
      setImgError(false);
    };
    img.onerror = () => {
      setImgError(true);
      setImgLoaded(false);
    };
  }, [imageSrc]);

  // Interactive 3D Parallax Tilt with Framer Motion spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const popOutY = useTransform(smoothY, [-0.5, 0.5], [-14, 6]);
  const badgeParallaxX = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const badgeParallaxY = useTransform(smoothY, [-0.5, 0.5], [14, -14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2200);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex w-full max-w-[460px] sm:max-w-[520px] flex-col items-center justify-center select-none py-4 perspective-[1200px]"
    >
      {/* ── Creative Design Switcher (Hologram Pop-Out vs Full Stage) ── */}
      <div className="z-30 mb-5 flex items-center gap-2 rounded-full border border-[#7042f8]/50 bg-[#07011d]/90 p-1 backdrop-blur-xl shadow-[0_0_25px_rgba(112,66,248,0.4)]">
        <button
          type="button"
          onClick={() => setViewMode("hologram")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
            viewMode === "hologram"
              ? "bg-gradient-to-r from-[#7042f8] to-[#00f0ff] text-white shadow-[0_0_18px_rgba(0,240,255,0.6)]"
              : "text-purple-300 hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>3D Hologram</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode("stage")}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
            viewMode === "stage"
              ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_18px_rgba(112,66,248,0.6)]"
              : "text-purple-300 hover:text-white"
          }`}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Full Stage</span>
        </button>

        {/* Laser Scan Action Button */}
        <button
          type="button"
          onClick={triggerScan}
          disabled={isScanning}
          aria-label="Scan Profile"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all cursor-pointer"
          title="Trigger Hologram Laser Scan"
        >
          <Scan className={`h-3.5 w-3.5 ${isScanning ? "animate-spin text-white" : ""}`} />
        </button>
      </div>

      {/* ── Ambient Radial Cosmic Aura ── */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7042f8]/45 via-[#00f0ff]/30 to-purple-900/15 blur-3xl -z-20 pointer-events-none" />

      {/* ── Main 3D Card Shell ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative flex flex-col items-center justify-center w-full min-h-[500px] sm:min-h-[550px]"
      >
        <AnimatePresence mode="wait">
          {viewMode === "hologram" ? (
            /* ═══════════════════════════════════════════════════════════════
               DESIGN 1: 3D HOLOGRAPHIC POP-OUT CYBER CARD (AWARD-WINNING)
               ═══════════════════════════════════════════════════════════════ */
            <motion.div
              key="hologram-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center justify-end w-full max-w-[340px] sm:max-w-[380px] h-[460px] sm:h-[500px]"
            >
              {/* Outer Animated Conic-Gradient Laser Border */}
              <div className="absolute -inset-[2px] rounded-[2.2rem] bg-gradient-to-r from-[#7042f8] via-[#00f0ff] to-[#7042f8] opacity-75 blur-[2px] animate-pulse -z-10 pointer-events-none" />

              {/* The Futuristic Frosted Cyber Card Frame */}
              <div className="relative w-full h-[400px] sm:h-[430px] rounded-[2rem] border border-[#7042f8]/60 bg-gradient-to-b from-[#17073b]/90 via-[#0a0221]/80 to-[#030014]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(112,66,248,0.35)] overflow-hidden">
                {/* Cyber Matrix Background Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:18px_18px] opacity-20 pointer-events-none" />

                {/* Rotating Tech Ring in Background */}
                <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full border border-dashed border-[#7042f8]/40 animate-spin-slow pointer-events-none" style={{ animationDuration: "50s" }} />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full border border-[#00f0ff]/30 animate-spin-slow pointer-events-none" style={{ animationDuration: "35s" }} />

                {/* Cyber Corner Tech Brackets */}
                <div className="absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#00f0ff] pointer-events-none" />
                <div className="absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#00f0ff] pointer-events-none" />
                <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#7042f8] pointer-events-none" />
                <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#7042f8] pointer-events-none" />

                {/* Top Cyber HUD Bar */}
                <div className="absolute top-3.5 inset-x-8 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#00f0ff] z-10 pointer-events-none">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    ID // EA-2026
                  </span>
                  <span className="text-purple-300">FULL-STACK</span>
                </div>

                {/* Glass Light Reflection Diagonal Streak */}
                <div className="absolute -inset-full top-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

                {/* Bottom Card Base Info Strip */}
                <div className="absolute bottom-0 inset-x-0 p-4 pt-10 bg-gradient-to-t from-[#030014] via-[#07011d]/90 to-transparent z-20 flex items-center justify-between border-t border-[#7042f8]/30">
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight leading-none">
                      {name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#00f0ff] mt-1 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" />
                      IIT Madras Scholar
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-300 block">
                      {leetcodeSolved} Solved
                    </span>
                    <span className="text-[9px] font-mono uppercase text-gray-400">
                      LeetCode
                    </span>
                  </div>
                </div>
              </div>

              {/* ── 3D POP-OUT SUBJECT (Head & Chest Pop Gracefully Out of Card) ── */}
              <motion.div
                style={{ y: popOutY }}
                className="absolute -top-12 sm:-top-16 inset-x-0 h-[480px] sm:h-[530px] flex items-end justify-center pointer-events-none z-10"
              >
                {imgLoaded && !imgError ? (
                  <div className="relative w-full h-full flex items-end justify-center group pointer-events-auto">
                    {/* Dynamic Dual Neon Silhouette Aura */}
                    <div className="absolute inset-x-10 bottom-10 top-12 rounded-full bg-gradient-to-t from-[#00f0ff]/25 via-[#7042f8]/35 to-transparent blur-2xl -z-10 opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* The Prominent Pop-Out Profile Image */}
                    <Image
                      src={imageSrc}
                      alt={name}
                      width={866}
                      height={1154}
                      priority
                      className="h-full w-auto max-h-[480px] sm:max-h-[530px] object-contain object-bottom filter contrast-[1.06] brightness-[1.03] saturate-[1.1] drop-shadow-[0_15px_30px_rgba(112,66,248,0.5)] drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-[1.03] transition-transform duration-500"
                    />

                    {/* Laser Hologram Scan Beam */}
                    <AnimatePresence>
                      {isScanning && (
                        <motion.div
                          initial={{ top: "0%", opacity: 0 }}
                          animate={{ top: ["0%", "92%", "10%"], opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 2.2, ease: "easeInOut" }}
                          className="absolute inset-x-6 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_25px_#00f0ff] pointer-events-none z-30"
                        >
                          <div className="absolute inset-x-0 -top-6 h-12 bg-gradient-to-b from-[#00f0ff]/25 via-[#00f0ff]/10 to-transparent" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-purple-900/50 grid place-items-center text-white font-mono text-2xl font-bold">
                    EA
                  </div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            /* ═══════════════════════════════════════════════════════════════
               DESIGN 2: FULL-BODY STAGE WITH REALISTIC REFLECTION & PODIUM
               ═══════════════════════════════════════════════════════════════ */
            <motion.div
              key="stage-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center justify-end w-full min-h-[520px] sm:min-h-[570px]"
            >
              {/* Directional Overhead Spotlight Beam */}
              <div className="absolute -top-10 inset-x-0 flex justify-center pointer-events-none -z-10 opacity-70">
                <div className="w-80 h-[500px] bg-gradient-to-b from-[#00f0ff]/20 via-[#7042f8]/10 to-transparent blur-xl [clip-path:polygon(35%_0%,65%_0%,100%_100%,0%_100%)]" />
              </div>

              {/* Full Standing Subject */}
              <div className="relative z-10 flex flex-col items-center justify-end w-full h-[460px] sm:h-[510px]">
                <div className="relative w-full h-full flex items-end justify-center group">
                  <Image
                    src={imageSrc}
                    alt={name}
                    width={866}
                    height={1154}
                    priority
                    className="h-full w-auto max-h-[460px] sm:max-h-[510px] object-contain object-bottom filter contrast-[1.05] brightness-[1.02] saturate-[1.08] drop-shadow-[0_15px_30px_rgba(112,66,248,0.5)] drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  />

                  {/* Floor Reflection */}
                  <div className="absolute top-full left-0 right-0 h-36 overflow-hidden pointer-events-none select-none opacity-30">
                    <div className="relative w-full h-[460px] sm:h-[510px] -mt-[460px] sm:-mt-[510px] scale-y-[-1] blur-[1px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,transparent_55%)]">
                      <Image
                        src={imageSrc}
                        alt=""
                        width={866}
                        height={1154}
                        className="h-full w-auto max-h-[460px] sm:max-h-[510px] object-contain object-bottom mx-auto filter contrast-[1.05] brightness-90"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Tilted Stage Deck & Contact Shadows */}
              <div className="relative z-10 -mt-3 flex flex-col items-center pointer-events-none w-full">
                <div className="relative flex justify-center items-center w-full max-w-[280px] pointer-events-none -mb-3 z-20">
                  <div className="w-16 h-3.5 rounded-full bg-black/95 blur-[2.5px] -rotate-6 transform translate-x-2" />
                  <div className="w-10 h-2 bg-black/70 blur-[4px]" />
                  <div className="w-16 h-3.5 rounded-full bg-black/95 blur-[2.5px] rotate-6 transform -translate-x-2" />
                </div>
                <div className="h-6 w-64 sm:w-80 rounded-full bg-black/90 blur-md -mb-2" />
                <div className="h-8 w-64 sm:w-80 rounded-[100%] border-2 border-[#00f0ff]/70 bg-gradient-to-r from-[#17083a]/90 via-[#0d0324]/90 to-[#17083a]/90 shadow-[0_0_40px_rgba(0,240,255,0.6)] backdrop-blur-xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating 3D HUD Badges with Interactive Parallax ── */}
        {/* Top-Left: Status Beacon */}
        <motion.div
          style={{ x: badgeParallaxX, y: badgeParallaxY }}
          className="absolute top-2 -left-3 sm:-left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/50 bg-[#07011d]/90 shadow-[0_0_20px_rgba(16,185,129,0.35)] backdrop-blur-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono font-bold text-white tracking-wide">
            Open to Work
          </span>
        </motion.div>

        {/* Top-Right: IIT Madras Distinction */}
        <motion.div
          style={{ x: badgeParallaxX, y: badgeParallaxY }}
          className="absolute top-2 -right-3 sm:-right-4 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_20px_rgba(0,240,255,0.35)] backdrop-blur-xl"
        >
          <GraduationCap className="w-4 h-4 text-[#00f0ff]" />
          <div className="text-left">
            <span className="block text-[10px] font-mono font-extrabold text-white">IIT Madras</span>
            <span className="block text-[9px] font-mono text-cyan-300">BS Data Science</span>
          </div>
        </motion.div>

        {/* Mid-Left: Tech Stack Chip */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2/5 -left-5 sm:-left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7042f8]/60 bg-[#07011d]/90 shadow-[0_0_15px_rgba(112,66,248,0.45)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[11px] font-mono font-bold text-white">Next.js 15</span>
        </motion.div>

        {/* Mid-Right: TypeScript Chip */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2/5 -right-5 sm:-right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00f0ff]/60 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Code2 className="w-3.5 h-3.5 text-[#b49bff]" />
          <span className="text-[11px] font-mono font-bold text-white">TypeScript</span>
        </motion.div>

        {/* Bottom-Right: Live LeetCode Solved Badge */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 -right-2 sm:right-0 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/50 bg-[#07011d]/90 shadow-[0_0_18px_rgba(245,158,11,0.35)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-mono font-bold text-white">
            {leetcodeSolved} LeetCode Solved
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
