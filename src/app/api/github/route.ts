import { fail, ok } from "@/lib/api";

export const runtime = "nodejs";

export const revalidate = 3600;

const GITHUB_API = "https://api.github.com";
const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

type GithubRepoNode = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  pushed_at: string | null;
  updated_at: string | null;
};

type GithubEventNode = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: {
    commits?: Array<{ message: string; sha: string }>;
    size?: number;
    ref_type?: string;
    action?: string;
  };
};

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-os",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  const token = process.env.GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function parseContributionCalendar(html: string) {
  const days: Array<{ date: string; count: number; level: number }> = [];
  const seen = new Set<string>();

  // Newer markup: <td ... data-date="2025-01-01" ... data-level="2" ...>
  // GitHub may emit the attributes in either order, so capture both.
  const cellPattern = /<td[^>]*?(?:data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"|data-level="(\d)"[^>]*?data-date="(\d{4}-\d{2}-\d{2})")[^>]*>/g;
  let match: RegExpExecArray | null;

  while ((match = cellPattern.exec(html)) !== null) {
    const date = match[1] || match[4];
    const level = match[2] || match[3] || "0";

    if (!date || seen.has(date)) {
      continue;
    }

    seen.add(date);
    days.push({ date, count: -1, level: Number(level) });
  }

  // Older markup embeds counts inside tooltips / aria labels.
  const countPattern = /(\d+) contributions? on ([A-Z][a-z]+ \d{1,2}, \d{4})/g;

  while ((match = countPattern.exec(html)) !== null) {
    const count = Number(match[1]);
    const date = new Date(match[2]);

    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const iso = date.toISOString().slice(0, 10);
    const day = days.find((entry) => entry.date === iso);

    if (day) {
      day.count = count;
    }
  }

  const noContributionPattern = /No contributions on ([A-Z][a-z]+ \d{1,2}, \d{4})/g;

  while ((match = noContributionPattern.exec(html)) !== null) {
    const date = new Date(match[1]);

    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const iso = date.toISOString().slice(0, 10);
    const day = days.find((entry) => entry.date === iso);

    if (day) {
      day.count = 0;
    }
  }

  return days.length ? days : null;
}

export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get("username")?.trim() || "";

  if (!USERNAME_PATTERN.test(username)) {
    return fail("A valid GitHub username is required.", 400);
  }

  const headers = githubHeaders();

  try {
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}`, { headers, next: { revalidate } }),
      fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=pushed&type=owner`, {
        headers,
        next: { revalidate }
      }),
      fetch(`${GITHUB_API}/users/${username}/events/public?per_page=30`, {
        headers,
        next: { revalidate }
      })
    ]);

    const rateLimited =
      userResponse.status === 403 &&
      userResponse.headers.get("x-ratelimit-remaining") === "0";

    if (userResponse.status === 404) {
      return fail("GitHub user was not found.", 404);
    }

    if (rateLimited) {
      return fail("GitHub API rate limit reached. Try again later.", 429);
    }

    if (!userResponse.ok) {
      return fail("Unable to load GitHub profile right now.", 502);
    }

    const user = await userResponse.json();
    const repos: GithubRepoNode[] = reposResponse.ok ? await reposResponse.json() : [];
    const events: GithubEventNode[] = eventsResponse.ok ? await eventsResponse.json() : [];

    const languages = new Map<string, number>();
    let totalStars = 0;
    let totalForks = 0;

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      if (repo.language) {
        languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
      }
    }

    let contributions: Array<{ date: string; count: number; level: number }> | null = null;

    try {
      const pageResponse = await fetch(`https://github.com/users/${username}/contributions`, {
        headers: { "User-Agent": "portfolio-os" },
        next: { revalidate }
      });

      if (pageResponse.ok) {
        contributions = parseContributionCalendar(await pageResponse.text());
      }
    } catch {
      contributions = null;
    }

    // GitHub only exposes exact per-day counts in the cell tooltip markup when
    // it is present; otherwise we only have a 0-4 intensity level. Surface a
    // total only when every parsed day carries a real count.
    const contributionsLastYear =
      contributions && contributions.every((day) => day.count >= 0)
        ? contributions.reduce((sum, day) => sum + day.count, 0)
        : null;

    return ok({
      profile: {
        login: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio || "",
        company: user.company || "",
        location: user.location || "",
        blog: user.blog || "",
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        publicRepos: user.public_repos ?? 0,
        createdAt: user.created_at,
        htmlUrl: user.html_url
      },
      totals: { stars: totalStars, forks: totalForks, contributionsLastYear },
      languages: [...languages.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      repos: repos
        .filter((repo) => !repo.fork)
        .slice(0, 20)
        .map((repo) => ({
          name: repo.name,
          description: repo.description || "",
          url: repo.html_url,
          homepage: repo.homepage || "",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "",
          topics: repo.topics || [],
          updatedAt: repo.pushed_at || repo.updated_at
        })),
      activity: events.slice(0, 14).map((event) => ({
        type: event.type,
        repo: event.repo?.name || "",
        repoUrl: event.repo?.name ? `https://github.com/${event.repo.name}` : "",
        createdAt: event.created_at,
        commits:
          event.type === "PushEvent"
            ? event.payload?.size ?? event.payload?.commits?.length ?? null
            : null
      })),
      contributions
    });
  } catch {
    return fail("GitHub data is temporarily unavailable.", 502);
  }
}
