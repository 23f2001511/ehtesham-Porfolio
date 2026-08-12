"use client";

import { useEffect, useRef, useState } from "react";
import type { ApiResponse } from "@/types";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Fetch a JSON API payload once per session (module-level memoization with
 * in-flight deduplication) so navigating between sections/routes does not
 * retrigger the upstream GitHub / LeetCode calls.
 */
export function useApiData<T>(endpoint: string) {
  const cacheRef = useRef(getOrCreateCache<T>(endpoint));
  const [data, setData] = useState<T | null>(cacheRef.current.value);
  const [status, setStatus] = useState<Status>(cacheRef.current.value ? "success" : "idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const cache = cacheRef.current;
    let active = true;

    if (cache.value) {
      setData(cache.value);
      setStatus("success");
      return;
    }

    setStatus("loading");

    cache.promise
      .then((value) => {
        if (active) {
          setData(value);
          setStatus("success");
        }
      })
      .catch((caught) => {
        // Allow a later visit to retry on failure.
        caches.delete(endpoint);
        if (active) {
          setError(caught instanceof Error ? caught.message : "Unable to load data.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [endpoint]);

  return { data, status, error, isLoading: status === "loading" || status === "idle" };
}

type CacheEntry<T> = { promise: Promise<T>; value: T | null };

// One entry per endpoint; survives component remounts and route changes.
const caches = new Map<string, CacheEntry<never>>();

function getOrCreateCache<T>(endpoint: string): CacheEntry<T> {
  const existing = caches.get(endpoint) as CacheEntry<T> | undefined;

  if (existing) {
    return existing;
  }

  const promise = new Promise<T>((resolve, reject) => {
    fetch(endpoint, { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<T>;
        if (!response.ok || !payload.success) {
          throw new Error(payload.success ? "Request failed." : payload.error);
        }
        return payload.data;
      })
      .then(resolve)
      .catch(reject);
  });

  const entry: CacheEntry<T> = { promise, value: null };
  promise.then((value) => {
    entry.value = value;
  });
  caches.set(endpoint, entry as CacheEntry<never>);
  return entry;
}
