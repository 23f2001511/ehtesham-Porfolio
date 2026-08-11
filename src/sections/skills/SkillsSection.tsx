"use client";

import { motion, useReducedMotion } from "framer-motion";
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
import SectionHeading from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackSkills } from "@/constants";
import { useCollection } from "@/hooks/useCollection";
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
  Workflow,
};

// Category visual config
const categoryConfig: Record<string, {
  gradient: string;
  glowColor: string;
  borderColor: string;
  nodeColor: string;
  label: string;
}> = {
  "Data Science & Software": {
    gradient: "from-cyan-400 to-blue-500",
    glowColor: "rgba(34, 211, 238, 0.25)",
    borderColor: "rgba(34, 211, 238, 0.3)",
    nodeColor: "#22d3ee",
    label: "Data Science & Software",
  },
  "Web Development": {
    gradient: "from-violet-400 to-purple-500",
    glowColor: "rgba(168, 85, 247, 0.25)",
    borderColor: "rgba(168, 85, 247, 0.3)",
    nodeColor: "#a855f7",
    label: "Web Development",
  },
  "Core Engineering": {
    gradient: "from-emerald-400 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.25)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    nodeColor: "#10b981",
    label: "Core Engineering",
  },
};

const defaultCategory = {
  gradient: "from-slate-400 to-slate-500",
  glowColor: "rgba(148, 163, 184, 0.2)",
  borderColor: "rgba(148, 163, 184, 0.25)",
  nodeColor: "#94a3b8",
  label: "Other",
};

function SkillNode({ skill, index, config }: {
  skill: Skill;
  index: number;
  config: typeof defaultCategory;
}) {
  const reducedMotion = useReducedMotion();
  const Icon = iconMap[skill.icon || ""] ?? Code2;

  // Each badge gets a unique floating animation delay
  const floatDuration = 4 + (index % 3) * 1.5;
  const floatDelay = index * 0.4;

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, scale: 0, rotate: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        type: "spring",
        stiffness: 150,
        damping: 15,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              scale: 1.15,
              y: -6,
              transition: { duration: 0.25 },
            }
      }
      className="skill-satellite group relative"
      style={{
        animation: reducedMotion
          ? "none"
          : `skill-orbit ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
      }}
    >
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          boxShadow: `0 0 30px ${config.glowColor}, 0 0 60px ${config.glowColor}`,
          borderRadius: "0.75rem",
          inset: "-4px",
        }}
      />

      <div
        className="relative flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-md transition-all duration-300 group-hover:bg-white/[0.08]"
        style={{
          borderColor: config.borderColor,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Icon */}
        <div
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg"
          style={{
            backgroundColor: `${config.nodeColor}15`,
            border: `1px solid ${config.nodeColor}30`,
          }}
        >
          <Icon className="h-4 w-4" style={{ color: config.nodeColor }} aria-hidden="true" />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{skill.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
              />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{skill.level}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConstellationCluster({ category, skills, index }: {
  category: string;
  skills: Skill[];
  index: number;
}) {
  const reducedMotion = useReducedMotion();
  const config = categoryConfig[category] || defaultCategory;

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative"
    >
      {/* Category header node */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="h-3 w-3 rounded-full constellation-node-pulse"
          style={{
            backgroundColor: config.nodeColor,
            boxShadow: `0 0 12px ${config.glowColor}, 0 0 24px ${config.glowColor}`,
          }}
        />
        <h3 className="text-lg font-black text-white tracking-tight">
          {config.label}
        </h3>
        {/* Connecting line */}
        <div
          className="flex-1 h-[1px]"
          style={{
            background: `linear-gradient(90deg, ${config.borderColor}, transparent)`,
          }}
        />
      </div>

      {/* Skills orbit */}
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, i) => (
          <SkillNode
            key={`${skill.name}-${skill.category}`}
            skill={skill}
            index={i}
            config={config}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { data: skills, isLoading, error } = useCollection<Skill>("/api/skills", fallbackSkills);

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  // Order categories
  const categoryOrder = ["Data Science & Software", "Web Development", "Core Engineering"];
  const orderedCategories = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <section id="skills" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Skills"
          title="A constellation of tools from code to circuits."
          description="From Python and React to MATLAB and power electronics — skills spanning software engineering, web development, and core electrical engineering."
        />

        {error ? (
          <p className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Live skills could not be loaded. Showing curated starter content.
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : skills.length ? (
          <div className="grid gap-12">
            {orderedCategories.map((category, i) => (
              <ConstellationCluster
                key={category}
                category={category}
                skills={grouped[category]}
                index={i}
              />
            ))}
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
