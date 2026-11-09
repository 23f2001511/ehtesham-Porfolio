"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Folder, Github, Rocket } from "lucide-react";
import { useMemo, useState } from "react";
import Reveal from "@/components/shared/Reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackProjects } from "@/constants";
import { useCollection } from "@/hooks/useCollection";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import ProjectDetailDialog from "./ProjectDetailDialog";

/* ── Featured project (alternating layout) ──────────────────────────── */

function FeaturedProject({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const isOdd = index % 2 !== 0;

  return (
    <Reveal delay={0.05}>
      <div className={cn("group relative grid items-center gap-4 lg:gap-0 lg:grid-cols-12", isOdd && "lg:text-right")}>
        {/* Image side */}
        <div
          className={cn(
            "relative col-span-full aspect-[16/10] overflow-hidden rounded-xl border border-[#7042f8]/30 shadow-2xl lg:col-span-7 lg:row-start-1",
            isOdd ? "lg:col-start-6" : "lg:col-start-1"
          )}
        >
          <div
            className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl"
            onClick={() => onOpen(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
            aria-label={`Open details for ${project.title}`}
          >
            {project.imageUrl ? (
              <>
                <Image
                  src={project.imageUrl}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#07011d]/20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
              </>
            ) : (
              <div className="grid h-full place-items-center bg-[radial-gradient(ellipse_at_30%_30%,rgba(79,156,255,0.14),transparent_70%)] transition-opacity duration-500 group-hover:opacity-50">
                <Rocket className="h-12 w-12 text-[#00f0ff]/40" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        {/* Content side */}
        <div
          className={cn(
            "relative z-10 col-span-full flex flex-col p-5 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none bg-[#07011d]/90 lg:bg-transparent border border-[#7042f8]/30 lg:border-0 backdrop-blur-xl lg:backdrop-blur-none lg:col-span-7 lg:row-start-1",
            isOdd ? "lg:col-start-1 lg:items-start lg:text-left" : "lg:col-start-6 lg:items-end lg:text-right"
          )}
        >
          <p className="font-mono text-xs font-semibold text-[#00f0ff] uppercase tracking-wider">Featured Project</p>
          <h3
            className="font-display mt-2 cursor-pointer text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white transition-colors hover:text-[#00f0ff]"
            onClick={() => onOpen(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
          >
            {project.title}
          </h3>

          <div className="mt-3 lg:mt-5 rounded-xl border border-[#7042f8]/40 bg-[#07011d]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
              {project.description || project.summary}
            </p>
          </div>

          <div className={cn("mt-4 flex flex-wrap gap-2", isOdd ? "lg:justify-start" : "lg:justify-end")}>
            {project.tags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] px-2.5 py-0.5 rounded-md border border-[#7042f8]/30 bg-purple-950/40 text-purple-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className={cn("mt-4 flex items-center gap-3", isOdd ? "lg:justify-start" : "lg:justify-end")}>
            {project.repoUrl ? (
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source code`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#7042f8]/40 bg-[#07011d]/80 text-gray-300 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} live demo`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00f0ff]/40 bg-[#07011d]/80 text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Other noteworthy project card ──────────────────────────────────── */

function OtherProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={reducedMotion ? undefined : { y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass glass-hover group relative flex h-full cursor-pointer flex-col rounded-lg p-6 transition-all duration-300 sm:p-7"
      onClick={() => onOpen(project)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
    >
      {/* Top row: folder icon + links */}
      <div className="flex items-center justify-between">
        <Folder className="h-10 w-10 text-primary" aria-hidden="true" />
        <div className="flex items-center gap-3">
          {project.repoUrl ? (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} source code`}
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
            </Link>
          ) : null}
          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Title + description */}
      <h3 className="font-display mt-6 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
        {project.summary}
      </p>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="font-mono text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

/* ── Category filter pill ───────────────────────────────────────────── */

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-xs font-medium transition-all duration-300",
        active
          ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_12px_rgba(79,156,255,0.15)]"
          : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

/* ── Main section ───────────────────────────────────────────────────── */

export default function ProjectsSection() {
  const { data: rawProjects, isLoading, error } = useCollection<Project>("/api/projects");
  const projects = useMemo(() => (rawProjects.length ? rawProjects : fallbackProjects), [rawProjects]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    if (!activeCategory) return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const featured = filtered.filter((p) => p.featured);
  const other = filtered.filter((p) => !p.featured);
  const visibleOther = showAll ? other : other.slice(0, 6);

  return (
    <section id="projects" className="section-pad">
      <div className="section-shell">
        {/* Numbered heading & Space Title */}
        <Reveal>
          <div className="text-center mb-14">
            <div className="welcome-box mb-4">
              <Rocket className="w-4 h-4 text-[#00f0ff]" />
              <span className="welcome-text font-bold">Featured Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              My{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-400 to-cyan-400">
                Projects
              </span>
            </h2>
            <p className="cursive mt-3 text-lg font-medium text-gray-300">
              Interactive Web Applications &amp; Production Systems
            </p>
          </div>
        </Reveal>

        {/* Category filter pills */}
        {categories.length > 1 && (
          <Reveal delay={0.05}>
            <div className="mt-8 flex flex-wrap gap-2">
              <FilterPill
                active={activeCategory === null}
                onClick={() => setActiveCategory(null)}
              >
                All
              </FilterPill>
              {categories.map((cat) => (
                <FilterPill
                  key={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory((c) => (c === cat ? null : cat))}
                >
                  {cat}
                </FilterPill>
              ))}
            </div>
          </Reveal>
        )}

        {isLoading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : featured.length || other.length ? (
          <>
            {/* Featured projects — alternating layout */}
            {featured.length > 0 && (
              <div className="mt-14 space-y-24">
                {featured.map((project, index) => (
                  <FeaturedProject
                    key={project.slug || project.title}
                    project={project}
                    index={index}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            )}

            {/* Other Noteworthy Projects */}
            {other.length > 0 && (
              <div className="mt-24">
                <Reveal>
                  <h3 className="text-center font-display text-2xl font-bold tracking-tight text-foreground">
                    Other Noteworthy Projects
                  </h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    view the archive
                  </p>
                </Reveal>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleOther.map((project, index) => (
                    <Reveal key={project.slug || project.title} delay={(index % 3) * 0.06}>
                      <OtherProjectCard project={project} onOpen={setSelected} />
                    </Reveal>
                  ))}
                </div>

                {other.length > 6 && !showAll && (
                  <Reveal delay={0.1}>
                    <div className="mt-10 text-center">
                      <button
                        type="button"
                        onClick={() => setShowAll(true)}
                        className="inline-flex h-12 items-center gap-2 rounded-lg border border-primary/60 bg-transparent px-8 font-mono text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/10"
                      >
                        Show More
                      </button>
                    </div>
                  </Reveal>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mt-12">
            <EmptyState
              title={error ? "Couldn't load projects" : "No projects published yet"}
              description={
                error
                  ? "The request failed. Check your connection and refresh the page."
                  : "Create your first project from the admin dashboard and it will appear here."
              }
            />
          </div>
        )}
      </div>

      <ProjectDetailDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
