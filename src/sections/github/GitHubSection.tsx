"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  GitFork,
  MapPin,
  Search,
  Star,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import ContributionHeatmap, { type HeatmapDatum } from "@/components/shared/ContributionHeatmap";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/constants";
import { useApiData } from "@/hooks/useApiData";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import type { GithubData, GithubRepo } from "@/types";

type SortMode = "recent" | "stars" | "forks";

const eventLabels: Record<string, string> = {
  PushEvent: "Pushed to",
  CreateEvent: "Created",
  DeleteEvent: "Deleted a branch in",
  ForkEvent: "Forked",
  WatchEvent: "Starred",
  IssuesEvent: "Opened an issue in",
  IssueCommentEvent: "Commented in",
  PullRequestEvent: "Opened a pull request in",
  PullRequestReviewEvent: "Reviewed a pull request in",
  ReleaseEvent: "Published a release in",
  PublicEvent: "Open-sourced"
};

function humanizeEvent(type: string) {
  if (eventLabels[type]) return eventLabels[type];
  const spaced = type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
  return `${spaced} in`;
}

export default function GitHubSection() {
  const { data, isLoading, error } = useApiData<GithubData>(
    `/api/github?username=${siteConfig.githubUsername}`
  );
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("recent");

  const heatmapData = useMemo<HeatmapDatum[]>(() => {
    if (!data?.contributions) return [];
    return data.contributions.map((day) => ({
      date: day.date,
      level: Math.max(0, Math.min(4, day.level)),
      count: day.count >= 0 ? day.count : null,
      label: day.level > 0 ? "Active" : "No activity"
    }));
  }, [data]);

  const languages = useMemo(() => {
    if (!data) return [];
    const total = data.languages.reduce((sum, lang) => sum + lang.count, 0) || 1;
    return data.languages.slice(0, 6).map((lang) => ({
      ...lang,
      percent: Math.round((lang.count / total) * 100)
    }));
  }, [data]);

  const repoLanguages = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Set(data.repos.map((repo) => repo.language).filter((lang): lang is string => Boolean(lang)))
    ).sort();
  }, [data]);

  const filteredRepos = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLowerCase();
    const filtered = data.repos.filter((repo) => {
      if (language && repo.language !== language) return false;
      if (!term) return true;
      return (
        repo.name.toLowerCase().includes(term) ||
        (repo.description ?? "").toLowerCase().includes(term) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(term))
      );
    });
    return [...filtered].sort((a, b) => {
      if (sort === "stars") return b.stars - a.stars;
      if (sort === "forks") return b.forks - a.forks;
      return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
    });
  }, [data, query, language, sort]);

  const numericContributionTotal = useMemo(() => {
    if (!data?.contributions?.length) return null;
    return data.contributions.every((day) => day.count >= 0)
      ? data.contributions.reduce((sum, day) => sum + day.count, 0)
      : null;
  }, [data]);

  return (
    <section id="github" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="GitHub"
          title="Code, in public"
          description="Live repository, language, and activity data pulled straight from the GitHub API — no screenshots, no static numbers."
        />

        {isLoading ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-80 lg:col-span-2" />
          </div>
        ) : error || !data ? (
          <div className="mt-12">
            <EmptyState
              title="GitHub data is unavailable right now"
              description={error || "The GitHub API did not respond. You can still browse the profile directly."}
            />
            <div className="mt-4 text-center">
              <Link
                href={`https://github.com/${siteConfig.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                View on GitHub
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6">
            {/* Profile + languages */}
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal>
                <div className="panel card-lift h-full p-6 sm:p-7">
                  <div className="flex flex-wrap items-start gap-5">
                    <Image
                      src={data.profile.avatarUrl}
                      alt={`${data.profile.login} avatar`}
                      width={88}
                      height={88}
                      className="h-20 w-20 rounded-2xl border border-border sm:h-[88px] sm:w-[88px]"
                      unoptimized
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {data.profile.name || data.profile.login}
                      </h3>
                      <Link
                        href={data.profile.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        @{data.profile.login}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                      {data.profile.bio ? (
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{data.profile.bio}</p>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        {data.profile.location ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {data.profile.location}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                          Joined {formatDate(data.profile.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4">
                    <MiniStat icon={Users} label="Followers" value={data.profile.followers} />
                    <MiniStat icon={Users} label="Following" value={data.profile.following} />
                    <MiniStat icon={BookOpen} label="Repos" value={data.profile.publicRepos} />
                    <MiniStat icon={Star} label="Stars" value={data.totals.stars} />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="panel h-full p-6 sm:p-7">
                  <h3 className="text-sm font-semibold text-foreground">Top languages</h3>
                  <p className="mt-1 text-xs text-muted-foreground">By repository count</p>
                  <div className="mt-5 space-y-4">
                    {languages.map((lang) => (
                      <div key={lang.name}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{lang.name}</span>
                          <span className="text-muted-foreground">
                            {lang.count} {lang.count === 1 ? "repo" : "repos"} · {lang.percent}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${Math.max(4, lang.percent)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Contribution heatmap */}
            <Reveal>
              <div className="panel p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Contribution activity</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {numericContributionTotal != null
                        ? `${numericContributionTotal.toLocaleString()} contributions in the last year`
                        : "Daily activity intensity from GitHub's public profile — exact per-day counts are not publicly exposed"}
                    </p>
                  </div>
                  <Link
                    href={data.profile.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Source
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
                {heatmapData.length ? (
                  <ContributionHeatmap data={heatmapData} variant="github" className="mt-6" />
                ) : (
                  <EmptyState
                    className="mt-6"
                    title="No contribution calendar available"
                    description="GitHub did not return contribution activity for this account right now."
                  />
                )}
              </div>
            </Reveal>

            {/* Repository explorer */}
            <Reveal>
              <div className="panel p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Repository explorer</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {data.repos.length} most recently updated public repositories
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search name, description, topic…"
                      aria-label="Search repositories"
                      className="h-10 w-full rounded-md border border-border bg-input pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <FilterChip active={language === null} onClick={() => setLanguage(null)}>
                    All
                  </FilterChip>
                  {repoLanguages.map((lang) => (
                    <FilterChip
                      key={lang}
                      active={language === lang}
                      onClick={() => setLanguage((current) => (current === lang ? null : lang))}
                    >
                      {lang}
                    </FilterChip>
                  ))}
                  <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-surface p-1">
                    {(
                      [
                        ["recent", "Recent"],
                        ["stars", "Stars"],
                        ["forks", "Forks"]
                      ] as [SortMode, string][]
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSort(mode)}
                        aria-pressed={sort === mode}
                        className={cn(
                          "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                          sort === mode
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredRepos.length ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {filteredRepos.map((repo) => (
                      <RepoCard key={repo.name} repo={repo} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    className="mt-6"
                    title="No repositories match"
                    description="Try clearing the search or picking a different language filter."
                  />
                )}
              </div>
            </Reveal>

            {/* Recent activity */}
            <Reveal>
              <div className="panel p-6 sm:p-7">
                <h3 className="text-sm font-semibold text-foreground">Recent public activity</h3>
                {data.activity.length ? (
                  <ul className="mt-4 divide-y divide-border">
                    {data.activity.slice(0, 8).map((event, index) => (
                      <li
                        key={`${event.repo}-${event.createdAt}-${index}`}
                        className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm"
                      >
                        <span className="font-medium text-foreground">{humanizeEvent(event.type)}</span>
                        <Link
                          href={event.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {event.repo}
                        </Link>
                        {typeof event.commits === "number" && event.commits > 0 ? (
                          <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground">
                            +{event.commits} {event.commits === 1 ? "commit" : "commits"}
                          </span>
                        ) : null}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {timeAgo(event.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    className="mt-4"
                    title="No recent public events"
                    description="GitHub's public events feed is quiet for this account right now."
                  />
                )}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 px-3.5 py-3">
      <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">{value.toLocaleString()}</p>
      <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" aria-hidden="true" />
        <span className="text-[11px] uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary/60 bg-primary/15 text-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <article className="panel-ghost card-lift flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 break-words text-sm font-semibold text-foreground hover:text-primary"
        >
          {repo.name}
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${repo.name} on GitHub`}
            className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          {repo.homepage ? (
            <Link
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-secondary/50 hover:text-foreground"
            >
              Live
            </Link>
          ) : null}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
        {repo.description || "No description provided."}
      </p>

      {repo.topics.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {topic}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
            {repo.language}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          {repo.stars}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
          {repo.forks}
        </span>
        {repo.updatedAt ? (
          <span className="ml-auto">Updated {timeAgo(repo.updatedAt)}</span>
        ) : null}
      </div>
    </article>
  );
}
