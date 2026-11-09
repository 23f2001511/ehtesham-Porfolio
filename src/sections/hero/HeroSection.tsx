"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Code2,
  Download,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { useApiData } from "@/hooks/useApiData";
import type { GithubData, LeetcodeData } from "@/types";
import ProjectsBtn from "@/components/ProjectsBtn";
import BlackHoleVortex from "@/components/three/BlackHoleVortex";
import HeroAvatar from "@/components/HeroAvatar";
import { slideInFromLeft, slideInFromTop } from "@/lib/motion";

const ROLES = [
  "Full-Stack Developer",
  "IIT Madras • BS Data Science",
  "Next.js 15 & TypeScript Specialist",
  "Scalable Systems Architect"
];

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setText(words[0]);
      return;
    }
    const word = words[index % words.length];
    const speed = deleting ? 30 : 65;
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, reduced]);

  return text;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HeroSection() {
  const { profile } = usePublicProfile();
  const typed = useTypewriter(ROLES);
  const { data: github } = useApiData<GithubData>(`/api/github?username=${siteConfig.githubUsername}`);
  const { data: leetcode } = useApiData<LeetcodeData>(`/api/leetcode?username=${siteConfig.leetcodeUsername}`);

  const stats = [
    {
      label: "Repositories",
      value: github ? github.profile.publicRepos : "8+"
    },
    {
      label: "LeetCode Solved",
      value: leetcode ? leetcode.solved.all : 103
    },
    {
      label: "GitHub Stars",
      value: github ? github.totals.stars : "5+"
    }
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-[95vh] items-center justify-center overflow-hidden pt-24 pb-14"
    >
      {/* ── Top Celestial Accretion Black Hole Video (Sanidhyy Space Signature) ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="rotate-180 absolute -top-[340px] left-0 w-full h-full object-cover -z-20 pointer-events-none opacity-80"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>
      <BlackHoleVortex />

      {/* ── Ambient Radial Cosmic Aura ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#7042f8]/12 blur-[140px]" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#030014] to-transparent" />
      </div>

      <div className="section-shell relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ── Left Column: Space & Modern Merged Typography ── */}
        <div className="flex flex-col items-start max-w-2xl">
          {/* Sanidhyy Space Signature Welcome Badge */}
          <motion.div
            variants={slideInFromTop(0.1)}
            initial="hidden"
            animate="visible"
            className="welcome-box mb-6 bg-[#030014]/90 border border-[#7042f8]/60 shadow-[0_0_20px_rgba(112,66,248,0.35)]"
          >
            <Sparkles className="w-4 h-4 text-[#00f0ff]" />
            <span className="welcome-text font-bold">Fullstack Developer Portfolio</span>
          </motion.div>

          {/* Sanidhyy Space Signature Hero Headline */}
          <motion.h1
            variants={slideInFromLeft(0.25)}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]"
          >
            Providing{" "}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-400 to-cyan-400 font-extrabold">
              the best project experience
            </span>
          </motion.h1>

          {/* Dynamic Typewriter Role Pill */}
          <motion.div
            variants={slideInFromLeft(0.4)}
            initial="hidden"
            animate="visible"
            className="mt-5 flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[#7042f8]/40 bg-[#07011d]/90 backdrop-blur-md shadow-[0_0_15px_rgba(42,14,97,0.4)]"
          >
            <span className="text-sm font-mono font-bold text-[#00f0ff]">&gt;</span>
            <span className="font-mono text-sm sm:text-lg font-semibold text-purple-200">
              {typed}
            </span>
            <span className="inline-block w-2 h-4 bg-[#00f0ff] animate-pulse" />
          </motion.div>

          {/* Descriptive Intro Bio */}
          <motion.p
            variants={slideInFromLeft(0.55)}
            initial="hidden"
            animate="visible"
            className="mt-6 text-sm sm:text-base leading-relaxed text-gray-200 max-w-xl"
          >
            I&apos;m <span className="text-white font-bold">{siteConfig.name}</span>, a Full Stack Developer &amp; Data Science scholar at{" "}
            <span className="text-[#00f0ff] font-semibold">IIT Madras</span>. I engineer scalable web platforms, high-throughput APIs, and motion-rich interactive experiences with Next.js 15, TypeScript, and MongoDB.
          </motion.p>

          {/* ── Signature Action Row: Rotating ProjectsBtn + Secondary CTAs ── */}
          <motion.div
            variants={slideInFromLeft(0.7)}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            {/* Sanidhyy Modern Signature Rotating Projects Button */}
            <ProjectsBtn href="#projects" />

            <div className="flex flex-col gap-3">
              <a
                href={profile.resumeUrl || siteConfig.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="button-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#00f0ff]" />
                <span>Resume / CV</span>
              </a>

              {/* Social Matrix */}
              <div className="flex items-center gap-2">
                <SocialLink href={`https://github.com/${siteConfig.githubUsername}`} label="GitHub" Icon={Github} />
                <SocialLink href={siteConfig.linkedinUrl} label="LinkedIn" Icon={Linkedin} />
                <SocialLink href={`https://leetcode.com/u/${siteConfig.leetcodeUsername}/`} label="LeetCode" Icon={Code2} />
                <SocialLink href={`mailto:${siteConfig.email}`} label="Email" Icon={Mail} />
              </div>
            </div>
          </motion.div>

          {/* ── Metric Badges ── */}
          <motion.div
            variants={slideInFromLeft(0.85)}
            initial="hidden"
            animate="visible"
            className="mt-10 grid grid-cols-3 gap-3 w-full max-w-lg"
          >
            {stats.map((item) => (
              <div
                key={item.label}
                className="space-card px-4 py-3 text-center border-[#7042f8]/40 bg-[#07011d]/85"
              >
                <div className="text-xl sm:text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">
                  {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-300 mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right Column: Smart Avatar / 3D Hologram Fallback ── */}
        <motion.div
          variants={slideInFromTop(0.35)}
          initial="hidden"
          animate="visible"
          className="relative w-full"
        >
          <HeroAvatar
            imageSrc={profile.avatarUrl || "/profile.png"}
            name={profile.name || siteConfig.name}
            leetcodeSolved={leetcode?.solved?.all || 103}
          />
        </motion.div>
      </div>

      {/* Downward indicator */}
      <motion.button
        type="button"
        onClick={() => scrollTo("about")}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-300 hover:text-[#00f0ff] transition-colors cursor-pointer select-none"
        aria-label="Scroll down"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">SCROLL</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#00f0ff]" />
      </motion.button>
    </section>
  );
}

function SocialLink({ href, label, Icon }: { href: string; label: string; Icon: typeof Github }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-[#7042f8]/40 bg-[#07011d]/80 text-gray-300 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
