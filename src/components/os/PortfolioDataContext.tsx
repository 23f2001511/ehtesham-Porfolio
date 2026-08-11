"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import type { ApiResponse, Project, Skill } from "@/types";
import { fallbackProjects, fallbackSkills } from "@/constants";

// The JSON store intentionally keeps a lean skill set while the fallback
// constants carry the owner's full skill list. Prefer whichever source has
// data once the API settles.
function pickSkills(apiSkills: Skill[] | null): Skill[] {
  if (apiSkills === null) {
    return fallbackSkills;
  }
  return apiSkills.length ? apiSkills : fallbackSkills;
}

type Snapshot = {
  projects: Project[];
  skills: Skill[];
  loaded: boolean;
};

type PortfolioDataContextValue = Snapshot;

const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    projects: fallbackProjects,
    skills: fallbackSkills,
    loaded: false
  });
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    let active = true;

    async function load(endpoint: string) {
      const response = await fetch(endpoint, { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<unknown[]>;
      if (!payload.success) {
        throw new Error(payload.error);
      }
      return payload.data;
    }

    Promise.allSettled([load("/api/projects"), load("/api/skills")]).then(
      ([projectsResult, skillsResult]) => {
        if (!active) {
          return;
        }
        setSnapshot({
          projects:
            projectsResult.status === "fulfilled"
              ? (projectsResult.value as Project[])
              : fallbackProjects,
          skills: pickSkills(
            skillsResult.status === "fulfilled" ? (skillsResult.value as Skill[]) : null
          ),
          loaded: true
        });
      }
    );

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<PortfolioDataContextValue>(() => snapshot, [snapshot]);

  return (
    <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);

  if (!context) {
    return { projects: fallbackProjects, skills: fallbackSkills, loaded: false };
  }

  return context;
}
