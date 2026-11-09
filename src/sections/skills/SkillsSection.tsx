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
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackSkills } from "@/constants";
import { useCollection } from "@/hooks/useCollection";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

const iconMap: Record<string, typeof Code2> = {
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

function resolveCategory(category: string) {
  const key = category.toLowerCase();
  if (key.includes("data") || key.includes("science") || key.includes("software"))
    return { bar: "from-[#00f0ff] to-[#38bdf8]", chip: "border-cyan-500/40 bg-cyan-950/40 text-cyan-300", order: 1 };
  if (key.includes("web") || key.includes("front"))
    return { bar: "from-[#7042f8] to-[#00f0ff]", chip: "border-purple-500/40 bg-purple-950/40 text-purple-300", order: 2 };
  if (key.includes("back") || key.includes("server"))
    return { bar: "from-[#3b82f6] to-[#00f0ff]", chip: "border-blue-500/40 bg-blue-950/40 text-blue-300", order: 3 };
  if (key.includes("design") || key.includes("ui"))
    return { bar: "from-[#ec4899] to-[#8b5cf6]", chip: "border-pink-500/40 bg-pink-950/40 text-pink-300", order: 4 };
  if (key.includes("engineer") || key.includes("core"))
    return { bar: "from-[#f59e0b] to-[#ec4899]", chip: "border-amber-500/40 bg-amber-950/40 text-amber-300", order: 5 };
  return { bar: "from-[#7042f8] to-[#6366f1]", chip: "border-indigo-500/40 bg-indigo-950/40 text-indigo-300", order: 9 };
}

function SkillChip({ skill }: { skill: Skill }) {
  const Icon = iconMap[skill.icon ?? ""] ?? Code2;
  const accent = resolveCategory(skill.category);

  return (
    <div
      className="group flex items-center gap-3.5 rounded-xl border border-[#7042f8]/25 bg-[#07011d]/70 px-4 py-3.5 transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-[#100632]/85 hover:shadow-[0_0_20px_rgba(112,66,248,0.35)] hover:-translate-y-0.5"
      title={skill.years ? `${skill.years} yrs` : undefined}
    >
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border", accent.chip)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
            {skill.name}
          </p>
          <span className="text-[11px] font-mono tabular-nums text-gray-400">
            {typeof skill.years === "number" ? `${skill.years}y` : ""}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1b0a42]">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", accent.bar)}
            style={{ width: `${Math.max(8, Math.min(100, skill.level))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { data: rawSkills, isLoading, error } = useCollection<Skill>("/api/skills");
  const skills = rawSkills.length ? rawSkills : fallbackSkills;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ||= []).push(skill);
    return acc;
  }, {});

  const orderedCategories = Object.keys(grouped).sort(
    (a, b) => resolveCategory(a).order - resolveCategory(b).order
  );

  return (
    <section id="skills" className="relative z-10 py-24 overflow-hidden">
      {/* ── Ambient Skills Background Video (Sanidhyy Space Signature) ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center opacity-30">
        <video
          className="w-full h-full object-cover"
          playsInline
          loop
          muted
          autoPlay
        >
          <source src="/videos/skills-bg.webm" type="video/webm" />
        </video>
      </div>

      <div className="section-shell">
        {/* Sanidhyy Space Signature Title */}
        <div className="text-center mb-16">
          <div className="welcome-box mb-4">
            <Sparkles className="w-4 h-4 text-[#00f0ff]" />
            <span className="welcome-text">Technical Superpowers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Making apps with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400">
              modern technologies
            </span>
          </h2>

          <p className="cursive mt-3 text-lg sm:text-xl font-medium text-gray-300">
            Never miss a task, deadline or idea
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl bg-purple-950/20" />
            ))}
          </div>
        ) : skills.length ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {orderedCategories.map((category, index) => {
              const accent = resolveCategory(category);
              return (
                <Reveal key={category} delay={index * 0.08} className="h-full">
                  <div className="space-card h-full p-6 border-[#7042f8]/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 pb-4 border-b border-[#7042f8]/20">
                        <span className={cn("h-3 w-3 rounded-full bg-gradient-to-r", accent.bar)} />
                        <h3 className="text-base font-bold tracking-tight text-white">
                          {category}
                        </h3>
                        <span className="ml-auto text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-[#7042f8]/40 text-purple-300">
                          {grouped[category].length} Skills
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3">
                        {grouped[category]
                          .slice()
                          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                          .map((skill) => (
                            <SkillChip
                              key={skill.id ?? skill.name}
                              skill={skill}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              title={error ? "Couldn't load skills" : "No skills published yet"}
              description={
                error
                  ? "The request failed. Check your connection and refresh the page."
                  : "Add skills from the admin dashboard to populate this section."
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
