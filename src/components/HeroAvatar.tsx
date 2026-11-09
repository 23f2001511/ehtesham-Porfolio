"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Layers,
  Code2,
  Database,
  Flame,
  Scan,
  Sparkles,
  Radio
} from "lucide-react";

interface HeroAvatarProps {
  imageSrc?: string;
  name?: string;
  leetcodeSolved?: number;
}

type StudioMode = "cosmic" | "cyber" | "studio";

export default function HeroAvatar({
  imageSrc = "/profile.png",
  name = "Ehtesham Aalam",
  leetcodeSolved = 103
}: HeroAvatarProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [studioMode, setStudioMode] = useState<StudioMode>("cosmic");
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

  const springConfig = { damping: 25, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const reverseTranslateX = useTransform(smoothX, [-0.5, 0.5], [12, -12]);
  const reverseTranslateY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const lightPositionX = useTransform(smoothX, [-0.5, 0.5], ["30%", "70%"]);

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
    setTimeout(() => setIsScanning(false), 2400);
  };

  // Color theme definitions for creative modes
  const modeThemes = {
    cosmic: {
      aura: "from-[#7042f8]/40 via-[#00f0ff]/25 to-purple-900/10",
      portalBorder: "border-[#7042f8]/40",
      stageGlow: "shadow-[0_0_40px_rgba(112,66,248,0.5)]",
      stageBorder: "border-[#00f0ff]/70",
      spotlight: "from-[#00f0ff]/20 via-[#7042f8]/10 to-transparent",
      badgeColor: "text-[#00f0ff]"
    },
    cyber: {
      aura: "from-cyan-500/40 via-emerald-500/20 to-transparent",
      portalBorder: "border-cyan-500/40",
      stageGlow: "shadow-[0_0_40px_rgba(0,240,255,0.6)]",
      stageBorder: "border-cyan-400/80",
      spotlight: "from-cyan-400/25 via-emerald-400/10 to-transparent",
      badgeColor: "text-cyan-400"
    },
    studio: {
      aura: "from-amber-500/30 via-purple-600/20 to-transparent",
      portalBorder: "border-amber-400/40",
      stageGlow: "shadow-[0_0_40px_rgba(251,191,36,0.45)]",
      stageBorder: "border-amber-300/70",
      spotlight: "from-amber-200/25 via-purple-500/10 to-transparent",
      badgeColor: "text-amber-300"
    }
  };

  const currentTheme = modeThemes[studioMode];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex w-full max-w-[440px] sm:max-w-[500px] lg:max-w-[560px] flex-col items-center justify-center select-none py-4 perspective-[1200px]"
    >
      {/* ── Mode Selection Header (Creative Feature) ── */}
      <div className="z-30 mb-3 flex items-center gap-1.5 rounded-full border border-[#7042f8]/40 bg-[#07011d]/90 p-1 backdrop-blur-xl shadow-[0_0_20px_rgba(112,66,248,0.3)]">
        <button
          type="button"
          onClick={() => setStudioMode("cosmic")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold transition-all cursor-pointer ${
            studioMode === "cosmic"
              ? "bg-gradient-to-r from-[#7042f8] to-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.5)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Sparkles className="h-3 w-3" />
          <span>Cosmic</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioMode("cyber")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold transition-all cursor-pointer ${
            studioMode === "cyber"
              ? "bg-gradient-to-r from-cyan-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.5)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Layers className="h-3 w-3" />
          <span>Cyber</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioMode("studio")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold transition-all cursor-pointer ${
            studioMode === "studio"
              ? "bg-gradient-to-r from-amber-600 to-purple-600 text-white shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Radio className="h-3 w-3" />
          <span>Studio</span>
        </button>

        {/* Hologram Scan Button */}
        <button
          type="button"
          onClick={triggerScan}
          disabled={isScanning}
          aria-label="Scan Profile"
          className="ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-purple-400/50 text-purple-300 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-purple-900/40 transition-all cursor-pointer"
          title="Laser Scan"
        >
          <Scan className={`h-3 w-3 ${isScanning ? "animate-spin text-[#00f0ff]" : ""}`} />
        </button>
      </div>

      {/* ── Ambient Radial Cosmic Aura ── */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentTheme.aura} blur-3xl -z-20 pointer-events-none transition-colors duration-700`} />

      {/* ── Parallax 3D Card Shell ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative flex flex-col items-center justify-center w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[620px]"
      >
        {/* ── Directional Top Spotlight Beam ── */}
        <motion.div
          style={{ left: lightPositionX }}
          className="absolute -top-12 -translate-x-1/2 w-72 h-[480px] pointer-events-none -z-10 opacity-70"
        >
          <div className={`w-full h-full bg-gradient-to-b ${currentTheme.spotlight} blur-xl [clip-path:polygon(35%_0%,65%_0%,100%_100%,0%_100%)]`} />
        </motion.div>

        {/* ── Realistic Studio Backdrop Arch ── */}
        <motion.div
          style={{ x: reverseTranslateX, y: reverseTranslateY }}
          className={`absolute inset-x-6 top-6 bottom-16 rounded-[2.5rem] border ${currentTheme.portalBorder} bg-gradient-to-b from-[#140636]/75 via-[#09021c]/60 to-[#030014]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(112,66,248,0.25)] -z-10 overflow-hidden pointer-events-none transition-colors duration-700`}
        >
          {/* Cyber Grid Matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />

          {/* Rotating Celestial Tech Rings */}
          <div className="absolute -top-16 -right-16 h-[320px] w-[320px] rounded-full border border-dashed border-[#7042f8]/40 animate-spin-slow pointer-events-none" style={{ animationDuration: "60s" }} />
          <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full border border-[#00f0ff]/30 animate-spin-slow pointer-events-none" style={{ animationDuration: "45s" }} />

          {/* Top ambient illumination */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
        </motion.div>

        {/* ── Standing Subject (Real Standing Pose) ── */}
        <div className="relative z-10 flex flex-col items-center justify-end w-full h-[470px] sm:h-[530px] lg:h-[570px]">
          {imgLoaded && !imgError ? (
            <div className="relative flex flex-col items-center justify-end w-full h-full group">
              {/* Dynamic Aura behind cutout */}
              <div className="absolute inset-x-12 bottom-12 top-10 rounded-full bg-gradient-to-t from-[#00f0ff]/20 via-[#7042f8]/30 to-transparent blur-2xl -z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* The Subject Image (Enhanced & Realistic Standing) */}
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={866}
                  height={1154}
                  priority
                  className="h-full w-auto max-h-[470px] sm:max-h-[530px] lg:max-h-[570px] object-contain object-bottom transition-all duration-500 filter contrast-[1.04] brightness-[1.02] saturate-[1.08] drop-shadow-[0_10px_25px_rgba(112,66,248,0.45)] drop-shadow-[0_0_15px_rgba(0,240,255,0.35)] group-hover:drop-shadow-[0_15px_35px_rgba(0,240,255,0.65)] group-hover:drop-shadow-[0_0_30px_rgba(112,66,248,0.6)]"
                />

                {/* Laser Scan Line Animation (When scan is triggered) */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      initial={{ top: "0%", opacity: 0 }}
                      animate={{ top: ["0%", "95%", "10%"], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2.2, ease: "easeInOut" }}
                      className="absolute inset-x-10 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_20px_#00f0ff] pointer-events-none z-20"
                    >
                      <div className="absolute inset-x-0 -top-6 h-12 bg-gradient-to-b from-[#00f0ff]/20 via-[#00f0ff]/10 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Realistic Mirror Floor Reflection (Key to Real Standing) ── */}
              <div className="absolute top-full left-0 right-0 h-36 overflow-hidden pointer-events-none select-none opacity-30">
                <div className="relative w-full h-[470px] sm:h-[530px] lg:h-[570px] -mt-[470px] sm:-mt-[530px] lg:-mt-[570px] scale-y-[-1] blur-[1px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,transparent_55%)]">
                  <Image
                    src={imageSrc}
                    alt=""
                    width={866}
                    height={1154}
                    className="h-full w-auto max-h-[470px] sm:max-h-[530px] lg:max-h-[570px] object-contain object-bottom mx-auto filter contrast-[1.05] brightness-90"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ── Holographic Cyber Fallback ── */
            <div className="relative flex flex-col items-center justify-center h-full w-full p-6 text-center select-none">
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-4 flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#00f0ff] bg-gradient-to-tr from-[#7042f8] via-[#1b0849] to-[#00f0ff]/40 shadow-[0_0_35px_rgba(0,240,255,0.7)]"
              >
                <span className="font-mono text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-200">
                  EA
                </span>
                <span className="absolute -inset-2 rounded-full border border-[#00f0ff]/50 animate-ping opacity-35" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight text-white">{name}</span>
              <span className="text-xs font-mono text-[#00f0ff] mt-1 tracking-wider">
                Full-Stack Space Developer
              </span>
            </div>
          )}
        </div>

        {/* ── Realistic 3D Perspective Studio Floor & Pedestal (Physical Grounding) ── */}
        <div className="relative z-10 -mt-3 sm:-mt-4 flex flex-col items-center justify-center pointer-events-none w-full">
          {/* Dual Precision Contact Shadows (Right beneath soles) */}
          <div className="relative flex justify-center items-center w-full max-w-[280px] pointer-events-none -mb-3 z-20">
            {/* Left foot contact shadow */}
            <div className="w-16 h-3.5 rounded-full bg-black/95 blur-[2.5px] -rotate-6 transform translate-x-2" />
            {/* Gap between feet */}
            <div className="w-10 h-2 bg-black/70 blur-[4px]" />
            {/* Right foot contact shadow */}
            <div className="w-16 h-3.5 rounded-full bg-black/95 blur-[2.5px] rotate-6 transform -translate-x-2" />
          </div>

          {/* Broad Ambient Occlusion Floor Shadow */}
          <div className="h-6 w-64 sm:w-80 rounded-full bg-black/90 blur-md -mb-2" />

          {/* 3D Tilted Reflective Glass Deck / High-Tech Stage */}
          <div className="relative flex items-center justify-center">
            {/* Polished Rim Stage */}
            <div className={`h-8 w-64 sm:w-80 rounded-[100%] border-2 ${currentTheme.stageBorder} bg-gradient-to-r from-[#17083a]/90 via-[#0d0324]/90 to-[#17083a]/90 ${currentTheme.stageGlow} backdrop-blur-xl transition-all duration-700`} />

            {/* Inner Concentric Glow Ring */}
            <div className="absolute h-5 w-52 sm:w-68 rounded-[100%] border border-[#00f0ff]/60 bg-cyan-400/15 blur-xs animate-pulse" />

            {/* Stage Grid Laser Line */}
            <div className="absolute h-0.5 w-44 sm:w-56 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-80" />
          </div>
        </div>

        {/* ── Floating Tech & Distinction HUD Badges ── */}
        {/* Top-Left: Live Status Beacon */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 -left-2 sm:left-2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/50 bg-[#07011d]/90 shadow-[0_0_20px_rgba(16,185,129,0.35)] backdrop-blur-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono font-bold text-white tracking-wide">
            Available for Hire
          </span>
        </motion.div>

        {/* Top-Right: Academic Distinction Badge */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 -right-2 sm:right-2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_20px_rgba(0,240,255,0.35)] backdrop-blur-xl"
        >
          <GraduationCap className="w-4 h-4 text-[#00f0ff]" />
          <div className="text-left">
            <span className="block text-[10px] font-mono font-extrabold text-white">IIT Madras</span>
            <span className="block text-[9px] font-mono text-cyan-300">BS Data Science</span>
          </div>
        </motion.div>

        {/* Middle-Left: Next.js + React Chip */}
        <motion.div
          animate={{ y: [-5, 5, -5], x: [-2, 2, -2] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -left-4 sm:-left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7042f8]/60 bg-[#07011d]/90 shadow-[0_0_15px_rgba(112,66,248,0.45)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[11px] font-mono font-bold text-white">Next.js 15</span>
        </motion.div>

        {/* Middle-Right: TypeScript Chip */}
        <motion.div
          animate={{ y: [5, -5, 5], x: [2, -2, 2] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-4 sm:-right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00f0ff]/60 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Code2 className="w-3.5 h-3.5 text-[#b49bff]" />
          <span className="text-[11px] font-mono font-bold text-white">TypeScript</span>
        </motion.div>

        {/* Lower-Left: Backend / MongoDB Chip */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 -left-3 sm:-left-2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7042f8]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(112,66,248,0.4)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Database className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[11px] font-mono font-bold text-white">MongoDB</span>
        </motion.div>

        {/* Lower-Right: LeetCode Metrics Chip */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 -right-3 sm:-right-2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-mono font-bold text-white">{leetcodeSolved} Solved</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
