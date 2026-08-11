"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Grid2x2, List as ListIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { usePortfolioData } from "../PortfolioDataContext";
import type { AppProps } from "../OSContext";
import { AppEmptyState, AppSurface } from "./appShared";

function projectCategory(project: Project): string {
  const category = project.category?.trim();
  return category || "Other";
}

function StatusDot({ status }: { status: Project["status"] }) {
  return <span className={cn("os-status-dot", `os-status-dot--${status.toLowerCase().replace(" ", "-")}`)} aria-hidden="true" />;
}

export default function ProjectsApp({ openApp }: AppProps) {
  const { projects, loaded } = usePortfolioData();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<"featured" | "title" | "status">("featured");
  const [tag, setTag] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const project of projects) {
      set.add(projectCategory(project));
    }
    return [...set];
  }, [projects]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      for (const item of project.tags) {
        set.add(item);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b)).slice(0, 24);
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filteredProjects = projects.filter((project) => {
      if (category !== "All" && projectCategory(project) !== category) {
        return false;
      }
      if (tag && !project.tags.includes(tag)) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack = `${project.title} ${project.summary} ${project.description} ${project.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });

    const sorted = [...filteredProjects];
    if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "status") {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    } else {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);
    }
    return sorted;
  }, [projects, query, category, sort, tag]);

  const openDetail = (project: Project) => {
    openApp("project-detail", { slug: project.slug, title: project.title });
  };

  return (
    <AppSurface>
      <div className="os-toolbar">
        <label className="os-toolbar__search os-interactive">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
          />
        </label>
        <select
          className="os-select os-interactive"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="os-select os-interactive"
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          aria-label="Sort projects"
        >
          <option value="featured">Featured</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>
        <div className="os-segment" role="group" aria-label="View mode">
          <button
            type="button"
            className={cn("os-interactive", view === "grid" && "is-active")}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <Grid2x2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn("os-interactive", view === "list" && "is-active")}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <ListIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="os-chip-row" role="group" aria-label="Technology filters">
          <button
            type="button"
            className={cn("os-chip os-interactive", !tag && "os-chip--active")}
            onClick={() => setTag("")}
          >
            All tech
          </button>
          {allTags.map((item) => (
            <button
              key={item}
              type="button"
              className={cn("os-chip os-interactive", tag === item && "os-chip--active")}
              onClick={() => setTag((value) => (value === item ? "" : item))}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {!loaded && projects.length > 0 && (
        <p className="os-inline-note" role="status">
          Loading latest content…
        </p>
      )}

      {filtered.length === 0 ? (
        <AppEmptyState
          title="No projects found"
          description="Try a different search or clear the filters. Add projects from the admin dashboard to see them here."
        />
      ) : view === "grid" ? (
        <div className="os-explorer-grid" role="list" aria-label="Projects">
          {filtered.map((project) => (
            <button
              key={project.slug}
              type="button"
              role="listitem"
              className="os-explorer-card os-interactive"
              onClick={() => openDetail(project)}
            >
              <div className="os-explorer-card__top">
                <span className="os-explorer-card__icon" aria-hidden="true">
                  {project.title.charAt(0).toUpperCase()}
                </span>
                <span className="os-explorer-card__status">
                  <StatusDot status={project.status} />
                  {project.status}
                </span>
              </div>
              <p className="os-explorer-card__title">{project.title}</p>
              <p className="os-explorer-card__summary">{project.summary}</p>
              <div className="os-explorer-card__tags">
                {project.tags.slice(0, 4).map((item) => (
                  <span key={item} className="os-tag">
                    {item}
                  </span>
                ))}
                {project.tags.length > 4 && <span className="os-tag">+{project.tags.length - 4}</span>}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="os-explorer-list" role="list" aria-label="Projects">
          {filtered.map((project) => (
            <button
              key={project.slug}
              type="button"
              role="listitem"
              className="os-explorer-row os-interactive"
              onClick={() => openDetail(project)}
            >
              <span className="os-explorer-row__icon" aria-hidden="true">
                {project.title.charAt(0).toUpperCase()}
              </span>
              <span className="os-explorer-row__main">
                <span className="os-explorer-row__title">{project.title}</span>
                <span className="os-explorer-row__summary">{project.summary}</span>
              </span>
              <span className="os-explorer-row__meta">
                <StatusDot status={project.status} />
                {project.status}
              </span>
              <ExternalLink className="h-4 w-4 text-[var(--fg-muted)]" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </AppSurface>
  );
}
