"use client";

import { useCallback, useEffect, useState } from "react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import type { ApiResponse } from "@/types";

// ── Shared live-data hooks ─────────────────────────────────────────────────
// These power the GitHub/LeetCode apps AND the landing hero widgets. Requests
// are de-duplicated per username so the hero and the open app share one fetch.

export type GithubData = {
  profile: {
    login: string;
    name: string;
    avatarUrl: string;
    bio: string;
    company: string;
    location: string;
    blog: string;
    followers: number;
    following: number;
    publicRepos: number;
    createdAt: string;
    htmlUrl: string;
  };
  totals: { stars: number; forks: number };
  languages: Array<{ name: string; count: number }>;
  repos: Array<{
    name: string;
    description: string;
    url: string;
    homepage: string;
    stars: number;
    forks: number;
    language: string;
    topics: string[];
    updatedAt: string | null;
  }>;
  activity: Array<{ type: string; repo: string; createdAt: string }>;
  contributions: Array<{ date: string; count: number; level: number }> | null;
};

export type LeetcodeData = {
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

type LoadState<T> = {
  data: T | null;
  error: string;
  loading: boolean;
  resolved: boolean;
  username: string;
  reload: () => void;
};

// In-flight request cache so multiple consumers share one network call.
const inflight = new Map<string, Promise<unknown>>();

function fetchJson<T>(url: string): Promise<T> {
  const cached = inflight.get(url) as Promise<T> | undefined;
  if (cached) {
    return cached;
  }
  const request: Promise<T> = fetch(url)
    .then(async (response) => {
      const payload = (await response.json()) as ApiResponse<T>;
      if (!payload.success) {
        throw new Error(payload.error);
      }
      return payload.data;
    })
    .finally(() => {
      inflight.delete(url);
    });
  inflight.set(url, request);
  return request;
}

function useLiveData<T>(username: string, endpoint: string, label: string): LoadState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    if (!username) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    fetchJson<T>(`${endpoint}?username=${encodeURIComponent(username)}`)
      .then((result) => {
        if (active) {
          setData(result);
        }
      })
      .catch((caught: unknown) => {
        if (active) {
          setData(null);
          setError(caught instanceof Error ? caught.message : `${label} data unavailable.`);
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
  }, [username, endpoint, label, reloadKey]);

  return { data, error, loading, resolved: true, username, reload };
}

export function useGithubData(): LoadState<GithubData> {
  const { profile } = usePublicProfile();
  const username = (profile.githubUsername || "").trim();
  return useLiveData<GithubData>(username, "/api/github", "GitHub");
}

export function useLeetcodeData(): LoadState<LeetcodeData> {
  const { profile } = usePublicProfile();
  const username = (profile.leetcodeUsername || "").trim();
  return useLiveData<LeetcodeData>(username, "/api/leetcode", "LeetCode");
}
