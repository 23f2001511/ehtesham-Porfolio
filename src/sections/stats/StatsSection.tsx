"use client";

import AnimatedNumber from "@/components/shared/AnimatedNumber";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/constants";
import { useApiData } from "@/hooks/useApiData";
import { useCollection } from "@/hooks/useCollection";
import type { GithubData, LeetcodeData, Skill } from "@/types";

type Stat = {
  label: string;
  value: number | null;
  suffix?: string;
  hint: string;
  loading: boolean;
};

function activeDays(leetcode: LeetcodeData | null): number {
  if (!leetcode?.calendar) return 0;
  return Object.values(leetcode.calendar).filter((count) => count > 0).length;
}

export default function StatsSection() {
  const { data: github, isLoading: githubLoading } = useApiData<GithubData>(
    `/api/github?username=${siteConfig.githubUsername}`
  );
  const { data: leetcode, isLoading: leetcodeLoading } = useApiData<LeetcodeData>(
    `/api/leetcode?username=${siteConfig.leetcodeUsername}`
  );
  const { data: skills } = useCollection<Skill>("/api/skills");

  const stats: Stat[] = [
    {
      label: "Public repositories",
      value: github ? github.profile.publicRepos : null,
      hint: "on GitHub",
      loading: githubLoading
    },
    {
      label: "Stars earned",
      value: github ? github.totals.stars : null,
      hint: "across repositories",
      loading: githubLoading
    },
    {
      label: "GitHub followers",
      value: github ? github.profile.followers : null,
      hint: "and counting",
      loading: githubLoading
    },
    {
      label: "Total forks",
      value: github ? github.totals.forks : null,
      hint: "across repositories",
      loading: githubLoading
    },
    {
      label: "Problems solved",
      value: leetcode ? leetcode.solved.all : null,
      hint: "on LeetCode",
      loading: leetcodeLoading
    },
    {
      label: "LeetCode ranking",
      value: leetcode?.ranking ?? null,
      hint: "global",
      loading: leetcodeLoading
    },
    {
      label: "Active days",
      value: leetcode ? activeDays(leetcode) : null,
      hint: "with submissions",
      loading: leetcodeLoading
    },
    {
      label: "Technologies",
      value: skills.length,
      hint: "in the toolbox",
      loading: false
    }
  ];

  return (
    <section id="stats" className="border-y border-border bg-surface/40 py-14">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Numbers"
            title="A snapshot, backed by live data"
            className="!max-w-3xl"
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={(index % 4) * 0.06}>
              <div className="panel card-lift h-full px-5 py-5 sm:px-6">
                <dd className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                  {stat.loading ? (
                    <Skeleton className="mt-1 h-7 w-16" />
                  ) : stat.value == null ? (
                    "—"
                  ) : (
                    <AnimatedNumber value={stat.value} />
                  )}
                </dd>
                <dt className="mt-2 text-[13px] font-medium text-foreground">{stat.label}</dt>
                {stat.hint ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
