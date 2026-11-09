"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  GraduationCap,
  Layers,
  Code2,
  Database,
  Flame
} from "lucide-react";

interface HeroAvatarProps {
  imageSrc?: string;
  name?: string;
}

export default function HeroAvatar({
  imageSrc = "/profile.png",
  name = "Ehtesham Aalam"
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

  // Interactive 3D Parallax Tilt with Framer Motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const reverseTranslateX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const reverseTranslateY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

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
      className="relative mx-auto flex w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] items-center justify-center select-none py-6 perspective-[1000px]"
    >
      {/* ── Ambient Radial Cosmic Aura ── */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7042f8]/35 via-[#00f0ff]/25 to-purple-900/10 blur-3xl -z-20 pointer-events-none" />

      {/* ── Parallax 3D Card Shell ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative flex flex-col items-center justify-center w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[620px]"
      >
        {/* ── Background Cyber Holographic Arch & Portal ── */}
        <motion.div
          style={{ x: reverseTranslateX, y: reverseTranslateY }}
          className="absolute inset-x-6 top-8 bottom-12 rounded-[2.5rem] border border-[#7042f8]/40 bg-gradient-to-b from-[#16063b]/70 via-[#0b0321]/50 to-[#030014]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(112,66,248,0.25)] -z-10 overflow-hidden pointer-events-none"
        >
          {/* Cyber Matrix Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />

          {/* Rotating Celestial Orbital SVG */}
          <div className="absolute -top-16 -right-16 h-[320px] w-[320px] rounded-full border border-dashed border-[#7042f8]/40 animate-spin-slow pointer-events-none" style={{ animationDuration: "60s" }} />
          <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full border border-[#00f0ff]/30 animate-spin-slow pointer-events-none" style={{ animationDuration: "45s" }} />

          {/* Vertical Light Flare */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#00f0ff]/15 via-transparent to-transparent" />
        </motion.div>

        {/* ── Outer Orbital SVG Illustration (Sanidhyy Signature) ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 select-none -z-10">
          <Image
            src="/hero-bg.svg"
            alt="Orbital Tech Elements"
            width={640}
            height={640}
            priority
            className="animate-spin-slow drop-shadow-[0_0_30px_rgba(112,66,248,0.3)]"
            style={{ animationDuration: "90s" }}
          />
        </div>

        {/* ── Main Dynamic Profile Silhouette ── */}
        <div className="relative z-10 flex flex-col items-center justify-end w-full h-[460px] sm:h-[530px] lg:h-[580px]">
          {imgLoaded && !imgError ? (
            /* ── Full Cutout Standing Profile with Float Animation & Neon Glow ── */
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-end justify-center w-full h-full group"
            >
              {/* Dynamic Aura behind cutout */}
              <div className="absolute inset-x-12 bottom-12 top-10 rounded-full bg-gradient-to-t from-[#00f0ff]/20 via-[#7042f8]/30 to-transparent blur-2xl -z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* The Subject Image */}
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={433}
                  height={577}
                  priority
                  className="h-full w-auto max-h-[460px] sm:max-h-[530px] lg:max-h-[580px] object-contain object-bottom transition-all duration-500 drop-shadow-[0_10px_25px_rgba(112,66,248,0.45)] drop-shadow-[0_0_15px_rgba(0,240,255,0.35)] group-hover:drop-shadow-[0_15px_35px_rgba(0,240,255,0.65)] group-hover:drop-shadow-[0_0_30px_rgba(112,66,248,0.6)] group-hover:scale-[1.02]"
                />
              </div>

              {/* Holographic light sweep streak */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ) : (
            /* ── Futuristic Holographic Cyber Avatar Fallback ── */
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

        {/* ── Holographic Base Pedestal (Where the subject stands) ── */}
        <div className="relative z-10 -mt-6 sm:-mt-8 flex flex-col items-center justify-center pointer-events-none">
          {/* Ground Contact Shadow */}
          <div className="h-4 w-48 sm:w-60 rounded-full bg-black/80 blur-md -mb-2" />

          {/* Elliptical Glowing Stage */}
          <div className="relative flex items-center justify-center">
            <div className="h-7 w-56 sm:w-72 rounded-[100%] border border-[#00f0ff]/70 bg-gradient-to-r from-[#7042f8]/60 via-[#00f0ff]/40 to-[#7042f8]/60 shadow-[0_0_35px_rgba(0,240,255,0.6)] backdrop-blur-md" />
            <div className="absolute h-5 w-48 sm:w-60 rounded-[100%] border border-[#7042f8]/50 bg-cyan-400/20 blur-sm animate-pulse" />
          </div>
        </div>

        {/* ── Floating Tech Badges (Surrounding Subject with 3D Depth) ── */}
        {/* Top-Left: Live Status Badge */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 -left-2 sm:left-2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/50 bg-[#07011d]/90 shadow-[0_0_20px_rgba(16,185,129,0.35)] backdrop-blur-xl"
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
          className="absolute top-4 -right-2 sm:right-2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_20px_rgba(0,240,255,0.35)] backdrop-blur-xl"
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
          className="absolute bottom-20 -left-3 sm:-left-2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7042f8]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(112,66,248,0.4)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Database className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[11px] font-mono font-bold text-white">MongoDB</span>
        </motion.div>

        {/* Lower-Right: LeetCode Metrics Chip */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -right-3 sm:-right-2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-xl hover:scale-105 transition-transform"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-mono font-bold text-white">150+ LeetCode</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
