import { fail, ok } from "@/lib/api";

export const runtime = "nodejs";

export const revalidate = 3600;

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{1,30}$/;

const PROFILE_QUERY = `
query portfolioProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submissionCalendar
    profile {
      realName
      userAvatar
      ranking
      countryName
      reputation
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    languageProblemCount {
      languageName
      problemsSolved
    }
    badges {
      name
      icon
    }
  }
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
  }
  recentAcSubmissionList(username: $username, limit: 15) {
    title
    titleSlug
    timestamp
  }
}
`;

export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get("username")?.trim() || "";

  if (!USERNAME_PATTERN.test(username)) {
    return fail("A valid LeetCode username is required.", 400);
  }

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "portfolio-os",
        Referer: "https://leetcode.com"
      },
      body: JSON.stringify({ query: PROFILE_QUERY, variables: { username } }),
      next: { revalidate }
    });

    if (!response.ok) {
      return fail("LeetCode data is temporarily unavailable.", 502);
    }

    const payload = await response.json();
    const matchedUser = payload?.data?.matchedUser;

    if (!matchedUser) {
      return fail("LeetCode user was not found.", 404);
    }

    const stats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
    const byDifficulty = (difficulty: string) =>
      stats.find((entry: { difficulty: string }) => entry.difficulty === difficulty) || {
        count: 0,
        submissions: 0
      };

    let calendar: Record<string, number> = {};

    if (typeof matchedUser.submissionCalendar === "string" && matchedUser.submissionCalendar) {
      try {
        calendar = JSON.parse(matchedUser.submissionCalendar);
      } catch {
        calendar = {};
      }
    }

    const contest = payload?.data?.userContestRanking;

    return ok({
      username: matchedUser.username,
      realName: matchedUser.profile?.realName || "",
      avatar: matchedUser.profile?.userAvatar || "",
      ranking: matchedUser.profile?.ranking ?? null,
      reputation: matchedUser.profile?.reputation ?? null,
      solved: {
        all: byDifficulty("All").count,
        easy: byDifficulty("Easy").count,
        medium: byDifficulty("Medium").count,
        hard: byDifficulty("Hard").count
      },
      submissions: {
        all: byDifficulty("All").submissions,
        easy: byDifficulty("Easy").submissions,
        medium: byDifficulty("Medium").submissions,
        hard: byDifficulty("Hard").submissions
      },
      languages: (matchedUser.languageProblemCount || [])
        .map((entry: { languageName: string; problemsSolved: number }) => ({
          name: entry.languageName,
          solved: entry.problemsSolved
        }))
        .sort(
          (a: { solved: number }, b: { solved: number }) => b.solved - a.solved
        )
        .slice(0, 8),
      badges: (matchedUser.badges || [])
        .map((badge: { name: string; icon: string }) => ({
          name: badge.name,
          icon: badge.icon?.startsWith("http")
            ? badge.icon
            : badge.icon
              ? `https://leetcode.com${badge.icon}`
              : ""
        }))
        .slice(0, 12),
      calendar,
      contest:
        contest && contest.attendedContestsCount
          ? {
              attended: contest.attendedContestsCount,
              rating: Math.round(contest.rating ?? 0),
              globalRanking: contest.globalRanking ?? null,
              topPercentage:
                typeof contest.topPercentage === "number"
                  ? Number(contest.topPercentage.toFixed(2))
                  : null
            }
          : null,
      recent: (payload?.data?.recentAcSubmissionList || []).map(
        (item: { title: string; titleSlug: string; timestamp: string }) => ({
          title: item.title,
          slug: item.titleSlug,
          timestamp: Number(item.timestamp)
        })
      )
    });
  } catch {
    return fail("LeetCode data is temporarily unavailable.", 502);
  }
}
