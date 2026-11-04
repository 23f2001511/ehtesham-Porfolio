"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, FileText, Github, Linkedin, Mail, Sparkles, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { useApiData } from "@/hooks/useApiData";
import type { GithubData, LeetcodeData } from "@/types";

// Dynamic load of the 3D WebGL scene (client-only)
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full border border-primary/20 bg-primary/5" />
    </div>
  ),
});

const ROLES = [
  "Full-Stack Developer",
  "IIT Madras • BS Data Science",
  "Problem Solver & Architect",
  "Next.js & TypeScript Specialist"
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
    const speed = deleting ? 40 : 85;
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) {
          setTimeout(() => setDeleting(true), 1500);
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
  const reduced = useReducedMotion();
  const typed = useTypewriter(ROLES);
  const { data: github } = useApiData<GithubData>(`/api/github?username=${siteConfig.githubUsername}`);
  const { data: leetcode } = useApiData<LeetcodeData>(`/api/leetcode?username=${siteConfig.leetcodeUsername}`);

  const stats = [
    {
      label: "Repositories",
      value: github ? github.profile.publicRepos : null
    },
    {
      label: "Problems solved",
      value: leetcode ? leetcode.solved.all : null
    },
    {
      label: "Stars earned",
      value: github ? github.totals.stars : null
    }
  ];

  const displayName = profile.name || siteConfig.name;
  const nameParts = displayName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? displayName;
  const restName = nameParts.slice(1).join(" ");

  const fade = (delay: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 22 },
    animate: reduced ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const }
  });

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" aria-hidden="true" />
      </div>

      <div className="section-shell relative z-10 grid w-full items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        {/* Left Column: Text & CTAs */}
        <div className="max-w-2xl">
          <motion.div {...fade(0.05)} className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 pulse-dot" aria-hidden="true" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            </span>
            <span className="font-mono text-primary">status:</span> Available for opportunities
          </motion.div>

          <motion.h1 {...fade(0.12)} className="font-display mt-6 text-balance text-5xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            {restName ? (
              <>
                {firstName} <span className="text-gradient-flow">{restName}</span>
              </>
            ) : (
              <span className="text-gradient-flow">{displayName}</span>
            )}
          </motion.h1>

          <motion.p {...fade(0.2)} className="mt-4 h-8 font-mono text-xl font-medium text-primary sm:text-2xl">
            <span className="caret">{typed}</span>
          </motion.p>

          <motion.p {...fade(0.28)} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.tagline ||
              "I build scalable full-stack web applications, interactive 3D experiences, and data-driven systems with clean architecture."}
          </motion.p>

          <motion.div {...fade(0.36)} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("projects")}
              className="group btn-spring inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[#2dd4bf] px-6 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
            >
              View My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="btn-spring inline-flex h-12 items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 text-sm font-semibold text-foreground backdrop-blur-md hover:-translate-y-px hover:border-primary/50 hover:shadow-[var(--elevation-1)]"
            >
              Say Hello
            </button>
            <div className="ml-1 flex items-center gap-1.5">
              <SocialButton href={`https://github.com/${siteConfig.githubUsername}`} label="GitHub" Icon={Github} />
              <SocialButton href={siteConfig.linkedinUrl} label="LinkedIn" Icon={Linkedin} />
              <SocialButton href={`https://leetcode.com/u/${siteConfig.leetcodeUsername}/`} label="LeetCode" Icon={Code2} />
              <SocialButton href={siteConfig.resumeUrl} label="Resume" Icon={FileText} />
              <SocialButton href={`mailto:${siteConfig.email}`} label="Email" Icon={Mail} />
            </div>
          </motion.div>

          <motion.dl {...fade(0.44)} className="mt-12 grid max-w-lg grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-xl px-4 py-3 border border-border/50">
                <dd className="font-display text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl text-gradient">
                  {stat.value == null ? "—" : stat.value.toLocaleString()}
                </dd>
                <dt className="mt-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right Column: 3D Visual Centerpiece */}
        <motion.div
          {...fade(0.25)}
          className="relative mx-auto flex aspect-square w-full max-w-[32rem] items-center justify-center lg:max-w-none lg:h-[520px]"
        >
          {/* Subtle glowing backdrop halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent blur-3xl" aria-hidden="true" />

          {/* Floating Glass HUD Chip 1 (Top Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -top-2 right-4 z-20 hidden sm:flex items-center gap-2 rounded-xl border border-primary/20 bg-surface/70 px-3.5 py-2 backdrop-blur-md shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Specialization</p>
              <p className="text-xs font-semibold text-foreground">Next.js • React • TypeScript</p>
            </div>
          </motion.div>

          {/* Floating Glass HUD Chip 2 (Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-6 left-2 z-20 hidden sm:flex items-center gap-2 rounded-xl border border-primary/20 bg-surface/70 px-3.5 py-2 backdrop-blur-md shadow-lg"
          >
            <Award className="h-4 w-4 text-secondary" />
            <div className="text-left">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Academics</p>
              <p className="text-xs font-semibold text-foreground">IIT Madras • BS Data Science</p>
            </div>
          </motion.div>

          {/* 3D WebGL Canvas */}
          <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border/40 bg-surface/20 backdrop-blur-[2px]">
            <HeroScene />
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Cue */}
      <motion.button
        type="button"
        onClick={() => scrollTo("about")}
        {...fade(0.6)}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Scroll to about section"
      >
        <div className="glass flex h-10 w-6 items-start justify-center rounded-full p-1.5 border border-primary/20">
          <div className="h-2 w-1 animate-bounce rounded-full bg-primary" aria-hidden="true" />
        </div>
      </motion.button>
    </section>
  );
}

function SocialButton({ href, label, Icon }: { href: string; label: string; Icon: typeof Github }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      className="btn-spring grid h-10 w-10 place-items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-muted-foreground backdrop-blur-md hover:-translate-y-1 hover:border-primary/50 hover:text-primary hover:shadow-[var(--elevation-1)]"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
