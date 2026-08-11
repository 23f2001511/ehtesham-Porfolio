"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import type { ApiResponse } from "@/types";
import { AppEmptyState, AppSection, AppSurface, StatTile } from "./appShared";

type LeetcodeData = {
  username: string;
  realName: string;
  avatar: string;
  ranking: number | null;
  reputation: number | null;
  solved: { all: number; easy: number; medium: number; hard: number };
  submissions: { all: number; easy: number; medium: number; hard: number };
  languages: Array<{ name: string; solved: number }>;
  badges: Array<{ name: string; icon: string }>;
  calendar: Record<string, number>;
  contest: {
    attended: number;
    rating: number;
    globalRanking: number | null;
    topPercentage: number | null;
  } | null;
  recent: Array<{ title: string; slug: string; timestamp: number }>;
};

const DIFFICULTIES = [
  { key: "easy", label: "Easy", className: "os-progress--easy" },
  { key: "medium", label: "Medium", className: "os-progress--medium" },
  { key: "hard", label: "Hard", className: "os-progress--hard" }
] as const;

function useLeetcodeData(username: string, resolved: boolean) {
  const [data, setData] = useState<LeetcodeData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!resolved || !username) {
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    fetch(`/api/leetcode?username=${encodeURIComponent(username)}`)
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<LeetcodeData>;
        if (!payload.success) {
          throw new Error(payload.error);
        }
        if (active) {
          setData(payload.data);
        }
      })
      .catch((caught: unknown) => {
        if (active) {
          setData(null);
          setError(caught instanceof Error ? caught.message : "LeetCode data unavailable.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [username, resolved, reloadKey]);

  return { data, error, loading, reload: () => setReloadKey((key) => key + 1) };
}

function formatDateFromSeconds(value: number) {
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function DifficultyBar({
  label,
  className,
  solved,
  total
}: {
  label: string;
  className: string;
  solved: number;
  total: number;
}) {
  const ratio = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;
  return (
    <div className="os-lc-bar">
      <div className="os-lc-bar__head">
        <span>{label}</span>
        <span className="os-lc-bar__count">
          {solved} solved
        </span>
      </div>
      <div
        className={`os-progress ${className}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ratio}
        aria-label={`${label} problems`}
      >
        <span style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}

export default function LeetcodeApp() {
  const { profile, resolved } = usePublicProfile();
  const username = (profile.leetcodeUsername || "").trim();
  const { data, error, loading, reload } = useLeetcodeData(username, resolved);

  const totalSolved = data ? data.solved.all : 0;
  const acceptance = useMemo(() => {
    if (!data || data.submissions.all <= 0) {
      return null;
    }
    return Math.round((data.solved.all / data.submissions.all) * 100);
  }, [data]);

  if (!resolved) {
    return (
      <AppSurface>
        <div aria-hidden="true">
          <span className="os-skeleton-line os-skeleton-line--w40" />
          <span className="os-skeleton-line os-skeleton-line--w70" />
        </div>
      </AppSurface>
    );
  }

  if (!username) {
    return (
      <AppSurface>
        <AppEmptyState
          title="LeetCode not configured"
          description="Add your LeetCode username in the admin profile settings to show live problem-solving statistics here."
          action={
            <a
              className="os-btn os-btn--ghost os-interactive"
              href="/admin/dashboard"
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open admin dashboard
            </a>
          }
        />
      </AppSurface>
    );
  }

  return (
    <AppSurface>
      {loading && (
        <p className="os-inline-note" role="status">
          Loading LeetCode data…
        </p>
      )}

      {error && !loading && (
        <AppEmptyState
          title="LeetCode data unavailable"
          description={error}
          action={
            <button type="button" className="os-btn os-btn--ghost os-interactive" onClick={reload}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          }
        />
      )}

      {data && !loading && !error && (
        <>
          <div className="os-stat-grid" role="list" aria-label="LeetCode stats">
            <StatTile
              value={String(data.solved.all)}
              label="Problems solved"
              hint={acceptance !== null ? `${acceptance}% acceptance` : undefined}
            />
            <StatTile
              value={data.ranking !== null ? data.ranking.toLocaleString() : "—"}
              label="Global ranking"
            />
            <StatTile value={String(data.languages.length)} label="Languages used" />
            <StatTile value={String(data.badges.length)} label="Badges" />
          </div>

          <AppSection title="Difficulty">
            <div className="os-lc-bars">
              {DIFFICULTIES.map((difficulty) => (
                <DifficultyBar
                  key={difficulty.key}
                  label={difficulty.label}
                  className={difficulty.className}
                  solved={data.solved[difficulty.key]}
                  total={totalSolved}
                />
              ))}
            </div>
          </AppSection>

          {data.contest && (
            <AppSection title="Contest">
              <div className="os-lc-contest">
                <div>
                  <p className="os-lc-contest__label">Rating</p>
                  <p className="os-lc-contest__value">{data.contest.rating}</p>
                </div>
                <div>
                  <p className="os-lc-contest__label">Contests attended</p>
                  <p className="os-lc-contest__value">{data.contest.attended}</p>
                </div>
                <div>
                  <p className="os-lc-contest__label">Global rank</p>
                  <p className="os-lc-contest__value">
                    {data.contest.globalRanking !== null
                      ? data.contest.globalRanking.toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="os-lc-contest__label">Top</p>
                  <p className="os-lc-contest__value">
                    {data.contest.topPercentage !== null ? `${data.contest.topPercentage}%` : "—"}
                  </p>
                </div>
              </div>
            </AppSection>
          )}

          {data.languages.length > 0 && (
            <AppSection title="Languages" hint="By problems solved">
              <ul className="os-pill-list">
                {data.languages.map((language) => (
                  <li key={language.name} className="os-pill">
                    {language.name} · {language.solved}
                  </li>
                ))}
              </ul>
            </AppSection>
          )}

          {data.badges.length > 0 && (
            <AppSection title="Badges">
              <ul className="os-pill-list">
                {data.badges.map((badge) => (
                  <li key={badge.name} className="os-pill">
                    {badge.name}
                  </li>
                ))}
              </ul>
            </AppSection>
          )}

          {data.recent.length > 0 && (
            <AppSection title="Recent solved problems">
              <ul className="os-activity-list">
                {data.recent.slice(0, 10).map((item) => (
                  <li key={`${item.slug}-${item.timestamp}`} className="os-activity-list__item">
                    <span className="os-activity-list__type">{formatDateFromSeconds(item.timestamp)}</span>
                    <a
                      className="os-activity-list__repo os-interactive"
                      href={`https://leetcode.com/problems/${item.slug}/`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </AppSection>
          )}

          <AppSection>
            <a
              className="os-btn os-btn--primary os-interactive"
              href={`https://leetcode.com/u/${encodeURIComponent(username)}/`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View LeetCode profile
            </a>
          </AppSection>
        </>
      )}
    </AppSurface>
  );
}
