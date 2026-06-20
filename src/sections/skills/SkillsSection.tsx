"use client";

import {
  Atom,
  Code2,
  Database,
  Layers,
  MousePointer2,
  Palette,
  Server,
  Sparkles,
  Workflow
} from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackSkills } from "@/constants";
import { useCollection } from "@/hooks/useCollection";
import type { Skill } from "@/types";

const iconMap = {
  Atom,
  Code2,
  Database,
  Layers,
  MousePointer2,
  Palette,
  Server,
  Sparkles,
  Workflow
};

export default function SkillsSection() {
  const { data: skills, isLoading, error } = useCollection<Skill>("/api/skills", fallbackSkills);

  return (
    <section id="skills" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Skills"
          title="A stack chosen for product speed and long-term maintainability."
          description="I use TypeScript, modern React patterns, MongoDB, and design-minded components to ship interfaces that are both useful and pleasant."
        />

        {error ? (
          <p className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Live skills could not be loaded. Showing curated starter content.
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40" />
            ))}
          </div>
        ) : skills.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => {
              const Icon = iconMap[skill.icon as keyof typeof iconMap] ?? Code2;

              return (
                <Reveal key={`${skill.name}-${skill.category}`} delay={index * 0.04}>
                  <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.07]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-md border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      {skill.featured ? <Badge tone="emerald">Featured</Badge> : null}
                    </div>
                    <h3 className="mt-5 text-lg font-black text-white">{skill.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{skill.category}</p>
                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{skill.level}% working proficiency</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No skills published yet"
            description="Add skills from the admin dashboard to populate this section."
          />
        )}
      </div>
    </section>
  );
}
