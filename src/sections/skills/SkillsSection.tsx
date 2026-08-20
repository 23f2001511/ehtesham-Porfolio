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
import LazySkillBadge3D from "@/components/LazySkillBadge3D";
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

/** Only the top featured skills get a 3D badge; the rest keep the 2D icon. */
const THREED_BADGE_LIMIT = 8;

/** Category -> brand color for the 3D badge, mirroring resolveCategory keys. */
function categoryColor(category: string) {
  const key = category.toLowerCase();
  if (key.includes("data") || key.includes("science") || key.includes("software")) return "#38bdf8";
  if (key.includes("web") || key.includes("front")) return "#a78bfa";
  if (key.includes("back") || key.includes("server")) return "#34d399";
  if (key.includes("design") || key.includes("ui")) return "#e879f9";
  if (key.includes("engineer") || key.includes("core")) return "#fbbf24";
  if (key.includes("product")) return "#22d3ee";
  return "#94a3b8";
}

/**
 * Accent config keyed by a *normalized* category name so both the fallback
 * constants ("Web Development", "Data Science & Software", "Core Engineering")
 * and the live store data ("Frontend", "Backend", "Design", "Product")
 * render with the intended color.
 */
function resolveCategory(category: string) {
  const key = category.toLowerCase();
  if (key.includes("data") || key.includes("science") || key.includes("software"))
    return { bar: "from-sky-400 to-blue-500", chip: "border-sky-300/30 bg-sky-300/10 text-sky-200", order: 1 };
  if (key.includes("web") || key.includes("front"))
    return { bar: "from-violet-400 to-purple-500", chip: "border-violet-300/30 bg-violet-300/10 text-violet-200", order: 2 };
  if (key.includes("back") || key.includes("server"))
    return { bar: "from-emerald-400 to-teal-500", chip: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200", order: 3 };
  if (key.includes("design") || key.includes("ui"))
    return { bar: "from-fuchsia-400 to-pink-500", chip: "border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-200", order: 4 };
  if (key.includes("engineer") || key.includes("core"))
    return { bar: "from-amber-400 to-orange-500", chip: "border-amber-300/30 bg-amber-300/10 text-amber-200", order: 5 };
  if (key.includes("product"))
    return { bar: "from-cyan-400 to-teal-400", chip: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200", order: 6 };
  return { bar: "from-slate-400 to-slate-500", chip: "border-slate-300/30 bg-slate-300/10 text-slate-200", order: 9 };
}

function SkillChip({ skill, use3D }: { skill: Skill; use3D: boolean }) {
  const Icon = iconMap[skill.icon ?? ""] ?? Code2;
  const accent = resolveCategory(skill.category);

  return (
    <div
      className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40"
      title={skill.years ? `${skill.years} yrs` : undefined}
    >
      {use3D ? (
        <LazySkillBadge3D color={categoryColor(skill.category)} size={40} />
      ) : (
        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border", accent.chip)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{skill.name}</p>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {typeof skill.years === "number" ? `${skill.years}y` : ""}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full bg-gradient-to-r", accent.bar)} style={{ width: `${Math.max(4, Math.min(100, skill.level))}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { data: skills, isLoading, error } = useCollection<Skill>("/api/skills", fallbackSkills);

  const topSkills = new Set(
    skills
      .slice()
      .sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      )
      .slice(0, THREED_BADGE_LIMIT)
      .map((skill) => skill.id ?? skill.name)
  );

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ||= []).push(skill);
    return acc;
  }, {});

  const orderedCategories = Object.keys(grouped).sort(
    (a, b) => resolveCategory(a).order - resolveCategory(b).order
  );

  return (
    <section id="skills" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Skills"
          title="A technical toolbox, grouped by discipline"
          description="Languages, frameworks, databases, and core engineering tools — each with an honest self-assessed proficiency."
          gradient
        />

        {error ? (
          <p className="mb-5 mt-8 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Live skills could not be loaded. Showing curated starter content.
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : skills.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orderedCategories.map((category, index) => {
              const accent = resolveCategory(category);
              return (
                <Reveal key={category} delay={index * 0.06} className="h-full">
                  <div className="panel card-lift h-full p-6">
                    <div className="flex items-center gap-3">
                      <span className={cn("h-2.5 w-2.5 rounded-full bg-gradient-to-r", accent.bar)} />
                      <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        {category}
                      </h3>
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {grouped[category].length}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-2.5">
                      {grouped[category]
                        .slice()
                        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                        .map((skill) => (
                          <SkillChip
                            key={skill.id ?? skill.name}
                            skill={skill}
                            use3D={topSkills.has(skill.id ?? skill.name)}
                          />
                        ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              title="No skills published yet"
              description="Add skills from the admin dashboard to populate this section."
            />
          </div>
        )}
      </div>
    </section>
  );
}
