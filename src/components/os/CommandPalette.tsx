"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOS } from "./OSContext";
import { AppGlyph, type OsIconId } from "./DesktopIcon";
import { usePortfolioData } from "./PortfolioDataContext";
import { usePublicProfile } from "@/hooks/usePublicProfile";

type EntryKind = "app" | "project" | "skill" | "certificate" | "action";

type Entry = {
  id: string;
  kind: EntryKind;
  title: string;
  subtitle: string;
  appId: OsIconId;
  keywords: string;
  run: () => void;
};

const APP_ITEMS: Array<{ appId: OsIconId; title: string; subtitle: string; keywords: string }> = [
  { appId: "about", title: "About", subtitle: "Profile & system info", keywords: "profile bio about system" },
  { appId: "projects", title: "Projects", subtitle: "Browse the project explorer", keywords: "projects work code apps" },
  { appId: "skills", title: "Skills", subtitle: "Technology matrix", keywords: "skills stack tools tech" },
  { appId: "experience", title: "Experience", subtitle: "Roles & timeline", keywords: "experience work timeline" },
  { appId: "education", title: "Education", subtitle: "Degrees & study", keywords: "education degree school iit" },
  { appId: "certificates", title: "Certificates", subtitle: "Credentials & documents", keywords: "certificates credentials" },
  { appId: "resume", title: "Resume", subtitle: "Preview & download", keywords: "resume cv download" },
  { appId: "github", title: "GitHub", subtitle: "Live GitHub activity", keywords: "github repos commits" },
  { appId: "leetcode", title: "LeetCode", subtitle: "Problem solving stats", keywords: "leetcode dsa problems" },
  { appId: "contact", title: "Contact", subtitle: "Email & social profiles", keywords: "contact email hire message" },
  { appId: "terminal", title: "Terminal", subtitle: "Command line portfolio", keywords: "terminal cli console" },
  { appId: "settings", title: "Settings", subtitle: "Appearance & behavior", keywords: "settings theme wallpaper" }
];

function normalize(value: string) {
  return value.toLowerCase();
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const { openApp, closeWindow, windows } = useOS();
  const { projects, skills } = usePortfolioData();
  const { profile } = usePublicProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (!open) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const entries = useMemo<Entry[]>(() => {
    const items: Entry[] = APP_ITEMS.map((app) => ({
      id: `app-${app.appId}`,
      kind: "app",
      title: app.title,
      subtitle: app.subtitle,
      appId: app.appId,
      keywords: `${app.title} ${app.keywords}`,
      run: () => openApp(app.appId)
    }));

    for (const project of projects) {
      items.push({
        id: `project-${project.slug}`,
        kind: "project",
        title: project.title,
        subtitle: `Project · ${project.status}`,
        appId: "projects",
        keywords: `${project.title} ${project.tags.join(" ")} project`,
        run: () => openApp("project-detail", { slug: project.slug, title: project.title })
      });
    }

    for (const skill of skills) {
      items.push({
        id: `skill-${skill.name}`,
        kind: "skill",
        title: skill.name,
        subtitle: `Skill · ${skill.category}`,
        appId: "skills",
        keywords: `${skill.name} ${skill.category} skill`,
        run: () => openApp("skills", { highlight: skill.name })
      });
    }

    const profileKeywords = `${profile.name ?? ""}`;
    if (profileKeywords.trim()) {
      items.push({
        id: "identity",
        kind: "action",
        title: profileKeywords.trim(),
        subtitle: "Open profile",
        appId: "about",
        keywords: `${profileKeywords} owner profile`,
        run: () => openApp("about")
      });
    }

    const openExternal = (url: string) => {
      window.open(url, "_blank", "noopener,noreferrer");
    };

    const ghUser = (profile.githubUsername || "").trim();
    if (ghUser) {
      items.push({
        id: "action-github-profile",
        kind: "action",
        title: `GitHub · ${ghUser}`,
        subtitle: "Open GitHub profile in browser",
        appId: "github",
        keywords: `${ghUser} github profile repos open browser`,
        run: () => openExternal(`https://github.com/${ghUser}`)
      });
    }

    const lcUser = (profile.leetcodeUsername || "").trim();
    if (lcUser) {
      items.push({
        id: "action-leetcode-profile",
        kind: "action",
        title: `LeetCode · ${lcUser}`,
        subtitle: "Open LeetCode profile in browser",
        appId: "leetcode",
        keywords: `${lcUser} leetcode profile dsa open browser`,
        run: () => openExternal(`https://leetcode.com/u/${encodeURIComponent(lcUser)}/`)
      });
    }

    const linkedin = (profile.socials || []).find((link) => /linkedin/i.test(link.label));
    if (linkedin) {
      items.push({
        id: "action-linkedin-profile",
        kind: "action",
        title: "LinkedIn",
        subtitle: "Open LinkedIn profile in browser",
        appId: "contact",
        keywords: "linkedin profile social open browser",
        run: () => openExternal(linkedin.href)
      });
    }

    const primaryEmail = (profile.email || "").trim();
    if (primaryEmail) {
      items.push({
        id: "action-copy-email",
        kind: "action",
        title: `Copy email · ${primaryEmail}`,
        subtitle: "Copy primary email address",
        appId: "contact",
        keywords: `${primaryEmail} email contact copy`,
        run: () => {
          void navigator.clipboard?.writeText(primaryEmail).catch(() => {});
        }
      });
    }

    const terminalWin = windows.find((win) => win.appId === "terminal");
    items.push({
      id: "action-terminal",
      kind: "action",
      title: terminalWin ? "Focus Terminal" : "Open Terminal",
      subtitle: "Run portfolio commands",
      appId: "terminal",
      keywords: "terminal focus cli",
      run: () => openApp("terminal")
    });

    return items;
  }, [openApp, profile.name, profile.githubUsername, profile.leetcodeUsername, profile.email, profile.socials, projects, skills, windows]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) {
      return entries.slice(0, 12);
    }
    return entries
      .map((entry) => {
        const haystack = normalize(`${entry.title} ${entry.subtitle} ${entry.keywords}`);
        const starts = normalize(entry.title).startsWith(q) ? 0 : 1;
        const includesIdx = haystack.indexOf(q);
        const score = includesIdx === -1 ? Number.POSITIVE_INFINITY : starts * 100 + includesIdx;
        return { entry, score };
      })
      .filter((item) => item.score !== Number.POSITIVE_INFINITY)
      .sort((a, b) => a.score - b.score)
      .slice(0, 14)
      .map((item) => item.entry);
  }, [entries, query]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-idx="${index}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const runEntry = (entry: Entry | undefined) => {
    if (!entry) {
      return;
    }
    // Don’t stack a duplicate on the focused instance of the same app.
    const existing = windows.find((win) => win.appId === entry.appId);
    if (existing) {
      closeWindow(existing.id);
    }
    entry.run();
    close();
  };

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((value) => Math.min(results.length - 1, value + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((value) => Math.max(0, value - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runEntry(results[index]);
    } else if (event.key === "Tab") {
      event.preventDefault();
      setIndex((value) => (results.length ? (value + 1) % results.length : 0));
    }
  };

  const kindLabel: Record<EntryKind, string> = {
    app: "App",
    project: "Project",
    skill: "Skill",
    certificate: "Certificate",
    action: "Action"
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="os-palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="os-palette"
            initial={reducedMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="os-palette__input-row">
              <Search className="h-4 w-4 text-[var(--fg-muted)]" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search apps, projects, skills… (Ctrl/⌘ K)"
                aria-label="Search"
                className="os-palette__input"
              />
              <button type="button" className="os-interactive os-palette__close" onClick={close} aria-label="Close palette">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="os-palette__list" ref={listRef} role="listbox" aria-label="Results">
              {results.length === 0 ? (
                <p className="os-palette__empty">No results found.</p>
              ) : (
                results.map((entry, idx) => (
                  <button
                    key={entry.id}
                    type="button"
                    role="option"
                    aria-selected={idx === index}
                    data-idx={idx}
                    className={cn("os-palette__item", idx === index && "os-palette__item--active")}
                    onMouseEnter={() => setIndex(idx)}
                    onClick={() => runEntry(entry)}
                  >
                    <span className="os-palette__item-icon" aria-hidden="true">
                      <AppGlyph appId={entry.appId} className="h-4 w-4" />
                    </span>
                    <span className="os-palette__item-text">
                      <span className="os-palette__item-title">{entry.title}</span>
                      <span className="os-palette__item-subtitle">{entry.subtitle}</span>
                    </span>
                    <span className="os-palette__item-kind">{kindLabel[entry.kind]}</span>
                  </button>
                ))
              )}
            </div>
            <div className="os-palette__footer" aria-hidden="true">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
