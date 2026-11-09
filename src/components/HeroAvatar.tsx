"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  GraduationCap,
  Flame,
  Layers,
  Code2
} from "lucide-react";

interface HeroAvatarProps {
  imageSrc?: string;
  name?: string;
  leetcodeSolved?: number;
}

export default function HeroAvatar({
  imageSrc = "/profile.png",
  name = "Ehtesham Aalam",
  leetcodeSolved = 103
}: HeroAvatarProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
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

  // Smooth, subtle 3D parallax tilt (organic & graceful)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 160 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const haloTranslateX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const haloTranslateY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[500px] flex-col items-center justify-center select-none py-4 sm:py-6 perspective-[1000px]"
    >
      {/* ── Soft Deep Cosmic Ambient Glow ── */}
      <motion.div
        style={{ x: haloTranslateX, y: haloTranslateY }}
        className="absolute inset-2 sm:inset-6 rounded-full bg-gradient-to-tr from-[#7042f8]/35 via-[#00f0ff]/20 to-purple-900/10 blur-[60px] sm:blur-[90px] -z-20 pointer-events-none"
      />

      {/* ── Rotating Celestial Orbital Rings (Mobile-Safe & Overflow-Protected) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none -z-10 overflow-hidden">
        <div
          className="h-[270px] w-[270px] sm:h-[390px] sm:w-[390px] lg:h-[460px] lg:w-[460px] rounded-full border border-dashed border-[#7042f8]/50 animate-spin-slow"
          style={{ animationDuration: "80s" }}
        />
        <div
          className="absolute h-[220px] w-[220px] sm:h-[320px] sm:w-[320px] lg:h-[400px] lg:w-[400px] rounded-full border border-[#00f0ff]/30 animate-spin-slow"
          style={{ animationDuration: "50s", animationDirection: "reverse" }}
        />
      </div>

      {/* ── Main Interactive 3D Shell ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative flex flex-col items-center justify-end w-full h-[430px] sm:h-[520px] lg:h-[580px]"
      >
        {/* ── Subject Image Display ── */}
        <div className="relative z-10 flex flex-col items-center justify-end w-full h-full">
          {imgLoaded && !imgError ? (
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-end justify-center w-full h-full group cursor-pointer"
            >
              {/* Soft Radial Silhouette Aura */}
              <div className="absolute inset-x-8 sm:inset-x-12 bottom-10 sm:bottom-12 top-8 sm:top-10 rounded-full bg-gradient-to-t from-[#00f0ff]/20 via-[#7042f8]/30 to-transparent blur-xl sm:blur-2xl -z-10 opacity-70 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none" />

              {/* The Subject Photo */}
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={866}
                  height={1154}
                  priority
                  className="h-full w-auto max-h-[430px] sm:max-h-[520px] lg:max-h-[580px] object-contain object-bottom filter contrast-[1.04] brightness-[1.02] drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] drop-shadow-[0_0_25px_rgba(112,66,248,0.4)] group-hover:drop-shadow-[0_0_35px_rgba(0,240,255,0.55)] group-hover:scale-[1.02] transition-all duration-500"
                />
              </div>
            </motion.div>
          ) : (
            /* Cyber Holographic Fallback */
            <div className="relative flex flex-col items-center justify-center h-full w-full p-6 text-center select-none">
              <div className="relative mb-4 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border-2 border-[#00f0ff] bg-gradient-to-tr from-[#7042f8] via-[#1b0849] to-[#00f0ff]/40 shadow-[0_0_35px_rgba(0,240,255,0.7)]">
                <span className="font-mono text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-200">
                  EA
                </span>
              </div>
              <span className="text-base sm:text-lg font-bold text-white">{name}</span>
            </div>
          )}
        </div>

        {/* ── Grounding Pedestal & Shadow ── */}
        <div className="relative z-10 -mt-2 sm:-mt-3 flex flex-col items-center pointer-events-none w-full">
          {/* Ground Contact Shadow */}
          <div className="h-3 sm:h-4 w-36 sm:w-56 rounded-full bg-black/90 blur-[4px] -mb-1" />

          {/* Glowing Ground Base Ellipse */}
          <div className="relative flex items-center justify-center">
            <div className="h-5 sm:h-6 w-48 sm:w-72 rounded-[100%] border border-[#00f0ff]/50 bg-gradient-to-r from-[#7042f8]/40 via-[#00f0ff]/30 to-[#7042f8]/40 shadow-[0_0_25px_rgba(0,240,255,0.45)] backdrop-blur-md" />
            <div className="absolute h-3 sm:h-4 w-36 sm:w-56 rounded-[100%] bg-cyan-400/15 blur-xs animate-pulse" />
          </div>
        </div>

        {/* ── Responsive Floating Badges (Mobile-Safe Inset Positioning) ── */}
        {/* Top-Left: Status Badge */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 sm:top-4 left-1 sm:-left-3 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-emerald-500/40 bg-[#07011d]/90 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white tracking-wide">
            Open to Work
          </span>
        </motion.div>

        {/* Top-Right: IIT Madras Academic Distinction */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 sm:top-4 right-1 sm:-right-3 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-[#00f0ff]/40 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-xl"
        >
          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00f0ff]" />
          <div className="text-left">
            <span className="block text-[9px] sm:text-[10px] font-mono font-extrabold text-white leading-tight">IIT Madras</span>
            <span className="block text-[8px] sm:text-[9px] font-mono text-cyan-300 leading-tight">BS Data Science</span>
          </div>
        </motion.div>

        {/* Mid-Left: Tech Stack Chip */}
        <motion.div
          animate={{ y: [-4, 4, -4], x: [-2, 2, -2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1 sm:-left-4 z-30 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#7042f8]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(112,66,248,0.35)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00f0ff]" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">Next.js 15</span>
        </motion.div>

        {/* Mid-Right: TypeScript Chip */}
        <motion.div
          animate={{ y: [4, -4, 4], x: [2, -2, 2] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1 sm:-right-4 z-30 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.35)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#b49bff]" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">TypeScript</span>
        </motion.div>

        {/* Bottom-Right: Live LeetCode Solved Badge */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 right-1 sm:right-0 z-30 flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-amber-500/40 bg-[#07011d]/90 shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">
            {leetcodeSolved} LeetCode Solved
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
