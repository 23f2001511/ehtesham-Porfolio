"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, Flame, Hash, Trophy } from "lucide-react";
import { useMemo } from "react";
import ContributionHeatmap, { type HeatmapDatum } from "@/components/shared/ContributionHeatmap";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/constants";
import { useApiData } from "@/hooks/useApiData";
import { cn, timeAgo } from "@/lib/utils";
import type { LeetcodeData } from "@/types";

/* ── helpers ─────────────────────────────────────────────────────────── */

function levelForCount(count: number) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

const difficultyMeta = [
  { key: "easy" as const, label: "Easy", bar: "bg-emerald-400", text: "text-emerald-300" },
  { key: "medium" as const, label: "Medium", bar: "bg-amber-400", text: "text-amber-300" },
  { key: "hard" as const, label: "Hard", bar: "bg-rose-400", text: "text-rose-300" }
];

/* ── solved ring ─────────────────────────────────────────────────────── */

function SolvedRing({ total, easy, medium, hard }: { total: number; easy: number; medium: number; hard: number }) {
  const radius = 62;
  const circ = 2 * Math.PI * radius;
  // visual target baseline — rough global problem count for the "of N" context
  const target = 3300;
  const fill = Math.min(1, total / target);

  return (
    <div className="relative h-44 w-44 sm:h-48 sm:w-48" role="img" aria-label={`${total} problems solved on LeetCode`}>
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="url(#leetcode-ring)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - fill)}
        />
        <defs>
          <linearGradient id="leetcode-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#4f9cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">{total}</span>
        <span className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">solved</span>
        <span className="mt-1 text-[10px] text-muted-foreground">
          <span className="text-emerald-300">{easy}</span> · <span className="text-amber-300">{medium}</span> ·{" "}
          <span className="text-rose-300">{hard}</span>
        </span>
      </div>
    </div>
  );
}

/* ── main section ────────────────────────────────────────────────────── */

export default function LeetCodeSection() {
  const { data, isLoading, error } = useApiData<LeetcodeData>(
    `/api/leetcode?username=${siteConfig.leetcodeUsername}`
  );

  const profileUrl = `https://leetcode.com/u/${siteConfig.leetcodeUsername}/`;

  const heatmapData = useMemo<HeatmapDatum[]>(() => {
    if (!data?.calendar) return [];
    return Object.entries(data.calendar).map(([epoch, count]) => ({
      date: new Date(Number(epoch) * 1000).toISOString().slice(0, 10),
      level: levelForCount(count),
      count,
      label: count > 0 ? `${count} submission${count === 1 ? "" : "s"}` : "No submissions"
    }));
  }, [data]);

  const derived = useMemo(() => {
    if (!data?.calendar) return null;
    const entries = Object.entries(data.calendar)
      .map(([epoch, count]) => ({ epoch: Number(epoch), count }))
      .sort((a, b) => a.epoch - b.epoch);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yearAgo = new Date(today);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    const yearAgoEpoch = Math.floor(yearAgo.getTime() / 1000);

    const totalYear = entries
      .filter((e) => e.epoch >= yearAgoEpoch)
      .reduce((sum, e) => sum + e.count, 0);
    const activeDays = entries.filter((e) => e.count > 0).length;

    const days = new Set(entries.map((e) => e.epoch));
    const DAY = 86400;
    let anchor = Math.floor(today.getTime() / 1000);
    if (!days.has(anchor)) anchor -= DAY;
    let streak = 0;
    let guard = 0;
    while (days.has(anchor) && guard < 5000) {
      streak += 1;
      anchor -= DAY;
      guard += 1;
    }

    return { totalYear, activeDays, streak };
  }, [data]);

  const maxLang = useMemo(
    () => data?.languages.reduce((max, l) => Math.max(max, l.solved), 0) || 1,
    [data]
  );

  return (
    <section id="leetcode" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="LeetCode"
          title="Problem solving, measured in submissions"
          description="Live LeetCode analytics pulled from the public GraphQL API — solved counts, submission calendar, languages, ranking, and recent accepted problems."
        />

        {isLoading ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
            <Skeleton className="h-72 lg:col-span-2" />
            <Skeleton className="h-72 lg:col-span-2" />
          </div>
        ) : error || !data ? (
          <div className="mt-12">
            <EmptyState
              title="LeetCode data is unavailable right now"
              description={error || "The LeetCode API did not respond. You can still view the profile directly."}
            />
            <div className="mt-4 text-center">
              <Link
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                View on LeetCode
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6">
            {/* Profile card + solved breakdown */}
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal>
                <div className="panel card-lift h-full p-6 sm:p-7">
                  <div className="flex flex-wrap items-start gap-5">
                    {data.avatar ? (
                      <Image
                        src={data.avatar}
                        alt={`${data.username} avatar`}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-2xl border border-border"
                        unoptimized
                      />
                    ) : (
                      <div className="grid h-20 w-20 place-items-center rounded-2xl border border-border bg-surface text-xl font-bold text-foreground">
                        {data.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {data.realName && data.realName !== data.username ? data.realName : siteConfig.name}
                      </h3>
                      <Link
                        href={profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        @{data.username}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>

                      {derived ? (
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Flame className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                            {derived.streak} day streak
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Hash className="h-3.5 w-3.5" aria-hidden="true" />
                            {derived.activeDays} active days
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
                    <div className="rounded-lg border border-border bg-surface/60 px-3.5 py-3">
                      <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                        {data.ranking ? `#${data.ranking.toLocaleString()}` : "—"}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                        <Trophy className="h-3 w-3" aria-hidden="true" />
                        <span className="text-[11px] uppercase tracking-wide">Global ranking</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-surface/60 px-3.5 py-3">
                      <p className="text-xl font-bold tracking-tight text-foreground">
                        {data.contest ? data.contest.rating.toLocaleString() : "—"}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                        <Award className="h-3 w-3" aria-hidden="true" />
                        <span className="text-[11px] uppercase tracking-wide">Contest</span>
                      </div>
                    </div>
                  </div>

                  {data.contest ? (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Contests attended: {data.contest.attended}
                      {data.contest.globalRanking != null
                        ? ` · contest rank #${data.contest.globalRanking.toLocaleString()}`
                        : ""}
                      {data.contest.topPercentage != null
                        ? ` · top ${data.contest.topPercentage}%`
                        : ""}
                    </p>
                  ) : (
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground/40" aria-hidden="true" />
                      No rated contest history yet — ranking shown is the overall global ranking.
                    </p>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="panel grid h-full grid-cols-1 content-center items-center gap-6 p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-7">
                  <div className="flex justify-center sm:justify-start">
                    <SolvedRing
                      total={data.solved.all}
                      easy={data.solved.easy}
                      medium={data.solved.medium}
                      hard={data.solved.hard}
                    />
                  </div>
                  <div className="w-full">
                    {/* instantly-scannable difficulty counts */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {difficultyMeta.map((meta) => (
                        <div
                          key={meta.key}
                          className="rounded-lg border border-border bg-surface/50 px-3.5 py-3 text-center"
                        >
                          <p className={cn("text-2xl font-bold tabular-nums tracking-tight", meta.text)}>
                            {data.solved[meta.key]}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                            {meta.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 space-y-4">
                    {difficultyMeta.map((meta) => {
                      const count = data.solved[meta.key];
                      const subs = data.submissions[meta.key];
                      const width = data.solved.all > 0 ? Math.round((count / data.solved.all) * 100) : 0;
                      return (
                        <div key={meta.key}>
                          <div className="flex items-baseline justify-between">
                            <span className={cn("text-xs font-semibold", meta.text)}>{meta.label}</span>
                            <span className="text-xs tabular-nums text-muted-foreground">
                              <span className="font-bold text-foreground">{count}</span> / {subs}{" "}
                              submissions
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn("h-full rounded-full", meta.bar)}
                              style={{ width: `${Math.max(count > 0 ? 3 : 0, width)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Activity calendar */}
            <Reveal>
              <div className="panel p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Submission activity</h3>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {derived
                      ? `${derived.totalYear.toLocaleString()} submissions in the last year · ${derived.activeDays} active days · ${derived.streak} day streak`
                      : "Daily submission activity from the LeetCode calendar"}
                  </p>
                  </div>
                  <Link
                    href={profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Source
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
                {heatmapData.length ? (
                  <ContributionHeatmap data={heatmapData} variant="leetcode" className="mt-6" />
                ) : (
                  <EmptyState
                    className="mt-6"
                    title="No submission calendar available"
                    description="LeetCode did not return submission activity for this account right now."
                  />
                )}
              </div>
            </Reveal>

            {/* Languages + recent submissions + badges */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="panel h-full p-6 sm:p-7">
                  <h3 className="text-sm font-semibold text-foreground">Languages</h3>
                  <p className="mt-1 text-xs text-muted-foreground">By problems solved</p>
                  <div className="mt-5 space-y-4">
                    {data.languages.length ? (
                      data.languages.map((lang) => {
                        const percent = Math.round((lang.solved / maxLang) * 100);
                        return (
                          <div key={lang.name}>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-foreground">{lang.name}</span>
                              <span className="text-muted-foreground">
                                {lang.solved} {lang.solved === 1 ? "problem" : "problems"}
                              </span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                                style={{ width: `${Math.max(6, percent)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <EmptyState
                        className="min-h-24"
                        title="No language breakdown"
                        description="LeetCode did not return language statistics."
                      />
                    )}
                  </div>

                  {data.badges.length ? (
                    <div className="mt-6 border-t border-border pt-5">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Badges
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {data.badges.map((badge) => (
                          <span
                            key={badge.name}
                            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground"
                          >
                            {badge.icon ? (
                              // eslint-disable-next-line @next/next/no-img-element -- external badge icon from LeetCode CDN
                              <img src={badge.icon} alt="" width={16} height={16} loading="lazy" className="h-4 w-4" />
                            ) : (
                              <Award className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                            )}
                            {badge.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="panel h-full p-6 sm:p-7">
                  <h3 className="text-sm font-semibold text-foreground">Recent accepted submissions</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Latest problems solved on LeetCode</p>
                  {data.recent.length ? (
                    <ul className="mt-4 divide-y divide-border">
                      {data.recent.slice(0, 10).map((item) => (
                        <li
                          key={`${item.slug}-${item.timestamp}`}
                          className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm"
                        >
                          <Link
                            href={`https://leetcode.com/problems/${item.slug}/`}
                            target="_blank"
                            rel="noreferrer"
                            className="min-w-0 truncate font-medium text-foreground hover:text-primary"
                          >
                            {item.title}
                          </Link>
                          <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                            {timeAgo(item.timestamp * 1000)}
                            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      className="mt-4"
                      title="No recent submissions"
                      description="LeetCode did not return recent accepted submissions."
                    />
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
