"use client";

import { ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGithubData } from "../osData";
import { AppEmptyState, AppSection, AppSurface, StatTile } from "./appShared";

const HEAT_LEVELS = ["var(--heat-0)", "var(--heat-1)", "var(--heat-2)", "var(--heat-3)", "var(--heat-4)"];

function contributionColor(level: number) {
  return HEAT_LEVELS[Math.max(0, Math.min(4, level))];
}

function eventLabel(type: string) {
  return type.replace(/Event$/, "");
}

function ContributionHeatmap({ weeks }: { weeks: Array<Array<{ date: string; count: number; level: number }>> }) {
  if (!weeks.length) {
    return null;
  }
  return (
    <div className="os-heatmap" role="img" aria-label="GitHub contribution heatmap">
      {weeks.map((week, index) => (
        <div key={index} className="os-heatmap__week">
          {week.map((day) => (
            <span
              key={day.date}
              className="os-heatmap__cell"
              title={`${day.date}${day.count >= 0 ? ` · ${day.count} contributions` : ""}`}
              style={{ backgroundColor: contributionColor(day.level) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

export default function GitHubApp() {
  const { data, error, loading, resolved, username, reload } = useGithubData();

  if (!resolved) {
    return (
      <AppSurface>
        <div aria-hidden="true">
          <span className="os-skeleton-line os-skeleton-line--w40" />
          <span className="os-skeleton-line os-skeleton-line--w70" />
          <span className="os-skeleton-line os-skeleton-line--w60" />
        </div>
      </AppSurface>
    );
  }

  if (!username) {
    return (
      <AppSurface>
        <AppEmptyState
          title="GitHub not configured"
          description="Set your GitHub username in the admin profile settings to enable live stats, repositories, and contribution data here."
          action={
            <a className="os-btn os-btn--ghost os-interactive" href="/admin/dashboard" target="_blank" rel="noreferrer noopener">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open admin dashboard
            </a>
          }
        />
      </AppSurface>
    );
  }

  const weeks: Array<Array<{ date: string; count: number; level: number }>> = [];
  if (data?.contributions?.length) {
    for (let i = 0; i < data.contributions.length; i += 7) {
      weeks.push(data.contributions.slice(i, i + 7));
    }
  }

  return (
    <AppSurface>
      {loading && (
        <p className="os-inline-note" role="status">
          Loading GitHub data…
        </p>
      )}

      {error && !loading && (
        <AppEmptyState
          title="GitHub data unavailable"
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
          <div className="os-profile-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.profile.avatarUrl}
              alt={`${data.profile.name}'s GitHub avatar`}
              className="os-profile-hero__avatar os-profile-hero__avatar--image"
            />
            <div className="min-w-0">
              <p className="os-profile-hero__name">{data.profile.name}</p>
              <p className="os-profile-hero__tagline">@{data.profile.login}</p>
              {data.profile.bio && <p className="os-body">{data.profile.bio}</p>}
              <div className="os-profile-hero__meta">
                {data.profile.location && <span>{data.profile.location}</span>}
                {data.profile.company && <span>{data.profile.company}</span>}
              </div>
            </div>
          </div>

          <div className="os-stat-grid" role="list" aria-label="GitHub stats">
            <StatTile value={String(data.profile.publicRepos)} label="Public repos" />
            <StatTile value={String(data.profile.followers)} label="Followers" />
            <StatTile value={String(data.totals.stars)} label="Stars" />
            <StatTile value={String(data.totals.forks)} label="Forks" />
          </div>

          {weeks.length > 0 && (
            <AppSection title="Contributions" hint="Past year · live from GitHub">
              <ContributionHeatmap weeks={weeks} />
              <div className="os-heatmap__legend" aria-hidden="true">
                <span>Less</span>
                {HEAT_LEVELS.map((color) => (
                  <span key={color} className="os-heatmap__cell" style={{ backgroundColor: color }} />
                ))}
                <span>More</span>
              </div>
            </AppSection>
          )}

          {data.languages.length > 0 && (
            <AppSection title="Languages" hint="Across public repositories">
              <ul className="os-pill-list">
                {data.languages.map((language) => (
                  <li key={language.name} className="os-pill">
                    {language.name} · {language.count}
                  </li>
                ))}
              </ul>
            </AppSection>
          )}

          {data.repos.length > 0 && (
            <AppSection title="Repositories" hint="Recently pushed">
              <div className="os-explorer-list" role="list">
                {data.repos.map((repo) => (
                  <a
                    key={repo.name}
                    role="listitem"
                    className="os-explorer-row os-interactive"
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="os-explorer-row__icon" aria-hidden="true">
                      {repo.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="os-explorer-row__main">
                      <span className="os-explorer-row__title">{repo.name}</span>
                      <span className="os-explorer-row__summary">
                        {repo.description || "No description"}
                      </span>
                    </span>
                    <span className="os-explorer-row__meta">
                      {repo.language && <span>{repo.language}</span>}
                      <span>★ {repo.stars}</span>
                    </span>
                    <ExternalLink className="h-4 w-4 text-[var(--fg-muted)]" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </AppSection>
          )}

          {data.activity.length > 0 && (
            <AppSection title="Recent activity">
              <ul className="os-activity-list">
                {data.activity.slice(0, 8).map((event, index) => (
                  <li key={`${event.createdAt}-${index}`} className="os-activity-list__item">
                    <span className="os-activity-list__type">{eventLabel(event.type)}</span>
                    <span className="os-activity-list__repo">{event.repo}</span>
                  </li>
                ))}
              </ul>
            </AppSection>
          )}

          <AppSection>
            <button
              type="button"
              className={cn("os-btn os-btn--ghost os-interactive")}
              onClick={() => void copyUrl(data.profile.htmlUrl)}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Copy GitHub profile URL
            </button>
            <a
              className="os-btn os-btn--primary os-interactive"
              href={data.profile.htmlUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              View GitHub profile
            </a>
          </AppSection>
        </>
      )}
    </AppSurface>
  );
}
