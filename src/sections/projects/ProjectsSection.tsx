"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackProjects } from "@/constants";
import { useCollection } from "@/hooks/useCollection";
import type { Project } from "@/types";

export default function ProjectsSection() {
  const { data: projects, isLoading, error } = useCollection<Project>("/api/projects", fallbackProjects);

  return (
    <section id="projects" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work with clean interfaces and real application structure."
          description="These projects highlight reusable components, API design, responsive layouts, and thoughtful user flows."
        />

        {error ? (
          <p className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Live projects could not be loaded. Showing curated starter content.
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-96" />
            ))}
          </div>
        ) : projects.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.slug || project.title} delay={index * 0.05}>
                <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.07]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={`${project.title} preview`}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(16,185,129,0.12),rgba(251,191,36,0.08))] p-6 text-center">
                        <span className="text-sm font-semibold text-cyan-100">{project.title}</span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <Badge tone={project.status === "Live" ? "emerald" : "cyan"}>{project.status}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-black text-white">{project.title}</h3>
                    <p className="mt-3 leading-7 text-slate-300">{project.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} tone="slate">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex gap-2 pt-6">
                      {project.liveUrl ? (
                        <Button size="sm" onClick={() => window.open(project.liveUrl, "_blank", "noreferrer")}>
                          Live
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      ) : null}
                      {project.repoUrl ? (
                        <Link
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-white/5 px-3 text-xs font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/10"
                        >
                          <Github className="h-4 w-4" aria-hidden="true" />
                          Code
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects published yet"
            description="Create your first project from the admin dashboard and it will appear here."
          />
        )}
      </div>
    </section>
  );
}
