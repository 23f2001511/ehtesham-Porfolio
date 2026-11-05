"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Award, Atom, Layers, Code2, Database } from "lucide-react";

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

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[28rem] sm:max-w-[34rem] items-center justify-center lg:max-w-none lg:h-[520px]">
      {/* ── Ambient Radial Cosmic Aura ── */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7042f8]/30 via-[#00f0ff]/20 to-transparent blur-3xl -z-10" />

      {/* ── Outer Tech Orbital SVG Illustration (Sanidhyy Signature) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85 select-none -z-10">
        <Image
          src="/hero-bg.svg"
          alt="Orbital Tech Elements"
          width={600}
          height={600}
          priority
          className="animate-spin-slow opacity-90 drop-shadow-[0_0_30px_rgba(112,66,248,0.4)]"
          style={{ animationDuration: "90s" }}
        />
      </div>

      {/* ── Center Concentric Cyber Aperture ── */}
      <div className="relative flex h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] items-center justify-center">
        {/* Outer Orbit Track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-[#7042f8]/50"
        />

        {/* Counter-Spinning Cyan Track */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
        />

        {/* Inner Pulsing Ring */}
        <motion.div
          animate={{ scale: [1, 1.03, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-7 rounded-full border-2 border-[#7042f8]/60 shadow-[0_0_25px_rgba(112,66,248,0.5)]"
        />

        {/* ── Main Display Aperture ── */}
        <div className="relative z-10 flex h-[230px] w-[230px] sm:h-[280px] sm:w-[280px] items-center justify-center overflow-hidden rounded-full border-2 border-[#00f0ff]/70 bg-gradient-to-b from-[#1b0849]/95 via-[#0b0424]/95 to-[#040114] shadow-[0_0_35px_rgba(0,240,255,0.4)] backdrop-blur-md">
          {imgLoaded && !imgError ? (
            /* ── User Photo with Cyber Holographic Frame ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-full w-full"
            >
              <Image
                src={imageSrc}
                alt={name}
                fill
                sizes="(max-width: 640px) 230px, 280px"
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          ) : (
            /* ── Futuristic Holographic Cyber Avatar Fallback ── */
            <div className="relative flex flex-col items-center justify-center h-full w-full p-6 text-center select-none overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:14px_14px] opacity-25" />

              {/* Pulsing Core Energy Orb */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00f0ff] bg-gradient-to-tr from-[#7042f8]/70 via-[#1b0849] to-[#00f0ff]/40 shadow-[0_0_25px_rgba(0,240,255,0.7)]"
              >
                <span className="font-mono text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-200">
                  EA
                </span>
                <span className="absolute -inset-1 rounded-full border border-[#00f0ff]/50 animate-ping opacity-35" />
              </motion.div>

              <span className="text-sm font-bold tracking-tight text-white">
                {name}
              </span>
              <span className="text-[11px] font-mono text-[#00f0ff] mt-0.5 tracking-wider">
                Full-Stack Space Developer
              </span>
            </div>
          )}
        </div>

        {/* ── Floating Tech Badges (Surrounding Orbit) ── */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-2 left-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7042f8]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(112,66,248,0.4)] backdrop-blur-md"
        >
          <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[11px] font-mono font-bold text-white">Next.js 15</span>
        </motion.div>

        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-2 right-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-md"
        >
          <Code2 className="w-3.5 h-3.5 text-[#b49bff]" />
          <span className="text-[11px] font-mono font-bold text-white">TypeScript</span>
        </motion.div>

        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7042f8]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(112,66,248,0.4)] backdrop-blur-md"
        >
          <Atom className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[11px] font-mono font-bold text-white">React 19</span>
        </motion.div>

        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00f0ff]/50 bg-[#07011d]/90 shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-md"
        >
          <Database className="w-3.5 h-3.5 text-[#b49bff]" />
          <span className="text-[11px] font-mono font-bold text-white">MongoDB</span>
        </motion.div>
      </div>

      {/* ── Floating Glass HUD Chip 1 (Top-Right) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute -top-3 right-1 sm:right-4 z-30 hidden sm:flex items-center gap-2.5 rounded-xl border border-[#7042f8]/40 bg-[#07011d]/90 px-3.5 py-2 backdrop-blur-md shadow-[0_0_20px_rgba(112,66,248,0.35)]"
      >
        <Sparkles className="h-4 w-4 text-[#00f0ff]" />
        <div className="text-left">
          <p className="text-[9px] font-mono uppercase tracking-wider text-purple-300">Specialization</p>
          <p className="text-xs font-semibold text-white">Next.js • React • TypeScript</p>
        </div>
      </motion.div>

      {/* ── Floating Glass HUD Chip 2 (Bottom-Left) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute -bottom-3 left-1 sm:left-4 z-30 hidden sm:flex items-center gap-2.5 rounded-xl border border-[#00f0ff]/40 bg-[#07011d]/90 px-3.5 py-2 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.3)]"
      >
        <Award className="h-4 w-4 text-[#00f0ff]" />
        <div className="text-left">
          <p className="text-[9px] font-mono uppercase tracking-wider text-cyan-300">Academics</p>
          <p className="text-xs font-semibold text-white">IIT Madras • BS Data Science</p>
        </div>
      </motion.div>
    </div>
  );
}
