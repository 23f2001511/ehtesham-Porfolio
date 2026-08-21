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

          <motion.h1 {...fade(0.12)} className="font-display mt-6 text-balance text-5xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
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
                <dd className="font-display text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                  {stat.value == null ? "—" : stat.value.toLocaleString()}
                </dd>
                <dt className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Portrait / floating-planet avatar on large screens */}
        <div className="hidden lg:block">
          <HeroPortrait avatarUrl={profile.avatarUrl} name={displayName} reduced={Boolean(reduced)} />
        </div>
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

/**
 * Hero visual. When the admin has uploaded a photo it renders as a circular
 * portrait framed like a planet — soft glow, a living gradient rim, and a
 * tilted orbital ring with a drifting satellite. With no photo, the same
 * footprint shows an animated "floating planet" (banded gradient sphere with a
 * Saturn ring and an orbiting moon) so the layout never collapses. All motion
 * is disabled under prefers-reduced-motion.
 */
function HeroPortrait({
  avatarUrl,
  name,
  reduced
}: {
  avatarUrl?: string;
  name: string;
  reduced: boolean;
}) {
  const float = reduced
    ? {}
    : {
        animate: { y: [0, -14, 0] },
        transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const }
      };

  const spin = (duration: number) =>
    reduced
      ? {}
      : {
          animate: { rotateZ: 360 },
          transition: { duration, repeat: Infinity, ease: "linear" as const }
        };

  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[26rem] place-items-center">
      {/* ambient nebula glow */}
      <div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/35 via-accent/15 to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* wide tilted orbital ring + satellite */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        style={{ rotateX: 66, transformPerspective: 900 }}
        {...spin(24)}
        aria-hidden="true"
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_2px_var(--accent)]" />
      </motion.div>

      {/* inner tilted orbital ring, opposite tilt for depth */}
      <motion.div
        className="absolute inset-[14%] rounded-full border border-secondary/20"
        style={{ rotateX: 72, rotateZ: 30, transformPerspective: 900 }}
        {...spin(16)}
        aria-hidden="true"
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_12px_2px_var(--secondary)]" />
      </motion.div>

      {/* the body: photo planet or generated planet, gently floating */}
      <motion.div className="relative h-[68%] w-[68%]" {...float}>
        {avatarUrl ? (
          <div className="gradient-border relative h-full w-full overflow-hidden rounded-full shadow-[0_24px_70px_-20px_rgba(139,92,246,0.6)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={`${name} — portrait`}
              className="h-full w-full rounded-full object-cover"
            />
            {/* subtle planet-shading over the photo for cohesion */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: "inset -16px -20px 48px rgba(4,6,16,0.5)" }}
              aria-hidden="true"
            />
          </div>
        ) : (
          <PlanetOrb />
        )}
      </motion.div>
    </div>
  );
}

/** Purely decorative CSS planet used when no profile photo is set. */
function PlanetOrb() {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <div
        className="absolute inset-0 rounded-full shadow-[0_24px_70px_-18px_rgba(139,92,246,0.6)]"
        style={{
          background:
            "radial-gradient(125% 125% at 30% 24%, #b7a6ff 0%, #8b5cf6 32%, #5b21b6 60%, #22d3ee 128%)"
        }}
      >
        {/* banded surface texture */}
        <div
          className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 2px, transparent 6px, transparent 22px)"
          }}
        />
        {/* terminator shadow for spherical depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "inset -22px -26px 60px rgba(4,6,16,0.6), inset 14px 16px 40px rgba(255,255,255,0.22)" }}
        />
        {/* specular highlight */}
        <div className="absolute left-[22%] top-[16%] h-[26%] w-[26%] rounded-full bg-white/50 blur-2xl" />
      </div>

      {/* Saturn ring */}
      <div
        className="absolute left-1/2 top-1/2 h-[52%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-white/25"
        style={{ transform: "translate(-50%, -50%) rotate(-20deg)", boxShadow: "0 0 24px rgba(34,211,238,0.25)" }}
      />
    </div>
  );
}
