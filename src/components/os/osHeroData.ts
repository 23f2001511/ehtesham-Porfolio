"use client";

import { useMemo } from "react";
import type { Project, SocialLink } from "@/types";
import { usePortfolioData } from "./PortfolioDataContext";
import { useGithubData, useLeetcodeData } from "./osData";

// Re-export the shared live-data types so the hero has a single import surface.
export type { GithubData, LeetcodeData } from "./osData";

export type HeroGithubSummary = {
  repos: number;
  stars: number;
  forks: number;
  languages: Array<{ name: string; share: number }>;
};

export type HeroLeetcodeSummary = {
  solved: { all: number; easy: number; medium: number; hard: number };
  ranking: number | null;
};

const LANGUAGES_PALETTE = [
  "#22d3ee",
  "#34d399",
  "#a78bfa",
  "#fbbf24",
  "#fb7185",
  "#38bdf8",
  "#f472b6",
  "#94a3b8"
];

export function useHeroData(): {
  projects: Project[];
  loaded: boolean;
  projectsCount: number;
  featuredProjects: Project[];
  github: HeroGithubSummary | null;
  githubLoading: boolean;
  leetcode: HeroLeetcodeSummary | null;
  leetcodeLoading: boolean;
} {
  const { projects, loaded } = usePortfolioData();
  const { data: githubData, loading: githubLoading } = useGithubData();
  const { data: leetcodeData, loading: leetcodeLoading } = useLeetcodeData();

  const githubSummary = useMemo<HeroGithubSummary | null>(() => {
    if (!githubData) {
      return null;
    }
    const totalLanguages = githubData.languages.reduce((sum, entry) => sum + entry.count, 0);
    const languages = githubData.languages.slice(0, 6).map((entry) => ({
      name: entry.name,
      share: totalLanguages > 0 ? entry.count / totalLanguages : 0
    }));
    return {
      repos: githubData.profile.publicRepos,
      stars: githubData.totals.stars,
      forks: githubData.totals.forks,
      languages
    };
  }, [githubData]);

  const leetcodeSummary = useMemo<HeroLeetcodeSummary | null>(() => {
    if (!leetcodeData) {
      return null;
    }
    return {
      solved: leetcodeData.solved,
      ranking: leetcodeData.ranking
    };
  }, [leetcodeData]);

  return {
    projects,
    loaded,
    projectsCount: projects.length,
    featuredProjects: projects.filter((project) => project.featured).slice(0, 3),
    github: githubSummary,
    githubLoading,
    leetcode: leetcodeSummary,
    leetcodeLoading
  };
}

export const LANGUAGE_COLORS = LANGUAGES_PALETTE;

export function findSocialLink(socials: SocialLink[] | undefined, label: string) {
  return (socials ?? []).find((link) => link.label.toLowerCase() === label);
}
