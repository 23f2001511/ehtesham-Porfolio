"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy, FolderKanban, Github, Linkedin, Mail } from "lucide-react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { useOS } from "./OSContext";
import { findSocialLink, LANGUAGE_COLORS, useHeroData } from "./osHeroData";

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="os-hero__stat">
      <span className="os-hero__stat-value">{value}</span>
      <span className="os-hero__stat-label">{label}</span>
    </span>
  );
}

export default function HeroOverlay({ onDismiss }: { onDismiss: () => void }) {
  const { openApp } = useOS();
  const { profile } = usePublicProfile();
  const reducedMotion = usePrefersReducedMotion();
  const { github, githubLoading, leetcode, leetcodeLoading, projectsCount, loaded } = useHeroData();
  const [copied, setCopied] = useState(false);

  const name = profile.name;
  const role = profile.role || "Full Stack Developer";
  const intro = profile.aboutBio || profile.tagline || "";
  const email = profile.email || "";
  const linkedin = findSocialLink(profile.socials, "linkedin");
  const githubUrl = profile.githubUsername ? `https://github.com/${profile.githubUsername}` : "";
  const leetcodeUrl = profile.leetcodeUsername
    ? `https://leetcode.com/u/${encodeURIComponent(profile.leetcodeUsername)}/`
    : "";

  const copyEmail = async () => {
    if (!email) {
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const difficultyShares = useMemo(() => {
    if (!leetcode) {
      return null;
    }
    const total = leetcode.solved.all || 0;
    if (total <= 0) {
      return null;
    }
    return [
      { key: "easy", label: "Easy", value: leetcode.solved.easy, color: "var(--heat-4)", share: leetcode.solved.easy / total },
      { key: "medium", label: "Medium", value: leetcode.solved.medium, color: "#fbbf24", share: leetcode.solved.medium / total },
      { key: "hard", label: "Hard", value: leetcode.solved.hard, color: "#fb7185", share: leetcode.solved.hard / total }
    ];
  }, [leetcode]);

  return (
    <motion.section
      className="os-hero"
      aria-label="Introduction"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="os-hero__panel">
        <p className="os-hero__eyebrow">Developer OS · Workstation online</p>
        <h1 className="os-hero__name">{name}</h1>
        <p className="os-hero__role">{role}</p>
        {intro ? <p className="os-hero__intro">{intro}</p> : null}

        <div className="os-hero__ctas">
          <button
            type="button"
            className="os-btn os-btn--primary os-interactive os-hero__cta"
            onClick={() => openApp("projects")}
          >
            <FolderKanban className="h-4 w-4" aria-hidden="true" />
            Explore my work
          </button>
          <button
            type="button"
            className="os-btn os-btn--ghost os-interactive os-hero__cta"
            onClick={onDismiss}
          >
            Enter desktop
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* real live data strip */}
        <div className="os-hero__widgets">
          {(github || githubLoading) && (
            <button
              type="button"
              className="os-hero__widget os-interactive"
              onClick={() => openApp("github")}
              aria-label="Open GitHub application"
            >
              <span className="os-hero__widget-head">
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                GitHub
              </span>
              {githubLoading && !github ? (
                <span className="os-skeleton-line os-skeleton-line--w60" />
              ) : github ? (
                <>
                  <span className="os-hero__widget-stats">
                    <MiniStat value={String(github.repos)} label="repos" />
                    <MiniStat value={String(github.stars)} label="stars" />
                    <MiniStat value={String(github.forks)} label="forks" />
                  </span>
                  {github.languages.length > 0 && (
                    <span className="os-hero__langbar" aria-hidden="true">
                      {github.languages.map((language, index) => (
                        <span
                          key={language.name}
                          title={`${language.name}`}
                          style={{
                            width: `${Math.max(6, language.share * 100)}%`,
                            background: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]
                          }}
                        />
                      ))}
                    </span>
                  )}
                </>
              ) : null}
            </button>
          )}

          {(leetcode || leetcodeLoading) && (
            <button
              type="button"
              className="os-hero__widget os-interactive"
              onClick={() => openApp("leetcode")}
              aria-label="Open LeetCode application"
            >
              <span className="os-hero__widget-head">
                <span className="os-app-icon os-app-icon--leetcode os-app-icon--sm" aria-hidden="true" />
                LeetCode
              </span>
              {leetcodeLoading && !leetcode ? (
                <span className="os-skeleton-line os-skeleton-line--w60" />
              ) : leetcode ? (
                <>
                  <span className="os-hero__widget-stats">
                    <MiniStat value={String(leetcode.solved.all)} label="solved" />
                    {leetcode.ranking !== null && (
                      <MiniStat value={`#${leetcode.ranking.toLocaleString()}`} label="rank" />
                    )}
                  </span>
                  {difficultyShares && (
                    <span className="os-hero__langbar" aria-hidden="true">
                      {difficultyShares.map((segment) => (
                        <span
                          key={segment.key}
                          title={`${segment.label} ${segment.value}`}
                          style={{ width: `${Math.max(6, segment.share * 100)}%`, background: segment.color }}
                        />
                      ))}
                    </span>
                  )}
                </>
              ) : null}
            </button>
          )}

          <button
            type="button"
            className="os-hero__widget os-interactive"
            onClick={() => openApp("projects")}
            aria-label="Open Projects application"
          >
            <span className="os-hero__widget-head">
              <span className="os-app-icon os-app-icon--projects os-app-icon--sm" aria-hidden="true" />
              Projects
            </span>
            <span className="os-hero__widget-stats">
              {loaded ? (
                <MiniStat value={String(projectsCount)} label={projectsCount === 1 ? "project" : "projects"} />
              ) : (
                <span className="os-skeleton-line os-skeleton-line--w40" />
              )}
            </span>
          </button>
        </div>

        {/* social chips */}
        <div className="os-hero__socials">
          {githubUrl && (
            <a className="os-hero__chip os-interactive" href={githubUrl} target="_blank" rel="noreferrer noopener">
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </a>
          )}
          {linkedin && (
            <a className="os-hero__chip os-interactive" href={linkedin.href} target="_blank" rel="noreferrer noopener">
              <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
              LinkedIn
            </a>
          )}
          {leetcodeUrl && (
            <a className="os-hero__chip os-interactive" href={leetcodeUrl} target="_blank" rel="noreferrer noopener">
              <span className="os-app-icon os-app-icon--leetcode os-app-icon--sm" aria-hidden="true" />
              LeetCode
            </a>
          )}
          {email && (
            <button
              type="button"
              className={cn("os-hero__chip os-interactive", copied && "os-hero__chip--copied")}
              onClick={() => void copyEmail()}
            >
              {copied ? <Copy className="h-3.5 w-3.5" aria-hidden="true" /> : <Mail className="h-3.5 w-3.5" aria-hidden="true" />}
              {copied ? "Email copied" : "Copy email"}
            </button>
          )}
        </div>

        <p className="os-hero__hint">3D nodes, desktop icons, or Ctrl/⌘K to jump anywhere.</p>
      </div>

      <button
        type="button"
        className="os-hero__close os-interactive"
        onClick={onDismiss}
        aria-label="Dismiss intro and enter desktop"
      >
        Enter desktop
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </motion.section>
  );
}
