"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOS } from "./OSContext";
import { AppGlyph, type OsIconId } from "./DesktopIcon";
import { OS_DESKTOP_APPS } from "./apps/registry";

export const LAUNCHER_CATEGORIES: Array<{ id: string; label: string; apps: OsIconId[] }> = [
  { id: "portfolio", label: "Portfolio", apps: ["about", "projects", "skills", "experience", "education", "certificates"] },
  { id: "online", label: "Online", apps: ["github", "leetcode", "contact"] },
  { id: "system", label: "System", apps: ["resume", "terminal", "settings"] }
];

const RECENT_KEY = "portfolio-os-recent-apps";

export function pushRecentApp(appId: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [appId, ...list.filter((id) => id !== appId)].slice(0, 4);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // best-effort
  }
}

function readRecentApps(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(list) ? list.filter((id) => typeof id === "string").slice(0, 4) : [];
  } catch {
    return [];
  }
}

export default function AppLauncher({ onClose }: { onClose?: () => void }) {
  const { openApp, closeWindow, windows } = useOS();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [recent, setRecent] = useState<string[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setRecent(readRecentApps());
  }, []);

  const launch = useCallback(
    (appId: OsIconId) => {
      pushRecentApp(appId);
      const existing = windows.find((win) => win.appId === "launcher");
      if (existing) {
        closeWindow(existing.id);
      }
      openApp(appId);
      onClose?.();
    },
    [closeWindow, onClose, openApp, windows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const categories =
      activeCategory === "all"
        ? LAUNCHER_CATEGORIES
        : LAUNCHER_CATEGORIES.filter((category) => category.id === activeCategory);
    return categories
      .map((category) => ({
        ...category,
        apps: category.apps.filter((appId) => {
          if (!q) {
            return true;
          }
          const def = OS_DESKTOP_APPS.find((app) => app.id === appId);
          return (
            appId.includes(q) ||
            (def?.title.toLowerCase().includes(q) ?? false) ||
            category.label.toLowerCase().includes(q)
          );
        })
      }))
      .filter((category) => category.apps.length > 0);
  }, [activeCategory, query]);

  const recentApps = recent.filter((id): id is OsIconId =>
    OS_DESKTOP_APPS.some((app) => app.id === id)
  );

  const selfClose = () => {
    const existing = windows.find((win) => win.appId === "launcher");
    if (existing) {
      closeWindow(existing.id);
    }
    onClose?.();
  };

  return (
    <motion.div
      className="os-launcher"
      initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      role="dialog"
      aria-label="Application launcher"
    >
      <div className="os-launcher__header">
        <div className="os-launcher__search">
          <Search className="h-4 w-4 text-[var(--fg-muted)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search applications…"
            aria-label="Search applications"
            className="os-launcher__search-input"
          />
        </div>
        <button type="button" className="os-interactive os-launcher__close" onClick={selfClose} aria-label="Close launcher">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <nav className="os-launcher__categories" aria-label="Categories">
        {[{ id: "all", label: "All" }, ...LAUNCHER_CATEGORIES].map((category) => (
          <button
            key={category.id}
            type="button"
            className={cn(
              "os-interactive os-launcher__category",
              activeCategory === category.id && "os-launcher__category--active"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <div className="os-launcher__body">
        {recentApps.length > 0 && activeCategory === "all" && !query && (
          <section className="os-launcher__section" aria-label="Recent applications">
            <h3 className="os-launcher__section-title">Recent</h3>
            <LauncherGrid apps={recentApps} onLaunch={launch} />
          </section>
        )}
        {filtered.length === 0 ? (
          <p className="os-launcher__empty">No applications match “{query}”.</p>
        ) : (
          filtered.map((category) => (
            <section key={category.id} className="os-launcher__section" aria-label={category.label}>
              <h3 className="os-launcher__section-title">{category.label}</h3>
              <LauncherGrid apps={category.apps} onLaunch={launch} />
            </section>
          ))
        )}
      </div>
    </motion.div>
  );
}

function LauncherGrid({
  apps,
  onLaunch
}: {
  apps: OsIconId[];
  onLaunch: (appId: OsIconId) => void;
}) {
  return (
    <div className="os-launcher__grid" role="list">
      {apps.map((appId) => {
        const def = OS_DESKTOP_APPS.find((app) => app.id === appId);
        if (!def) {
          return null;
        }
        return (
          <button
            key={appId}
            type="button"
            role="listitem"
            className="os-launcher__app os-interactive"
            onClick={() => onLaunch(appId)}
          >
            <span className="os-launcher__app-icon" aria-hidden="true">
              <AppGlyph appId={appId} className="h-5 w-5" />
            </span>
            <span className="os-launcher__app-label">{def.title}</span>
          </button>
        );
      })}
    </div>
  );
}
