"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Rocket } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackProjects } from "@/constants";
import { useCollection } from "@/hooks/useCollection";
import type { Project } from "@/types";

const cardColors = [
  { glow: "rgba(34, 211, 238, 0.2)", border: "rgba(34, 211, 238, 0.35)", accent: "#22d3ee" },
  { glow: "rgba(168, 85, 247, 0.2)", border: "rgba(168, 85, 247, 0.35)", accent: "#a855f7" },
  { glow: "rgba(16, 185, 129, 0.2)", border: "rgba(16, 185, 129, 0.35)", accent: "#10b981" },
  { glow: "rgba(251, 191, 36, 0.18)", border: "rgba(251, 191, 36, 0.3)", accent: "#fbbf24" },
];

function CosmicProjectCard({ project, index }: { project: Project; index: number }) {
  const reducedMotion = useReducedMotion();
  const colors = cardColors[index % cardColors.length];

  return (
    <motion.article
      initial={reducedMotion ? {} : { opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -10,
              transition: { duration: 0.3, ease: "easeOut" },
            }
      }
      className="cosmic-card group relative flex h-full flex-col overflow-hidden rounded-xl"
      style={{
        "--card-glow": colors.glow,
        "--card-border": colors.border,
        "--card-accent": colors.accent,
      } as React.CSSProperties}
    >
      {/* Animated border glow */}
      <div className="cosmic-card-border absolute inset-0 rounded-xl pointer-events-none" />

      {/* Card body */}
      <div className="relative flex h-full flex-col border border-white/8 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden">
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
            opacity: 0.5,
          }}
        />

        {/* Image / placeholder */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className="grid h-full place-items-center p-6 text-center"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, ${colors.glow}, transparent 70%)`,
              }}
            >
              <div>
                <Rocket
                  className="mx-auto h-8 w-8 mb-3 opacity-40"
                  style={{ color: colors.accent }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-white/70">{project.title}</span>
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute left-3 top-3">
            <Badge tone={project.status === "Live" ? "emerald" : "cyan"}>{project.status}</Badge>
          </div>

          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-black text-white">{project.title}</h3>
          <p className="mt-3 leading-7 text-slate-300/90">{project.summary}</p>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  color: colors.accent,
                  borderColor: `${colors.accent}33`,
                  backgroundColor: `${colors.accent}0d`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
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
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const { data: projects, isLoading, error } = useCollection<Project>("/api/projects", fallbackProjects);

  return (
    <section id="projects" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title="Engineered solutions from code to circuitry."
          description="From hospital management systems to analog electronics — each project reflects hands-on engineering and clean design thinking."
        />

        {error ? (
          <p className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Live projects could not be loaded. Showing curated starter content.
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-96" />
            ))}
          </div>
        ) : projects.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <CosmicProjectCard key={project.slug || project.title} project={project} index={index} />
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
