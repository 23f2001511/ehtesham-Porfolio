"use client";

import { useEffect, useState } from "react";
import type { ApiResponse } from "@/types";

export function useCollection<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
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
        if (!response.ok) {
          throw new Error("Unable to load data.");
        }

        const payload = (await response.json()) as ApiResponse<T[]>;

        if (!payload.success) {
          throw new Error(payload.error || "Unable to load data.");
        }

        if (active) {
          setData(payload.data);
        }
      } catch (caughtError) {
        if (active) {
          setData([]);
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
