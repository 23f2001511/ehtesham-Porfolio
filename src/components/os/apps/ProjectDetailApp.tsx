"use client";

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { usePortfolioData } from "../PortfolioDataContext";
import type { AppProps } from "../OSContext";
import { AppEmptyState, AppSection, AppSurface } from "./appShared";

export default function ProjectDetailApp({ data }: AppProps) {
  const { projects } = usePortfolioData();
  const slug = typeof data?.slug === "string" ? data.slug : "";
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <AppSurface>
        <AppEmptyState
          title="Project not found"
          description="This project may have been removed. Open the Projects app to browse the full list."
        />
      </AppSurface>
    );
  }


  return (
    <AppSurface>
      <header className="os-detail-hero">
        <div className="min-w-0">
          <p className="os-detail-hero__eyebrow">
            {project.category ? project.category : "Project"} · {project.status}
          </p>
          <h2 className="os-detail-hero__title">{project.title}</h2>
          <p className="os-detail-hero__summary">{project.summary}</p>
        </div>
        <div className="os-detail-hero__links">
          {project.liveUrl && (
            <a
              className="os-btn os-btn--primary os-interactive"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Live demo
            </a>
          )}
          {project.repoUrl && (
            <a
              className="os-btn os-btn--ghost os-interactive"
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Repository
            </a>
          )}
        </div>
      </header>

      {project.imageUrl && (
        <Image
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          width={1200}
          height={640}
          sizes="(max-width: 760px) 100vw, 700px"
          className="os-window-shot"
        />
      )}

      <AppSection title="Overview">
        <p className="os-body">{project.description}</p>
      </AppSection>

      {project.problem && (
        <AppSection title="Problem">
          <p className="os-body">{project.problem}</p>
        </AppSection>
      )}

      {project.solution && (
        <AppSection title="Solution">
          <p className="os-body">{project.solution}</p>
        </AppSection>
      )}

      {project.architecture && project.architecture.length > 0 && (
        <AppSection title="Architecture">
          <ol className="os-arch" aria-label="Architecture layers">
            {project.architecture.map((layer, index) => (
              <li key={`${layer}-${index}`} className="os-arch__node">
                <span className="os-arch__label">{layer}</span>
                {index < project.architecture!.length - 1 && (
                  <span className="os-arch__arrow" aria-hidden="true">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </AppSection>
      )}

      {project.features && project.features.length > 0 && (
        <AppSection title="Features">
          <ul className="os-pill-list">
            {project.features.map((feature) => (
              <li key={feature} className="os-pill">
                {feature}
              </li>
            ))}
          </ul>
        </AppSection>
      )}

      <AppSection title="Stack">
        <ul className="os-pill-list">
          {project.tags.map((tag) => (
            <li key={tag} className="os-pill">
              {tag}
            </li>
          ))}
        </ul>
      </AppSection>

      {(project.challenges || project.learnings) && (
        <div className="os-columns">
          {project.challenges && (
            <AppSection title="Challenges">
              <p className="os-body">{project.challenges}</p>
            </AppSection>
          )}
          {project.learnings && (
            <AppSection title="Learnings">
              <p className="os-body">{project.learnings}</p>
            </AppSection>
          )}
        </div>
      )}

      {!project.liveUrl && !project.repoUrl && (
        <p className="os-inline-note">No live or repository link configured for this project yet.</p>
      )}
    </AppSurface>
  );
}
