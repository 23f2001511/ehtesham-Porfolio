"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, FileText, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { useApiData } from "@/hooks/useApiData";
import type { GithubData, LeetcodeData } from "@/types";

const ROLES = [
  "Full-Stack Developer",
  "Data Science Student",
  "Problem Solver",
  "Builder of Web Products"
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
    const speed = deleting ? 45 : 90;
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) {
          setTimeout(() => setDeleting(true), 1400);
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

  // gradient accent on the second word (surname) of the display name
  const displayName = profile.name || siteConfig.name;
  const nameParts = displayName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? displayName;
  const restName = nameParts.slice(1).join(" ");

  const fade = (delay: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 20 },
    animate: reduced ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const }
  });

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Dissolve into the next section — the full-page SpaceBackground
          (mounted in the root layout) now provides the hero backdrop. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" aria-hidden="true" />
      </div>

      <div className="section-shell relative z-10 grid w-full items-center gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="max-w-2xl">
          <motion.div {...fade(0.05)} className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-60 pulse-dot" aria-hidden="true" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
            </span>
            Available for opportunities
          </motion.div>

          <motion.h1 {...fade(0.12)} className="mt-6 text-balance text-5xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {restName ? (
              <>
                {firstName} <span className="text-gradient">{restName}</span>
              </>
            ) : (
              displayName
            )}
          </motion.h1>

          <motion.p {...fade(0.2)} className="mt-4 h-8 text-xl font-medium text-primary sm:text-2xl">
            <span className="caret">{typed}</span>
          </motion.p>

          <motion.p {...fade(0.28)} className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            {profile.tagline ||
              "I design and build modern web applications — clean interfaces, reliable APIs, and products backed by real data."}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fade(0.36)} className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("projects")}
              className="group btn-spring inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]"
            >
              View projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="btn-spring inline-flex h-12 items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 text-sm font-semibold text-foreground backdrop-blur-md hover:-translate-y-px hover:border-border-strong hover:shadow-[var(--elevation-1)]"
            >
              Contact me
            </button>
            <div className="ml-1 flex items-center gap-1">
              <SocialButton href={`https://github.com/${siteConfig.githubUsername}`} label="GitHub" Icon={Github} />
              <SocialButton href={siteConfig.linkedinUrl} label="LinkedIn" Icon={Linkedin} />
              <SocialButton href={`https://leetcode.com/u/${siteConfig.leetcodeUsername}/`} label="LeetCode" Icon={Code2} />
              <SocialButton href={siteConfig.resumeUrl} label="Resume" Icon={FileText} />
              <SocialButton href={`mailto:${siteConfig.email}`} label="Email" Icon={Mail} />
            </div>
          </motion.div>

          {/* Live stats */}
          <motion.dl {...fade(0.44)} className="mt-14 grid max-w-lg grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass px-4 py-3.5">
                <dd className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                  {stat.value == null ? "—" : stat.value.toLocaleString()}
                </dd>
                <dt className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Spacer column for the 3D visual on large screens */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      {/* scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollTo("about")}
        {...fade(0.6)}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Scroll to about"
      >
        <div className="glass flex h-10 w-6 items-start justify-center rounded-full p-1.5">
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
      className="btn-spring grid h-11 w-11 place-items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-muted-foreground backdrop-blur-md hover:-translate-y-1 hover:border-border-strong hover:text-foreground hover:shadow-[var(--elevation-1)]"
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </Link>
  );
}
