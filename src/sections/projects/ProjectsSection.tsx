"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Rocket } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection } from "@/hooks/useCollection";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import ProjectDetailDialog from "./ProjectDetailDialog";

function statusTone(status: string) {
  if (status === "Live") return "bg-secondary/90 text-secondary-foreground backdrop-blur";
  if (status === "In Progress") return "bg-primary/90 text-primary-foreground backdrop-blur";
  return "border border-[var(--glass-border)] bg-[var(--glass-bg)] text-foreground backdrop-blur";
}

function ProjectCard({
  project,
  onOpen
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={reducedMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass glass-hover group relative flex h-full cursor-pointer flex-col overflow-hidden"
      onClick={() => onOpen(project)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(project);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(ellipse_at_30%_30%,rgba(79,156,255,0.14),transparent_70%)] p-6 text-center">
            <div>
              <Rocket className="mx-auto mb-3 h-8 w-8 text-primary/40" aria-hidden="true" />
              <span className="text-sm font-semibold text-muted-foreground">{project.title}</span>
            </div>
          </div>
        )}

        <span
          className={cn(
            "absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-semibold",
            statusTone(project.status)
          )}
        >
          {project.status}
        </span>

        {/* subtle dark gradient at the bottom of the media for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold tracking-tight text-foreground">
              {project.title}
            </h3>
            {project.category ? (
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {project.category}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {project.repoUrl ? (
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source code`}
                onClick={(event) => event.stopPropagation()}
                className="grid h-9 w-9 place-items-center rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] text-muted-foreground backdrop-blur-md transition-colors hover:border-border-strong hover:text-foreground"
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
                onClick={(event) => event.stopPropagation()}
                className="grid h-9 w-9 place-items-center rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] text-muted-foreground backdrop-blur-md transition-colors hover:border-border-strong hover:text-foreground"
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-primary opacity-80 transition-opacity group-hover:opacity-100">
          View details
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const { data: projects, isLoading, error } = useCollection<Project>("/api/projects");
  const [selected, setSelected] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

  return (
    <section id="projects" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work, engineered end-to-end"
          description="Full-stack applications, systems projects, and hardware experiments — each one built to work, not just to demo."
          gradient
        />

        {isLoading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-96" />
            ))}
          </div>
        ) : ordered.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {ordered.map((project, index) => (
              <Reveal key={project.slug || project.title} delay={(index % 2) * 0.08}>
                <ProjectCard project={project} onOpen={setSelected} />
              </Reveal>
            ))}
          </div>
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
