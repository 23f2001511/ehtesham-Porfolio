"use client";

import { useEffect, useState } from "react";
import type { ApiResponse } from "@/types";

export function useCollection<T>(endpoint: string, fallback: T[] = []) {
  const [data, setData] = useState<T[]>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(endpoint, {
          cache: "no-store"
        });
        const payload = (await response.json()) as ApiResponse<T[]>;

        if (!payload.success) {
          throw new Error(payload.error);
        }

        if (active) {
          setData(payload.data);
        }
      } catch (caughtError) {
        if (active) {
          setData(fallback);
          setError(caughtError instanceof Error ? caughtError.message : "Unable to load data.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [endpoint, fallback]);

  return {
    data,
    isLoading,
    error
  };
}
