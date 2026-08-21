"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, ImageOff, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Project } from "@/types";

const detailBlocks: Array<{ key: "problem" | "solution" | "challenges" | "learnings"; label: string }> = [
  { key: "problem", label: "Problem" },
  { key: "solution", label: "Solution" },
  { key: "challenges", label: "Challenges" },
  { key: "learnings", label: "What I learned" }
];

export default function ProjectDetailDialog({
  project,
  onClose
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-background/65 backdrop-blur-md sm:items-center sm:p-6"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 32, scale: 0.98 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="glass-panel max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl sm:rounded-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--glass-border)] bg-transparent px-6 py-4 backdrop-blur-xl sm:px-8">
              <h3 className="font-display truncate text-lg font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="btn-spring grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 pb-8 pt-6 sm:px-8">
              {project.imageUrl ? (
                <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-lg border border-border">
                  <Image
                    src={project.imageUrl}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2.5 py-1 text-xs font-medium text-foreground">
                  {project.status}
                </span>
                {project.category ? (
                  <span className="rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {project.category}
                  </span>
                ) : null}
                {project.featured ? (
                  <span className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-foreground">
                    Featured
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-base leading-8 text-muted-foreground">
                {project.description || project.summary}
              </p>

              {detailBlocks.map(({ key, label }) =>
                project[key] ? (
                  <div key={key} className="mt-6">
                    <h4 className="text-sm font-semibold text-foreground">{label}</h4>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{project[key]}</p>
                  </div>
                ) : null
              )}

              {project.features?.length ? (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-foreground">Key features</h4>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-muted-foreground"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.architecture?.length ? (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-foreground">Architecture</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {project.architecture.map((layer) => (
                      <li key={layer} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {layer}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground">Technologies</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
                {project.liveUrl ? (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-spring inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]"
                  >
                    View live
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
                {project.repoUrl ? (
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-spring inline-flex h-11 items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 text-sm font-semibold text-foreground backdrop-blur-md hover:border-border-strong"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    View code
                  </Link>
                ) : null}
                {!project.liveUrl && !project.repoUrl ? (
                  <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <ImageOff className="h-3.5 w-3.5" aria-hidden="true" />
                    Links are not public for this project yet.
                  </span>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
