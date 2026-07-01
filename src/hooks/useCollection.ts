"use client";

import { useEffect, useRef, useState } from "react";
import type { ApiResponse } from "@/types";

export function useCollection<T>(endpoint: string, fallback: T[] = []) {
  const fallbackRef = useRef(fallback);
  const [data, setData] = useState<T[]>(fallback);
  const [isLoading, setIsLoading] = useState(false);
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
          setData(fallbackRef.current);
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
  }, [endpoint]);

  return {
    data,
    isLoading,
    error
  };
}
