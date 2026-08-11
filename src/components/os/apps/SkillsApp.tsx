"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { usePortfolioData } from "../PortfolioDataContext";
import { AppEmptyState, AppSurface } from "./appShared";

function levelLabel(level: number) {
  if (level >= 85) return "Advanced";
  if (level >= 72) return "Proficient";
  if (level >= 55) return "Working";
  return "Exploring";
}

export default function SkillsApp() {
  const { skills } = usePortfolioData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const skill of skills) {
      if (skill.category) {
        set.add(skill.category);
      }
    }
    return [...set];
  }, [skills]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, typeof skills>();

    for (const skill of skills) {
      if (category !== "All" && skill.category !== category) {
        continue;
      }
      if (q && !`${skill.name} ${skill.category}`.toLowerCase().includes(q)) {
        continue;
      }
      const list = map.get(skill.category) || [];
      list.push(skill);
      map.set(skill.category, list);
    }

    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [skills, query, category]);

  return (
    <AppSurface>
      <div className="os-toolbar">
        <label className="os-toolbar__search os-interactive">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills…"
            aria-label="Search skills"
          />
        </label>
        <select
          className="os-select os-interactive"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {grouped.length === 0 ? (
        <AppEmptyState
          title="No skills match"
          description="Try another search or category. Add skills from the admin dashboard."
        />
      ) : (
        grouped.map(([group, items]) => (
          <section key={group} className="os-app__section">
            <header className="os-app__section-head">
              <h2 className="os-app__section-title">{group}</h2>
              <p className="os-app__section-hint">{items.length} skills</p>
            </header>
            <div className="os-skills-grid" role="list">
              {items.map((skill) => (
                <article key={skill.name} className="os-skill" role="listitem">
                  <header className="os-skill__head">
                    <span className="os-skill__name">{skill.name}</span>
                    <span className="os-skill__label">{levelLabel(skill.level)}</span>
                  </header>
                  <div
                    className="os-progress"
                    role="progressbar"
                    aria-valuenow={skill.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name} proficiency`}
                  >
                    <span style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }} />
                  </div>
                  {typeof skill.years === "number" && skill.years > 0 && (
                    <p className="os-skill__years">
                      {skill.years} {skill.years === 1 ? "year" : "years"} of use
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </AppSurface>
  );
}
