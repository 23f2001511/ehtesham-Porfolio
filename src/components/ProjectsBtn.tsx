"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectsBtnProps {
  href?: string;
}

export default function ProjectsBtn({ href = "#projects" }: ProjectsBtnProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative z-10 flex items-center justify-center">
      <Link
        href={href}
        onClick={handleClick}
        className="group relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full p-2 transition-transform duration-300 hover:scale-105 active:scale-95"
        aria-label="View Projects and Work"
      >
        {/* Ambient Pulsing Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7042f8]/40 via-[#a855f7]/30 to-[#00f0ff]/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        {/* Rotating SVG Circular Text */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 h-full w-full pointer-events-none select-none"
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <path
                id="circlePath"
                d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              />
            </defs>
            <text className="text-[9.5px] font-mono font-bold uppercase tracking-[2.5px] fill-purple-200 group-hover:fill-[#00f0ff] transition-colors duration-300">
              <textPath href="#circlePath" startOffset="0%">
                MY PROJECTS • MY WORK • EXPLORE •
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Center Glowing Orbital Core */}
        <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-[#7042f8]/60 bg-gradient-to-br from-[#120738] via-[#0b0424] to-[#040114] shadow-[0_0_25px_rgba(112,66,248,0.5)] group-hover:border-[#00f0ff] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300">
          <ArrowUpRight className="h-6 w-6 text-[#00f0ff] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" />
        </div>
      </Link>
    </div>
  );
}
